-- Fix RLS Policies for Supabase Auth Integration
-- Run this in Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON usuarios;
DROP POLICY IF EXISTS "Users can view own businesses" ON negocios;
DROP POLICY IF EXISTS "Users can manage own businesses" ON negocios;

-- Create comprehensive RLS policies for usuarios table
CREATE POLICY "Users can insert own profile" ON usuarios 
    FOR INSERT 
    WITH CHECK (auth.uid()::text = id_usuario::text);

CREATE POLICY "Users can view own profile" ON usuarios 
    FOR SELECT 
    USING (auth.uid()::text = id_usuario::text);

CREATE POLICY "Users can update own profile" ON usuarios 
    FOR UPDATE 
    USING (auth.uid()::text = id_usuario::text)
    WITH CHECK (auth.uid()::text = id_usuario::text);

-- Create comprehensive RLS policies for negocios table
CREATE POLICY "Users can insert own business" ON negocios 
    FOR INSERT 
    WITH CHECK (auth.uid()::text = id_usuario::text);

CREATE POLICY "Users can view own businesses" ON negocios 
    FOR SELECT 
    USING (auth.uid()::text = id_usuario::text);

CREATE POLICY "Users can update own businesses" ON negocios 
    FOR UPDATE 
    USING (auth.uid()::text = id_usuario::text)
    WITH CHECK (auth.uid()::text = id_usuario::text);

CREATE POLICY "Users can delete own businesses" ON negocios 
    FOR DELETE 
    USING (auth.uid()::text = id_usuario::text);

-- Update other tables that reference business (they should inherit permissions)
-- Tema table
DROP POLICY IF EXISTS "Users can manage tema" ON tema;
CREATE POLICY "Users can manage tema" ON tema 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = tema.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = tema.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    );

-- Marca table  
DROP POLICY IF EXISTS "Users can manage marca" ON marca;
CREATE POLICY "Users can manage marca" ON marca 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = marca.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = marca.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    );

-- Configuracion_visual table
DROP POLICY IF EXISTS "Users can manage config visual" ON configuracion_visual;
CREATE POLICY "Users can manage config visual" ON configuracion_visual 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = configuracion_visual.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = configuracion_visual.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    );

-- Categorias table
DROP POLICY IF EXISTS "Users can manage categorias" ON categorias;
CREATE POLICY "Users can manage categorias" ON categorias 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = categorias.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = categorias.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    );

-- Productos table
DROP POLICY IF EXISTS "Users can manage productos" ON productos;
CREATE POLICY "Users can manage productos" ON productos 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = productos.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = productos.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    );

-- Enable RLS on remaining tables and add policies
ALTER TABLE variantes_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage variantes config" ON variantes_config 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = variantes_config.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = variantes_config.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    );

ALTER TABLE reglas_negocio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage reglas negocio" ON reglas_negocio 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = reglas_negocio.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = reglas_negocio.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    );

ALTER TABLE agentes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage agentes" ON agentes 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = agentes.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = agentes.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    );

ALTER TABLE config_comercial ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage config comercial" ON config_comercial 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = config_comercial.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = config_comercial.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    );

ALTER TABLE automatizaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage automatizaciones" ON automatizaciones 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = automatizaciones.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM negocios 
            WHERE negocios.id_negocio = automatizaciones.id_negocio 
            AND negocios.id_usuario::text = auth.uid()::text
        )
    );