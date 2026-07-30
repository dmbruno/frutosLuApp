-- Imagen estática de portada por ejercicio (miniatura para las vistas de lista:
-- Hoy, vista previa del día). Separada de video_url porque los links de la
-- profe (YouTube/Instagram) no siempre tienen una miniatura confiable vía CORS,
-- y porque un ejercicio puede tener foto sin tener video todavía (needs_filming).
alter table exercises add column thumbnail_url text;
