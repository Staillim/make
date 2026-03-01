# 🔍 Análisis de 5palos y Aplicación a Maket AI

## 📊 **Resumen del Proyecto 5palos (SmartBurger)**

### ¿Qué es 5palos?
Un **sistema inteligente para restaurante** (hamburguesería) que implementa:
- 🤖 **Chat conversacional con IA** (María) para tomar pedidos
- 🛒 **Sistema de carrito y pedidos** automático
- 📊 **Panel administrativo** con métricas en tiempo real
- 🧠 **IA autónoma (MAX)** que toma decisiones de negocio
- 👤 **Sistema de perfiles** que aprende de cada usuario

---

## ✅ **Características Implementadas en 5palos**

### 1. **Chat Inteligente Personalizado**
- ✅ Asistente "María" entrenado específicamente para hamburguesería
- ✅ Entiende lenguaje natural: "sin cebolla", "doble carne"
- ✅ Calcula precios automáticamente con extras
- ✅ Aplica promociones contextuales (Happy Hour)
- ✅ **Upselling inteligente** (sugiere bebidas, papas)
- ✅ Sistema de fallback si OpenAI falla

**Cómo lo hace:**
```typescript
// Prompt dinámico basado en:
- Tipo de negocio (hamburguesería)
- Productos disponibles (de BD)
- Reglas de dominio (no sugerir pizzas en burger shop)
- Perfil del usuario (sin cebolla, salsa extra)
```

### 2. **Agente Autónomo MAX** (15 funciones)
No solo un chatbot, es un **gerente virtual** que:
- ⚡ **Gestiona inventario**: Detecta stock bajo, ordena reposición
- 💰 **Optimiza precios dinámicamente**: Ajusta según demanda/hora
- 🎯 **Activa/desactiva productos**: Si no hay stock o caducidad cercana
- 📊 **Analiza ventas**: Identifica productos rentables vs no rentables
- 🚨 **Responde emergencias**: Alerta de pedidos atrasados, stock crítico

**Ejemplo real de MAX:**
```
Admin: "MAX, ¿por qué bajaste el precio de las papas?"
MAX: "Detecté 80kg de papas con 3 días para caducar. 
      Activé promoción del 25% para acelerar venta.
      Proyección: vender 70kg en 48hrs vs perder todo."
```

### 3. **Sistema de Perfiles con Aprendizaje**
| Dato que aprende | Cómo lo usa |
|------------------|-------------|
| Promedio de gasto ($15) | Sugiere productos en ese rango |
| Nunca pide: Cebolla | Automáticamente prepara "sin cebolla" |
| Siempre pide: Salsa extra | Lo ofrece proactivamente |
| Hora favorita: 8PM | Sugiere combos de cena |
| Día favorito: Martes | Envía ofertas los martes |

**Trigger automático actualiza perfil:**
```sql
-- Cada vez que una orden se completa
CREATE TRIGGER update_user_profile_after_order
AFTER UPDATE ON orders
WHEN NEW.status = 'completed'
EXECUTE update_behavior_analytics();
```

### 4. **Base de Datos Dinámica**
**9 tablas principales:**
- `products` (productos del menú)
- `ingredients` (ingredientes con stock)
- `orders` + `order_items` (pedidos con customizaciones)
- `promotions` (descuentos configurables)
- `user_profiles` (roles: admin, cocina, cliente)
- `user_behavior_analytics` (perfiles de aprendizaje)
- `restaurant_settings` (configuración dinámica)
- `pricing_rules` (precios por horario/demanda)
- `autonomous_actions` (log de decisiones de MAX)

**Todo configurable desde BD**, sin hardcode en código.

### 5. **Configuración 100% Dinámica**
```typescript
// ❌ ANTES (hardcoded)
const HAPPY_HOUR_START = "15:00";
const MAX_DISCOUNT = 15;

// ✅ AHORA (desde BD)
const config = await getRestaurantSettings();
const happyHour = config.happy_hour_start;
const maxDiscount = config.max_discount_percentage;
```

**MAX puede cambiar la configuración:**
```
Admin: "MAX, cambia el horario de apertura a 8am"
MAX: [ejecuta updateSetting('opening_time', '08:00')]
     "Horario actualizado. Nuevas horas: 8am - 11pm"
```

