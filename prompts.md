# PROMPTS.md — Frutos Lu

Guion de ejecución para Claude Code. **Un paso = un prompt = un commit.**
Pegá cada prompt tal cual, esperá a que termine, **verificá** con el check ✅ antes
de avanzar. Si un paso falla la verificación, corregilo antes de seguir — los pasos
se apoyan unos en otros.

Referencia siempre `CLAUDE.md` (está en la raíz). Es la fuente de verdad del proyecto.

---

## Antes de empezar (Diego, manual)

- [ ] Proyecto Supabase creado. Anotá `URL`, `anon key`, `service_role key`.
- [ ] Repo GitHub creado y clonado.
- [ ] `CLAUDE.md` y este `PROMPTS.md` en la raíz del repo.
- [ ] VS Code abierto en la carpeta, Claude Code iniciado.

---

# FASE 1 — LA BASE

## P1 · Scaffolding

```
Vamos a construir Frutos Lu, una PWA de entrenamiento. Leé CLAUDE.md entero antes
de escribir código y tratalo como fuente de verdad, en especial la sección 6
(arquitectura de carpetas atomizada) y la 9 (convenciones).

Este primer paso es SOLO scaffolding, sin features todavía:
1. Inicializá React + Vite + TypeScript (strict).
2. Instalá y configurá: Tailwind CSS, vite-plugin-pwa, @supabase/supabase-js,
   react-router-dom, @tanstack/react-query, ESLint + Prettier, Vitest.
3. Creá la estructura de carpetas EXACTA de la sección 6 de CLAUDE.md
   (lib/, types/, components/ui/, components/layout/, features/, pages/), con
   archivos placeholder y barrel exports donde corresponda.
4. Configurá el cliente único de Supabase en src/lib/supabase.ts leyendo
   VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY desde .env.local. Creá .env.example.
5. Configurá Tailwind con la paleta Frutos Lu (rosa #F2679C, coral, ámbar) y la
   fuente Poppins como tokens.
6. Configurá TanStack Query en src/lib/queryClient.ts y los providers en App.tsx.
7. Dejá una página "/" mínima que confirme visualmente que Supabase conecta.

NO crees tablas, auth ni pantallas de producto todavía. Al terminar, decime los
comandos que corriste y cómo verifico que arranca. Hacé un commit "chore: scaffolding inicial".
```

✅ **Verificar:** `npm run dev` levanta sin errores, la página "/" carga, la consola
no muestra error de conexión a Supabase. Las carpetas coinciden con la sección 6.

---

## P2 · Migración de base de datos

```
Ahora la base de datos. Tomá TODO el SQL de la sección 4 de CLAUDE.md (enums, tablas,
constraints, la función assign_template, parse_sets_reps, muscle_volume, la view
v_adherence) y las políticas RLS de la sección 4.

1. Creá una carpeta supabase/migrations/ y un archivo 0001_initial_schema.sql con
   todo el esquema en orden correcto de dependencias (enums → tablas → funciones →
   RLS → índices → view).
2. Implementá el CUERPO real de las funciones que en CLAUDE.md están como comentario:
   - parse_sets_reps(txt): los patrones del Excel (3X10, 3X5/5, 10 TOTAL, 1' POR LADO,
     10'' POR LADO, 3X6 A 8). Ante la duda, NULL, nunca error.
   - assign_template(template_id, user_id, starts_on): copia profunda + expansión del
     cycle_pattern a semanas concretas 1..N.
   - muscle_volume: agregación de set_logs por grupo muscular.
3. Activá RLS en TODAS las tablas con las políticas de CLAUDE.md (helper is_admin(),
   gate de suscripción is_active_sub()).
4. Dejá instrucciones claras de cómo aplico esta migración en mi proyecto Supabase
   (SQL Editor o CLI).

No inventes tablas ni columnas fuera de CLAUDE.md. Commit "feat: esquema inicial + RLS".
```

✅ **Verificar:** aplicás el SQL en Supabase sin errores. En Table Editor están todas
las tablas. RLS aparece activo (candado) en cada una. Las 3 funciones existen en
Database → Functions.

---

## P3 · Tipos + seed inicial

