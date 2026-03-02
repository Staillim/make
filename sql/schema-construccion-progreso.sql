-- Migración: Tabla para tracking del progreso de construcción de negocios
-- Usada por el Orquestador para guardar el estado de la conversación

CREATE TABLE IF NOT EXISTS construccion_progreso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_negocio UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  fase_actual TEXT NOT NULL DEFAULT 'descubrimiento',
  -- Opciones: descubrimiento, productos, identidad, operaciones, inventario, validacion
  
  negocio_parcial JSONB DEFAULT '{}',
  -- Información recopilada hasta el momento sobre el negocio
  
  historial_mensajes JSONB DEFAULT '[]',
  -- Array de {role: 'user'|'assistant', content: '...', timestamp: '...'}
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ultima_actualizacion TIMESTAMPTZ DEFAULT NOW(),
  
  -- Índices
  CONSTRAINT construccion_progreso_id_negocio_key UNIQUE (id_negocio)
);

-- Índice para búsquedas por negocio
CREATE INDEX IF NOT EXISTS idx_construccion_progreso_id_negocio 
ON construccion_progreso(id_negocio);

-- Índice para búsquedas por fase
CREATE INDEX IF NOT EXISTS idx_construccion_progreso_fase 
ON construccion_progreso(fase_actual);

-- Trigger para actualizar ultima_actualizacion
CREATE OR REPLACE FUNCTION update_construccion_progreso_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ultima_actualizacion = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_construccion_progreso_timestamp
BEFORE UPDATE ON construccion_progreso
FOR EACH ROW
EXECUTE FUNCTION update_construccion_progreso_timestamp();

-- Comentarios para documentación
COMMENT ON TABLE construccion_progreso IS 'Tracking del progreso de construcción de negocios con el Orquestador';
COMMENT ON COLUMN construccion_progreso.fase_actual IS 'Fase actual: descubrimiento, productos, identidad, operaciones, inventario, validacion';
COMMENT ON COLUMN construccion_progreso.negocio_parcial IS 'JSON con información del negocio recopilada hasta ahora';
COMMENT ON COLUMN construccion_progreso.historial_mensajes IS 'Historial completo de la conversación con el Orquestador';
