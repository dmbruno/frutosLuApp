# <db/> gym-app — Especificación de implementación

> **Proyecto:** PWA de entrenamiento personalizado para profesora de gimnasia y sus alumnos.
> **Autor:** `>diego.bruno_`
> **Estado:** Spec v1 — lista para implementación.
> **Alcance v1:** pesas + cardio/tiempo + feedback de sesión + adherencia. ~50 alumnos.

---

## 1. Contexto y objetivo

Una profesora de gimnasia carga rutinas personalizadas a cada alumno desde un panel admin.
El alumno ve su rutina semanal en el teléfono, registra peso/reps por serie durante el
entrenamiento, y consulta su progreso (kilaje movido por grupo muscular por día/semana/mes,
PRs, racha). La profe monitorea adherencia y desempeño de todos sus alumnos.

**Referencia de producto:** Hevy (app alumno) + Hevy Coach (panel entrenador). Copiar sus
patrones de UX, no sus features sociales.

**Modelo de negocio v1:** suscripción manual. La profe activa/desactiva accesos desde el
panel. Sin pasarela de pagos en v1 (el schema queda preparado para Mercado Pago en v2).

## 2. Stack — decisiones fijas, no reabrir

| Capa | Elección | Nota |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript | SPA única, rutas admin y alumno en el mismo deploy |
| PWA | vite-plugin-pwa | manifest + service worker, instalable en home screen |
| UI | Tailwind CSS | mobile-first; el alumno usa esto en el gimnasio |
| Estado servidor | TanStack Query | cache + reintentos; no usar Redux |
| Backend | Supabase (Postgres + Auth + RLS) | free tier alcanza para 50 alumnos |
| Gráficos | Recharts | volumen por grupo muscular, progresión por ejercicio |
| Video | iframe embed de YouTube | solo se guarda la URL, cero storage propio |
| Deploy | Vercel | preview deploys por PR |

**Regla:** toda la lógica de autorización vive en RLS de Postgres. El frontend nunca es
la barrera de seguridad, solo la UX.

## 3. Roles y acceso

- `admin` (la profe): CRUD total sobre ejercicios, programas, alumnos, suscripciones.
- `alumno`: lee SOLO sus programas; escribe SOLO sus sesiones, sets, feedback y métricas corporales.
- Alumno con `subscription_status = 'inactive'`: puede loguearse pero la app muestra
  pantalla de bloqueo ("Contactá a tu profe para renovar"). Sus datos NO se borran.

Onboarding de alumno: la profe lo da de alta con email desde el panel → Supabase envía
invitación (magic link) → el alumno completa anamnesis en el primer login.

## 4. Modelo de datos (SQL)

Ejecutar como migración inicial. Convenciones: snake_case, UUID PK, `created_at` en todo.