```
1. Generá los tipos de TypeScript desde la base con supabase gen types typescript
   y guardalos en src/types/database.ts. Decime el comando exacto para regenerarlos.
2. Creá src/types/domain.ts con los tipos de dominio derivados (Program, WeekPlan,
   DayWithExercises, StudentWithAdherence, etc.) construidos sobre los de database.ts.
3. Creá supabase/seed.sql con:
   - Los ~60 ejercicios de Luciana listados en la sección 4.1 de CLAUDE.md, con su
     nombre exacto, bloque (movilidad/core/estructura), músculo primario estimado,
     equipment normalizado (BW/DKB/DDB), y needs_filming=true donde el Excel marca *FILMAR.
   - 1 plantilla base "Embarazo Gym X3" (user_id NULL) con su cycle_pattern, algunos
     días y ejercicios de ejemplo tomados del Excel, para probar el flujo end-to-end.
4. Implementá src/lib/utils/parseSetsReps.ts (versión cliente, espejo de la SQL) con
   sus tests en Vitest cubriendo todos los patrones del Excel.

Commit "feat: tipos generados + seed de ejercicios y plantilla base".
```

✅ **Verificar:** `src/types/database.ts` existe y tipa. Aplicás el seed, la tabla
`exercises` tiene ~60 filas, hay 1 plantilla con `user_id NULL`. `npm run test` pasa
los tests de `parseSetsReps`.

---

## P4 · Auth + roles + rutas protegidas

```
Implementá la feature auth siguiendo la arquitectura de CLAUDE.md (features/auth/ con
components, hooks, api.ts — la UI NO habla con supabase directo).

1. features/auth/api.ts: signInWithOtp (magic link), signOut, getSession.
2. features/auth/hooks/: useAuth (sesión actual + estado), useRole (lee profiles.role).
3. features/auth/components/: LoginForm, MagicLinkSent.
4. components/layout/ProtectedRoute.tsx: guard por rol y por subscription_status
   según la sección 7 de CLAUDE.md.
5. routes.tsx: definí todas las rutas de la sección 7 con sus guards. Las de producto
   pueden ser placeholders por ahora.
6. Al primer login, si no existe fila en profiles, crearla (rol 'alumno' por defecto).
   Yo marcaré manualmente mi usuario como 'admin' en Supabase para probar.

Commit "feat: auth con magic link, roles y rutas protegidas".
```

✅ **Verificar:** entrás con tu mail, te llega el magic link, iniciás sesión. Como
admin ves `/admin`; si te ponés como alumno sin suscripción, te manda a `/bloqueado`.

---

## P5 · Catálogo de ejercicios (CRUD admin)

```
Feature exercises completa (features/exercises/), pantalla /admin/ejercicios.

1. api.ts: listExercises, createExercise, updateExercise, archiveExercise.
2. hooks/: useExercises (lista con filtro/búsqueda), useExerciseMutations.
3. components/: ExerciseList, ExerciseRow, ExerciseForm (nombre, tipo, bloque, músculo
   primario, secundarios, instrucciones, video_url, needs_filming, equipment).
4. pages/admin/ExercisesPage.tsx: ensambla la feature. Búsqueda, alta, edición.
5. Usá los primitivos de components/ui/. Estados loading/error/vacío contemplados.

Respetá el flujo componente → hook → api → supabase. Commit "feat: CRUD catálogo de ejercicios".
```

✅ **Verificar:** en `/admin/ejercicios` ves los ~60 del seed, podés crear uno nuevo,
editarlo, y buscar. Los cambios persisten en Supabase.

---

## P6 · Editor de plantillas (con semanas tipo)

```
Feature programs — la parte de PLANTILLAS y su editor. Es el dominio más complejo,
seguí al detalle las secciones 4 (modelo semanas tipo + cycle_pattern) y 6 de CLAUDE.md.

1. api.ts: listTemplates, getProgramFull (con días+ejercicios), createTemplate,
   updateProgram, y las mutations de días/ejercicios.
2. hooks/: useTemplates, useProgramEditor.
3. components/:
   - TemplateLibrary: lista de plantillas (user_id NULL).
   - ProgramEditor: contenedor del editor.
   - WeekTabs: pestañas de semanas tipo + "duplicar semana anterior".
   - DayBlock: un día con sus bloques (movilidad/core/estructura).
   - ExercisePicker: buscador del catálogo para agregar ejercicios.
   - Fila de ejercicio: order_code, sets_reps_text (texto libre, con parseo auto a
     parsed_*), superset_group, rest_sec, coach_note.
4. pages/admin/TemplatesPage.tsx y ProgramEditorPage.tsx.

Recordá: sets_reps_text es la VERDAD (texto), parsed_* se autocompletan. La profe
escribe en UN campo. Commit "feat: editor de plantillas con semanas tipo".
```

