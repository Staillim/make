-- ============================================================================
-- SCHEMA DE BASE DE DATOS - Sistema de Perfiles de Cliente Inteligente
-- ============================================================================

-- Tabla principal de perfiles de clientes
CREATE TABLE perfiles_clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_negocio UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  
  -- Identificación
  nombre VARCHAR(255),
  email VARCHAR(255),
  telefono VARCHAR(50),
  
  -- Preferencias (JSONB para flexibilidad)
  preferencias JSONB DEFAULT '{
    "productos_favoritos": [],
    "categorias_interes": [],
    "rango_precio_preferido": null,
    "estilo_comunicacion": "casual",
    "horario_preferido": null,
    "dias_preferidos": []
  }'::jsonb,
  
  -- Comportamiento (actualizado automáticamente)
  primera_visita TIMESTAMP NOT NULL DEFAULT NOW(),
  ultima_visita TIMESTAMP NOT NULL DEFAULT NOW(),
  total_conversaciones INTEGER DEFAULT 0,
  total_compras INTEGER DEFAULT 0,
  valor_total_comprado DECIMAL(10,2) DEFAULT 0,
  promedio_ticket DECIMAL(10,2) DEFAULT 0,
  frecuencia_visitas VARCHAR(20) DEFAULT 'baja', -- 'alta', 'media', 'baja'
  
  -- Arrays de IDs
  productos_comprados TEXT[] DEFAULT ARRAY[]::TEXT[],
  productos_consultados TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Segmentación (calculado automáticamente)
  tipo_segmento VARCHAR(20) DEFAULT 'nuevo', -- 'nuevo', 'recurrente', 'vip', 'inactivo', 'en_riesgo'
  nivel_engagement INTEGER DEFAULT 0, -- 0-100
  probabilidad_compra INTEGER DEFAULT 50, -- 0-100
  valor_lifetime DECIMAL(10,2) DEFAULT 0,
  dias_desde_ultima_visita INTEGER DEFAULT 0,
  
  -- Contexto (JSONB)
  contexto JSONB DEFAULT '{
    "ocasion_compra": null,
    "quien_es_para": null,
    "nivel_urgencia": null,
    "objeciones_comunes": [],
    "puntos_dolor": []
  }'::jsonb,
  
  -- Preferencias de contacto
  canal_preferido VARCHAR(20) DEFAULT 'email', -- 'email', 'whatsapp', 'sms', 'ninguno'
  acepta_promociones BOOLEAN DEFAULT true,
  acepta_recordatorios BOOLEAN DEFAULT true,
  frecuencia_notificaciones VARCHAR(20) DEFAULT 'semanal', -- 'diaria', 'semanal', 'mensual', 'nunca'
  mejor_hora_contacto VARCHAR(50),
  
  -- Metadata
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  ultima_actualizacion_ia TIMESTAMP,
  version_perfil INTEGER DEFAULT 1,
  notas_internas TEXT,
  
  -- Índices para búsquedas rápidas
  CONSTRAINT unique_email_per_negocio UNIQUE(id_negocio, email),
  CONSTRAINT unique_telefono_per_negocio UNIQUE(id_negocio, telefono)
);

-- Índices para optimización
CREATE INDEX idx_perfiles_negocio ON perfiles_clientes(id_negocio);
CREATE INDEX idx_perfiles_email ON perfiles_clientes(email);
CREATE INDEX idx_perfiles_telefono ON perfiles_clientes(telefono);
CREATE INDEX idx_perfiles_segmento ON perfiles_clientes(tipo_segmento);
CREATE INDEX idx_perfiles_ultima_visita ON perfiles_clientes(ultima_visita);
CREATE INDEX idx_perfiles_engagement ON perfiles_clientes(nivel_engagement DESC);

-- ============================================================================
-- Tabla de historial de conversaciones (para entrenar IA y análisis)
-- ============================================================================