```sql
-- ============ PERFILES ============
create type user_role as enum ('admin', 'alumno');
create type sub_status as enum ('active', 'inactive');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'alumno',
  full_name text not null,
  birth_date date,
  sex text check (sex in ('F', 'M', 'X')),
  athlete_profile text,          -- 'runner' | 'rugby' | 'postparto' | libre
  subscription_status sub_status not null default 'inactive',
  subscription_expires_at date,  -- informativo; el gate es el status
  injuries_notes text,           -- anamnesis: lesiones / consideraciones
  experience_level text check (experience_level in ('inicial','intermedio','avanzado')),
  goal text,                     -- objetivo declarado en anamnesis
  onboarding_done boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============ CATÁLOGO DE EJERCICIOS ============
-- Enum cerrado de grupos musculares: es la clave de todo el análisis.
create type muscle_group as enum (
  'pecho','espalda','hombros','biceps','triceps','antebrazos',
  'cuadriceps','isquiotibiales','gluteos','gemelos',
  'abdominales','lumbares','cardio','cuerpo_completo'
);
create type exercise_kind as enum ('fuerza','cardio','movilidad');

-- Bloques que usa Luciana en sus rutinas (de su Excel):
create type exercise_block as enum ('movilidad','core','estructura','cardio','otro');

create table exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,     -- nombre exacto de la profe: "SENTADILLA SUMO CON BARRA"
  kind exercise_kind not null default 'fuerza',
  default_block exercise_block,  -- bloque típico; se puede overridear por rutina
  primary_muscle muscle_group not null,
  secondary_muscles muscle_group[] not null default '{}',
  instructions text,             -- indicaciones de la profe, markdown simple
  video_url text,                -- YouTube, Instagram u otro (la profe usa ambos)
  needs_filming boolean not null default false,  -- el "*FILMAR" del Excel: video pendiente
  equipment text,                -- 'barra' | 'DDB' | 'DKB' | 'BW' | 'banda' | 'polea' | ...
  is_archived boolean not null default false,
  created_at timestamptz not null default now()
);
-- Nota seed: cargar el glosario de la profe como equipment normalizado —
-- BW=peso corporal, DKB=doble kettlebell, DDB=doble mancuerna.

-- ============ PLAN (lo prescripto) ============
-- MODELO DE PLANTILLAS (requerimiento del cliente): las rutinas viven
-- precargadas en una biblioteca y se ASIGNAN a alumnos.
-- user_id NULL  = plantilla de la biblioteca (la "receta madre").
-- user_id lleno = programa asignado a un alumno (copia editable).
-- Asignar = COPIA al asignar (snapshot): se duplican programs → program_days
-- → program_exercises con el user_id del alumno vía función assign_template().
-- Editar la plantilla madre NUNCA modifica programas ya asignados; la profe
-- puede ajustar la copia de cada alumno sin tocar la plantilla.
create table programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,  -- NULL = plantilla
  template_id uuid references programs(id) on delete set null,  -- origen de la copia
  name text not null,            -- "Fuerza base 4 semanas"
  notes text,                    -- notas generales de la profe
  starts_on date,                -- NULL en plantillas; obligatorio al asignar
  duration_weeks int,            -- null = sin fin definido
  is_active boolean not null default true,  -- un solo programa activo por alumno
  created_at timestamptz not null default now(),
  constraint template_or_assigned check (
    (user_id is null and starts_on is null)      -- plantilla
    or (user_id is not null and starts_on is not null)  -- asignado
  )
);

-- Función de asignación (copia profunda + EXPANSIÓN de semanas tipo):
create or replace function assign_template(
  p_template_id uuid, p_user_id uuid, p_starts_on date
) returns uuid language plpgsql security definer as $$
-- 1. inserta copia de programs con user_id + template_id, starts_on = p_starts_on
-- 2. lee cycle_pattern de la plantilla (ej {1,2,3,4} repetido hasta total_weeks)
-- 3. para CADA semana real (1..total_weeks): busca la semana tipo que le toca
--    según el patrón, y copia sus program_days + program_exercises con
--    week_number = la semana REAL (no la tipo). Así 1,5,9 nacen como filas
--    separadas aunque provengan del mismo tipo A.
-- 4. desactiva el programa activo anterior del alumno (is_active = false)
-- 5. retorna el id del nuevo programa
-- Resultado: la copia del alumno queda expandida y 100% editable semana por semana.
$$;
-- RLS: las plantillas (user_id IS NULL) son visibles/editables SOLO por admin.

-- SEMANAS TIPO REUTILIZABLES (del Excel real de Luciana):
-- Su planilla NO tiene 24 semanas distintas. Tiene POCAS "semanas tipo" que se
-- repiten en ciclos: los encabezados dicen "SEMANA 1-5-9", "SEMANA 2-6-10", etc.
-- → semana 1=5=9 son la MISMA rutina (tipo A).
--
-- DECISIÓN DE DISEÑO (importante):
-- * En la PLANTILLA, la profe arma semanas tipo (A,B,C,D) UNA vez, y define el
--   patrón de ciclo. week_number en la plantilla identifica el TIPO (1=A,2=B,...).
--   Un campo cycle_pattern en programs mapea semana real → semana tipo.
-- * Al ASIGNAR, assign_template() EXPANDE el patrón a semanas concretas 1..N,
--   generando una fila program_days por cada semana real del alumno.
--   Así cada semana del alumno es una fila independiente y editable por separado
--   (permite "editar SOLO la semana 1 del alumno X" sin afectar sus semanas 5 y 9,
--   ni a ningún otro alumno). Cuesta más filas, pero es barato y da libertad total.
--
-- Analogía: la plantilla es el molde; la copia del alumno son las galletas ya
-- horneadas, cada una individual.
create table program_days (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  week_number int not null default 1,  -- en plantilla: nº de semana TIPO. en copia: semana real 1..N
  title text not null,           -- "DÍA 1", "DÍA 2", "DÍA 3"
  position int not null,         -- orden del día dentro de la semana
  weekday int check (weekday between 1 and 7),  -- opcional: anclar a día real
  unique (program_id, week_number, position)
);
-- programs gana: cycle_pattern int[]  -- ej {1,2,3,4,1,2,3,4,...} mapea semana real→tipo
--                total_weeks int       -- semanas reales a expandir al asignar (ej 24)

-- program_exercises: refleja cómo Luciana escribe sus rutinas (de su Excel).
-- CLAVE 1: la VERDAD es texto. En su planilla aparecen "3X10", "3X5/5" (por lado),
--   "3X1' POR LADO", "10 TOTAL", "3X6 A 8", "3X10'' POR LADO", "8 PASOS + 8 SENT".
--   Se guarda tal cual en sets_reps_text y SIEMPRE se muestra así (nunca se pierde
--   ni se deforma info). ADEMÁS se parsean campos numéricos OPCIONALES (parsed_*)
--   solo para alimentar métricas de volumen; si un caso no parsea, quedan NULL y
--   no rompen nada. Ver parse_sets_reps() abajo. La app NUNCA obliga a la profe a
--   cargar en casillas separadas: escribe en UN campo y el parseo es automático.
-- CLAVE 2: la profe NO prescribe peso — su columna "PESO EJECUTADO" va vacía.
--   suggested_weight_kg queda casi siempre NULL; el peso lo carga la alumna al entrenar.
-- CLAVE 3: bloque (MOVILIDAD/CORE/ESTRUCTURA) y código de orden ("A1","B2","C1")
--   se conservan. Ejercicios con misma letra (A1+A2) = superserie.
create table program_exercises (
  id uuid primary key default gen_random_uuid(),
  program_day_id uuid not null references program_days(id) on delete cascade,
  exercise_id uuid not null references exercises(id),
  block exercise_block not null default 'estructura',  -- de qué bloque del día es
  order_code text,               -- etiqueta de la profe: "1", "A1", "A2", "B1", "C2"
  position int not null,         -- orden numérico para render
  -- --- FUENTE DE VERDAD (lo que escribe la profe) ---
  sets_reps_text text not null,  -- "3X5/5", "10 TOTAL", "1' POR LADO" — se muestra tal cual
  -- --- DERIVADOS OPCIONALES (autogenerados por parse_sets_reps, solo para métricas) ---
  parsed_sets int,               -- 3    (NULL si no se puede inferir)
  parsed_reps int,               -- 5    (NULL si es rango/tiempo/total)
  is_per_side boolean not null default false,  -- true para "/5" y "POR LADO"
  rep_unit text,                 -- 'reps' | 'seg' | 'min' | 'total' | 'rango' | NULL
  -- --- resto ---
  suggested_weight_kg numeric(6,2),  -- casi siempre NULL (ella no pauta peso)
  rest_sec int,
  superset_group text,           -- "A","B","C" — agrupa A1+A2 como superserie
  coach_note text                -- "*libre o en guía", "*RODILLAS FLEXIONADAS/SIN"
);

-- Parseo texto → campos numéricos. Se ejecuta en un trigger BEFORE INSERT/UPDATE
-- sobre sets_reps_text. NO valida ni bloquea: lo que no matchea queda NULL.
-- Patrones detectados en el Excel real de Luciana (cubrir al menos estos):
--   "3X10"            → sets=3  reps=10  unit='reps'
--   "3X5/5"           → sets=3  reps=5   is_per_side=true  unit='reps'
--   "3X6 A 8"         → sets=3  reps=NULL unit='rango'   (guardar rango en texto)
--   "10 TOTAL"        → sets=NULL reps=10 unit='total'
--   "3X1' POR LADO"   → sets=3  reps=NULL is_per_side=true unit='min'
--   "3X10'' POR LADO" → sets=3  reps=NULL is_per_side=true unit='seg'
--   "1' X LADO"       → sets=NULL is_per_side=true unit='min'
--   "3X8 PASOS + 8 SENT" → sets=3 reps=NULL unit='reps' (combinado: dejar en texto)
-- Regla de oro: ante la duda, dejar NULL. El texto siempre manda para mostrar;
-- los parsed_* solo suman al volumen cuando existen sets Y reps numéricos.
create or replace function parse_sets_reps(txt text)
returns table (p_sets int, p_reps int, p_per_side boolean, p_unit text)
language plpgsql immutable as $$
-- 1. normalizar (upper, trim)
-- 2. detectar "POR LADO" | "X LADO" | "/n" → p_per_side = true
-- 3. detectar unidad: "''" → seg | "'" → min | "TOTAL" → total | " A " → rango | resto → reps
-- 4. regex "^(\d+)\s*X" → p_sets ; para reps solo si es entero simple (no rango/tiempo)
-- 5. lo que no matchee → NULL (nunca lanzar error)
$$;

-- ============ EJECUCIÓN (lo realizado) ============
create table workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  program_day_id uuid references program_days(id) on delete set null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  feeling smallint check (feeling between 1 and 5),  -- feedback 😫→💪
  athlete_note text,
  created_at timestamptz not null default now()
);

create type set_type as enum ('normal','calentamiento','fallo','drop');

create table set_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references workout_sessions(id) on delete cascade,
  program_exercise_id uuid references program_exercises(id) on delete set null,
  exercise_id uuid not null references exercises(id),  -- desnormalizado a propósito:
                                                       -- el análisis sobrevive si la
                                                       -- profe edita/borra el plan
  set_number int not null,
  set_type set_type not null default 'normal',
  weight_kg numeric(6,2),        -- null para cardio/movilidad
  reps int,
  duration_sec int,              -- para ejercicios por tiempo
  distance_m int,                -- para running
  logged_at timestamptz not null default now()
);

-- ============ TRACK DE PROGRESO / ANTROPOMETRÍA ============
-- La sección "TRACK DE PROGRESO" del Excel de Luciana es central para ella:
-- registra peso, % graso y circunferencias (cuello, hombros, pecho, bíceps,
-- cintura, cadera, cuádriceps, pantorrillas) en INICIO y FINAL, más fotos
-- (frente, atrás, laterales). Va en la v1.
create table body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  measured_on date not null default current_date,
  label text,                    -- "INICIO", "FINAL", o libre
  weight_kg numeric(5,2),
  body_fat_pct numeric(4,1),
  -- circunferencias en cm (todas opcionales):
  neck_cm numeric(5,1), shoulders_cm numeric(5,1), chest_cm numeric(5,1),
  biceps_cm numeric(5,1), waist_cm numeric(5,1), hips_cm numeric(5,1),
  quads_cm numeric(5,1), calves_cm numeric(5,1),
  note text,
  unique (user_id, measured_on, label)
);

-- Fotos de progreso (Storage privado con RLS; opcional pero previsto):
create table progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  taken_on date not null default current_date,
  pose text,                     -- 'frente' | 'atras' | 'lateral_der' | 'lateral_izq'
  stage text,                    -- 'inicio' | 'final'
  storage_path text not null     -- ruta en Supabase Storage (bucket privado)
);
```

