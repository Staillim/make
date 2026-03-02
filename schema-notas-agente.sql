-- Migración: Sistema de Notas de Agentes
-- Cada agente (vendedor, administrador, orquestador, marketing)
-- puede guardar notas propias que persisten entre conversaciones (memoria a largo plazo).
--
-- Ejecutar en: Supabase SQL Editor

-- 1. Tipos ENUM específicos de notas
CREATE TYPE tipo_agente_enum AS ENUM ('vendedor', 'administrador', 'orquestador', 'marketing');
CREATE TYPE importancia_nota AS ENUM ('alta', 'media', 'baja');
CREATE TYPE categoria_nota_agente AS ENUM (
  'patron_venta',
  'preferencia_cliente',
  'oportunidad',
  'problema_recurrente',
  'insight_negocio',
  'alerta',
  'aprendizaje_ia',
  'evento_especial',
  'otro'
);
CREATE TYPE fuente_nota AS ENUM ('conversacion', 'analisis', 'manual');

-- 2. Tabla notas_agente
CREATE TABLE notas_agente (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_negocio    UUID NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
  tipo_agente   tipo_agente_enum NOT NULL,
  contenido     TEXT NOT NULL,
  importancia   importancia_nota DEFAULT 'media',
  categoria     categoria_nota_agente DEFAULT 'otro',
  tags          TEXT[] DEFAULT '{}',
  fuente        fuente_nota DEFAULT 'conversacion',
  id_conversacion TEXT,        -- ID de sesión/conversación donde se originó la nota
  activa        BOOLEAN DEFAULT TRUE,  -- FALSE = archivada
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices para consultas frecuentes
CREATE INDEX idx_notas_agente_negocio_tipo
  ON notas_agente (id_negocio, tipo_agente)
  WHERE activa = TRUE;

CREATE INDEX idx_notas_agente_importancia
  ON notas_agente (id_negocio, tipo_agente, importancia)
  WHERE activa = TRUE;

CREATE INDEX idx_notas_agente_tags
  ON notas_agente USING GIN (tags);

-- 4. Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_notas_agente_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notas_agente_updated_at
  BEFORE UPDATE ON notas_agente
  FOR EACH ROW EXECUTE FUNCTION update_notas_agente_updated_at();

-- 5. Row Level Security (RLS)
ALTER TABLE notas_agente ENABLE ROW LEVEL SECURITY;

-- Solo el dueño del negocio puede ver y modificar las notas de sus agentes
CREATE POLICY "notas_agente_owner_policy" ON notas_agente
  FOR ALL
  USING (
    id_negocio IN (
      SELECT id_negocio FROM negocios WHERE id_usuario = auth.uid()
    )
  );

-- Service role bypass (para API routes con service key)
CREATE POLICY "notas_agente_service_role" ON notas_agente
  FOR ALL TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- 6. Vista para estadísticas de notas (útil para dashboards)
CREATE VIEW vista_estadisticas_notas AS
SELECT
  id_negocio,
  tipo_agente,
  COUNT(*) FILTER (WHERE activa = TRUE) AS total_activas,
  COUNT(*) FILTER (WHERE activa = TRUE AND importancia = 'alta') AS criticas,
  COUNT(*) FILTER (WHERE activa = TRUE AND importancia = 'media') AS importantes,
  COUNT(*) FILTER (WHERE activa = TRUE AND importancia = 'baja') AS informativas,
  MAX(created_at) AS ultima_nota
FROM notas_agente
GROUP BY id_negocio, tipo_agente;
