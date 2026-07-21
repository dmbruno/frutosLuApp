-- Seed inicial: ejercicios documentados en la sección 4.1 de CLAUDE.md + una
-- plantilla base "Embarazo Gym X3" para probar el flujo plantilla → asignación
-- → expansión de semanas de punta a punta.
--
-- NOTA: CLAUDE.md menciona ~60 ejercicios únicos en el Excel real de Luciana;
-- acá están los ~27 nombrados explícitamente en la sección 4.1 (el Excel
-- original no está en este repo). Sumá el resto desde /admin/ejercicios o
-- ampliando este archivo con sus nombres exactos.

-- ============ EJERCICIOS ============
insert into exercises (name, kind, default_block, primary_muscle, secondary_muscles, equipment) values
  ('CAT CAMEL', 'movilidad', 'movilidad', 'lumbares', '{}', 'BW'),
  ('ROTACIONES TORACICAS', 'movilidad', 'movilidad', 'espalda', '{}', 'BW'),
  ('RANITAS', 'movilidad', 'movilidad', 'gluteos', '{}', 'BW'),
  ('90/90 ROTACION DE CADERA', 'movilidad', 'movilidad', 'gluteos', '{}', 'BW'),
  ('ESCAPULACIONES', 'movilidad', 'movilidad', 'espalda', '{hombros}', 'BW'),
  ('FLEXION DE TOBILLO + ACTIVACION DE ISQUIOS', 'movilidad', 'movilidad', 'isquiotibiales', '{gemelos}', 'BW'),

  ('CONNECTION BREATH', 'fuerza', 'core', 'abdominales', '{}', 'BW'),
  ('DEAD BUG MARCH', 'fuerza', 'core', 'abdominales', '{}', 'BW'),
  ('BIRD DOG', 'fuerza', 'core', 'lumbares', '{abdominales}', 'BW'),
  ('REVERSE CRUNCH', 'fuerza', 'core', 'abdominales', '{}', 'BW'),
  ('PRESS PALLOF', 'fuerza', 'core', 'abdominales', '{}', 'banda'),
  ('SCRUM POSITION LATERAL WALK', 'fuerza', 'core', 'gluteos', '{abdominales}', 'banda'),
  ('PLANCHA LATERAL', 'fuerza', 'core', 'abdominales', '{}', 'BW'),

  ('SENTADILLA BACK CON BARRA', 'fuerza', 'estructura', 'cuadriceps', '{gluteos}', 'barra'),
  ('SENTADILLA SUMO CON BARRA', 'fuerza', 'estructura', 'cuadriceps', '{gluteos,isquiotibiales}', 'barra'),
  ('SENTADILLA GOBLET', 'fuerza', 'estructura', 'cuadriceps', '{gluteos}', 'mancuerna'),
  ('SENTADILLA BULGARA', 'fuerza', 'estructura', 'cuadriceps', '{gluteos}', 'mancuerna'),
  ('HIP THRUST', 'fuerza', 'estructura', 'gluteos', '{isquiotibiales}', 'barra'),
  ('ESTOCADAS ATRAS DDB', 'fuerza', 'estructura', 'cuadriceps', '{gluteos}', 'DDB'),
  ('PULL THROUGH EN POLEA', 'fuerza', 'estructura', 'gluteos', '{isquiotibiales}', 'polea'),
  ('PRESS PLANO DDB', 'fuerza', 'estructura', 'pecho', '{triceps}', 'DDB'),
  ('PRESS INCLINADO DDB', 'fuerza', 'estructura', 'pecho', '{hombros}', 'DDB'),
  ('CURL FEMORAL CON FITBALL', 'fuerza', 'estructura', 'isquiotibiales', '{}', 'fitball'),
  ('FACE PULLS', 'fuerza', 'estructura', 'espalda', '{hombros}', 'polea'),
  ('VUELO LATERAL', 'fuerza', 'estructura', 'hombros', '{}', 'mancuerna'),
  ('WALK OUT', 'fuerza', 'estructura', 'abdominales', '{hombros}', 'BW'),
  ('WALL BALLS', 'cardio', 'estructura', 'cuadriceps', '{hombros}', 'pelota medicinal')
on conflict (name) do nothing;

-- ============ PLANTILLA BASE: EMBARAZO GYM X3 ============
-- 2 semanas tipo (A=1, B=2) alternadas por 24 semanas reales. cycle_pattern
-- {1,2} se repite hasta total_weeks=24 al asignar (assign_template).
do $$
declare
  v_template_id uuid;
  v_day_id uuid;
