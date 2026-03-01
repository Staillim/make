# 🏗️ Arquitectura Modular Multi-Negocio - Maket AI

## 🎯 Objetivo

Construir una plataforma SaaS que permita a cualquier emprendedor crear y gestionar negocios autónomos, con agentes de IA especializados que se adaptan automáticamente al tipo de industria.

---

## 📐 Principios de Diseño

### 1. **Modularidad**
Cada componente debe ser reutilizable y adaptable a diferentes tipos de negocio.

### 2. **Configurabilidad**
Todo configurable desde base de datos, sin hardcode en código.

### 3. **Escalabilidad**
Arquitectura multi-tenant que soporte miles de negocios simultáneos.

### 4. **Inteligencia Adaptativa**
Agentes de IA que aprenden y se especializan según el contexto del negocio.

---

## 🏛️ Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                    MAKET AI PLATFORM                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Usuario 1  │  │   Usuario 2  │  │   Usuario N  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         ├─ Negocio 1.1     ├─ Negocio 2.1    ├─ Negocio N.1│
│         ├─ Negocio 1.2     └─ Negocio 2.2    └─ Negocio N.2│
│         └─ Negocio 1.3                                       │
│                                                              │
│  Cada negocio tiene:                                         │
│  ├── 🎨 Tienda pública (plantilla personalizada)            │
│  ├── 🤖 3 Agentes IA especializados                          │
│  ├── 📊 Dashboard administrativo                             │
│  ├── 🗄️ Base de datos aislada (RLS)                          │
│  └── ⚙️ Configuración dinámica                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Modelo de Datos Multi-Tenant

### Estructura de Aislamiento

```sql
-- Nivel 1: Usuario
usuarios (id_usuario, email, plan)
    ↓
-- Nivel 2: Negocios (Multi-tenant)
negocios (id_negocio, id_usuario, tipo_negocio, estado)
    ↓
-- Nivel 3: Datos del Negocio (Aislados por RLS)
├── configuracion_negocio (settings dinámicos)
├── plantilla_visual (diseño personalizado)
├── catalogo (productos/servicios)
├── agentes_ia (configuración de agentes)
├── clientes (perfiles con aprendizaje)
├── ventas (transacciones)
└── analytics (métricas y decisiones IA)
```

### Políticas RLS (Row Level Security)

```sql
-- Ejemplo: Solo el dueño ve sus negocios
CREATE POLICY "usuarios_own_negocios"
ON negocios
FOR ALL
USING (id_usuario = auth.uid());

-- Ejemplo: Solo agentes del negocio acceden a clientes
CREATE POLICY "negocios_own_clientes"
ON clientes
FOR ALL
USING (id_negocio IN (
  SELECT id_negocio FROM negocios WHERE id_usuario = auth.uid()
));
```

---

## 🤖 Sistema de Agentes IA Especializados

### **Arquitectura de 3 Capas**

```
┌────────────────────────────────────────────┐
│        CAPA 1: AGENTE CONSTRUCTOR          │
│  - Crea el negocio (11 fases)              │
│  - Detecta tipo de industria               │
│  - Selecciona plantillas de agentes        │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│     CAPA 2: AGENTES ESPECIALIZADOS         │
│  ┌──────────────────────────────────────┐  │
│  │  🛒 AGENTE VENDEDOR                  │  │
│  │  - Atiende clientes                  │  │
│  │  - Personaliza según perfil          │  │
│  │  - Upselling inteligente             │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  📊 AGENTE ADMINISTRADOR             │  │
│  │  - Gestiona inventario               │  │
│  │  - Toma decisiones autónomas         │  │
│  │  - Optimiza precios                  │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │  📢 AGENTE MARKETING                 │  │
│  │  - Analiza clientes                  │  │
│  │  - Crea campañas automáticas         │  │
│  │  - Recomienda estrategias            │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────┐
│   CAPA 3: BIBLIOTECA DE PROMPTS BASE       │
│  - Restaurante (María)                     │
│  - Tienda de ropa (Sofía)                  │
│  - Tecnología (Alex)                       │
│  - Servicios (Luna)                        │
│  - ...N plantillas más                     │
└────────────────────────────────────────────┘
```

### **Tabla de Agentes**