✅ **Verificar:** creás una plantilla nueva, agregás días y ejercicios desde el
catálogo, escribís "3X10" y ves que autocompleta sets/reps, duplicás una semana y la
ajustás. Todo persiste.

---

## P7 · Asignación de plantilla a alumno  ⛑ PUNTO DE CONTROL

```
Cerramos la Fase 1 con la asignación (feature programs).

1. api.ts: assignTemplate (llama a la función SQL assign_template), listStudentPrograms.
2. hooks/: useAssignTemplate.
3. components/: AssignModal (elegir alumno/s + fecha de inicio), y en la ficha de
   alumno la posibilidad de ver/editar SU copia del programa (edición por alumno sin
   tocar la plantilla madre).
4. Verificá el flujo completo: asignar "Embarazo Gym X3" a un alumno de prueba expande
   las semanas correctamente según cycle_pattern y starts_on.

Commit "feat: asignación de plantillas con expansión de semanas".
```

✅ **Verificar + ⛑ CON LUCIANA:** ella arma una rutina real y la asigna a una alumna
de prueba. **Cronometrá.** Si le lleva más de 15 min, pará y rediseñá el editor (P6)
antes de la Fase 2. Este es el checkpoint que define el producto.

---

# FASE 2 — ENTRENAR

## P8 · Vista Hoy / Mi semana

```
Feature workout — parte de visualización (features/workout/).

1. api.ts: getTodayWorkout (resuelve la semana actual desde starts_on, ver
   lib/utils/dates.ts), getWeekView.
2. hooks/: useTodayWorkout, useWeekView.
3. components/: TodayView (qué toca hoy + nota de la profe + botón Empezar),
   WeekView (días de la semana con ✓ completados).
4. components/layout/AppShell.tsx + BottomNav.tsx (nav del alumno).
5. pages/: TodayPage, WeekPage.

Commit "feat: vistas hoy y semana del alumno".
```

✅ **Verificar:** como alumno con rutina asignada, "/" muestra el día correcto según
la fecha de inicio, y "/semana" lista los días de la semana actual.

---

## P9 · Modo entrenamiento + registro por serie

```
El corazón de la app. Máxima atención a la UX (sección 7 de CLAUDE.md, SetRow).

1. api.ts: startSession, logSet, finishSession, getLastPerformance (para "última vez").
2. hooks/: useSetLogger (un INSERT por serie, con UUID de cliente para idempotencia),
   useWorkoutSession.
3. components/:
   - SetRow ⭐: peso | reps | check. Precargado con la última vez. Steppers ±2.5kg.
     Un solo responsabilidad: registrar UNA serie. Máx tipeo mínimo.
   - WorkoutSession: orquesta los ejercicios del día, superseries, navegación.
4. pages/WorkoutPage.tsx (/entrenar/:programDayId).

Guardá cada serie al tocar el check (no un submit final). Commit "feat: modo entrenamiento y registro por serie".
```

✅ **Verificar:** entrás a entrenar, registrás series, cada check persiste al toque,
ves "la última vez" al lado de cada serie.

---

## P10 · Timer, superseries y cierre de sesión

```
Completá la experiencia de entrenamiento.

1. components/: RestTimer (cuenta regresiva con rest_sec, salteable), manejo visual de
   superseries (agrupar A1/A2), SessionSummary (duración, kilaje, series + feedback
   emoji 1-5 + nota opcional para la profe).
2. hooks/: useRestTimer.
3. api.ts: guardar feeling y note en finishSession.

Commit "feat: timer de descanso, superseries y cierre con feedback".
```

✅ **Verificar:** al terminar series salta el timer, las superseries se ven agrupadas,
y al cerrar la sesión guarda el resumen + cómo se sintió.

---

## P11 · Cola offline mínima

