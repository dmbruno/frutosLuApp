-- Bucket público para miniaturas de ejercicios: a diferencia de progress-photos
-- (privado, datos del alumno), estas son fotos de stock del catálogo que
-- necesitan ver todos los alumnos, así que no hace falta URL firmada.
-- Solo la profe (admin) puede subir/editar/borrar.
insert into storage.buckets (id, name, public)
values ('exercise-thumbnails', 'exercise-thumbnails', true)
on conflict (id) do nothing;

create policy "admin sube miniaturas de ejercicios"
on storage.objects for insert
with check (bucket_id = 'exercise-thumbnails' and is_admin());

create policy "admin actualiza miniaturas de ejercicios"
on storage.objects for update
using (bucket_id = 'exercise-thumbnails' and is_admin());

create policy "admin borra miniaturas de ejercicios"
on storage.objects for delete
using (bucket_id = 'exercise-thumbnails' and is_admin());