### RLS (activar en TODAS las tablas)

Patrón: helper `is_admin()` + política de dueño. Ejemplo completo para `set_logs`;
replicar el patrón en el resto.

```sql
create or replace function is_admin() returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table set_logs enable row level security;

create policy "admin ve todo" on set_logs
  for all using (is_admin());

create policy "alumno lee sus sets" on set_logs
  for select using (
    session_id in (select id from workout_sessions where user_id = auth.uid())
  );

create policy "alumno inserta en sus sesiones" on set_logs
  for insert with check (
    session_id in (select id from workout_sessions where user_id = auth.uid())
  );
```

Reglas por tabla:
- `profiles`: alumno lee/actualiza solo su fila (y NO puede cambiar `role` ni
  `subscription_status` — proteger con política de columnas o trigger).
- `exercises`, `programs`, `program_days`, `program_exercises`: alumno solo SELECT
  (sus programas); escritura solo admin.
- `workout_sessions`, `set_logs`, `body_metrics`: alumno CRUD sobre lo propio.

**Gate de suscripción también en RLS** (la pantalla de bloqueo del front es UX, no
seguridad): las políticas de SELECT del alumno sobre `programs`, `program_days` y
`program_exercises` deben incluir la condición de suscripción activa:

```sql
create or replace function is_active_sub() returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and subscription_status = 'active'
  );
$$;

-- Ejemplo en programs (replicar en program_days y program_exercises vía join):
create policy "alumno lee sus programas" on programs
  for select using (
    is_admin() or (user_id = auth.uid() and is_active_sub())
  );
```