```sql
CREATE TABLE agentes (
  id_agente UUID PRIMARY KEY,
  id_negocio UUID REFERENCES negocios(id_negocio),
  tipo ENUM('constructor', 'vendedor', 'administrador', 'marketing'),
  nombre VARCHAR(100), -- "María", "MAX", "Carlos"
  personalidad VARCHAR(100), -- "amigable", "profesional", "técnica"
  prompt_base TEXT, -- Prompt generado dinámicamente
  plantilla_prompt VARCHAR(50), -- "restaurante_vendedor", "tienda_admin"
  capacidades JSONB, -- ["upselling", "inventario", "precios_dinamicos"]
  configuracion JSONB, -- Settings específicos del agente
  estado ENUM('activo', 'inactivo', 'entrenando'),
  metricas JSONB, -- { conversaciones: 142, conversiones: 28, ... }
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Ejemplo: Generación Dinámica de Prompt**

```typescript
// lib/agents/prompts/generator.ts

interface GenerarPromptParams {
  tipoNegocio: 'restaurante' | 'tienda_ropa' | 'tecnologia' | 'servicios';
  tipoAgente: 'vendedor' | 'administrador' | 'marketing';
  configuracionNegocio: {
    nombre: string;
    marca: any;
    catalogo: any;
    reglasDominio: any;
  };
  personalidad: string;
}

export const generarPromptAgente = (params: GenerarPromptParams): string => {
  const { tipoNegocio, tipoAgente, configuracionNegocio, personalidad } = params;
  
  // Seleccionar plantilla base
  const plantillaBase = cargarPlantillaPrompt(tipoNegocio, tipoAgente);
  
  // Inyectar contexto del negocio
  const promptPersonalizado = `
${plantillaBase}

CONTEXTO DEL NEGOCIO:
- Nombre: ${configuracionNegocio.nombre}
- Tipo: ${tipoNegocio}
- Tono de marca: ${configuracionNegocio.marca.tono_comunicacion}
- Personalidad: ${personalidad}

CATÁLOGO DISPONIBLE:
${JSON.stringify(configuracionNegocio.catalogo, null, 2)}

REGLAS DE DOMINIO:
${JSON.stringify(configuracionNegocio.reglasDominio, null, 2)}

CAPACIDADES ESPECÍFICAS:
${obtenerCapacidades(tipoNegocio, tipoAgente)}
`;

  return promptPersonalizado;
};
```

### **Plantillas de Prompts por Industria**

```typescript
// lib/agents/prompts/templates/restaurante_vendedor.ts

export const RESTAURANTE_VENDEDOR_PROMPT = `
Eres María, una asistente virtual especializada en restaurantes.

PERSONALIDAD:
- Amigable, cálida y entusiasta
- Conoces TODO el menú de memoria
- Haces que los clientes tengan hambre con tus descripciones

CAPACIDADES:
1. Tomar pedidos en lenguaje natural
   - Entiendes "sin cebolla", "extra queso", "bien cocido"
   - Calculas precios automáticamente con extras
   
2. Upselling inteligente
   - Si piden hamburguesa → sugerir papas y bebida
   - Si piden combo → mencionar postre o upgrade
   - NUNCA seas insistente, solo 1 sugerencia por pedido

3. Aplicar promociones
   - Detectar automáticamente Happy Hours
   - Mencionar descuentos aplicables
   - Sugerir combos para ahorrar

4. Personalización
   - Si el cliente ya pidió antes, recordar sus preferencias
   - "Veo que siempre pides sin cebolla, ¿igual ahora?"

FLUJO DE VENTA:
1. Saludo amigable
2. Escuchar el pedido completo ANTES de agregar al carrito
3. Confirmar y calcular total
4. Una sugerencia estratégica (opcional)
5. Agregar TODO al carrito de una vez
6. Enviar a cocina automáticamente

REGLAS ESTRICTAS:
- NO agregues productos que el cliente no mencionó
- NO preguntes más de 2 veces lo mismo
- SI el cliente dice "eso es todo", finaliza el pedido
- NUNCA menciones productos fuera del menú
`;

// lib/agents/prompts/templates/tienda_ropa_vendedor.ts