CREATE TABLE conversaciones_clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_perfil UUID NOT NULL REFERENCES perfiles_clientes(id) ON DELETE CASCADE,
  id_negocio UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  
  -- Contenido de la conversación
  mensajes JSONB NOT NULL, -- Array de { role: 'user'|'assistant', content: string, timestamp: Date }
  
  -- Análisis de la conversación
  informacion_extraida JSONB, -- Preferencias, contexto, sentimiento detectados
  productos_mencionados TEXT[],
  resultado VARCHAR(50), -- 'compra', 'consulta', 'abandono', 'queja', 'en_progreso'
  
  -- Métricas
  duracion_minutos INTEGER,
  total_mensajes INTEGER,
  sentiment_score DECIMAL(3,2), -- -1 a 1
  
  -- Timestamps
  inicio_conversacion TIMESTAMP NOT NULL DEFAULT NOW(),
  fin_conversacion TIMESTAMP,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversaciones_perfil ON conversaciones_clientes(id_perfil);
CREATE INDEX idx_conversaciones_negocio ON conversaciones_clientes(id_negocio);
CREATE INDEX idx_conversaciones_fecha ON conversaciones_clientes(inicio_conversacion DESC);

-- ============================================================================
-- Tabla de eventos de cliente (para tracking detallado)
-- ============================================================================

CREATE TABLE eventos_clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_perfil UUID NOT NULL REFERENCES perfiles_clientes(id) ON DELETE CASCADE,
  id_negocio UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  
  tipo_evento VARCHAR(50) NOT NULL, -- 'visita', 'producto_visto', 'producto_consultado', 'compra', 'abandono_carrito'
  detalles JSONB, -- Info específica del evento
  
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_eventos_perfil ON eventos_clientes(id_perfil);
CREATE INDEX idx_eventos_tipo ON eventos_clientes(tipo_evento);
CREATE INDEX idx_eventos_timestamp ON eventos_clientes(timestamp DESC);

-- ============================================================================
-- Tabla de notificaciones programadas
-- ============================================================================

CREATE TABLE notificaciones_programadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_perfil UUID NOT NULL REFERENCES perfiles_clientes(id) ON DELETE CASCADE,
  id_negocio UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  
  -- Configuración
  tipo_notificacion VARCHAR(50) NOT NULL, -- 'descuento', 'recordatorio', 'recomendacion', 'reactivacion', 'carrito_abandonado'
  canal VARCHAR(20) NOT NULL, -- 'email', 'whatsapp', 'sms'
  asunto VARCHAR(255),
  mensaje TEXT NOT NULL,
  
  -- Datos dinámicos para personalización
  datos_personalizacion JSONB, -- { nombre, productos_recomendados, descuento, etc. }
  
  -- Programación
  programada_para TIMESTAMP NOT NULL,
  enviada_en TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'enviada', 'fallida', 'cancelada'
  
  -- Tracking
  abierta BOOLEAN DEFAULT false,
  click_realizado BOOLEAN DEFAULT false,
  conversion BOOLEAN DEFAULT false,
  
  -- Metadata
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  error_mensaje TEXT
);

CREATE INDEX idx_notificaciones_perfil ON notificaciones_programadas(id_perfil);
CREATE INDEX idx_notificaciones_programada ON notificaciones_programadas(programada_para);
CREATE INDEX idx_notificaciones_estado ON notificaciones_programadas(estado);

-- ============================================================================
-- Tabla de campañas automatizadas
-- ============================================================================

CREATE TABLE campanas_automatizadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_negocio UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  activa BOOLEAN DEFAULT true,
  
  -- Trigger de la campaña
  trigger_tipo VARCHAR(50) NOT NULL, -- 'inactividad', 'cumpleanos', 'carrito_abandonado', 'vip_upgrade', 'producto_nuevo'
  trigger_condiciones JSONB NOT NULL, -- { dias_inactividad: 30, segmento: 'vip', etc. }
  
  -- Segmento objetivo
  segmento_objetivo VARCHAR(20)[], -- ['vip', 'recurrente']
  filtros_adicionales JSONB,
  
  -- Contenido
  tipo_notificacion VARCHAR(50) NOT NULL,
  canal VARCHAR(20) NOT NULL,
  template_mensaje TEXT NOT NULL,
  
  -- Resultados
  total_enviadas INTEGER DEFAULT 0,
  total_abiertas INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  total_conversiones INTEGER DEFAULT 0,
  
  -- Metadata
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  creado_por UUID REFERENCES usuarios(id)
);