---

## 🎯 **Lo que 5palos te enseña para Maket AI**

### **Tu Visión Original** ✅ **Ya está en 5palos**

| Tu idea | En 5palos | Aplicable a Maket AI |
|---------|-----------|---------------------|
| Chatbot adaptable a negocios | ✅ María para burgers | ✅ Agente Constructor |
| Entrenamiento específico | ✅ Reglas de dominio | ✅ Fase 6 (reglas) |
| Base de datos dinámica | ✅ 9 tablas + JSONB | ✅ 13 tablas ya diseñadas |
| Múltiples negocios | ❌ Solo 1 restaurante | ✅ Multi-tenant (id_negocio) |
| Escalabilidad | ❌ Monolítico | ✅ Diseñado para N negocios |
| Modularidad | ⚠️ Parcial (plantillas no) | ✅ Sistema de plantillas JSON |

---

## 🔥 **Qué puedes copiar de 5palos a Maket AI**

### 1. **Sistema de Decisiones Autónomas**
```
Agente Constructor (Maket AI) + MAX (5palos) = 
🤖 AGENTES ESPECIALIZADOS POR NEGOCIO

Ejemplo:
- Negocio de ropa → Agente vendedor estilo fashion
- Restaurante → Agente vendedor estilo María (5palos)
- Ferretería → Agente vendedor técnico
```

**Implementación:**
```typescript
// En Maket AI - Fase 7 (configuración agentes)
const promptVendedor = generarPromptVendedor({
  tipoNegocio: "restaurante",
  personalidad: "amigable y hambrienta",
  reglasBase: reglasDominio, // Fase 6
  productosDisponibles: catalogo, // Fase 5
  estrategiaVenta: "upselling + combos", // Como María
});
```

### 2. **Perfiles de Usuario con Aprendizaje**
```sql
-- Agregar a Maket AI
CREATE TABLE customer_profiles (
  id UUID PRIMARY KEY,
  id_negocio UUID REFERENCES negocios(id_negocio),
  customer_identifier VARCHAR(255), -- email o nombre
  average_spend DECIMAL(10,2),
  favorite_categories JSONB, -- ["Camisetas", "Zapatos"]
  never_buys JSONB, -- ["Talla XL", "Color Rojo"]
  always_buys JSONB, -- ["Talla M", "Con envío express"]
  preferred_payment VARCHAR(50),
  last_purchase_at TIMESTAMP,
  purchase_frequency VARCHAR(20), -- weekly, monthly
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Ventaja:**
- El Agente Vendedor puede decir: *"Veo que siempre compras talla M, ¿esta camisa también en M?"*
- Como María en 5palos: *"Veo que siempre pides sin cebolla"*

### 3. **Dashboard con Métricas en Tiempo Real**
```typescript
// Ya tienes estructura en Maket AI, agregar:
CREATE VIEW dashboard_business_metrics AS
SELECT 
  n.id_negocio,
  COUNT(DISTINCT v.id_venta) as ventas_hoy,
  SUM(v.total) as ingresos_hoy,
  AVG(v.total) as ticket_promedio,
  COUNT(DISTINCT p.id_pedido) as pedidos_activos
FROM negocios n
LEFT JOIN ventas v ON v.id_negocio = n.id_negocio 
  AND DATE(v.fecha) = CURRENT_DATE
GROUP BY n.id_negocio;
```

### 4. **Configuración Dinámica por Negocio**
```sql
-- Para Maket AI (multi-tenant)
CREATE TABLE business_settings (
  id UUID PRIMARY KEY,
  id_negocio UUID REFERENCES negocios(id_negocio),
  setting_key VARCHAR(100), -- "opening_time", "max_discount"
  setting_value TEXT,
  setting_type VARCHAR(20), -- 'string', 'number', 'json'
  category VARCHAR(50), -- 'operations', 'pricing', 'marketing'
  updated_at TIMESTAMP,
  updated_by VARCHAR(50) -- 'admin' o 'agente_ia'
);
```

**Ventaja:**
- Cada negocio configura sus propias reglas
- Agente Administrador puede modificar settings
- Sin tocar código, todo desde BD

### 5. **Triggers Automáticos**
```sql
-- Actualizar inventario al vender
CREATE TRIGGER descuento_stock_automatico
AFTER INSERT ON ventas
FOR EACH ROW
EXECUTE FUNCTION descontar_stock_productos();