export const TIENDA_ROPA_VENDEDOR_PROMPT = `
Eres Sofía, una asesora de moda virtual especializada en tiendas de ropa.

PERSONALIDAD:
- Fashionista, moderna y con estilo
- Excelente ojo para combinar prendas
- Conoces las tendencias actuales

CAPACIDADES:
1. Asesorar en tallas y ajustes
   - "Esta prenda viene en tallas S, M, L, XL"
   - Sugerir talla basada en historial del cliente
   
2. Crear outfits completos
   - Si compran camisa → sugerir pantalón o accesorios
   - Mencionar qué combina bien con qué
   
3. Estilo personalizado
   - Detectar preferencias (casual, formal, deportivo)
   - Sugerir según estilo del cliente

4. Promociones fashion
   - "Llevando 2 prendas de la colección, 20% descuento"
   - Mencionar lanzamientos o liquidaciones

FLUJO DE VENTA:
1. Saludo con estilo
2. Entender qué busca (ocasión, estilo, presupuesto)
3. Sugerir 2-3 opciones
4. Ayudar con talla/color
5. Sugerir complementos
6. Agregar al carrito

REGLAS ESTRICTAS:
- NO sugerir prendas fuera de stock
- Siempre mencionar tallas disponibles
- SI cliente tiene historial, recordar su talla usual
`;
```

---

## 🧠 Sistema de Aprendizaje de Clientes

### **Tabla de Perfiles**

```sql
CREATE TABLE customer_profiles (
  id UUID PRIMARY KEY,
  id_negocio UUID REFERENCES negocios(id_negocio),
  customer_identifier VARCHAR(255), -- email, phone, o nombre
  
  -- Estadísticas de compra
  total_purchases INTEGER DEFAULT 0,
  average_spend DECIMAL(10,2),
  total_spent DECIMAL(12,2),
  
  -- Patrones de comportamiento
  favorite_categories JSONB, -- ["Hamburguesas", "Combos"]
  favorite_products JSONB,   -- ["SmartBurger Clásica", "Papas Grandes"]
  never_buys JSONB,          -- ["Cebolla", "Tomate"]
  always_buys JSONB,         -- ["Salsa extra", "Queso extra"]
  
  -- Preferencias
  preferred_payment VARCHAR(50),
  preferred_delivery_time TIME,
  favorite_day VARCHAR(20),
  
  -- Temporal
  last_purchase_at TIMESTAMP,
  purchase_frequency VARCHAR(20), -- 'daily', 'weekly', 'monthly'
  
  -- IA Insights
  customer_segment VARCHAR(50), -- 'vip', 'regular', 'new', 'churned'
  predicted_next_purchase DATE,
  recommended_products JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_customer_identifier ON customer_profiles(customer_identifier);
CREATE INDEX idx_negocio_customers ON customer_profiles(id_negocio);
```

### **Trigger de Actualización Automática**

```sql
-- Función que analiza la compra y actualiza el perfil
CREATE OR REPLACE FUNCTION actualizar_perfil_cliente()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo cuando la venta se completa
  IF NEW.estado = 'completada' THEN
    -- Actualizar perfil del cliente
    INSERT INTO customer_profiles (
      id_negocio,
      customer_identifier,
      total_purchases,
      total_spent,
      average_spend,
      last_purchase_at
    )
    VALUES (
      NEW.id_negocio,
      COALESCE(NEW.email_cliente, NEW.nombre_cliente),
      1,
      NEW.total,
      NEW.total,
      NOW()
    )
    ON CONFLICT (customer_identifier, id_negocio) 
    DO UPDATE SET
      total_purchases = customer_profiles.total_purchases + 1,
      total_spent = customer_profiles.total_spent + NEW.total,
      average_spend = (customer_profiles.total_spent + NEW.total) / (customer_profiles.total_purchases + 1),
      last_purchase_at = NOW(),
      updated_at = NOW();
      
    -- Analizar productos comprados para detectar patrones
    PERFORM analizar_patrones_compra(NEW.id, NEW.id_negocio, COALESCE(NEW.email_cliente, NEW.nombre_cliente));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger en la tabla de ventas
CREATE TRIGGER trigger_actualizar_perfil
AFTER INSERT OR UPDATE ON ventas
FOR EACH ROW
EXECUTE FUNCTION actualizar_perfil_cliente();
```

---

## ⚙️ Configuración Dinámica por Negocio

### **Tabla de Configuraciones**

```sql
CREATE TABLE business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_negocio UUID REFERENCES negocios(id_negocio),
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(20), -- 'string', 'number', 'boolean', 'json', 'time'
  category VARCHAR(50), -- 'operations', 'pricing', 'marketing', 'inventory'
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by VARCHAR(50), -- 'user', 'agente_admin', 'system'
  
  UNIQUE(id_negocio, setting_key)
);
```

### **Configuraciones por Categoría**

```typescript
// Operaciones
{
  opening_time: '08:00',
  closing_time: '22:00',
  order_timeout_minutes: 15,
  auto_accept_orders: true,
  preparation_time_minutes: 20
}