El historial (`workout_sessions`, `set_logs`, `body_metrics`) queda legible aunque la
suscripción esté inactiva: el alumno conserva sus datos, solo pierde acceso al plan.

### Índices (las queries calientes)

```sql
create index idx_set_logs_exercise on set_logs (exercise_id, logged_at);
create index idx_set_logs_session on set_logs (session_id);
create index idx_sessions_user on workout_sessions (user_id, started_at desc);
create index idx_programs_user on programs (user_id) where is_active;
```

### View de adherencia (sin cron, se calcula al vuelo)

```sql
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
```

### 4.1 · Mapeo del Excel real de Luciana ("EMBARAZO GYM X3")

Analicé su planilla real. Así se traduce su estructura al modelo (guía para el seed
y para validar el editor):

| En su Excel | En el modelo |
|---|---|
| BLOQUES: MOVILIDAD / CORE / ESTRUCTURA | `program_exercises.block` (enum `exercise_block`) |
| Códigos A1, A2, B1, B2, C1, C2 | `order_code` (texto) + `superset_group` ("A","B","C") |
| A1+A2 se hacen alternados | misma `superset_group` = superserie |
| "SERIES X REPS": 3X10, 3X5/5, 3X6 A 8, 10 TOTAL, 1' POR LADO, 10'' POR LADO | `sets_reps_text` (verdad, se muestra) + `parsed_sets`/`parsed_reps`/`is_per_side`/`rep_unit` (derivados opcionales, solo para métricas) |
| Columna "PESO EJECUTADO" (vacía) | la carga la registra la alumna → `set_logs.weight_kg`, NO la profe |
| Encabezado "SEMANA 1-5-9", "2-6-10"… | semanas tipo + `cycle_pattern` en la plantilla |
| "*FILMAR" junto al ejercicio | `exercises.needs_filming = true` |
| Enlaces a videos de su Instagram | `exercises.video_url` (no solo YouTube) |
| Notas "*libre o en guía", "*RODILLAS FLEXIONADAS/SIN" | `coach_note` |
| Glosario BW / DKB / DDB | `exercises.equipment` normalizado |
| Sección TRACK DE PROGRESO (medidas, % graso, fotos) | `body_metrics` + `progress_photos` |
| RECOMENDACIONES (Valsalva, suelo pélvico, lactancia…) | `programs.notes` de la plantilla |

