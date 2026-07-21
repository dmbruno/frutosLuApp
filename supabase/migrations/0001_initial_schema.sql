-- Frutos Lu — esquema inicial
-- Orden: extensiones → enums → tablas → triggers de protección →
-- funciones (is_admin, is_active_sub, parse_sets_reps, assign_template,
-- muscle_volume) → RLS → índices → view de adherencia.

create extension if not exists pgcrypto;

-- ============ ENUMS ============
create type user_role as enum ('admin', 'alumno');
create type sub_status as enum ('active', 'inactive');
create type muscle_group as enum (
  'pecho','espalda','hombros','biceps','triceps','antebrazos',
  'cuadriceps','isquiotibiales','gluteos','gemelos',
  'abdominales','lumbares','cardio','cuerpo_completo'
);
create type exercise_kind as enum ('fuerza','cardio','movilidad');
create type exercise_block as enum ('movilidad','core','estructura','cardio','otro');
create type set_type as enum ('normal','calentamiento','fallo','drop');

-- ============ PERFILES ============
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'alumno',
  full_name text not null,
  birth_date date,
  sex text check (sex in ('F', 'M', 'X')),
  athlete_profile text,
  subscription_status sub_status not null default 'inactive',
  subscription_expires_at date,
  injuries_notes text,
  experience_level text check (experience_level in ('inicial','intermedio','avanzado')),
  goal text,
  onboarding_done boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============ CATÁLOGO DE EJERCICIOS ============
create table exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  kind exercise_kind not null default 'fuerza',
  default_block exercise_block,
  primary_muscle muscle_group not null,
  secondary_muscles muscle_group[] not null default '{}',
  instructions text,
  video_url text,
  needs_filming boolean not null default false,
  equipment text,
  is_archived boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============ PLAN (lo prescripto) ============
create table programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  template_id uuid references programs(id) on delete set null,
  name text not null,
  notes text,
  starts_on date,
  duration_weeks int,
  is_active boolean not null default true,
  cycle_pattern int[],
  total_weeks int,
  created_at timestamptz not null default now(),
  constraint template_or_assigned check (
    (user_id is null and starts_on is null)
    or (user_id is not null and starts_on is not null)
  )
);

create table program_days (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  week_number int not null default 1,
  title text not null,
  position int not null,
  weekday int check (weekday between 1 and 7),
  unique (program_id, week_number, position)
);

create table program_exercises (
  id uuid primary key default gen_random_uuid(),
  program_day_id uuid not null references program_days(id) on delete cascade,
  exercise_id uuid not null references exercises(id),
  block exercise_block not null default 'estructura',
  order_code text,
  position int not null,
  sets_reps_text text not null,
  parsed_sets int,
  parsed_reps int,
  is_per_side boolean not null default false,
  rep_unit text,
  suggested_weight_kg numeric(6,2),
  rest_sec int,
  superset_group text,
  coach_note text
);

-- ============ EJECUCIÓN (lo realizado) ============
create table workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  program_day_id uuid references program_days(id) on delete set null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  feeling smallint check (feeling between 1 and 5),
  athlete_note text,
  created_at timestamptz not null default now()
);

create table set_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references workout_sessions(id) on delete cascade,
  program_exercise_id uuid references program_exercises(id) on delete set null,
  exercise_id uuid not null references exercises(id),
  set_number int not null,
  set_type set_type not null default 'normal',
  weight_kg numeric(6,2),
  reps int,
  duration_sec int,
  distance_m int,
  logged_at timestamptz not null default now()
);

-- ============ TRACK DE PROGRESO / ANTROPOMETRÍA ============
create table body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  measured_on date not null default current_date,
  label text,
  weight_kg numeric(5,2),
  body_fat_pct numeric(4,1),
  neck_cm numeric(5,1), shoulders_cm numeric(5,1), chest_cm numeric(5,1),
  biceps_cm numeric(5,1), waist_cm numeric(5,1), hips_cm numeric(5,1),
  quads_cm numeric(5,1), calves_cm numeric(5,1),
  note text,
  unique (user_id, measured_on, label)
);

create table progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  taken_on date not null default current_date,
  pose text,
  stage text,
  storage_path text not null
);

-- ============ PROTECCIÓN DE COLUMNAS EN PROFILES ============
-- alumno no puede auto-otorgarse rol admin ni activar su propia suscripción
create or replace function protect_profile_columns() returns trigger
language plpgsql as $$
begin
  if not (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  ) then
    new.role := old.role;
    new.subscription_status := old.subscription_status;
    new.subscription_expires_at := old.subscription_expires_at;
  end if;
  return new;
end;
$$;

create trigger profiles_protect_columns
before update on profiles
for each row execute function protect_profile_columns();

-- ============ HELPERS DE AUTORIZACIÓN ============
create or replace function is_admin() returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function is_active_sub() returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and subscription_status = 'active'
  );
$$;

