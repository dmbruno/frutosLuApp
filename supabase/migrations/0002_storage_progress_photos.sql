-- Bucket privado para fotos de progreso. Cada archivo se guarda bajo
-- "<user_id>/<archivo>", así storage.foldername(name)[1] = el dueño.
insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

create policy "admin ve todas las fotos"
on storage.objects for select
using (bucket_id = 'progress-photos' and is_admin());

create policy "alumno ve sus fotos"
on storage.objects for select
using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "alumno sube sus fotos"
on storage.objects for insert
with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "alumno borra sus fotos"
on storage.objects for delete
using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);