-- Alertas de stock bajo
CREATE TRIGGER alerta_stock_critico
AFTER UPDATE ON productos
WHEN NEW.stock <= NEW.stock_minimo
EXECUTE FUNCTION enviar_alerta_stock();

-- Actualizar perfil de cliente
CREATE TRIGGER actualizar_perfil_cliente
AFTER INSERT ON ventas
FOR EACH ROW
EXECUTE FUNCTION analizar_comportamiento_cliente();
```

### 6. **Sistema de Recomendaciones Inteligente**
Como el upselling de 5palos, pero genérico:

```typescript
// lib/agents/recomendador.ts
export const getSmartRecommendations = async (
  idNegocio: string,
  carrito: CartItem[],
  perfilCliente?: CustomerProfile
) => {
  // Análisis del contexto
  const tipoNegocio = await getTipoNegocio(idNegocio);
  const reglas = await getReglasRecomendacion(idNegocio);
  
  // Lógica adaptativa
  if (tipoNegocio === 'restaurante') {
    // Lógica tipo María (5palos)
    return recomendar_bebidas_y_acompañamientos(carrito);
  } else if (tipoNegocio === 'tienda_ropa') {
    // Lógica de moda
    return recomendar_accesorios_y_complementos(carrito);
  }
  
  // Fallback genérico
  return recomendar_productos_relacionados(carrito);
};
```

---

## 🚀 **Plan de Evolución: Maket AI Multi-Negocio**

### **Fase 1: Base Multi-Tenant** (Ya tienes)
- ✅ Tabla `negocios` con `id_usuario` + `id_negocio`
- ✅ RLS policies por negocio
- ✅ Sistema de plantillas
- ✅ Agente Constructor (11 fases)

### **Fase 2: Agentes Inteligentes Especializados** (Inspirado en 5palos)
```
Agente Constructor (ya existe)
     ↓
Crea negocio configurable
     ↓
Genera 3 agentes especializados:

1. Agente Vendedor
   - Plantilla: María (5palos) para restaurantes
   - Plantilla: Sofía (fashion) para ropa
   - Plantilla: Alex (técnico) para tecnología
   
2. Agente Administrador
   - Plantilla: MAX (5palos) → decisiones autónomas
   - Dashboard con métricas
   - Alertas automáticas
   
3. Agente Marketing
   - Análisis de clientes (perfiles como 5palos)
   - Campañas automáticas
   - Recomendaciones personalizadas
```

### **Fase 3: Sistema de Aprendizaje** (Como 5palos)
```sql
-- Tabla de aprendizaje por negocio
CREATE TABLE business_analytics (
  id UUID PRIMARY KEY,
  id_negocio UUID REFERENCES negocios(id_negocio),
  
  -- Métricas
  productos_mas_vendidos JSONB,
  horarios_pico JSONB,
  ticket_promedio DECIMAL,
  tasa_conversion DECIMAL,
  
  -- Insights IA
  recomendaciones_ia JSONB,
  acciones_sugeridas JSONB,
  
  updated_at TIMESTAMP
);
```

### **Fase 4: Configuración Dinámica Total** (Como 5palos)
- ❌ Eliminar hardcoded configs
- ✅ Todo desde tabla `business_settings`
- ✅ Agentes pueden modificar configuración
- ✅ Historial de cambios en `autonomous_actions`

### **Fase 5: Plantillas de Agentes por Industria**
```
Crear biblioteca de prompts base:

/lib/agents/prompts/
  ├── vendedor/
  │   ├── restaurante.ts (María de 5palos)
  │   ├── tienda_ropa.ts
  │   ├── tecnologia.ts
  │   └── servicios.ts
  ├── administrador/
  │   ├── inventario_fisico.ts
  │   ├── inventario_digital.ts
  │   └── servicios.ts
  └── marketing/
      ├── retail.ts
      ├── servicios.ts
      └── digital.ts