```
Robustez para señal mala en el gimnasio (sección 7.4 de CLAUDE.md).

1. features/workout/offlineQueue.ts: si el INSERT de un set_log falla, guardarlo en
   IndexedDB y reintentar cuando vuelva la conexión.
2. Integrar en useSetLogger de forma transparente (el alumno no se entera).
3. Indicador visual sutil de "guardando…/guardado" por serie.

NO offline-first completo, solo la cola de set_logs. Commit "feat: cola offline para registro de series".
```

✅ **Verificar:** ponés el navegador en offline, registrás series, volvés online y
las series se sincronizan solas. **Hito de fase:** una alumna entrena de punta a punta.

---

# FASE 3 — VALOR VISIBLE

## P12 · Progreso del alumno

```
Feature progress (features/progress/).

1. api.ts: getMuscleVolume (usa la función SQL muscle_volume, con rango semana/mes/año),
   getPersonalRecords, getStreak.
2. hooks/: useMuscleVolume, useRecords, useStreak.
3. components/: VolumeByMuscle (barras con Recharts), PersonalRecords, StreakCard, KPIs.
4. pages/ProgressPage.tsx.

Commit "feat: progreso con kilaje por músculo, récords y racha".
```

✅ **Verificar:** en "/progreso" ves el kilaje por grupo muscular del período, tus PRs
y la racha, calculados sobre los set_logs reales.

---

## P13 · Panel: adherencia + ficha de alumno

```
Feature students (features/students/) — el valor para la profe.

1. api.ts: listStudents (con adherencia via v_adherence), getStudentDetail,
   setSubscription (toggle activa/inactiva).
2. hooks/: useStudents, useAdherence, useSubscription.
3. components/: StudentList, AdherenceLight (semáforo verde/amarillo/rojo),
   SubscriptionToggle, StudentDetail (anamnesis, programa, progreso, sesiones, nota
   privada de la profe).
4. components/layout/AdminShell.tsx (sidebar en desktop, bottom nav en móvil).
5. pages/admin/: DashboardPage (semáforo del grupo), StudentsPage, StudentDetailPage.

Commit "feat: panel de adherencia y ficha de alumno".
```

✅ **Verificar:** el dashboard muestra el semáforo, podés pausar/activar el acceso de
un alumno con el toggle, y la ficha muestra todo lo suyo en un lugar.

---

## P14 · Track de progreso corporal

```
Feature body-tracking (features/body-tracking/).

1. api.ts: addMeasurement, listMeasurements, uploadProgressPhoto (Supabase Storage,
   bucket privado con RLS), listPhotos.
2. hooks/: useBodyMetrics, useProgressPhotos.
3. components/: MeasurementsForm (peso, % graso, circunferencias, label INICIO/FINAL),
   MeasurementHistory, PhotoGrid (frente/atrás/laterales, inicio/final).
4. Integrar en ProfilePage (alumno) y StudentDetail (profe la ve).

Configurá el bucket de Storage privado con su policy. Commit "feat: track de progreso corporal con medidas y fotos".
```

✅ **Verificar:** cargás medidas y una foto de progreso, se guardan, y la profe las ve
en la ficha del alumno. Las fotos no son accesibles sin permiso (bucket privado).

---

## P15 · Pulido PWA + branding final

```
Cierre de la v1.

1. Completá el manifest PWA (nombre Frutos Lu, íconos, theme color rosa, display
   standalone) y el service worker (app shell offline).
2. Aplicá la identidad Frutos Lu en todas las pantallas: paleta, Poppins, detalles.
3. Pantalla de instalación / prompt "agregar a inicio".
4. Revisión de estados vacíos, loading y errores en toda la app.
5. Revisá que la arquitectura quedó respetada: ningún componente importa supabase
   directo, features autocontenidas, pages solo ensamblan.

Commit "feat: PWA instalable y branding Frutos Lu — v1 completa".
```

✅ **Verificar:** instalás la app en el teléfono (ícono en el home), abre a pantalla
completa, se ve con la marca Frutos Lu. **Hito final:** app lista para las alumnas.

---

# FASE 4 — AJUSTES UX (aprobados por la profe)

Estos pasos cierran gaps entre lo implementado en Fase 2 y las pantallas de diseño que
la profe ya vio y aprobó (Hoy, modo entrenamiento, cierre de sesión). No son features
nuevas: es terminar la UI sobre lógica que ya funciona.

