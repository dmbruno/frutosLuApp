# Anamnesis v2 — pendiente, no implementar todavía

> Origen: Luciana estuvo iterando la idea del onboarding/anamnesis con ChatGPT
> (ver resumen completo abajo). Esto es la versión **acotada** de esa charla —
> lo que vale la pena construir sin volarnos el alcance de v1. El resto de las
> ideas de esa conversación (nutrición, motor de reglas automáticas, pagos,
> mensajería, sistema de puntaje/niveles con marca registrada) queda explícitamente
> **fuera de esto**, documentado al final para no perderlo pero sin comprometernos
> a construirlo ahora.

## Por qué

El onboarding actual (`features/onboarding/`) pregunta el nivel de forma
autopercibida: un solo `<select>` con `inicial / intermedio / avanzado`
(`experience_level`). Es justo el error que señala la charla con ChatGPT: la
gente se autoevalúa mal (alguien con 1 año cree que es avanzado; alguien que
compitió 8 años y volvió hace poco dice que es intermedio). Conviene que el
dato salga de un par de preguntas concretas, no de una etiqueta.

## Alcance propuesto (v2)

### 1. Reemplazar el dropdown de nivel por preguntas de experiencia real

En vez de `experience_level` como select libre, agregar al wizard (Step
"Perfil deportivo" o uno nuevo):

- ¿Cuántos años llevás entrenando **de manera constante**? (nunca / <6 meses /
  6-12 meses / 1-2 años / 2-5 años / +5 años)
- En los últimos 12 meses, ¿cuántas veces por semana entrenaste **en
  promedio**? (nada / 1 / 2 / 3 / 4 / 5+)

Con esas dos respuestas se puede derivar `experience_level` automáticamente
(regla simple, no hace falta scoring ponderado tipo el de la charla) en vez de
pedírselo directo al alumno. El campo `experience_level` en `profiles` se
mantiene igual — solo cambia cómo se completa.

### 2. Preguntas de dolor/lesión, condicionales (reemplaza el campo libre)

Hoy `injuries_notes` es un textarea libre. Sumar antes de ese campo:

- ¿Tenés dolor o alguna lesión actualmente? (Sí/No)
- Si Sí: ¿dónde? (texto o selector simple de zona) · ¿del 1 al 10 cuánto
  duele? · ¿está tratado/en rehabilitación?
- El textarea libre queda como "algo más que quieras contarle a tu profe"

No hace falta el árbol clínico completo de la charla (cirugías, tabla de
medicación, alergias, hábitos, salud digestiva) — eso es nivel ficha médica de
consultorio, no onboarding de gimnasio.

### 3. Salud femenina, condicional (solo si aplica)

Si `athlete_profile = 'postparto'` o si el alumno indica que está embarazada:
sección adicional con:

- Semana de embarazo / fecha de parto (si ya nació)
- Tipo de parto (cesárea / vaginal), si corresponde
- Autorización médica para entrenar (Sí/No)
- Lactancia (exclusiva / mixta / no)

No completo (no incluye ciclo menstrual, diástasis, suelo pélvico como
formulario estructurado en v2 — Luciana ya lo cubre a mano hoy vía
`injuries_notes`/notas; se puede sumar en una v3 si realmente lo pide).

### 4. Semáforo de salud a nivel alumno (opcional, depende de 1-3)

Extender el semáforo de adherencia (`v_adherence`, ya existe) con un segundo
indicador de salud (🟢/🟡/🔴) derivado de las respuestas de dolor/embarazo del
punto 2 y 3, visible en el panel admin. Solo tiene sentido una vez que existan
esas preguntas — no es un cambio aislado.

## Fuera de alcance (anotado, no se construye ahora)

Explícitamente descartado para v1/v2 — o porque ya estaba fuera de alcance en
`claude.md` sección 10, o porque es demasiado grande para el tamaño actual del
proyecto (~50 alumnos, un solo dev):

- Calculadora de nutrición/macros (calorías, proteínas, agua, etc.)
- Motor de reglas automáticas (sugerir deload, bajar volumen por poco sueño,
  alertas por % de peso perdido en la semana, desbloqueo de mesociclos)
- Historia clínica completa (PAR-Q+, cirugías, medicación, alergias, hábitos,
  salud digestiva como formularios estructurados)
- Sistema de puntaje ponderado + 5 niveles con nombre propio ("Método LF
  Performance™") — la clasificación por reglas simples del punto 1 alcanza
- Pagos/facturación automática (ya es v2 en el spec, Mercado Pago)
- Mensajería/chat interno (se usa WhatsApp, decisión ya tomada)
- Logros/gamificación

## Resumen de la charla original con ChatGPT (contexto completo)

Luciana habló con ChatGPT sobre rediseñar el onboarding y terminó en una
visión mucho más grande: anamnesis con clasificación automática por
puntaje (experiencia 20pts + técnica 25pts + fuerza relativa 20pts +
consistencia 15pts + movilidad 10pts + lesiones 10pts = nivel 1-5), un
screening clínico completo (PAR-Q+, antecedentes médicos, cirugías, lesiones
en árbol de decisión, dolor con mapa corporal y escala EVA, medicación,
alergias, hábitos, salud digestiva, salud femenina completa con ciclo/
embarazo/postparto/diástasis/suelo pélvico), semáforo de alertas automáticas,
ficha clínica auto-generada, más un módulo de nutrición inteligente, y una
visión de producto en 4 pilares (experiencia cliente / panel entrenador /
motor inteligente de reglas / administración) con metodología propia
registrada. Propuso reescribir todo desde cero con un PRD ("Product
Requirements Document") antes de seguir programando.

Se descartó reescribir desde cero (ya hay esquema en producción y un alumno
de prueba corriendo el flujo real) y se acotó la charla a los puntos 1-4 de
arriba, que son los que aportan valor real sin disparar el alcance.