```

---

## 🎨 **Arquitectura Propuesta: Maket AI Multi-Negocio**

### **Estructura de Datos**
```
USUARIO (1)
    ↓
NEGOCIOS (N) ← Multi-tenant
    ↓
Para cada negocio:
    ├── CONFIGURACIÓN
    │   ├── Tipo de negocio (restaurante, tienda, etc.)
    │   ├── Plantilla visual
    │   ├── Marca e identidad
    │   └── Settings dinámicos (como 5palos)
    │
    ├── CATÁLOGO
    │   ├── Productos/servicios
    │   ├── Categorías
    │   └── Inventario (con triggers como 5palos)
    │
    ├── AGENTES IA (3 por negocio)
    │   ├── Vendedor (prompt específico del tipo)
    │   ├── Administrador (decisiones autónomas)
    │   └── Marketing (perfiles + campañas)
    │
    ├── CLIENTES
    │   ├── Perfiles con aprendizaje (como 5palos)
    │   ├── Historial de compras
    │   └── Preferencias detectadas
    │
    └── ANALYTICS
        ├── Métricas en tiempo real
        ├── Decisiones de IA (log)
        └── Insights automáticos
```

### **Flujo de Creación de Negocio**
```
1. Usuario registrado en Maket AI
    ↓
2. Crea negocio → Agente Constructor inicia
    ↓
3. Define tipo: "Restaurante"
    ↓
4. Sistema carga:
    - ✅ Plantilla de tienda para restaurante
    - ✅ Prompt de María (estilo 5palos) para Agente Vendedor
    - ✅ Prompt de MAX para Agente Administrador
    - ✅ Campos de catálogo: productos + ingredientes
    - ✅ Triggers de inventario específicos
    ↓
5. Usuario completa 11 fases
    ↓
6. Negocio activado con 3 agentes funcionando
    ↓
7. Clientes interactúan → Sistema aprende (como 5palos)
```

---

## 💡 **Diferencias Clave: 5palos vs Maket AI**

| Aspecto | 5palos (SmartBurger) | Maket AI |
|---------|----------------------|----------|
| **Scope** | 1 restaurante específico | N negocios de cualquier tipo |
| **Usuarios** | 1 dueño + clientes | N dueños, cada uno con negocios |
| **Agentes IA** | María (vendedor) + MAX (admin) | Constructor + Vendedor + Admin por negocio |
| **Base de datos** | Single-tenant (1 negocio) | Multi-tenant (id_usuario + id_negocio) |
| **Plantillas** | No aplica (diseño fijo) | Sistema de plantillas configurables |
| **Personalización** | Limitada al menú | Total: diseño, agentes, flujos |
| **Escalabilidad** | 1 negocio → 1 deploy | 1 plataforma → N negocios |
| **Deployment** | Vercel (single app) | Netlify (multi-tenant) |

---

## ✅ **Conclusión: Tu Visión es Correcta**

Tu idea de **"startup con enfoque en múltiples negocios"** es exactamente lo que Maket AI ya está diseñado para ser, pero **5palos te muestra cómo implementar la parte de IA adaptable**.

### Lo que ya tienes (de Maket AI):
1. ✅ Arquitectura multi-tenant
2. ✅ Sistema de plantillas
3. ✅ Base de datos escalable
4. ✅ Diseño modular

### Lo que 5palos te aporta:
1. ✅ **Cómo entrenar agentes específicos** (María para burgers)
2. ✅ **Sistema de decisiones autónomas** (MAX)
3. ✅ **Perfiles con aprendizaje** (sin cebolla, salsa extra)
4. ✅ **Configuración 100% dinámica** (sin hardcode)
5. ✅ **Triggers y automatizaciones** reales

### Próximos pasos:
1. Implementar arquitectura de agentes especializados
2. Crear biblioteca de prompts por industria
3. Sistema de perfiles de clientes
4. Dashboard con métricas (como 5palos)
5. Configuración dinámica por negocio

---

**🎯 Tu visión + Arquitectura de Maket AI + Implementaciones de 5palos = Plataforma SaaS Multi-Negocio Definitiva**

¿Quieres que empecemos a implementar alguna de estas características?
