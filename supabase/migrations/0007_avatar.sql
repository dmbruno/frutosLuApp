-- Foto de perfil del alumno (círculo tipo Instagram). A diferencia de
-- progress-photos (sensibles, bucket privado), el avatar es de baja
-- sensibilidad: bucket público, servido por URL directa sin firmar.
alter table profiles add column if not exists avatar_url text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "cualquiera ve avatares" on storage.objects
for select using (bucket_id = 'avatars');

create policy "alumno sube su avatar" on storage.objects
for insert with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "alumno actualiza su avatar" on storage.objects
for update using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "alumno borra su avatar" on storage.objects
for delete using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- v_adherence suma avatar_url al final (CREATE OR REPLACE VIEW no permite
-- reordenar columnas existentes, así que se agrega al final, igual que se
-- hizo con subscription_expires_at en 0004).
create or replace view v_adherence as
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
  count(ws.id) filter (where ws.started_at > now() - interval '7 days') as sessions_7d,
  p.subscription_expires_at,
  p.avatar_url
from profiles p
left join workout_sessions ws on ws.user_id = p.id and ws.finished_at is not null
where p.role = 'alumno'
group by p.id;