**Observación de negocio:** su rutina "EMBARAZO GYM X3" es exactamente el caso
"plantilla genérica" → 3 días/semana, ~24 semanas por ciclos de 4 semanas tipo,
pensada para asignarse a muchas alumnas postparto y luego ajustar por persona.
Es el mejor primer caso de prueba end-to-end del sistema de plantillas.

**Ejercicios detectados para el seed** (nombres exactos de la profe, ~60 únicos):
movilidad (cat camel, rotaciones torácicas, ranitas, 90/90 rotación cadera,
escapulaciones, flexión de tobillo + activación de isquios…), core (connection
breath, dead bug march, bird dog, reverse crunch, press pallof, scrum position
lateral walk, plancha lateral…), estructura (sentadilla back/sumo/goblet/búlgara,
hip thrust, estocadas atrás DDB, pull through en polea, press plano/inclinado DDB,
curl femoral con fitball, face pulls, vuelo lateral, walk out, wall balls…).

## 5. Lógica de métricas — kilaje por grupo muscular

Regla estándar de la industria (misma que Hevy):

```
volumen de una serie = weight_kg × reps      (solo set_type != 'calentamiento')
→ 100% asignado al músculo primario del ejercicio
→  50% asignado a cada músculo secundario
```

Implementar como función SQL (no en el frontend) para que dashboard alumno y panel
admin consuman lo mismo:

```sql
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
```

Cardio/movilidad no suma kilaje: se reporta aparte como minutos totales y distancia.

**PRs (récords personales):** máximo `weight_kg` histórico por ejercicio, y mejor
volumen de serie. Query directa sobre `set_logs`, no tabla aparte.

## 6. Arquitectura de carpetas (atomizada — respetar SIEMPRE)

Estructura por **feature**, no por tipo de archivo. Cada feature es autocontenida y
se puede mantener/escalar sin tocar las demás. Claude Code debe respetar esta
estructura en cada paso y NUNCA meter lógica de datos dentro de componentes de UI.

