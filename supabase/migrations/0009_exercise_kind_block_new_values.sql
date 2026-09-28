-- Suma Activación, Potencia, Pliometría y Sprint tanto a exercise_kind (TIPO)
-- como a exercise_block (BLOQUE), a pedido de la profe. Aditivo: no afecta
-- ejercicios ni rutinas existentes.
alter type exercise_kind add value 'activacion';
alter type exercise_kind add value 'potencia';
alter type exercise_kind add value 'pliometria';
alter type exercise_kind add value 'sprint';

alter type exercise_block add value 'activacion';
alter type exercise_block add value 'potencia';
alter type exercise_block add value 'pliometria';
alter type exercise_block add value 'sprint';