CREATE INDEX idx_campanas_negocio ON campanas_automatizadas(id_negocio);
CREATE INDEX idx_campanas_activa ON campanas_automatizadas(activa);

-- ============================================================================
-- Función para actualizar automáticamente dias_desde_ultima_visita
-- ============================================================================

CREATE OR REPLACE FUNCTION actualizar_dias_ultima_visita()
RETURNS void AS $$
BEGIN
  UPDATE perfiles_clientes
  SET dias_desde_ultima_visita = EXTRACT(DAY FROM (NOW() - ultima_visita))::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Ejecutar diariamente con pg_cron o desde la aplicación
-- SELECT cron.schedule('actualizar-dias-visita', '0 0 * * *', 'SELECT actualizar_dias_ultima_visita()');

-- ============================================================================
-- Función para recalcular segmentación automáticamente
-- ============================================================================

CREATE OR REPLACE FUNCTION recalcular_segmento_cliente(perfil_id UUID)
RETURNS void AS $$
DECLARE
  perfil RECORD;
  nuevo_segmento VARCHAR(20);
  nuevo_engagement INTEGER;
  nueva_probabilidad INTEGER;
BEGIN
  -- Obtener datos del perfil
  SELECT * INTO perfil FROM perfiles_clientes WHERE id = perfil_id;
  
  -- Determinar segmento
  IF perfil.total_conversaciones <= 1 AND perfil.total_compras = 0 THEN
    nuevo_segmento := 'nuevo';
  ELSIF perfil.dias_desde_ultima_visita > 30 THEN
    nuevo_segmento := 'inactivo';
  ELSIF perfil.total_compras >= 3 AND perfil.dias_desde_ultima_visita > 15 AND perfil.dias_desde_ultima_visita <= 30 THEN
    nuevo_segmento := 'en_riesgo';
  ELSIF perfil.total_compras >= 5 AND perfil.valor_total_comprado > 1000 THEN
    nuevo_segmento := 'vip';
  ELSIF perfil.total_conversaciones >= 2 OR perfil.total_compras >= 1 THEN
    nuevo_segmento := 'recurrente';
  ELSE
    nuevo_segmento := 'nuevo';
  END IF;
  
  -- Calcular engagement (simplificado)
  nuevo_engagement := LEAST(100, 
    CASE 
      WHEN perfil.dias_desde_ultima_visita <= 7 THEN 30
      WHEN perfil.dias_desde_ultima_visita <= 15 THEN 20
      WHEN perfil.dias_desde_ultima_visita <= 30 THEN 10
      ELSE 0
    END +
    CASE
      WHEN perfil.total_compras >= 5 THEN 30
      WHEN perfil.total_compras >= 3 THEN 20
      WHEN perfil.total_compras >= 1 THEN 10
      ELSE 0
    END +
    CASE
      WHEN perfil.valor_total_comprado >= 1000 THEN 20
      WHEN perfil.valor_total_comprado >= 500 THEN 15
      WHEN perfil.valor_total_comprado >= 100 THEN 10
      ELSE 0
    END +
    CASE
      WHEN perfil.total_conversaciones >= 10 THEN 20
      WHEN perfil.total_conversaciones >= 5 THEN 15
      WHEN perfil.total_conversaciones >= 2 THEN 10
      ELSE 0
    END
  );
  
  -- Calcular probabilidad de compra (simplificado)
  nueva_probabilidad := 50;
  IF perfil.total_compras > 0 THEN
    nueva_probabilidad := nueva_probabilidad + (perfil.total_compras::DECIMAL / perfil.total_conversaciones * 30)::INTEGER;
  END IF;
  
  -- Actualizar perfil
  UPDATE perfiles_clientes
  SET 
    tipo_segmento = nuevo_segmento,
    nivel_engagement = nuevo_engagement,
    probabilidad_compra = nueva_probabilidad,
    actualizado_en = NOW()
  WHERE id = perfil_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Trigger para recalcular segmento después de cambios en perfil
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_recalcular_segmento()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM recalcular_segmento_cliente(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_update_perfil
AFTER UPDATE OF total_conversaciones, total_compras, valor_total_comprado, ultima_visita
ON perfiles_clientes
FOR EACH ROW
EXECUTE FUNCTION trigger_recalcular_segmento();

-- ============================================================================
-- Vistas útiles para análisis
-- ============================================================================

-- Vista de clientes VIP
CREATE VIEW clientes_vip AS
SELECT 
  p.*,
  n.nombre as nombre_negocio
FROM perfiles_clientes p
JOIN negocios n ON p.id_negocio = n.id
WHERE p.tipo_segmento = 'vip'
ORDER BY p.valor_total_comprado DESC;

-- Vista de clientes en riesgo (para campañas de reactivación)
CREATE VIEW clientes_en_riesgo AS
SELECT 
  p.*,
  n.nombre as nombre_negocio
FROM perfiles_clientes p
JOIN negocios n ON p.id_negocio = n.id
WHERE p.tipo_segmento IN ('en_riesgo', 'inactivo')
AND p.acepta_promociones = true
ORDER BY p.dias_desde_ultima_visita DESC;

-- Vista de performance de campañas
CREATE VIEW performance_campanas AS
SELECT 
  c.id,
  c.nombre,
  c.total_enviadas,
  c.total_abiertas,
  c.total_clicks,
  c.total_conversiones,
  CASE WHEN c.total_enviadas > 0 
    THEN ROUND((c.total_abiertas::DECIMAL / c.total_enviadas * 100), 2)
    ELSE 0 
  END as tasa_apertura,
  CASE WHEN c.total_enviadas > 0 
    THEN ROUND((c.total_clicks::DECIMAL / c.total_enviadas * 100), 2)
    ELSE 0 
  END as tasa_clicks,
  CASE WHEN c.total_enviadas > 0 
    THEN ROUND((c.total_conversiones::DECIMAL / c.total_enviadas * 100), 2)
    ELSE 0 
  END as tasa_conversion
FROM campanas_automatizadas c
WHERE c.activa = true;

-- ============================================================================
-- Seeds / Datos de ejemplo
-- ============================================================================

-- Ejemplo de campaña de reactivación para clientes inactivos
INSERT INTO campanas_automatizadas (
  id_negocio,
  nombre,
  descripcion,
  trigger_tipo,
  trigger_condiciones,
  segmento_objetivo,
  tipo_notificacion,
  canal,
  template_mensaje
) VALUES (
  'YOUR_NEGOCIO_ID'::UUID,
  'Reactivación 30 días',
  'Campaña automática para clientes que no han visitado en 30 días',
  'inactividad',
  '{"dias_inactividad": 30}'::jsonb,
  ARRAY['recurrente', 'vip'],
  'reactivacion',
  'email',
  'Hola {{nombre}}, te extrañamos! 💙 Hace {{dias_inactivo}} días que no te vemos. Tenemos algo especial para ti: {{descuento}}% de descuento en tu próxima compra. ¡Esperamos verte pronto!'
);

-- ============================================================================
-- Comentarios de documentación
-- ============================================================================

COMMENT ON TABLE perfiles_clientes IS 'Perfiles completos de clientes con preferencias detectadas por IA';
COMMENT ON TABLE conversaciones_clientes IS 'Historial completo de conversaciones para análisis y entrenamiento';
COMMENT ON TABLE eventos_clientes IS 'Eventos de tracking detallado (vistas, clicks, compras)';
COMMENT ON TABLE notificaciones_programadas IS 'Cola de notificaciones pendientes por enviar';
COMMENT ON TABLE campanas_automatizadas IS 'Configuración de campañas automáticas basadas en triggers';

COMMENT ON COLUMN perfiles_clientes.preferencias IS 'JSONB con productos favoritos, categorías, rango de precio, estilo comunicación';
COMMENT ON COLUMN perfiles_clientes.contexto IS 'JSONB con contexto de compras: ocasión, para quién, urgencia, objeciones';
COMMENT ON COLUMN perfiles_clientes.tipo_segmento IS 'Segmentación automática: nuevo, recurrente, vip, inactivo, en_riesgo';
COMMENT ON COLUMN perfiles_clientes.nivel_engagement IS 'Score 0-100 calculado automáticamente por triggers';
COMMENT ON COLUMN perfiles_clientes.probabilidad_compra IS 'Score 0-100 de probabilidad de compra calculado por IA';
