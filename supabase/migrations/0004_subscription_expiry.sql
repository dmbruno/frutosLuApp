-- El gate de suscripción ahora también verifica subscription_expires_at, no
-- solo subscription_status: cuando vence la fecha, el acceso se corta solo
-- (sin necesitar ningún cron/job que actualice el status manualmente). El
-- toggle manual de la profe sigue funcionando igual para pausar/activar en
-- cualquier momento, independiente de la fecha.
create or replace function is_active_sub() returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and subscription_status = 'active'
      and (subscription_expires_at is null or subscription_expires_at >= current_date)
  );
$$;

-- v_adherence suma subscription_expires_at al final (CREATE OR REPLACE VIEW
-- no permite reordenar columnas existentes, así que se agrega al final).
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
  p.subscription_expires_at
from profiles p
left join workout_sessions ws on ws.user_id = p.id and ws.finished_at is not null
where p.role = 'alumno'
group by p.id;
