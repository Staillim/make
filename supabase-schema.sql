-- Maket AI Database Schema
-- Ejecutar este script en Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tipos ENUM
CREATE TYPE plan_type AS ENUM ('free', 'premium');
CREATE TYPE estado_negocio AS ENUM ('en_configuracion', 'activo', 'pausado');
CREATE TYPE tipo_producto AS ENUM ('fisico', 'digital', 'mixto');
CREATE TYPE alcance_negocio AS ENUM ('local', 'nacional', 'internacional');
CREATE TYPE estado_producto AS ENUM ('activo', 'borrador', 'agotado');

-- 1. Tabla usuarios
CREATE TABLE usuarios (
    id_usuario UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    plan plan_type DEFAULT 'free',
    fecha_registro TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Tabla negocios
CREATE TABLE negocios (
    id_negocio UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_usuario UUID NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    nombre VARCHAR(200),
    estado estado_negocio DEFAULT 'en_configuracion',
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_activacion TIMESTAMP,
    url_tienda VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Tabla tema (tipo de negocio)
CREATE TABLE tema (
    id_tema UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_negocio UUID NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
    tipo_negocio VARCHAR(100) NOT NULL,
    categoria_principal VARCHAR(100) NOT NULL,
    tipo_producto tipo_producto NOT NULL,
    alcance alcance_negocio NOT NULL,
    descripcion_ia TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Tabla plantillas (precargada)
CREATE TABLE plantillas (
    id_plantilla UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    preview_url VARCHAR(500),
    tipo_plan plan_type NOT NULL,
    categorias_compatibles JSONB,
    configuracion_base JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Tabla marca (identidad visual)
CREATE TABLE marca (
    id_marca UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_negocio UUID NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
    nombre_negocio VARCHAR(200) NOT NULL,
    slogan VARCHAR(300),
    color_primario VARCHAR(7) NOT NULL,
    color_secundario VARCHAR(7),
    color_acento VARCHAR(7),
    estilo_visual VARCHAR(50) NOT NULL,
    publico_objetivo JSONB,
    tono_comunicacion VARCHAR(50) NOT NULL,
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Tabla configuracion_visual (personalización de plantilla)
CREATE TABLE configuracion_visual (
    id_config UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_negocio UUID NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
    id_plantilla UUID NOT NULL REFERENCES plantillas(id_plantilla),
    configuracion JSONB NOT NULL,
    ultima_modificacion TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Tabla categorias
CREATE TABLE categorias (
    id_categoria UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_negocio UUID NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    orden INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Tabla productos
CREATE TABLE productos (
    id_producto UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_negocio UUID NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
    id_categoria UUID NOT NULL REFERENCES categorias(id_categoria) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagenes JSONB,
    variantes JSONB,
    stock INTEGER DEFAULT 0,
    estado estado_producto DEFAULT 'borrador',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. Tabla variantes_config
CREATE TABLE variantes_config (
    id_variante_config UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_negocio UUID NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
    tallas JSONB,
    colores JSONB,
    tipo_inventario VARCHAR(50) DEFAULT 'propio',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 10. Tabla reglas_negocio
CREATE TABLE reglas_negocio (
    id_regla UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_negocio UUID NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
    dominio_permitido VARCHAR(100) NOT NULL,
    dominios_bloqueados JSONB,
    palabras_clave JSONB,
    palabras_prohibidas JSONB,
    reglas_personalizadas JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 11. Tabla agentes (IA)
CREATE TABLE agentes (
    id_agente UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_negocio UUID NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- 'vendedor', 'administrador'
    nombre VARCHAR(100) NOT NULL,
    personalidad VARCHAR(100) NOT NULL,
    prompt_base TEXT NOT NULL,
    avatar_url VARCHAR(500),
    estado VARCHAR(20) DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 12. Tabla config_comercial
CREATE TABLE config_comercial (
    id_config UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_negocio UUID NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
    metodos_pago JSONB NOT NULL,
    politica_devoluciones TEXT,
    tiempo_entrega VARCHAR(100),
    zonas_envio JSONB,
    costo_envio JSONB,
    moneda VARCHAR(3) DEFAULT 'COP',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 13. Tabla automatizaciones
CREATE TABLE automatizaciones (
    id_automatizacion UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_negocio UUID NOT NULL REFERENCES negocios(id_negocio) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT true,
    configuracion JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para optimización
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_negocios_usuario ON negocios(id_usuario);
CREATE INDEX idx_negocios_estado ON negocios(estado);
CREATE INDEX idx_productos_negocio ON productos(id_negocio);
CREATE INDEX idx_productos_categoria ON productos(id_categoria);
CREATE INDEX idx_categorias_negocio ON categorias(id_negocio);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_negocios_updated_at BEFORE UPDATE ON negocios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar plantillas básicas
INSERT INTO plantillas (nombre, descripcion, tipo_plan, configuracion_base) VALUES
('Minimal', 'Plantilla minimalista y elegante', 'free', '{"estilo": "minimal", "colores": ["#ffffff", "#000000"]}'),
('Modern', 'Plantilla moderna con gradientes', 'free', '{"estilo": "modern", "colores": ["#4f46e5", "#7c3aed"]}'),
('Classic', 'Plantilla clásica y profesional', 'free', '{"estilo": "classic", "colores": ["#374151", "#6b7280"]}'),
('Ecommerce Pro', 'Plantilla premium para tiendas', 'premium', '{"estilo": "pro", "colores": ["#059669", "#10b981"]}'),
('Fashion Store', 'Especializada en moda y estilo', 'premium', '{"estilo": "fashion", "colores": ["#ec4899", "#f472b6"]}'),
('Tech Store', 'Optimizada para productos tecnológicos', 'premium', '{"estilo": "tech", "colores": ["#3b82f6", "#60a5fa"]}');

-- Row Level Security (RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE negocios ENABLE ROW LEVEL SECURITY;
ALTER TABLE tema ENABLE ROW LEVEL SECURITY;
ALTER TABLE marca ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_visual ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- RLS Policies (básicas - refinarse según necesidades)
CREATE POLICY "Users can view own profile" ON usuarios FOR SELECT USING (auth.uid()::text = id_usuario::text);
CREATE POLICY "Users can view own businesses" ON negocios FOR SELECT USING (auth.uid()::text = id_usuario::text);
CREATE POLICY "Users can manage own businesses" ON negocios FOR ALL USING (auth.uid()::text = id_usuario::text);

-- Permitir lectura pública de plantillas
CREATE POLICY "Anyone can view templates" ON plantillas FOR SELECT USING (true);