begin
  insert into programs (user_id, name, notes, is_active, cycle_pattern, total_weeks)
  values (
    null, 'Embarazo Gym X3',
    'Valsalva evitado, activación de suelo pélvico en cada bloque, progresión libre según lactancia.',
    true, '{1,2}', 24
  )
  returning id into v_template_id;

  -- SEMANA TIPO 1 (A) — DIA 1
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 1, 'DIA 1', 1) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group)
  values
    (v_day_id, (select id from exercises where name = 'CAT CAMEL'), 'movilidad', 'A1', 1, '10 TOTAL', 'A'),
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', 'A2', 2, '10 TOTAL', 'A'),
    (v_day_id, (select id from exercises where name = 'DEAD BUG MARCH'), 'core', 'B1', 3, '3X10', 'B'),
    (v_day_id, (select id from exercises where name = 'BIRD DOG'), 'core', 'B2', 4, '3X10', 'B'),
    (v_day_id, (select id from exercises where name = 'SENTADILLA GOBLET'), 'estructura', 'C1', 5, '3X10', 'C'),
    (v_day_id, (select id from exercises where name = 'HIP THRUST'), 'estructura', 'C2', 6, '3X12', 'C');

  -- SEMANA TIPO 1 (A) — DIA 2
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 1, 'DIA 2', 2) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, coach_note)
  values
    (v_day_id, (select id from exercises where name = '90/90 ROTACION DE CADERA'), 'movilidad', 'A1', 1, '1'' POR LADO', null),
    (v_day_id, (select id from exercises where name = 'PLANCHA LATERAL'), 'core', 'B1', 2, '3X20'''' POR LADO', 'rodillas flexionadas o sin, a elección'),
    (v_day_id, (select id from exercises where name = 'ESTOCADAS ATRAS DDB'), 'estructura', 'C1', 3, '3X8/8', null),
    (v_day_id, (select id from exercises where name = 'PULL THROUGH EN POLEA'), 'estructura', 'C2', 4, '3X12', null);

  -- SEMANA TIPO 1 (A) — DIA 3
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 1, 'DIA 3', 3) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text)
  values
    (v_day_id, (select id from exercises where name = 'ESCAPULACIONES'), 'movilidad', 'A1', 1, '10 TOTAL'),
    (v_day_id, (select id from exercises where name = 'REVERSE CRUNCH'), 'core', 'B1', 2, '3X12'),
    (v_day_id, (select id from exercises where name = 'SENTADILLA SUMO CON BARRA'), 'estructura', 'C1', 3, '3X10'),
    (v_day_id, (select id from exercises where name = 'PRESS PLANO DDB'), 'estructura', 'C2', 4, '3X10');

  -- SEMANA TIPO 2 (B) — DIA 1
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 2, 'DIA 1', 1) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group)
  values
    (v_day_id, (select id from exercises where name = 'CAT CAMEL'), 'movilidad', 'A1', 1, '10 TOTAL', 'A'),
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', 'A2', 2, '10 TOTAL', 'A'),
    (v_day_id, (select id from exercises where name = 'DEAD BUG MARCH'), 'core', 'B1', 3, '3X12', 'B'),
    (v_day_id, (select id from exercises where name = 'BIRD DOG'), 'core', 'B2', 4, '3X12', 'B'),
    (v_day_id, (select id from exercises where name = 'SENTADILLA GOBLET'), 'estructura', 'C1', 5, '3X12', 'C'),
    (v_day_id, (select id from exercises where name = 'HIP THRUST'), 'estructura', 'C2', 6, '3X15', 'C');

  -- SEMANA TIPO 2 (B) — DIA 2
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 2, 'DIA 2', 2) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, coach_note)
  values
    (v_day_id, (select id from exercises where name = '90/90 ROTACION DE CADERA'), 'movilidad', 'A1', 1, '1'' POR LADO', null),
    (v_day_id, (select id from exercises where name = 'PLANCHA LATERAL'), 'core', 'B1', 2, '3X25'''' POR LADO', 'libre o en guía'),
    (v_day_id, (select id from exercises where name = 'ESTOCADAS ATRAS DDB'), 'estructura', 'C1', 3, '3X10/10', null),
    (v_day_id, (select id from exercises where name = 'PULL THROUGH EN POLEA'), 'estructura', 'C2', 4, '3X15', null);

  -- SEMANA TIPO 2 (B) — DIA 3
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 2, 'DIA 3', 3) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text)
  values
    (v_day_id, (select id from exercises where name = 'ESCAPULACIONES'), 'movilidad', 'A1', 1, '10 TOTAL'),
    (v_day_id, (select id from exercises where name = 'REVERSE CRUNCH'), 'core', 'B1', 2, '3X15'),
    (v_day_id, (select id from exercises where name = 'SENTADILLA SUMO CON BARRA'), 'estructura', 'C1', 3, '3X12'),
    (v_day_id, (select id from exercises where name = 'PRESS PLANO DDB'), 'estructura', 'C2', 4, '3X12');
end $$;