-- ============ PARSEO sets_reps_text → campos numéricos ============
-- Ante la duda, NULL — el texto siempre manda para mostrar.
create or replace function parse_sets_reps(txt text)
returns table (p_sets int, p_reps int, p_per_side boolean, p_unit text)
language plpgsql immutable as $$
declare
  norm text;
  quote1 text := chr(39);        -- '
  quote2 text := chr(39) || chr(39); -- ''
  v_sets int := null;
  v_reps int := null;
  v_per_side boolean := false;
  v_unit text := null;
  m text[];
begin
  norm := upper(trim(txt));

  if norm ~ 'POR LADO' or norm ~ 'X LADO' or norm ~ '/\s*\d+\s*$' then
    v_per_side := true;
  end if;

  if position(quote2 in norm) > 0 then
    v_unit := 'seg';
  elsif position(quote1 in norm) > 0 then
    v_unit := 'min';
  elsif norm ~ 'TOTAL' then
    v_unit := 'total';
  elsif norm ~ '\d+\s+A\s+\d+' then
    v_unit := 'rango';
  else
    v_unit := 'reps';
  end if;

  m := regexp_match(norm, '^(\d+)\s*X');
  if m is not null then
    v_sets := m[1]::int;
  end if;

  if v_unit = 'reps' and position('+' in norm) = 0 then
    m := regexp_match(norm, '^\d+\s*X\s*(\d+)');
    if m is not null then
      v_reps := m[1]::int;
    elsif v_sets is null then
      m := regexp_match(norm, '^(\d+)\s*$');
      if m is not null then
        v_reps := m[1]::int;
      end if;
    end if;
  elsif v_unit = 'total' then
    m := regexp_match(norm, '^(\d+)\s+TOTAL');
    if m is not null then
      v_reps := m[1]::int;
    end if;
  end if;

  return query select v_sets, v_reps, v_per_side, v_unit;
end;
$$;

create or replace function trg_parse_sets_reps() returns trigger
language plpgsql as $$
declare
  r record;
begin
  select * into r from parse_sets_reps(new.sets_reps_text);
  new.parsed_sets := r.p_sets;
  new.parsed_reps := r.p_reps;
  new.is_per_side := coalesce(r.p_per_side, false);
  new.rep_unit := r.p_unit;
  return new;
end;
$$;

create trigger program_exercises_parse
before insert or update of sets_reps_text on program_exercises
for each row execute function trg_parse_sets_reps();

-- ============ ASIGNACIÓN DE PLANTILLA (copia + expansión) ============
create or replace function assign_template(
  p_template_id uuid, p_user_id uuid, p_starts_on date
) returns uuid language plpgsql security definer as $$
declare
  v_new_program_id uuid;
  v_template record;
  v_total_weeks int;
  v_pattern int[];
  v_week int;
  v_type_week int;
  v_day record;
  v_new_day_id uuid;
  v_ex record;
begin
  select * into v_template from programs where id = p_template_id and user_id is null;
  if not found then
    raise exception 'Plantilla % no encontrada', p_template_id;
  end if;

  v_total_weeks := coalesce(v_template.total_weeks, 1);
  v_pattern := v_template.cycle_pattern;
  if v_pattern is null or array_length(v_pattern, 1) is null then
    v_pattern := array[1];
  end if;

  update programs set is_active = false
  where user_id = p_user_id and is_active = true;

  insert into programs (user_id, template_id, name, notes, starts_on, duration_weeks, is_active)
  values (p_user_id, p_template_id, v_template.name, v_template.notes, p_starts_on, v_total_weeks, true)
  returning id into v_new_program_id;

  for v_week in 1..v_total_weeks loop
    v_type_week := v_pattern[((v_week - 1) % array_length(v_pattern, 1)) + 1];

    for v_day in
      select * from program_days
      where program_id = p_template_id and week_number = v_type_week
      order by position
    loop
      insert into program_days (program_id, week_number, title, position, weekday)
      values (v_new_program_id, v_week, v_day.title, v_day.position, v_day.weekday)
      returning id into v_new_day_id;

      for v_ex in
        select * from program_exercises
        where program_day_id = v_day.id
        order by position
      loop
        insert into program_exercises (
          program_day_id, exercise_id, block, order_code, position,
          sets_reps_text, suggested_weight_kg, rest_sec, superset_group, coach_note
        ) values (
          v_new_day_id, v_ex.exercise_id, v_ex.block, v_ex.order_code, v_ex.position,
          v_ex.sets_reps_text, v_ex.suggested_weight_kg, v_ex.rest_sec, v_ex.superset_group, v_ex.coach_note
        );
      end loop;
    end loop;
  end loop;

  return v_new_program_id;
end;
$$;

