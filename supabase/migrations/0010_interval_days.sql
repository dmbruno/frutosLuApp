-- Días de entrenamiento por intervalos/circuito (HIIT), a pedido de la profe:
-- rutinas de 30/40/45 min con una lista de ejercicios y elementos a usar, en
-- vez del formato tradicional de series x reps.
create type day_format as enum ('tradicional', 'intervalos');

alter table program_days add column format day_format not null default 'tradicional';
alter table program_days add column duration_min int;
alter table program_days add column equipment_items text[] not null default '{}';

-- assign_template() copia program_days con una lista explícita de columnas:
-- hay que sumar las 3 nuevas para que no se pierdan al asignar una plantilla.
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
      insert into program_days (program_id, week_number, title, position, weekday, format, duration_min, equipment_items)
      values (
        v_new_program_id, v_week, v_day.title, v_day.position, v_day.weekday,
        v_day.format, v_day.duration_min, v_day.equipment_items
      )
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
