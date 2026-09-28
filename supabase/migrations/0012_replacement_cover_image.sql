-- Imagen de portada para las rutinas de la biblioteca de reemplazos (se
-- sube al crearlas, y se puede reemplazar después desde el editor). Usa el
-- mismo bucket público que las miniaturas de ejercicios — mismo tipo de
-- archivo, mismas políticas (solo admin sube/edita/borra).
alter table program_days add column if not exists cover_image_url text;