-- ============ MÉTRICAS: kilaje por grupo muscular ============
create or replace function muscle_volume(
  p_user uuid, p_from date, p_to date
) returns table (muscle muscle_group, volume_kg numeric)
language sql stable as $$
  with sets as (
    select sl.weight_kg * sl.reps as vol, e.primary_muscle, e.secondary_muscles
    from set_logs sl
    join workout_sessions ws on ws.id = sl.session_id
    join exercises e on e.id = sl.exercise_id
    where ws.user_id = p_user
      and sl.set_type <> 'calentamiento'
      and sl.weight_kg is not null and sl.reps is not null
      and ws.started_at::date between p_from and p_to
  )
  select primary_muscle, sum(vol) from sets group by 1
  union all
  select unnest(secondary_muscles), sum(vol * 0.5) from sets group by 1
$$;

-- ============ RLS ============
alter table profiles enable row level security;
create policy "admin ve todo profiles" on profiles for all using (is_admin());
create policy "alumno lee su perfil" on profiles for select using (id = auth.uid());
create policy "alumno actualiza su perfil" on profiles for update using (id = auth.uid());
create policy "alumno crea su perfil" on profiles for insert with check (id = auth.uid());

alter table exercises enable row level security;
create policy "admin CRUD ejercicios" on exercises for all using (is_admin());
create policy "alumno lee catalogo" on exercises for select using (auth.uid() is not null);

alter table programs enable row level security;
create policy "admin CRUD programs" on programs for all using (is_admin());
create policy "alumno lee sus programas" on programs
  for select using (is_admin() or (user_id = auth.uid() and is_active_sub()));

alter table program_days enable row level security;
create policy "admin CRUD program_days" on program_days for all using (is_admin());
create policy "alumno lee sus program_days" on program_days for select using (
  is_admin() or exists (
    select 1 from programs p
    where p.id = program_days.program_id and p.user_id = auth.uid() and is_active_sub()
  )
);

alter table program_exercises enable row level security;
create policy "admin CRUD program_exercises" on program_exercises for all using (is_admin());
create policy "alumno lee sus program_exercises" on program_exercises for select using (
  is_admin() or exists (
    select 1 from program_days pd
    join programs p on p.id = pd.program_id
    where pd.id = program_exercises.program_day_id and p.user_id = auth.uid() and is_active_sub()
  )
);

alter table workout_sessions enable row level security;
create policy "admin ve todo sessions" on workout_sessions for all using (is_admin());
create policy "alumno lee sus sessions" on workout_sessions for select using (user_id = auth.uid());
create policy "alumno crea sus sessions" on workout_sessions for insert with check (user_id = auth.uid());
create policy "alumno actualiza sus sessions" on workout_sessions for update using (user_id = auth.uid());

alter table set_logs enable row level security;
create policy "admin ve todo" on set_logs for all using (is_admin());
create policy "alumno lee sus sets" on set_logs for select using (
  session_id in (select id from workout_sessions where user_id = auth.uid())
);
create policy "alumno inserta en sus sesiones" on set_logs for insert with check (
  session_id in (select id from workout_sessions where user_id = auth.uid())
);

alter table body_metrics enable row level security;
create policy "admin ve todo body_metrics" on body_metrics for all using (is_admin());
create policy "alumno lee sus body_metrics" on body_metrics for select using (user_id = auth.uid());
create policy "alumno inserta body_metrics" on body_metrics for insert with check (user_id = auth.uid());
create policy "alumno actualiza body_metrics" on body_metrics for update using (user_id = auth.uid());
create policy "alumno borra body_metrics" on body_metrics for delete using (user_id = auth.uid());

alter table progress_photos enable row level security;
create policy "admin ve todo photos" on progress_photos for all using (is_admin());
create policy "alumno lee sus photos" on progress_photos for select using (user_id = auth.uid());
create policy "alumno inserta photos" on progress_photos for insert with check (user_id = auth.uid());
create policy "alumno borra photos" on progress_photos for delete using (user_id = auth.uid());

-- ============ ÍNDICES ============
create index idx_set_logs_exercise on set_logs (exercise_id, logged_at);
create index idx_set_logs_session on set_logs (session_id);
create index idx_sessions_user on workout_sessions (user_id, started_at desc);
create index idx_programs_user on programs (user_id) where is_active;
create index idx_program_days_program on program_days (program_id, week_number, position);
create index idx_program_exercises_day on program_exercises (program_day_id, position);

-- ============ VIEW DE ADHERENCIA ============
create view v_adherence as
select
  p.id as user_id,
  p.full_name,
  p.subscription_status,
  max(ws.started_at) as last_workout_at,
  case
    when max(ws.started_at) is null then 'rojo'
    when max(ws.started_at) > now() - interval '4 days' then 'verde'
    when max(ws.started_at) > now() - interval '7 days' then 'amarillo'
    else 'rojo'
  end as traffic_light,
  count(ws.id) filter (where ws.started_at > now() - interval '7 days') as sessions_7d
from profiles p
left join workout_sessions ws on ws.user_id = p.id and ws.finished_at is not null
where p.role = 'alumno'
group by p.id;
