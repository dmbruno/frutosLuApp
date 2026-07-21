-- Nota privada de la profe sobre un alumno. Va en tabla aparte (no como
-- columna de profiles) porque profiles.select('*') es lo que usa el alumno
-- para leer su propio perfil (RLS es por fila, no por columna) — si la nota
-- viviera ahí, cualquier alumno podría leerla. Con tabla propia + RLS
-- is_admin(), queda invisible para el alumno sin excepción.
create table student_notes (
  user_id uuid primary key references profiles(id) on delete cascade,
  note text,
  updated_at timestamptz not null default now()
);

alter table student_notes enable row level security;

create policy "admin CRUD student_notes" on student_notes for all using (is_admin());