```
src/
├── lib/                        # infraestructura, sin lógica de negocio
│   ├── supabase.ts             # cliente único de Supabase (singleton)
│   ├── queryClient.ts          # config de TanStack Query
│   └── utils/                  # helpers puros y testeables
│       ├── parseSetsReps.ts    # parseo "3X5/5" → {sets,reps,perSide,unit}
│       ├── volume.ts           # cálculo de kilaje por músculo (cliente)
│       ├── dates.ts            # semana actual desde starts_on, TZ Salta
│       └── format.ts           # formateo kg, fechas, etc.
│
├── types/                      # tipos compartidos
│   ├── database.ts             # GENERADO por supabase gen types (no editar a mano)
│   └── domain.ts               # tipos de dominio derivados (Program, WeekPlan…)
│
├── components/ui/              # primitivos de UI reutilizables, SIN lógica de negocio
│   ├── Button.tsx  Card.tsx  Input.tsx  Toggle.tsx  Pill.tsx
│   ├── Modal.tsx   Spinner.tsx  EmptyState.tsx  Toast.tsx
│   └── index.ts                # barrel export
│
├── components/layout/          # estructura visual compartida
│   ├── AppShell.tsx            # layout alumno (bottom nav)
│   ├── AdminShell.tsx          # layout admin (sidebar/bottom según viewport)
│   ├── BottomNav.tsx  Sidebar.tsx  ProtectedRoute.tsx
│
├── features/                   # ⭐ el corazón: una carpeta por dominio
│   ├── auth/
│   │   ├── components/         # LoginForm, MagicLinkSent
│   │   ├── hooks/              # useAuth, useSession, useRole
│   │   └── api.ts              # signInWithOtp, signOut
│   ├── exercises/              # catálogo
│   │   ├── components/         # ExerciseList, ExerciseForm, ExerciseRow
│   │   ├── hooks/              # useExercises, useExerciseMutations
│   │   └── api.ts
│   ├── programs/               # plantillas + asignación (el dominio más grande)
│   │   ├── components/         # TemplateLibrary, ProgramEditor, WeekTabs,
│   │   │                       #   DayBlock, ExercisePicker, AssignModal
│   │   ├── hooks/              # usePrograms, useTemplates, useAssignTemplate
│   │   └── api.ts
│   ├── workout/                # ejecución del alumno (pantalla crítica)
│   │   ├── components/         # TodayView, WeekView, WorkoutSession,
│   │   │                       #   SetRow ⭐, RestTimer, SessionSummary
│   │   ├── hooks/              # useTodayWorkout, useSetLogger, useRestTimer
│   │   ├── offlineQueue.ts     # cola de set_logs en IndexedDB
│   │   └── api.ts
│   ├── progress/               # métricas del alumno
│   │   ├── components/         # VolumeByMuscle, PersonalRecords, StreakCard
│   │   ├── hooks/              # useMuscleVolume, useRecords
│   │   └── api.ts
│   ├── students/               # panel: gestión de alumnos (admin)
│   │   ├── components/         # StudentList, StudentCard, AdherenceLight,
│   │   │                       #   SubscriptionToggle, StudentDetail
│   │   ├── hooks/              # useStudents, useAdherence, useSubscription
│   │   └── api.ts
│   └── body-tracking/          # antropometría + fotos
│       ├── components/         # MeasurementsForm, MeasurementHistory, PhotoGrid
│       ├── hooks/              # useBodyMetrics, useProgressPhotos
│       └── api.ts
│
├── pages/                      # SOLO ensamblan features, cero lógica propia
│   ├── LoginPage.tsx  OnboardingPage.tsx  BlockedPage.tsx
│   ├── TodayPage.tsx  WeekPage.tsx  WorkoutPage.tsx  ProgressPage.tsx  ProfilePage.tsx
│   └── admin/
│       ├── DashboardPage.tsx  StudentsPage.tsx  StudentDetailPage.tsx
│       ├── ExercisesPage.tsx  TemplatesPage.tsx  ProgramEditorPage.tsx
│
├── routes.tsx                  # definición central de rutas + guards
├── App.tsx                     # providers (Query, Router, Auth)
└── main.tsx
```

### Reglas de la arquitectura (no negociables)

1. **La UI nunca habla con Supabase directo.** Flujo estricto:
   `componente → hook → api.ts → supabase`. Un componente que importa `supabase`
   directamente es un bug.
2. **`api.ts` por feature** concentra todas las queries/mutations de ese dominio.
   Son funciones puras que reciben params y devuelven datos tipados.
3. **Hooks envuelven a `api.ts`** con TanStack Query (cache, loading, error, refetch).
   Nombres: `useX` para lectura, `useXMutations` para escritura.
4. **`components/ui/` es tonto**: sin fetch, sin lógica de negocio, solo props.
   Reutilizable en cualquier feature. Si un componente ahí importa un hook de
   feature, está mal ubicado.
5. **`pages/` solo ensambla**: importa componentes de features y los acomoda.
   Cero fetch, cero estado de negocio en las pages.
