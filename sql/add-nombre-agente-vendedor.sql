-- Migración: Añadir campo nombre_agente_vendedor a tabla marca
-- Fecha: Marzo 1, 2026
-- Propósito: Permitir que el dueño personalice el nombre de su agente IA vendedor

-- Añadir columna nombre_agente_vendedor a tabla marca
ALTER TABLE marca 
ADD COLUMN nombre_agente_vendedor VARCHAR(100);

-- Comentario explicativo
COMMENT ON COLUMN marca.nombre_agente_vendedor IS 'Nombre personalizado del agente IA vendedor (ej: Sofía, Alex, Luna). Si es NULL, se usa el nombre default según tipo_negocio.';

-- Valores por defecto opcionales según tipo_negocio (template)
-- Estos son los nombres default si el usuario no personaliza
-- María (restaurante), Sofía (tienda_ropa), Alex (tecnología), 
-- Coach Mike (gimnasio), Prof. Ana (educación), Luna (servicios)

-- No establecemos defaults automáticos porque queremos que sea opcional
-- El código manejará el fallback a nombres default
