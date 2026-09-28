-- Biblioteca de reemplazos: rutinas sueltas (típicamente de intervalos) que
-- cualquier alumno con suscripción activa puede elegir en vez de su rutina
-- del día, sin que la profe tenga que asignarlas a nadie ni ubicarlas en una
-- semana puntual. Se modelan como program_days con program_id = NULL — mismo
-- patrón que ya usa programs.user_id = NULL para las plantillas de biblioteca.

alter table program_days alter column program_id drop not null;
alter table program_days add column if not exists created_at timestamptz not null default now();

-- alumno lee sus program_days: ahora también puede leer los de la biblioteca
-- (program_id is null), no solo los de su programa asignado.
drop policy if exists "alumno lee sus program_days" on program_days;
create policy "alumno lee sus program_days" on program_days for select using (
  is_admin() or (
    is_active_sub() and (
      program_id is null
      or exists (select 1 from programs p where p.id = program_days.program_id and p.user_id = auth.uid())
    )
  )
);

-- alumno lee sus program_exercises: el join contra programs se rompe cuando
-- program_id es null (inner join no matchea), por eso pasa a left join y la
-- condición de "es de mi programa" se evalúa aparte.
drop policy if exists "alumno lee sus program_exercises" on program_exercises;
create policy "alumno lee sus program_exercises" on program_exercises for select using (
  is_admin() or exists (
    select 1 from program_days pd
    left join programs p on p.id = pd.program_id
    where pd.id = program_exercises.program_day_id
      and is_active_sub()
      and (pd.program_id is null or p.user_id = auth.uid())
  )
);