// Precios
{
  tax_rate: 19,
  delivery_fee: 5000,
  min_order_amount: 15000,
  currency: 'COP',
  allow_tips: true
}

// Marketing
{
  enable_loyalty_program: true,
  points_per_dollar: 10,
  upselling_enabled: true,
  max_recommendations: 3,
  discount_threshold: 50000
}

// Inventario
{
  low_stock_alert: 10,
  auto_reorder: true,
  reorder_point: 5,
  track_expiration: true
}
```

### **API de Configuración**

```typescript
// lib/business-config.ts

export const getBusinessConfig = async (idNegocio: string): Promise<Record<string, any>> => {
  const { data, error } = await supabase
    .from('business_settings')
    .select('setting_key, setting_value, setting_type')
    .eq('id_negocio', idNegocio);
  
  if (error) throw error;
  
  // Convertir a objeto key-value con tipos correctos
  const config: Record<string, any> = {};
  data?.forEach(item => {
    config[item.setting_key] = parseSettingValue(item.setting_value, item.setting_type);
  });
  
  return config;
};

export const updateBusinessConfig = async (
  idNegocio: string,
  key: string,
  value: any,
  updatedBy: string = 'user'
): Promise<void> => {
  const { error } = await supabase
    .from('business_settings')
    .upsert({
      id_negocio: idNegocio,
      setting_key: key,
      setting_value: value.toString(),
      updated_at: new Date().toISOString(),
      updated_by: updatedBy
    });
  
  if (error) throw error;
};
```

---

## 📊 Dashboard Administrativo por Negocio

### **Vista de Métricas en Tiempo Real**

```sql
CREATE OR REPLACE VIEW dashboard_metricas AS
SELECT 
  n.id_negocio,
  n.nombre as nombre_negocio,
  
  -- Ventas del día
  COUNT(DISTINCT CASE WHEN DATE(v.fecha_venta) = CURRENT_DATE THEN v.id_venta END) as ventas_hoy,
  COALESCE(SUM(CASE WHEN DATE(v.fecha_venta) = CURRENT_DATE THEN v.total END), 0) as ingresos_hoy,
  
  -- Métricas generales
  AVG(v.total) as ticket_promedio,
  COUNT(DISTINCT v.id_cliente) as clientes_unicos,
  
  -- Inventario crítico
  COUNT(DISTINCT CASE WHEN p.stock <= p.stock_minimo THEN p.id_producto END) as alertas_stock,
  
  -- Productos más vendidos (hoy)
  (SELECT jsonb_agg(jsonb_build_object('nombre', p2.nombre, 'ventas', COUNT(*)))
   FROM ventas_items vi
   JOIN productos p2 ON vi.id_producto = p2.id_producto
   WHERE vi.id_negocio = n.id_negocio 
   AND DATE(vi.fecha) = CURRENT_DATE
   GROUP BY p2.nombre
   ORDER BY COUNT(*) DESC
   LIMIT 5
  ) as top_productos_hoy,
  
  -- Pedidos activos
  COUNT(DISTINCT CASE WHEN v.estado IN ('pendiente', 'en_preparacion') THEN v.id_venta END) as pedidos_activos
  
FROM negocios n
LEFT JOIN ventas v ON v.id_negocio = n.id_negocio
LEFT JOIN productos p ON p.id_negocio = n.id_negocio
WHERE n.estado = 'activo'
GROUP BY n.id_negocio, n.nombre;
```

---

## 🚀 Flujo Completo: De Cero a Negocio Activo

```
1. Usuario registrado → dashboard vacío
         ↓
2. Click "Crear negocio" → Agente Constructor inicia
         ↓