## P16 · Vista Hoy — pills de días + lista de ejercicios

```
Ajustá TodayView (features/workout/) para que calce con el diseño aprobado por Luciana:

1. Agregá una fila de pills de días L-M-X-J-V arriba de la card "hoy toca", con ✓ en
   los días ya completados y resaltado en el día actual. Reusá los datos de
   getWeekView si ya alcanzan; si no, sumá lo que falte a features/workout/api.ts.
2. Reemplazá el contador "N ejercicios" por la lista real de ejercicios del día
   (nombre + sets_reps_text de cada uno), igual que se ve en /entrenar pero de solo
   lectura.
3. No toques la lógica de getTodayWorkout ni el botón Empezar/Repetir.

Commit "feat: pills de días y lista de ejercicios en vista Hoy".
```

✅ **Verificar:** en "/" se ven las pills de la semana con los días completados
marcados, y debajo la lista completa de ejercicios de hoy (no solo la cantidad).

---

## P17 · Modo entrenamiento — header y layout de series

```
Ajustá WorkoutSession / ExerciseStep / SetRow (features/workout/) para calcar el
diseño aprobado:

1. Header: "Día {title} · ejercicio {n} de {total}" en vez del contador plano actual.
2. Tabla de series con columnas #/ÚLTIMA VEZ/KG/REPS/✓ en vez de filas apiladas
   (mismo dato, otro layout — no cambies la lógica de useSetLogger).
3. "Siguiente ejercicio" como botón grande al pie de la pantalla, no como link en el
   header. En el último ejercicio el botón dice "Terminar".

No cambies la lógica de sesión, timer ni cola offline, solo el layout/copy.
Commit "feat: header y tabla de series en modo entrenamiento".
```

✅ **Verificar:** entrando a /entrenar/:id el header muestra el día, las series se ven
en tabla, y el botón de avance es el CTA principal abajo de la pantalla.

---

## P18 · Video embebido de YouTube

```
Los ejercicios deben poder mostrar su video SIN salir de la app.

1. src/lib/utils/youtube.ts: getYoutubeEmbedUrl(url) que acepta watch?v=, youtu.be/
   y URLs ya en /embed/, devuelve la URL de embed o null si no matchea.
2. src/components/ui/VideoEmbed.tsx: botón "Ver video explicativo" (thumbnail +
   play grande, paleta Frutos Lu) que al tocar carga el iframe embebido (no
   renderizar el iframe hasta que se toque, para no gastar carga de red gratis).
3. Reemplazá el iframe siempre visible de ExerciseStep.tsx por este componente.
4. Tests unitarios de getYoutubeEmbedUrl con los 3 formatos de URL.

Commit "feat: video embebido de YouTube en modo entrenamiento".
```

✅ **Verificar:** un ejercicio con video_url de YouTube (link normal, no /embed/)
muestra el botón "Ver video explicativo"; al tocarlo el video se reproduce adentro de
la app, sin abrir YouTube.

---

## P19 · Cierre de sesión — copy y celebración

```
Ajustá SessionSummary (features/workout/) para calcar el copy del diseño aprobado:

1. Título "¡Sesión terminada!" con emoji de celebración (sin librerías nuevas de
   confetti).
2. Botón final "Guardar sesión" (hoy dice "Terminar").
3. Label de la nota: "NOTA PARA LUCIANA" en vez del genérico actual.
4. No toques la lógica de finishSession ni el cálculo de stats.

Commit "feat: copy y celebración en cierre de sesión".
```

✅ **Verificar:** al terminar una sesión el texto calca el mockup: título, botón y
label de la nota.

---

## Reglas para todos los pasos

- **No avances sin verificar.** Un paso mal arrastra el error a todos los de arriba.
- **Un paso = un commit.** Siempre podés volver atrás.
- Si Claude Code propone salirse de la arquitectura de CLAUDE.md, frenalo y recordale
  la sección 6.
- Los cambios de alcance (features fuera de la v1) se anotan aparte, no se cuelan.
- Ante duda de negocio, preguntale a Luciana antes de que Claude Code decida por vos.

`>diego.bruno_` — guion de ejecución · Frutos Lu · v1