-- Seed real: exportado de las 3 pestañas del Excel de Luciana
-- (EMBARAZO GYM X3 - 1/2/3er TRIMESTRE, ver docs/*.csv). Reemplaza el
-- seed parcial anterior: ahora son los 60 ejercicios reales y la
-- plantilla completa de 36 semanas (12 semanas tipo x 3 trimestres,
-- 3 días cada una), fiel al texto original de sets_reps_text.

-- ============ EJERCICIOS (60, nombres exactos del Excel) ============
insert into exercises (name, kind, default_block, primary_muscle, secondary_muscles, equipment, needs_filming) values
  ('90/90 ROTACION CADERA', 'movilidad', 'movilidad', 'gluteos', '{}', 'BW', false),
  ('ABDUCCION INCLINADA EN MAQUINA', 'fuerza', 'estructura', 'gluteos', '{}', 'maquina', false),
  ('ABDUCCIONES CON BANDA', 'fuerza', 'estructura', 'gluteos', '{}', 'banda', false),
  ('ADELANTE/ATRÁS CON BANDA', 'movilidad', 'movilidad', 'hombros', '{}', 'banda', false),
  ('AIR SQUAT', 'fuerza', 'estructura', 'cuadriceps', '{gluteos}', 'BW', false),
  ('BIRD DOG', 'fuerza', 'core', 'lumbares', '{abdominales}', 'BW', false),
  ('CAMINATA LATERAL CON BANDA + SENTADILLA', 'fuerza', 'estructura', 'gluteos', '{cuadriceps}', 'banda', false),
  ('CAT CAMEL', 'movilidad', 'movilidad', 'lumbares', '{}', 'BW', false),
  ('CONNECTION BREATH', 'fuerza', 'core', 'abdominales', '{}', 'BW', true),
  ('CURL DE BICEP DDB', 'fuerza', 'estructura', 'biceps', '{}', 'DDB', false),
  ('CURL DE FEMORAL CON FITBALL', 'fuerza', 'estructura', 'isquiotibiales', '{}', 'fitball', false),
  ('CURL DE FEMORAL PAUSA CONTRACCIÓN 2''''', 'fuerza', 'estructura', 'isquiotibiales', '{}', 'fitball', false),
  ('DEAD BUG CON BANDA', 'fuerza', 'core', 'abdominales', '{}', 'banda', false),
  ('DEAD BUG MARCH', 'fuerza', 'core', 'abdominales', '{}', 'BW', false),
  ('ESCAPULACIONES', 'movilidad', 'movilidad', 'espalda', '{hombros}', 'BW', false),
  ('ESTOCADAS ATRÁS DDB', 'fuerza', 'estructura', 'cuadriceps', '{gluteos}', 'DDB', false),
  ('EXTENSION TRICEPS CON BANDA', 'fuerza', 'estructura', 'triceps', '{}', 'banda', false),
  ('FACE PULLS CON BANDA', 'fuerza', 'estructura', 'espalda', '{hombros}', 'banda', false),
  ('FLEXION DE TOBILLO + ACTIVACION DE ISQUIOS', 'movilidad', 'movilidad', 'isquiotibiales', '{gemelos}', 'BW', false),
  ('FLEXIONES PLANO INCLINADO', 'fuerza', 'estructura', 'pecho', '{triceps}', 'BW', false),
  ('FONDOS TRICEPS EN BANCO', 'fuerza', 'estructura', 'triceps', '{}', 'BW', false),
  ('GOBLET CURTSY LUNGES', 'fuerza', 'estructura', 'cuadriceps', '{gluteos}', 'mancuerna', false),
  ('HIP THRUST', 'fuerza', 'estructura', 'gluteos', '{isquiotibiales}', 'BW', false),
  ('HIP THRUST CON BANDA', 'fuerza', 'estructura', 'gluteos', '{isquiotibiales}', 'banda', false),
  ('HIP THRUST CON BARRA', 'fuerza', 'estructura', 'gluteos', '{isquiotibiales}', 'barra', false),
  ('PATADA DE GLUTEO CRUZADA EN POLEA', 'fuerza', 'estructura', 'gluteos', '{}', 'polea', false),
  ('PATADA DE GLUTEO EN POLEA', 'fuerza', 'estructura', 'gluteos', '{}', 'polea', false),
  ('PESO MUERTO B-STANCE', 'fuerza', 'estructura', 'isquiotibiales', '{gluteos}', 'mancuerna', false),
  ('PISTOL A CAJON + PRESS', 'fuerza', 'estructura', 'cuadriceps', '{hombros}', 'mancuerna', false),
  ('PLANCHA LATERAL', 'fuerza', 'core', 'abdominales', '{}', 'BW', true),
  ('PRESS DE HOMBRO CON DOBLE KB SENTADA', 'fuerza', 'estructura', 'hombros', '{}', 'DKB', false),
  ('PRESS DE HOMBROS CON KETTLEBELL', 'fuerza', 'estructura', 'hombros', '{}', 'kettlebell', false),
  ('PRESS INCLINADO DDB', 'fuerza', 'estructura', 'pecho', '{hombros}', 'DDB', true),
  ('PRESS PALLOF CON BANDA', 'fuerza', 'core', 'abdominales', '{}', 'banda', false),
  ('PRESS PLANO DDB', 'fuerza', 'estructura', 'pecho', '{triceps}', 'DDB', false),
  ('PULL THROUGH EN POLEA', 'fuerza', 'estructura', 'gluteos', '{isquiotibiales}', 'polea', true),
  ('PULL-DOWN A 1 MANO EN POLEA', 'fuerza', 'estructura', 'espalda', '{}', 'polea', false),
  ('PULL-DOWN AGARRE ANCHO', 'fuerza', 'estructura', 'espalda', '{}', 'polea', false),
  ('RANITAS', 'movilidad', 'movilidad', 'gluteos', '{}', 'BW', false),
  ('REMO AL MENTON CON BARRA', 'fuerza', 'estructura', 'hombros', '{espalda}', 'barra', false),
  ('REMO GIRONDA AGARRE NEUTRO', 'fuerza', 'estructura', 'espalda', '{biceps}', 'polea', true),
  ('REVERSE CRUNCH', 'fuerza', 'core', 'abdominales', '{}', 'BW', false),
  ('ROTACION DE HOMBRO', 'movilidad', 'movilidad', 'hombros', '{}', 'BW', false),
  ('ROTACION TORACICA', 'movilidad', 'movilidad', 'espalda', '{}', 'BW', false),
  ('ROTACIONES DE CADERA', 'movilidad', 'movilidad', 'gluteos', '{}', 'BW', false),
  ('ROTACIONES TORACICAS', 'movilidad', 'movilidad', 'espalda', '{}', 'BW', false),
  ('SCRUM POSITION LATERAL WALK', 'fuerza', 'core', 'gluteos', '{abdominales}', 'banda', false),
  ('SENTADILLA + HALO', 'fuerza', 'estructura', 'cuadriceps', '{hombros}', 'mancuerna', false),
  ('SENTADILLA A CAJON + PRESS DDB', 'fuerza', 'estructura', 'cuadriceps', '{hombros}', 'DDB', false),
  ('SENTADILLA BACK', 'fuerza', 'estructura', 'cuadriceps', '{gluteos}', 'barra', false),
  ('SENTADILLA BULGARA UNILATERAL', 'fuerza', 'estructura', 'cuadriceps', '{gluteos}', 'mancuerna', false),
  ('SENTADILLA GOBLET A CAJÓN', 'fuerza', 'estructura', 'cuadriceps', '{gluteos}', 'mancuerna', false),
  ('SENTADILLA SPLIT EN GUIA', 'fuerza', 'estructura', 'cuadriceps', '{gluteos}', 'maquina guiada', true),
  ('SENTADILLA SUMO CON BARRA', 'fuerza', 'estructura', 'cuadriceps', '{gluteos,isquiotibiales}', 'barra', false),
  ('SENTADILLA SUMO CON DB', 'fuerza', 'estructura', 'cuadriceps', '{gluteos}', 'mancuerna', false),
  ('SUELO PELVICO + ACTIVACION DE ADUCTORES', 'fuerza', 'core', 'abdominales', '{}', 'BW', false),
  ('TRICEPS CON BANDA', 'fuerza', 'estructura', 'triceps', '{}', 'banda', false),
  ('VUELO LATERAL', 'fuerza', 'estructura', 'hombros', '{}', 'mancuerna', false),
  ('WALK OUT', 'fuerza', 'estructura', 'abdominales', '{hombros}', 'BW', false),
  ('WALL BALLS', 'fuerza', 'estructura', 'cuadriceps', '{hombros}', 'pelota medicinal', false)
on conflict (name) do nothing;

-- ============ PLANTILLA: EMBARAZO GYM X3 (36 semanas, 12 tipo) ============
do $$
declare
  v_template_id uuid;
  v_day_id uuid;
begin
  insert into programs (user_id, name, notes, is_active, cycle_pattern, total_weeks)
  values (
    null, 'Embarazo Gym X3',
    'Evitar Valsalva; activación de suelo pélvico en cada bloque. Progresión por trimestre: 1er trimestre (semanas 1-12), 2do trimestre (semanas 13-24, series 2-3 x reps segun tolerancia), 3er trimestre (semanas 25-36, prioridad a movilidad y ejercicios en guía/banco). Ajustar siempre según indicación médica.',
    true, '{1,2,3,4,1,2,3,4,1,2,3,4,5,6,7,8,5,6,7,8,5,6,7,8,9,10,11,12,9,10,11,12,9,10,11,12}', 36
  )
  returning id into v_template_id;

  -- SEMANA TIPO 1 (T1A: SEMANA 1-5-9)
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 1, 'DIA 1', 1) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'CAT CAMEL'), 'movilidad', '1', 1, '3X10', null, null),
    (v_day_id, (select id from exercises where name = 'FLEXION DE TOBILLO + ACTIVACION DE ISQUIOS'), 'movilidad', '2', 2, '3X1'' POR LADO', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION TORACICA'), 'movilidad', '3', 3, '3X3 POR LADO', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, '3X20', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, '3X5', null, null),
    (v_day_id, (select id from exercises where name = 'DEAD BUG CON BANDA'), 'core', '2', 6, '3X12 TOTAL', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA BACK'), 'estructura', 'A1', 7, '3X10-12', 'A', 'libre o en guía'),
    (v_day_id, (select id from exercises where name = 'FACE PULLS CON BANDA'), 'estructura', 'A2', 8, '3X15', 'A', null),
    (v_day_id, (select id from exercises where name = 'HIP THRUST'), 'estructura', 'B1', 9, '3X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'WALK OUT'), 'estructura', 'B2', 10, '3X6 A 8', 'B', null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA + HALO'), 'estructura', 'C1', 11, '3X5', 'C', null),
    (v_day_id, (select id from exercises where name = 'REMO GIRONDA AGARRE NEUTRO'), 'estructura', 'C2', 12, '3X12', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 1, 'DIA 2', 2) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, '3X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, '3X20', null, null),
    (v_day_id, (select id from exercises where name = 'BIRD DOG'), 'core', '1', 5, '3X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '2', 6, '3X8', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA BULGARA UNILATERAL'), 'estructura', 'A1', 7, '3X8/8', 'A', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'A2', 8, '3X10', 'A', null),
    (v_day_id, (select id from exercises where name = 'PULL THROUGH EN POLEA'), 'estructura', 'B1', 9, '3X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'PULL-DOWN AGARRE ANCHO'), 'estructura', 'B2', 10, '3X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS DE HOMBROS CON KETTLEBELL'), 'estructura', 'C1', 11, '3X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'ABDUCCIONES CON BANDA'), 'estructura', 'C2', 12, '3X25', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 1, 'DIA 3', 3) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = '90/90 ROTACION CADERA'), 'movilidad', '1', 1, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '2', 2, '3X20', null, null),
    (v_day_id, (select id from exercises where name = 'ESCAPULACIONES'), 'movilidad', '3', 3, '3X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACIONES DE CADERA'), 'movilidad', '4', 4, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, '3X8', null, null),
    (v_day_id, (select id from exercises where name = 'SCRUM POSITION LATERAL WALK'), 'core', '2', 6, '3X8/8', null, null),
    (v_day_id, (select id from exercises where name = 'PATADA DE GLUTEO EN POLEA'), 'estructura', 'A1', 7, '3X12/12', 'A', null),
    (v_day_id, (select id from exercises where name = 'VUELO LATERAL'), 'estructura', 'A2', 8, '3X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'ESTOCADAS ATRÁS DDB'), 'estructura', 'B1', 9, '3X6X/6', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS PLANO DDB'), 'estructura', 'B2', 10, '3X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'CURL DE FEMORAL CON FITBALL'), 'estructura', 'C1', 11, '3X8', 'C', null),
    (v_day_id, (select id from exercises where name = 'FONDOS TRICEPS EN BANCO'), 'estructura', 'C2', 12, '3X10', 'C', 'RODILLAS FLEXIONADAS/SIN');

  -- SEMANA TIPO 2 (T1B: SEMANA 2-6-10)
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 2, 'DIA 1', 1) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, '3X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, '3X20', null, null),
    (v_day_id, (select id from exercises where name = 'REVERSE CRUNCH'), 'core', '1', 5, '3X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 6, '3X5', null, null),
    (v_day_id, (select id from exercises where name = 'PISTOL A CAJON + PRESS'), 'estructura', 'A1', 7, '3X4 POR LADO', 'A', null),
    (v_day_id, (select id from exercises where name = 'CAMINATA LATERAL CON BANDA + SENTADILLA'), 'estructura', 'A2', 8, '3X8 PASOS + 8 SENT', 'A', null),
    (v_day_id, (select id from exercises where name = 'PRESS DE HOMBRO CON DOBLE KB SENTADA'), 'estructura', 'B1', 9, '3X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'GOBLET CURTSY LUNGES'), 'estructura', 'B2', 10, '3X8/8', 'B', null),
    (v_day_id, (select id from exercises where name = 'EXTENSION TRICEPS CON BANDA'), 'estructura', 'C1', 11, '3X15', 'C', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'C2', 12, '3X10', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 2, 'DIA 2', 2) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = '90/90 ROTACION CADERA'), 'movilidad', '1', 1, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '2', 2, '3X20', null, null),
    (v_day_id, (select id from exercises where name = 'ESCAPULACIONES'), 'movilidad', '3', 3, '3X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACIONES DE CADERA'), 'movilidad', '4', 4, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, '3X8', null, null),
    (v_day_id, (select id from exercises where name = 'SCRUM POSITION LATERAL WALK'), 'core', '2', 6, '3X8/8', null, null),
    (v_day_id, (select id from exercises where name = 'PATADA DE GLUTEO EN POLEA'), 'estructura', 'A1', 7, '3X12/12', 'A', null),
    (v_day_id, (select id from exercises where name = 'VUELO LATERAL'), 'estructura', 'A2', 8, '3X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'ESTOCADAS ATRÁS DDB'), 'estructura', 'B1', 9, '3X6X/6', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS PLANO DDB'), 'estructura', 'B2', 10, '3X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'CURL DE FEMORAL CON FITBALL'), 'estructura', 'C1', 11, '3X8', 'C', null),
    (v_day_id, (select id from exercises where name = 'FONDOS TRICEPS EN BANCO'), 'estructura', 'C2', 12, '3X10', 'C', 'RODILLAS FLEXIONADAS/SIN');

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 2, 'DIA 3', 3) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'CAT CAMEL'), 'movilidad', '1', 1, '10 TOTAL', null, null),
    (v_day_id, (select id from exercises where name = 'FLEXION DE TOBILLO + ACTIVACION DE ISQUIOS'), 'movilidad', '2', 2, '1'' X LADO', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION TORACICA'), 'movilidad', '3', 3, '3 X LADO', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, '3X20', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, '3X5', null, null),
    (v_day_id, (select id from exercises where name = 'DEAD BUG MARCH'), 'core', '2', 6, '3X12', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA SUMO CON BARRA'), 'estructura', 'A1', 7, '3X8', 'A', null),
    (v_day_id, (select id from exercises where name = 'FACE PULLS CON BANDA'), 'estructura', 'A2', 8, '3X15', 'A', null),
    (v_day_id, (select id from exercises where name = 'HIP THRUST'), 'estructura', 'B1', 9, '3X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'WALK OUT'), 'estructura', 'B2', 10, '3X6 A 8', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS INCLINADO DDB'), 'estructura', 'C1', 11, '3X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'PESO MUERTO B-STANCE'), 'estructura', 'C2', 12, '3X8/8', 'C', null);

  -- SEMANA TIPO 3 (T1C: SEMANA 3-7-11)
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 3, 'DIA 1', 1) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'CAT CAMEL'), 'movilidad', '1', 1, '10 TOTAL', null, null),
    (v_day_id, (select id from exercises where name = 'FLEXION DE TOBILLO + ACTIVACION DE ISQUIOS'), 'movilidad', '2', 2, '1'' X LADO', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION TORACICA'), 'movilidad', '3', 3, '3 X LADO', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, '3X20', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, '3X5', null, null),
    (v_day_id, (select id from exercises where name = 'DEAD BUG MARCH'), 'core', '2', 6, '3X12', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA SUMO CON BARRA'), 'estructura', 'A1', 7, '3X8', 'A', null),
    (v_day_id, (select id from exercises where name = 'FACE PULLS CON BANDA'), 'estructura', 'A2', 8, '3X15', 'A', null),
    (v_day_id, (select id from exercises where name = 'HIP THRUST'), 'estructura', 'B1', 9, '3X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'WALK OUT'), 'estructura', 'B2', 10, '3X6 A 8', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS INCLINADO DDB'), 'estructura', 'C1', 11, '3X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'PESO MUERTO B-STANCE'), 'estructura', 'C2', 12, '3X8/8', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 3, 'DIA 2', 2) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, '3X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, '3X20', null, null),
    (v_day_id, (select id from exercises where name = 'REVERSE CRUNCH'), 'core', '1', 5, '3X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 6, '3X5', null, null),
    (v_day_id, (select id from exercises where name = 'PISTOL A CAJON + PRESS'), 'estructura', 'A1', 7, '3X4 POR LADO', 'A', null),
    (v_day_id, (select id from exercises where name = 'CAMINATA LATERAL CON BANDA + SENTADILLA'), 'estructura', 'A2', 8, '3X8 PASOS + 8 SENT', 'A', null),
    (v_day_id, (select id from exercises where name = 'PRESS DE HOMBRO CON DOBLE KB SENTADA'), 'estructura', 'B1', 9, '3X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'GOBLET CURTSY LUNGES'), 'estructura', 'B2', 10, '3X8/8', 'B', null),
    (v_day_id, (select id from exercises where name = 'EXTENSION TRICEPS CON BANDA'), 'estructura', 'C1', 11, '3X15', 'C', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'C2', 12, '3X10', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 3, 'DIA 3', 3) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, '3X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, '3X20', null, null),
    (v_day_id, (select id from exercises where name = 'BIRD DOG'), 'core', '1', 5, '3X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '2', 6, '3X5', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA BULGARA UNILATERAL'), 'estructura', 'A1', 7, '3X8/8', 'A', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'A2', 8, '3X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'PULL THROUGH EN POLEA'), 'estructura', 'B1', 9, '3X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'PULL-DOWN AGARRE ANCHO'), 'estructura', 'B2', 10, '3X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS DE HOMBROS CON KETTLEBELL'), 'estructura', 'C1', 11, '3X10', 'C', null),
    (v_day_id, (select id from exercises where name = 'ABDUCCIONES CON BANDA'), 'estructura', 'C2', 12, '3X20', 'C', null);

  -- SEMANA TIPO 4 (T1D: SEMANA 4-8-12)
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 4, 'DIA 1', 1) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'CAT CAMEL'), 'movilidad', '1', 1, '10 TOTAL', null, null),
    (v_day_id, (select id from exercises where name = 'FLEXION DE TOBILLO + ACTIVACION DE ISQUIOS'), 'movilidad', '2', 2, '1'' X LADO', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION TORACICA'), 'movilidad', '3', 3, '3 X LADO', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, '3X20', null, null),
    (v_day_id, (select id from exercises where name = 'SUELO PELVICO + ACTIVACION DE ADUCTORES'), 'core', '1', 5, '3X8', null, null),
    (v_day_id, (select id from exercises where name = 'PRESS PALLOF CON BANDA'), 'core', '2', 6, '3X10', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA GOBLET A CAJÓN'), 'estructura', 'A1', 7, '2X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'VUELO LATERAL'), 'estructura', 'A2', 8, '3X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'ESTOCADAS ATRÁS DDB'), 'estructura', 'B1', 9, '3X6X/6', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS PLANO DDB'), 'estructura', 'B2', 10, '3X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'CURL DE FEMORAL CON FITBALL'), 'estructura', 'C1', 11, '3X8', 'C', null),
    (v_day_id, (select id from exercises where name = 'FONDOS TRICEPS EN BANCO'), 'estructura', 'C2', 12, '3X10', 'C', 'RODILLAS FLEXIONADAS/SIN');

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 4, 'DIA 2', 2) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, '3X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, '3X20', null, null),
    (v_day_id, (select id from exercises where name = 'REVERSE CRUNCH'), 'core', '1', 5, '3X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 6, '3X5', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA SUMO CON DB'), 'estructura', 'A1', 7, '3X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'REMO GIRONDA AGARRE NEUTRO'), 'estructura', 'A2', 8, '3X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'ABDUCCION INCLINADA EN MAQUINA'), 'estructura', 'B1', 9, '3X20', 'B', null),
    (v_day_id, (select id from exercises where name = 'PULL-DOWN A 1 MANO EN POLEA'), 'estructura', 'B2', 10, '3X8/8', 'B', null),
    (v_day_id, (select id from exercises where name = 'HIP THRUST CON BARRA'), 'estructura', 'C1', 11, '3X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'C2', 12, '3X12', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 4, 'DIA 3', 3) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = '90/90 ROTACION CADERA'), 'movilidad', '1', 1, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '2', 2, '3X20', null, null),
    (v_day_id, (select id from exercises where name = 'ESCAPULACIONES'), 'movilidad', '3', 3, '3X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACIONES DE CADERA'), 'movilidad', '4', 4, '3X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, '3X8', null, null),
    (v_day_id, (select id from exercises where name = 'SCRUM POSITION LATERAL WALK'), 'core', '2', 6, '3X8/8', null, null),
    (v_day_id, (select id from exercises where name = 'PATADA DE GLUTEO CRUZADA EN POLEA'), 'estructura', 'A1', 7, '3X12/12', 'A', null),
    (v_day_id, (select id from exercises where name = 'CURL DE FEMORAL PAUSA CONTRACCIÓN 2'''''), 'estructura', 'A2', 8, '3X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'WALL BALLS'), 'estructura', 'B1', 9, '3X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'GOBLET CURTSY LUNGES'), 'estructura', 'B2', 10, '3X8/8', 'B', null),
    (v_day_id, (select id from exercises where name = 'REMO AL MENTON CON BARRA'), 'estructura', 'C1', 11, '3X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'TRICEPS CON BANDA'), 'estructura', 'C2', 12, '3X15', 'C', null);

  -- SEMANA TIPO 5 (T2A: SEMANA 13-17-21)
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 5, 'DIA 1', 1) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'CAT CAMEL'), 'movilidad', '1', 1, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'FLEXION DE TOBILLO + ACTIVACION DE ISQUIOS'), 'movilidad', '2', 2, 'X1'' POR LADO', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION TORACICA'), 'movilidad', '3', 3, 'X3 POR LADO', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, 'X5', null, null),
    (v_day_id, (select id from exercises where name = 'PLANCHA LATERAL'), 'core', '2', 6, 'X10'''' POR LADO', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA BACK'), 'estructura', 'A1', 7, 'X10-12', 'A', 'libre o en guía'),
    (v_day_id, (select id from exercises where name = 'FACE PULLS CON BANDA'), 'estructura', 'A2', 8, 'X15', 'A', null),
    (v_day_id, (select id from exercises where name = 'HIP THRUST CON BANDA'), 'estructura', 'B1', 9, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'WALK OUT'), 'estructura', 'B2', 10, 'X6 A 8', 'B', null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA + HALO'), 'estructura', 'C1', 11, 'X5', 'C', null),
    (v_day_id, (select id from exercises where name = 'REMO GIRONDA AGARRE NEUTRO'), 'estructura', 'C2', 12, 'X12', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 5, 'DIA 2', 2) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'BIRD DOG'), 'core', '1', 5, 'X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '2', 6, 'X8', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA SPLIT EN GUIA'), 'estructura', 'A1', 7, 'X8/8', 'A', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'A2', 8, 'X10', 'A', null),
    (v_day_id, (select id from exercises where name = 'PULL THROUGH EN POLEA'), 'estructura', 'B1', 9, 'X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'PULL-DOWN AGARRE ANCHO'), 'estructura', 'B2', 10, 'X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS DE HOMBROS CON KETTLEBELL'), 'estructura', 'C1', 11, 'X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'ABDUCCIONES CON BANDA'), 'estructura', 'C2', 12, 'X25', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 5, 'DIA 3', 3) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = '90/90 ROTACION CADERA'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '2', 2, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'ESCAPULACIONES'), 'movilidad', '3', 3, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACIONES DE CADERA'), 'movilidad', '4', 4, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, 'X8', null, null),
    (v_day_id, (select id from exercises where name = 'SCRUM POSITION LATERAL WALK'), 'core', '2', 6, 'X8/8', null, null),
    (v_day_id, (select id from exercises where name = 'PATADA DE GLUTEO EN POLEA'), 'estructura', 'A1', 7, 'X12/12', 'A', null),
    (v_day_id, (select id from exercises where name = 'VUELO LATERAL'), 'estructura', 'A2', 8, 'X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'ESTOCADAS ATRÁS DDB'), 'estructura', 'B1', 9, 'X6X/6', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS INCLINADO DDB'), 'estructura', 'B2', 10, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'CURL DE FEMORAL CON FITBALL'), 'estructura', 'C1', 11, 'X8', 'C', null),
    (v_day_id, (select id from exercises where name = 'FONDOS TRICEPS EN BANCO'), 'estructura', 'C2', 12, 'X10', 'C', 'RODILLAS FLEXIONADAS/SIN');

  -- SEMANA TIPO 6 (T2B: SEMANA 14-18-22)
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 6, 'DIA 1', 1) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'REVERSE CRUNCH'), 'core', '1', 5, 'X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 6, 'X5', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA GOBLET A CAJÓN'), 'estructura', 'A1', 7, 'X10', 'A', null),
    (v_day_id, (select id from exercises where name = 'CAMINATA LATERAL CON BANDA + SENTADILLA'), 'estructura', 'A2', 8, 'X8 PASOS + 8 SENT', 'A', null),
    (v_day_id, (select id from exercises where name = 'PRESS DE HOMBRO CON DOBLE KB SENTADA'), 'estructura', 'B1', 9, 'X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'GOBLET CURTSY LUNGES'), 'estructura', 'B2', 10, 'X8/8', 'B', null),
    (v_day_id, (select id from exercises where name = 'EXTENSION TRICEPS CON BANDA'), 'estructura', 'C1', 11, 'X15', 'C', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'C2', 12, 'X10', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 6, 'DIA 2', 2) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = '90/90 ROTACION CADERA'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '2', 2, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'ESCAPULACIONES'), 'movilidad', '3', 3, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACIONES DE CADERA'), 'movilidad', '4', 4, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, 'X8', null, null),
    (v_day_id, (select id from exercises where name = 'SCRUM POSITION LATERAL WALK'), 'core', '2', 6, 'X8/8', null, null),
    (v_day_id, (select id from exercises where name = 'PATADA DE GLUTEO EN POLEA'), 'estructura', 'A1', 7, 'X12/12', 'A', null),
    (v_day_id, (select id from exercises where name = 'VUELO LATERAL'), 'estructura', 'A2', 8, 'X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'ESTOCADAS ATRÁS DDB'), 'estructura', 'B1', 9, 'X6X/6', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS PLANO DDB'), 'estructura', 'B2', 10, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'CURL DE FEMORAL CON FITBALL'), 'estructura', 'C1', 11, 'X8', 'C', null),
    (v_day_id, (select id from exercises where name = 'FONDOS TRICEPS EN BANCO'), 'estructura', 'C2', 12, 'X10', 'C', 'RODILLAS FLEXIONADAS/SIN');

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 6, 'DIA 3', 3) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'CAT CAMEL'), 'movilidad', '1', 1, '10 TOTAL', null, null),
    (v_day_id, (select id from exercises where name = 'FLEXION DE TOBILLO + ACTIVACION DE ISQUIOS'), 'movilidad', '2', 2, '1''XLADO', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION TORACICA'), 'movilidad', '3', 3, '3XLADO', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, 'X5', null, null),
    (v_day_id, (select id from exercises where name = 'DEAD BUG MARCH'), 'core', '2', 6, 'X12', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA SUMO CON BARRA'), 'estructura', 'A1', 7, 'X8', 'A', null),
    (v_day_id, (select id from exercises where name = 'FACE PULLS CON BANDA'), 'estructura', 'A2', 8, 'X15', 'A', null),
    (v_day_id, (select id from exercises where name = 'HIP THRUST'), 'estructura', 'B1', 9, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'WALK OUT'), 'estructura', 'B2', 10, 'X6 A 8', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS INCLINADO DDB'), 'estructura', 'C1', 11, 'X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'PESO MUERTO B-STANCE'), 'estructura', 'C2', 12, 'X8/8', 'C', null);

  -- SEMANA TIPO 7 (T2C: SEMANA 15-19-23)
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 7, 'DIA 1', 1) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'CAT CAMEL'), 'movilidad', '1', 1, '10 TOTAL', null, null),
    (v_day_id, (select id from exercises where name = 'FLEXION DE TOBILLO + ACTIVACION DE ISQUIOS'), 'movilidad', '2', 2, '1'' X LADO', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION TORACICA'), 'movilidad', '3', 3, '3 X LADO', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, 'X5', null, null),
    (v_day_id, (select id from exercises where name = 'DEAD BUG MARCH'), 'core', '2', 6, 'X12', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA SUMO CON BARRA'), 'estructura', 'A1', 7, 'X8', 'A', null),
    (v_day_id, (select id from exercises where name = 'FACE PULLS CON BANDA'), 'estructura', 'A2', 8, 'X15', 'A', null),
    (v_day_id, (select id from exercises where name = 'HIP THRUST'), 'estructura', 'B1', 9, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'WALK OUT'), 'estructura', 'B2', 10, 'X6 A 8', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS INCLINADO DDB'), 'estructura', 'C1', 11, 'X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'PESO MUERTO B-STANCE'), 'estructura', 'C2', 12, 'X8/8', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 7, 'DIA 2', 2) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'REVERSE CRUNCH'), 'core', '1', 5, 'X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 6, 'X5', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA A CAJON + PRESS DDB'), 'estructura', 'A1', 7, 'X10', 'A', null),
    (v_day_id, (select id from exercises where name = 'CAMINATA LATERAL CON BANDA + SENTADILLA'), 'estructura', 'A2', 8, 'X8 PASOS + 8 SENT', 'A', null),
    (v_day_id, (select id from exercises where name = 'PRESS DE HOMBRO CON DOBLE KB SENTADA'), 'estructura', 'B1', 9, 'X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'GOBLET CURTSY LUNGES'), 'estructura', 'B2', 10, 'X8/8', 'B', null),
    (v_day_id, (select id from exercises where name = 'EXTENSION TRICEPS CON BANDA'), 'estructura', 'C1', 11, 'X15', 'C', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'C2', 12, 'X10', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 7, 'DIA 3', 3) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'BIRD DOG'), 'core', '1', 5, 'X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '2', 6, 'X5', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA BULGARA UNILATERAL'), 'estructura', 'A1', 7, 'X8/8', 'A', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'A2', 8, 'X30', 'A', null),
    (v_day_id, (select id from exercises where name = 'PULL THROUGH EN POLEA'), 'estructura', 'B1', 9, 'X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'PULL-DOWN AGARRE ANCHO'), 'estructura', 'B2', 10, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS DE HOMBROS CON KETTLEBELL'), 'estructura', 'C1', 11, 'X15', 'C', null),
    (v_day_id, (select id from exercises where name = 'ABDUCCIONES CON BANDA'), 'estructura', 'C2', 12, 'X10', 'C', null);

  -- SEMANA TIPO 8 (T2D: SEMANA 16-20-24)
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 8, 'DIA 1', 1) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'CAT CAMEL'), 'movilidad', '1', 1, '10 TOTAL', null, null),
    (v_day_id, (select id from exercises where name = 'FLEXION DE TOBILLO + ACTIVACION DE ISQUIOS'), 'movilidad', '2', 2, '1''XLADO', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION TORACICA'), 'movilidad', '3', 3, '3XLADO', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'SUELO PELVICO + ACTIVACION DE ADUCTORES'), 'core', '1', 5, 'X8', null, null),
    (v_day_id, (select id from exercises where name = 'PRESS PALLOF CON BANDA'), 'core', '2', 6, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA GOBLET A CAJÓN'), 'estructura', 'A1', 7, 'X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'VUELO LATERAL'), 'estructura', 'A2', 8, 'X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'ESTOCADAS ATRÁS DDB'), 'estructura', 'B1', 9, 'X6X/6', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS PLANO DDB'), 'estructura', 'B2', 10, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'CURL DE FEMORAL CON FITBALL'), 'estructura', 'C1', 11, 'X8', 'C', null),
    (v_day_id, (select id from exercises where name = 'FONDOS TRICEPS EN BANCO'), 'estructura', 'C2', 12, 'X10', 'C', 'RODILLAS FLEXIONADAS/SIN');

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 8, 'DIA 2', 2) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'REVERSE CRUNCH'), 'core', '1', 5, 'X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 6, 'X5', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA SUMO CON DB'), 'estructura', 'A1', 7, 'X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'REMO GIRONDA AGARRE NEUTRO'), 'estructura', 'A2', 8, 'X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'ABDUCCION INCLINADA EN MAQUINA'), 'estructura', 'B1', 9, 'X20', 'B', null),
    (v_day_id, (select id from exercises where name = 'PULL-DOWN A 1 MANO EN POLEA'), 'estructura', 'B2', 10, 'X8/8', 'B', null),
    (v_day_id, (select id from exercises where name = 'HIP THRUST CON BARRA'), 'estructura', 'C1', 11, 'X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'C2', 12, 'X12', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 8, 'DIA 3', 3) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = '90/90 ROTACION CADERA'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '2', 2, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'ESCAPULACIONES'), 'movilidad', '3', 3, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACIONES DE CADERA'), 'movilidad', '4', 4, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, 'X8', null, null),
    (v_day_id, (select id from exercises where name = 'SCRUM POSITION LATERAL WALK'), 'core', '2', 6, 'X8/8', null, null),
    (v_day_id, (select id from exercises where name = 'PATADA DE GLUTEO CRUZADA EN POLEA'), 'estructura', 'A1', 7, 'X12/12', 'A', null),
    (v_day_id, (select id from exercises where name = 'CURL DE FEMORAL PAUSA CONTRACCIÓN 2'''''), 'estructura', 'A2', 8, 'X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'WALL BALLS'), 'estructura', 'B1', 9, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'GOBLET CURTSY LUNGES'), 'estructura', 'B2', 10, 'X8/8', 'B', null),
    (v_day_id, (select id from exercises where name = 'REMO AL MENTON CON BARRA'), 'estructura', 'C1', 11, 'X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'TRICEPS CON BANDA'), 'estructura', 'C2', 12, 'X15', 'C', null);

  -- SEMANA TIPO 9 (T3A: SEMANA)
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 9, 'DIA 1', 1) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'CAT CAMEL'), 'movilidad', '1', 1, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'FLEXION DE TOBILLO + ACTIVACION DE ISQUIOS'), 'movilidad', '2', 2, 'X1'' POR LADO', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION TORACICA'), 'movilidad', '3', 3, 'X3 POR LADO', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, 'X5', null, null),
    (v_day_id, (select id from exercises where name = 'PLANCHA LATERAL'), 'core', '2', 6, 'X10'''' POR LADO', null, null),
    (v_day_id, (select id from exercises where name = 'AIR SQUAT'), 'estructura', 'A1', 7, 'X10-12', 'A', null),
    (v_day_id, (select id from exercises where name = 'FACE PULLS CON BANDA'), 'estructura', 'A2', 8, 'X15', 'A', null),
    (v_day_id, (select id from exercises where name = 'HIP THRUST CON BANDA'), 'estructura', 'B1', 9, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'FLEXIONES PLANO INCLINADO'), 'estructura', 'B2', 10, 'X6 A 8', 'B', 'regular altura'),
    (v_day_id, (select id from exercises where name = 'SENTADILLA + HALO'), 'estructura', 'C1', 11, 'X5', 'C', null),
    (v_day_id, (select id from exercises where name = 'REMO GIRONDA AGARRE NEUTRO'), 'estructura', 'C2', 12, 'X12', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 9, 'DIA 2', 2) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'BIRD DOG'), 'core', '1', 5, 'X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '2', 6, 'X8', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA SPLIT EN GUIA'), 'estructura', 'A1', 7, 'X8/8', 'A', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'A2', 8, 'X10', 'A', null),
    (v_day_id, (select id from exercises where name = 'PULL THROUGH EN POLEA'), 'estructura', 'B1', 9, 'X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'PULL-DOWN AGARRE ANCHO'), 'estructura', 'B2', 10, 'X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS DE HOMBROS CON KETTLEBELL'), 'estructura', 'C1', 11, 'X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'ABDUCCIONES CON BANDA'), 'estructura', 'C2', 12, 'X25', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 9, 'DIA 3', 3) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = '90/90 ROTACION CADERA'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '2', 2, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'ESCAPULACIONES'), 'movilidad', '3', 3, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACIONES DE CADERA'), 'movilidad', '4', 4, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, 'X8', null, null),
    (v_day_id, (select id from exercises where name = 'SCRUM POSITION LATERAL WALK'), 'core', '2', 6, 'X8/8', null, null),
    (v_day_id, (select id from exercises where name = 'PATADA DE GLUTEO EN POLEA'), 'estructura', 'A1', 7, 'X12/12', 'A', null),
    (v_day_id, (select id from exercises where name = 'VUELO LATERAL'), 'estructura', 'A2', 8, 'X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'ESTOCADAS ATRÁS DDB'), 'estructura', 'B1', 9, 'X6X/6', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS INCLINADO DDB'), 'estructura', 'B2', 10, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'CURL DE FEMORAL CON FITBALL'), 'estructura', 'C1', 11, 'X8', 'C', null),
    (v_day_id, (select id from exercises where name = 'FONDOS TRICEPS EN BANCO'), 'estructura', 'C2', 12, 'X10', 'C', 'RODILLAS FLEXIONADAS/SIN');

  -- SEMANA TIPO 10 (T3B: SEMANA)
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 10, 'DIA 1', 1) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'REVERSE CRUNCH'), 'core', '1', 5, 'X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 6, 'X5', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA GOBLET A CAJÓN'), 'estructura', 'A1', 7, 'X10', 'A', null),
    (v_day_id, (select id from exercises where name = 'CAMINATA LATERAL CON BANDA + SENTADILLA'), 'estructura', 'A2', 8, 'X8 PASOS + 8 SENT', 'A', null),
    (v_day_id, (select id from exercises where name = 'PRESS DE HOMBRO CON DOBLE KB SENTADA'), 'estructura', 'B1', 9, 'X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'GOBLET CURTSY LUNGES'), 'estructura', 'B2', 10, 'X8/8', 'B', null),
    (v_day_id, (select id from exercises where name = 'EXTENSION TRICEPS CON BANDA'), 'estructura', 'C1', 11, 'X15', 'C', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'C2', 12, 'X10', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 10, 'DIA 2', 2) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = '90/90 ROTACION CADERA'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '2', 2, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'ESCAPULACIONES'), 'movilidad', '3', 3, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACIONES DE CADERA'), 'movilidad', '4', 4, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, 'X8', null, null),
    (v_day_id, (select id from exercises where name = 'SCRUM POSITION LATERAL WALK'), 'core', '2', 6, 'X8/8', null, null),
    (v_day_id, (select id from exercises where name = 'PATADA DE GLUTEO EN POLEA'), 'estructura', 'A1', 7, 'X12/12', 'A', null),
    (v_day_id, (select id from exercises where name = 'VUELO LATERAL'), 'estructura', 'A2', 8, 'X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'ESTOCADAS ATRÁS DDB'), 'estructura', 'B1', 9, 'X6X/6', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS PLANO DDB'), 'estructura', 'B2', 10, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'CURL DE FEMORAL CON FITBALL'), 'estructura', 'C1', 11, 'X8', 'C', null),
    (v_day_id, (select id from exercises where name = 'FONDOS TRICEPS EN BANCO'), 'estructura', 'C2', 12, 'X10', 'C', 'RODILLAS FLEXIONADAS/SIN');

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 10, 'DIA 3', 3) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'CAT CAMEL'), 'movilidad', '1', 1, '10 TOTAL', null, null),
    (v_day_id, (select id from exercises where name = 'FLEXION DE TOBILLO + ACTIVACION DE ISQUIOS'), 'movilidad', '2', 2, '1''XLADO', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION TORACICA'), 'movilidad', '3', 3, '3XLADO', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, 'X5', null, null),
    (v_day_id, (select id from exercises where name = 'DEAD BUG MARCH'), 'core', '2', 6, 'X12', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA SUMO CON BARRA'), 'estructura', 'A1', 7, 'X8', 'A', null),
    (v_day_id, (select id from exercises where name = 'FACE PULLS CON BANDA'), 'estructura', 'A2', 8, 'X15', 'A', null),
    (v_day_id, (select id from exercises where name = 'HIP THRUST'), 'estructura', 'B1', 9, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'FLEXIONES PLANO INCLINADO'), 'estructura', 'B2', 10, 'X6 A 8', 'B', 'regular altura'),
    (v_day_id, (select id from exercises where name = 'PRESS INCLINADO DDB'), 'estructura', 'C1', 11, 'X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'PESO MUERTO B-STANCE'), 'estructura', 'C2', 12, 'X8/8', 'C', null);

  -- SEMANA TIPO 11 (T3C: SEMANA)
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 11, 'DIA 1', 1) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'CAT CAMEL'), 'movilidad', '1', 1, '10 TOTAL', null, null),
    (v_day_id, (select id from exercises where name = 'FLEXION DE TOBILLO + ACTIVACION DE ISQUIOS'), 'movilidad', '2', 2, '1'' X LADO', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION TORACICA'), 'movilidad', '3', 3, '3 X LADO', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, 'X5', null, null),
    (v_day_id, (select id from exercises where name = 'DEAD BUG MARCH'), 'core', '2', 6, 'X12', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA SUMO CON BARRA'), 'estructura', 'A1', 7, 'X8', 'A', null),
    (v_day_id, (select id from exercises where name = 'FACE PULLS CON BANDA'), 'estructura', 'A2', 8, 'X15', 'A', null),
    (v_day_id, (select id from exercises where name = 'HIP THRUST'), 'estructura', 'B1', 9, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'FLEXIONES PLANO INCLINADO'), 'estructura', 'B2', 10, 'X6 A 8', 'B', 'regular altura'),
    (v_day_id, (select id from exercises where name = 'PRESS INCLINADO DDB'), 'estructura', 'C1', 11, 'X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'PESO MUERTO B-STANCE'), 'estructura', 'C2', 12, 'X8/8', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 11, 'DIA 2', 2) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'REVERSE CRUNCH'), 'core', '1', 5, 'X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 6, 'X5', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA A CAJON + PRESS DDB'), 'estructura', 'A1', 7, 'X10', 'A', null),
    (v_day_id, (select id from exercises where name = 'CAMINATA LATERAL CON BANDA + SENTADILLA'), 'estructura', 'A2', 8, 'X8 PASOS + 8 SENT', 'A', null),
    (v_day_id, (select id from exercises where name = 'PRESS DE HOMBRO CON DOBLE KB SENTADA'), 'estructura', 'B1', 9, 'X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'GOBLET CURTSY LUNGES'), 'estructura', 'B2', 10, 'X8/8', 'B', null),
    (v_day_id, (select id from exercises where name = 'EXTENSION TRICEPS CON BANDA'), 'estructura', 'C1', 11, 'X15', 'C', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'C2', 12, 'X10', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 11, 'DIA 3', 3) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'BIRD DOG'), 'core', '1', 5, 'X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '2', 6, 'X5', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA BULGARA UNILATERAL'), 'estructura', 'A1', 7, 'X8/8', 'A', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'A2', 8, 'X30', 'A', null),
    (v_day_id, (select id from exercises where name = 'PULL THROUGH EN POLEA'), 'estructura', 'B1', 9, 'X10', 'B', null),
    (v_day_id, (select id from exercises where name = 'PULL-DOWN AGARRE ANCHO'), 'estructura', 'B2', 10, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS DE HOMBROS CON KETTLEBELL'), 'estructura', 'C1', 11, 'X15', 'C', null),
    (v_day_id, (select id from exercises where name = 'ABDUCCIONES CON BANDA'), 'estructura', 'C2', 12, 'X10', 'C', null);

  -- SEMANA TIPO 12 (T3D: SEMANA)
  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 12, 'DIA 1', 1) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'CAT CAMEL'), 'movilidad', '1', 1, '10 TOTAL', null, null),
    (v_day_id, (select id from exercises where name = 'FLEXION DE TOBILLO + ACTIVACION DE ISQUIOS'), 'movilidad', '2', 2, '1''XLADO', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION TORACICA'), 'movilidad', '3', 3, '3XLADO', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'SUELO PELVICO + ACTIVACION DE ADUCTORES'), 'core', '1', 5, 'X8', null, null),
    (v_day_id, (select id from exercises where name = 'PRESS PALLOF CON BANDA'), 'core', '2', 6, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA GOBLET A CAJÓN'), 'estructura', 'A1', 7, 'X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'VUELO LATERAL'), 'estructura', 'A2', 8, 'X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'ESTOCADAS ATRÁS DDB'), 'estructura', 'B1', 9, 'X6X/6', 'B', null),
    (v_day_id, (select id from exercises where name = 'PRESS PLANO DDB'), 'estructura', 'B2', 10, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'CURL DE FEMORAL CON FITBALL'), 'estructura', 'C1', 11, 'X8', 'C', null),
    (v_day_id, (select id from exercises where name = 'FONDOS TRICEPS EN BANCO'), 'estructura', 'C2', 12, 'X10', 'C', 'RODILLAS FLEXIONADAS/SIN');

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 12, 'DIA 2', 2) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = 'ROTACIONES TORACICAS'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'ADELANTE/ATRÁS CON BANDA'), 'movilidad', '2', 2, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACION DE HOMBRO'), 'movilidad', '3', 3, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '4', 4, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'REVERSE CRUNCH'), 'core', '1', 5, 'X16', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 6, 'X5', null, null),
    (v_day_id, (select id from exercises where name = 'SENTADILLA SUMO CON DB'), 'estructura', 'A1', 7, 'X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'REMO GIRONDA AGARRE NEUTRO'), 'estructura', 'A2', 8, 'X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'ABDUCCION INCLINADA EN MAQUINA'), 'estructura', 'B1', 9, 'X20', 'B', null),
    (v_day_id, (select id from exercises where name = 'PULL-DOWN A 1 MANO EN POLEA'), 'estructura', 'B2', 10, 'X8/8', 'B', null),
    (v_day_id, (select id from exercises where name = 'HIP THRUST CON BARRA'), 'estructura', 'C1', 11, 'X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'CURL DE BICEP DDB'), 'estructura', 'C2', 12, 'X12', 'C', null);

  insert into program_days (program_id, week_number, title, position)
  values (v_template_id, 12, 'DIA 3', 3) returning id into v_day_id;
  insert into program_exercises (program_day_id, exercise_id, block, order_code, position, sets_reps_text, superset_group, coach_note)
  values
    (v_day_id, (select id from exercises where name = '90/90 ROTACION CADERA'), 'movilidad', '1', 1, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'RANITAS'), 'movilidad', '2', 2, 'X20', null, null),
    (v_day_id, (select id from exercises where name = 'ESCAPULACIONES'), 'movilidad', '3', 3, 'X10', null, null),
    (v_day_id, (select id from exercises where name = 'ROTACIONES DE CADERA'), 'movilidad', '4', 4, 'X5/5', null, null),
    (v_day_id, (select id from exercises where name = 'CONNECTION BREATH'), 'core', '1', 5, 'X8', null, null),
    (v_day_id, (select id from exercises where name = 'SCRUM POSITION LATERAL WALK'), 'core', '2', 6, 'X8/8', null, null),
    (v_day_id, (select id from exercises where name = 'PATADA DE GLUTEO CRUZADA EN POLEA'), 'estructura', 'A1', 7, 'X12/12', 'A', null),
    (v_day_id, (select id from exercises where name = 'CURL DE FEMORAL PAUSA CONTRACCIÓN 2'''''), 'estructura', 'A2', 8, 'X12', 'A', null),
    (v_day_id, (select id from exercises where name = 'WALL BALLS'), 'estructura', 'B1', 9, 'X12', 'B', null),
    (v_day_id, (select id from exercises where name = 'GOBLET CURTSY LUNGES'), 'estructura', 'B2', 10, 'X8/8', 'B', null),
    (v_day_id, (select id from exercises where name = 'REMO AL MENTON CON BARRA'), 'estructura', 'C1', 11, 'X12', 'C', null),
    (v_day_id, (select id from exercises where name = 'TRICEPS CON BANDA'), 'estructura', 'C2', 12, 'X15', 'C', null);

end $$;
