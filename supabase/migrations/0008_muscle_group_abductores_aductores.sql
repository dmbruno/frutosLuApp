-- Suma abductores/aductores al enum muscle_group, para poder marcarlos como
-- músculo secundario en el catálogo de ejercicios. Aditivo: no afecta datos
-- existentes ni la función muscle_volume() (itera el enum sin lista fija).
alter type muscle_group add value 'abductores';
alter type muscle_group add value 'aductores';
