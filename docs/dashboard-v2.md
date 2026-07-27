# Dashboard admin v2 — pendiente, no implementar todavía

> Origen: Diego pidió un análisis de qué le falta al Dashboard admin
> (`/admin`, `src/pages/admin/DashboardPage.tsx`) comparado con apps de
> entrenamiento de referencia (Trainerize, TrueCoach, Hevy Coach), basado en
> los datos que **ya existen** en el modelo actual — no en features nuevas.
> Este documento es el punto de partida para cuando se quiera implementar.

## Por qué

Hoy el Dashboard muestra 3 contadores (verde/amarillo/rojo), un banner
condicional de vencimientos (≤3 días) y un total de alumnos — nada más. Con
un solo alumno de prueba se ve vacío, pero el problema real aparece con 50:
son números sin nombres, sin poder actuar desde ahí. El coach tiene que
entrar a `/admin/alumnos` y escanear la lista para saber a quién atender.

El objetivo (mismo mantra que ya validamos con la charla de ChatGPT): que la
profe tarde menos tiempo pensando y más tiempo entrenando gente — el
dashboard debería responder "¿a quién tengo que prestarle atención hoy?" de
un vistazo, no ser un resumen estadístico.

## Nivel 1 — con los datos que ya se piden a la base (bajo esfuerzo)

Todo esto ya está en `v_adherence` (via `listStudents()` en
`features/students/api.ts`) o se calcula ya en el cliente
(`daysRemaining()` en `lib/utils/dates.ts`). Es reorganizar lo que ya se trae,
no pedir datos nuevos.

1. **Semáforo con nombres, no solo número.** Debajo de cada contador
   (verde/amarillo/rojo), listar 3-4 nombres de esa categoría con link directo
   a su ficha (`/admin/alumnos/:id`), en vez de forzar a entrar a
   `/admin/alumnos` y buscarlos.
2. **"Vencimientos próximos" siempre visible, con nombres.** Hoy es un banner
   que solo aparece si hay alguien a ≤3 días. Cambiar a una lista fija (ej.
   "vencen en los próximos 7 días") con nombre + días restantes — mismo dato
   que ya usa `StudentList.tsx`, solo mostrado en el dashboard también.
3. **"Adherencia general" como KPI grande arriba de todo.** % de alumnos
   activos con `sessions_7d > 0` sobre el total de activos. Un solo número
   grande tipo "78% entrenó esta semana" da una foto instantánea del grupo.

## Nivel 2 — necesita una consulta nueva chica (mismo esfuerzo que armar `v_adherence` en su momento)

4. **Feed de actividad reciente.** Últimas 10-15 `workout_sessions`
   terminadas de **todos** los alumnos (no una por una), con nombre, hace
   cuánto, y el emoji de `feeling` — "María entrenó hace 2h 💪". Da pulso de
   lo que está pasando sin entrar alumno por alumno. Requiere un join
   `workout_sessions` + `profiles`, ordenado por `finished_at desc`, límite
   15 — una función nueva en `features/students/api.ts` al estilo de
   `getStudentDetail`.
5. **Alertas de feeling bajo o con nota.** Sesiones de los últimos 7 días con
   `feeling <= 2` o `athlete_note` no vacío — para detectar quién puede estar
   pasándola mal o dejó un comentario para la profe. Mismo query base que el
   punto 4, filtrado distinto.
6. **PRs recientes de la semana.** Ya existe la lógica de PRs por alumno
   individual en `/progreso` (máximo histórico de `weight_kg` por ejercicio) —
   extenderla a "quién marcó un PR esta semana" cruzando todos los alumnos es
   refuerzo positivo para mostrarle a la profe, y usa el mismo patrón de
   query, solo agregado a nivel de todos los alumnos en vez de uno.
7. **Cumpleaños de la semana.** `profiles.birth_date` ya se carga en el
   onboarding (opcional). Filtro simple, sin nueva tabla.
8. **Alumnas nuevas de la semana.** Requiere sumar `created_at` a
   `v_adherence` (hoy la vista no lo trae, aunque `profiles.created_at`
   existe) — un `create or replace view` de una línea.

## Nivel 3 — más esfuerzo, gráficos (ya usamos Recharts en `/progreso`)

9. **Tendencia de adherencia grupal** — sesiones completadas por semana,
   últimas 8 semanas, todos los alumnos sumados. Da una foto de si el grupo en
   general está entrenando más o menos que antes.
10. **Distribución por perfil deportivo** (`athlete_profile`:
    postparto/runner/rugby/libre) — barra o dona simple. Más "lindo" que
    accionable, prioridad baja.

## Fuera de alcance (a propósito, por ahora)

Todo lo del "Pilar 4 — Administración" que salió en la charla con ChatGPT
(pagos, facturación, estadísticas de negocio, equipo/roles) sigue sin sentido
hasta que exista un sistema de pagos — hoy la suscripción es manual
(toggle + renovar). Mensajería/chat sigue siendo WhatsApp, decisión ya
tomada. Ver `docs/anamnesis-v2.md` para el resto de lo que quedó anotado de
esa misma charla.

## Orden recomendado

Empezar por el Nivel 1 completo — es directamente reorganizar
`DashboardPage.tsx` con datos que la query ya trae, cero cambios de backend.
El Nivel 2 vale la pena una vez que haya más de un alumno real usando la app
(con uno solo, un "feed de actividad" no aporta mucho). El Nivel 3 queda para
cuando el resto esté sólido.