6. **Un archivo, una responsabilidad.** Si un componente pasa de ~150 líneas o hace
   más de una cosa, se parte. `SetRow` no sabe de sesiones; `WorkoutSession`
   no sabe de pintar un input de peso.
7. **Barrel exports** (`index.ts`) por carpeta para imports limpios.
8. **Sin lógica duplicada**: helpers puros van a `lib/utils/` y se testean solos
   (`parseSetsReps`, `volume`, `dates`).

## 7. Estructura de rutas

```
/login                     → magic link
/onboarding                → anamnesis (solo si onboarding_done = false)
/bloqueado                 → suscripción inactiva

/                          → Hoy: qué toca + acceso rápido a "Entrenar"
/semana                    → vista semanal con días ✓
/entrenar/:programDayId    → MODO ENTRENAMIENTO (pantalla crítica)
/progreso                  → gráficos: kilaje por músculo, PRs, racha, peso corporal
/perfil                    → datos personales + historial de peso + medidas

/admin                     → dashboard: semáforo de adherencia (v_adherence)
/admin/alumnos             → lista + activar/desactivar suscripción (toggle)
/admin/alumnos/:id         → ficha: anamnesis, programa activo, progreso, sesiones
/admin/ejercicios          → CRUD catálogo
/admin/plantillas          → biblioteca de plantillas + asignación
/admin/plantillas/:id      → EDITOR de rutinas con semanas tipo (pantalla crítica)
```

Guard de rutas en `routes.tsx` vía `<ProtectedRoute>`: `role === 'admin'` para
`/admin/*`; `subscription_status === 'active'` para el resto salvo `/login`,
`/onboarding`, `/bloqueado`.

### 7.1 `SetRow` — el componente estrella de la app

Una fila = una serie. El alumno la usa con las manos con magnesio entre series.

```
[ set# ] [ última vez: 60kg × 10 ] [ peso: input + steppers ±2.5 ] [ reps ] [ ✓ ]
```

- Pre-cargado con los valores de la MISMA serie de la sesión anterior
  (query: último `set_logs` del mismo `program_exercise_id` y `set_number`).
- El ✓ dispara: INSERT inmediato a `set_logs` + arranca timer de descanso (`rest_sec`).
- **Un INSERT por serie, nunca un submit al final.** Si muere la batería en la serie 8,
  las 7 anteriores están guardadas.
- Botones e inputs grandes: mínimo 48px de alto táctil.

### 7.2 Modo entrenamiento (`/entrenar/:programDayId`)

- Crea `workout_session` al entrar (o retoma la abierta del día).
- Un ejercicio por vez, navegación siguiente/anterior. Muestra: nombre, `coach_note`
  destacada, embed de YouTube colapsado, lista de `SetRow`.
- Timer de descanso: overlay con cuenta regresiva + vibración (`navigator.vibrate`).
- Al terminar: pantalla de cierre con feeling 1–5 (emojis) + nota opcional → setea
  `finished_at` y `feeling`.

### 7.3 Builder de rutinas (admin)

- Programa → días → ejercicios. Drag & drop para ordenar (dnd-kit).
- Selector de ejercicio con búsqueda sobre el catálogo (nunca texto libre).
- **Duplicar programa**: botón que clona programs + days + exercises a otro alumno.
  Es LA feature que le ahorra horas a la profe con 50 alumnos. Implementar como
  función RPC de Postgres (transaccional).
- Campos por ejercicio: sets, reps (texto), peso sugerido, RPE, descanso, superset,
  nota de coach.

### 7.4 Cola offline (mínima, no offline-first)

La señal en gimnasios es mala. Alcance acotado:

- Si el INSERT de `set_logs` falla por red → guardar el payload en IndexedDB
  (librería `idb`, key = uuid generado en cliente).
- Reintento: al recuperar conexión (`online` event) y al abrir la app.
- El `id` del set se genera en el cliente (uuid v4) → los reintentos son idempotentes.
- NO cachear lecturas ni sincronizar el plan offline en v1. Solo la escritura de sets.

## 8. Fases de implementación

**Fase 1 — Esqueleto (validar con la profe antes de seguir)**
1. Setup: Vite + TS + Tailwind + Supabase client + TanStack Query + router con guards.
2. Migración SQL completa (sección 4) + RLS + seed de ~30 ejercicios base.
3. Auth con magic link + alta de alumnos desde admin.
4. CRUD de ejercicios + builder de rutinas básico (sin drag & drop todavía).
5. ✋ CHECKPOINT: la profe carga una rutina real a un alumno real. Si tarda >15 min,
   rediseñar el builder antes de continuar.