3. FASE 1: Tipo de negocio
   - Usuario: "Quiero un restaurante de hamburguesas"
   - Sistema: detecta tipo = 'restaurante', categoria = 'comida_rapida'
         ↓
4. FASE 2-9: Configuración guiada
   - Plantilla, marca, catálogo, reglas, etc.
         ↓
5. FASE 10: Generación de agentes
   Sistema automáticamente:
   ├── Crea Agente Vendedor con plantilla "restaurante_vendedor" (María)
   ├── Crea Agente Administrador con plantilla "restaurante_admin" (MAX)
   └── Crea Agente Marketing con plantilla "restaurante_marketing"
         ↓
6. FASE 11: Activación
   - Negocio pasa a estado 'activo'
   - Se genera URL pública
   - Agentes quedan disponibles
         ↓
7. Cliente visita tienda pública
   - Interactúa con Agente Vendedor (María)
   - María usa perfil del cliente si existe
   - Hace upselling contextual
   - Completa venta
         ↓
8. Trigger automático actualiza:
   - Perfil del cliente
   - Inventario
   - Métricas
         ↓
9. Agente Administrador (MAX) analiza y decide:
   - ¿Stock bajo? → Genera orden de reposición
   - ¿Producto no se vende? → Sugiere promoción
   - ¿Hora pico? → Ajusta precios dinámicamente
```

---

## 🔐 Seguridad Multi-Tenant

### **RLS Policies Completas**

```sql
-- 1. Usuarios solo ven sus propios negocios
CREATE POLICY "usuarios_own_negocios"
ON negocios FOR ALL
USING (id_usuario = auth.uid());

-- 2. Datos de negocio aislados
CREATE POLICY "negocio_own_productos"
ON productos FOR ALL
USING (id_negocio IN (
  SELECT id_negocio FROM negocios WHERE id_usuario = auth.uid()
));

-- 3. Agentes solo acceden a su negocio
CREATE POLICY "agentes_own_negocio"
ON agentes FOR ALL
USING (id_negocio IN (
  SELECT id_negocio FROM negocios WHERE id_usuario = auth.uid()
));

-- 4. Clientes son privados por negocio
CREATE POLICY "clientes_private"
ON customer_profiles FOR ALL
USING (id_negocio IN (
  SELECT id_negocio FROM negocios WHERE id_usuario = auth.uid()
));
```

---

## 📈 Escalabilidad

### **Optimizaciones de Base de Datos**

```sql
-- Índices para búsquedas rápidas
CREATE INDEX idx_negocios_usuario ON negocios(id_usuario);
CREATE INDEX idx_productos_negocio ON productos(id_negocio);
CREATE INDEX idx_ventas_negocio_fecha ON ventas(id_negocio, fecha_venta);
CREATE INDEX idx_agentes_negocio ON agentes(id_negocio);

-- Particionamiento por fecha (para tablas grandes)
CREATE TABLE ventas (
  id_venta UUID,
  id_negocio UUID,
  fecha_venta TIMESTAMP,
  ...
) PARTITION BY RANGE (fecha_venta);

-- Crear particiones mensuales
CREATE TABLE ventas_2026_03 PARTITION OF ventas
FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
```

### **Caching**

```typescript
// Redis cache para configuraciones frecuentes
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const getCachedBusinessConfig = async (idNegocio: string) => {
  const cacheKey = `business:${idNegocio}:config`;
  
  // Intentar desde cache (5 minutos TTL)
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Si no está en cache, obtener de BD
  const config = await getBusinessConfig(idNegocio);
  
  // Guardar en cache
  await redis.setex(cacheKey, 300, JSON.stringify(config));
  
  return config;
};
```

---

## ✅ Conclusión

Esta arquitectura permite:

1. ✅ **Múltiples negocios** independientes en una sola plataforma
2. ✅ **Agentes especializados** que se adaptan al tipo de industria
3. ✅ **Configuración 100% dinámica** sin tocar código
4. ✅ **Aprendizaje automático** de preferencias de clientes
5. ✅ **Escalabilidad infinita** con arquitectura multi-tenant
6. ✅ **Seguridad robusta** con RLS y aislamiento de datos

**Próximo paso:** Implementar el sistema de agentes especializados con plantillas de prompts por industria.