**Fase 2 — Corazón**
6. Modo entrenamiento completo: SetRow, "última vez", timer, cierre con feeling.
7. Vista Hoy + Semana.
8. Cola offline de set_logs.

**Fase 3 — Valor visible**
9. Dashboard de progreso alumno: `muscle_volume()` + Recharts (día/semana/mes),
   PRs, racha de semanas, historial de peso corporal.
10. Panel admin: semáforo `v_adherence` + ficha de alumno con su progreso.
11. Anamnesis de onboarding.
12. Duplicar programa + drag & drop en builder.
13. PWA: manifest, íconos, service worker, prompt de instalación.
14. Pantalla de bloqueo por suscripción + toggle en admin.

## 9. Convenciones de código

**Stack de datos y estado:**
- TypeScript estricto (`strict: true`). Tipos de DB generados con
  `supabase gen types typescript` → `src/types/database.ts` (NUNCA editar a mano;
  regenerar tras cada migración).
- **TanStack Query** para todo el estado de servidor (cache, loading, error, refetch).
  Nada de `useEffect + useState` para fetching.
- **Zustand** solo si hace falta estado global de cliente (ej. sesión de entrenamiento
  en curso). Preferir estado local mientras se pueda.
- Toda query/mutation vive en `features/<x>/api.ts`, envuelta por un hook en
  `features/<x>/hooks/`. Cero llamadas a `supabase` desde componentes o pages.

**Estilo y nombres:**
- Componentes en `PascalCase.tsx`, hooks en `camelCase.ts` con prefijo `use`,
  helpers puros en `camelCase.ts`.
- Nombres de tablas/columnas en inglés; UI y textos en español (es-AR, voseo).
- Un componente = una responsabilidad. Máx. ~150 líneas; si crece, se parte.
- Props tipadas con interface explícita; nada de `any`.
- Estados de carga/error/vacío SIEMPRE contemplados (usar `Spinner`, `EmptyState`).

**Fechas y commits:**
- Guardar todo en UTC (`timestamptz`); mostrar en `America/Argentina/Salta`.
- Conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`). **Un paso del
  PROMPTS.md = un commit** con mensaje claro.

**Calidad:**
- ESLint + Prettier configurados desde el paso 1. El código se formatea solo.
- Helpers puros (`parseSetsReps`, `volume`, `dates`) con tests unitarios (Vitest).
- Antes de cerrar un paso: `npm run build` sin errores de TS.

## 10. Fuera de alcance v1 (no implementar aunque tiente)

- Chat interno (se usa WhatsApp), notificaciones push, fotos de progreso,
  pagos automáticos (Mercado Pago es v2: webhook → `subscription_status`),
  app nativa, features sociales, generación automática de rutinas.

## 11. Pendientes de definición con el cliente

- [x] ~~Paleta y nombre~~ → **Frutos Lu**, paleta rosa `#F2679C`/coral/ámbar,
      tipografías Portland (títulos, verificar licencia) + Poppins (cuerpo).
- [x] ~~Lista de ejercicios~~ → obtenida del Excel real (~60 ejercicios, ver 4.1).
- [ ] Confirmar si un plan largo tiene varios juegos de semanas tipo (fases/bloques,
      ej. semanas 1-12 vs 13-24 con ejercicios más avanzados).
- [ ] Precio y política de suscripción (mensual, ¿días de gracia?).
- [ ] Tipo de cambio para el cobro (oficial/MEP/blue/acordado).
- [ ] Dominio (ej. app.frutoslu.com).
- [ ] Licencia de la tipografía Portland (si no, Poppins SemiBold en títulos).

## 12. Arranque del proyecto (setup manual de Diego, antes de Claude Code)

Esto lo hace Diego una vez, fuera de Claude Code:
1. Crear proyecto en Supabase → guardar `Project URL`, `anon key`, `service_role key`.
2. Crear repo en GitHub (vacío).
3. Clonar, abrir en VS Code, iniciar Claude Code dentro del proyecto.
4. Tener `CLAUDE.md` (este archivo) y `PROMPTS.md` en la raíz del repo.
5. Ejecutar los prompts de `PROMPTS.md` en orden, uno por uno, verificando cada paso
   antes de avanzar. Un paso = un prompt = un commit.

---

`>diego.bruno_` — spec v1 · julio 2026