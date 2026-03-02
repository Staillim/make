# Agentes Universales - Guía de Uso

## Arquitectura de Agentes

El sistema ahora cuenta con **dos agentes universales** que trabajan en diferentes etapas del ciclo de vida del negocio:

### 1. 🎯 **Orquestador** - Constructor de Negocios
**Rol:** Consultor y arquitecto de soluciones  
**Fase:** Construcción inicial del negocio  
**Endpoint:** `/api/constructor/orquestador`

### 2. 🎛️ **Administrador** - Gerente General
**Rol:** Gestión operativa completa  
**Fase:** Post-construcción, operación diaria  
**Endpoint:** `/api/administrador`

---

## 🎯 ORQUESTADOR

### Objetivo
Ayudar al dueño del negocio a **definir y estructurar** su idea desde cero mediante conversación guiada.

### Capacidades

#### 1. Descubrimiento Progresivo (7 Fases)
```
Fase 1: Descubrimiento Inicial
  ↓ Tipo de negocio, público objetivo, modelo
  
Fase 2: Definición de Oferta
  ↓ Productos/servicios, categorías, precios
  
Fase 3: Identidad de Marca
  ↓ Colores, logo, tono, referencias visuales
  
Fase 4: Operaciones y Logística
  ↓ Delivery, horarios, zona, pagos
  
Fase 5: Inventario y Base de Datos
  ↓ Estructura adaptativa según industria
  
Fase 6: Casos de Uso y Funcionalidad
  ↓ Features prioritarios, integraciones
  
Fase 7: Validación y Resumen
  ↓ JSON completo para crear el negocio
```

#### 2. Recopilación de Referencias Visuales
- URLs de imágenes de productos
- Tableros de Pinterest/Instagram de inspiración
- Descripciones para generación con IA
- Referencias de negocios similares

#### 3. Estructuración de Inventario Adaptativo
El Orquestador diseña la estructura de BD según el tipo de negocio:

**Restaurante:**
```json
{
  "campos": ["ingredientes", "tiempo_preparacion", "alergenos", "calorias"],
  "relaciones": ["productos_ingredientes", "pedidos"]
}
```

**Tienda de Ropa:**
```json
{
  "campos": ["talla", "color", "material", "genero"],
  "relaciones": ["variantes", "colecciones"],
  "variantes": true
}
```

**Tecnología:**
```json
{
  "campos": ["marca", "modelo", "garantia_meses"],
  "relaciones": ["especificaciones"],
  "specs": ["ram", "almacenamiento", "procesador"]
}
```

**Servicios:**
```json
{
  "campos": ["duracion_mins", "profesional", "disponibilidad"],
  "relaciones": ["citas", "profesionales"]
}
```

#### 4. Salida: Especificación JSON Completa
```json
{
  "negocio": {
    "nombre": "Burger House",
    "tipo_industria": "restaurante",
    "descripcion": "Hamburguesas gourmet con ingredientes premium",
    "publico_objetivo": "Jóvenes 18-35 años, clase media-alta",
    "propuesta_valor": "Calidad premium a precio justo con delivery 30 mins"
  },
  "identidad_marca": {
    "palabras_clave": ["moderno", "premium", "rápido"],
    "colores": ["#FF6B6B", "#4ECDC4"],
    "tono_comunicacion": "casual_amigable"
  },
  "productos": [
    {
      "nombre": "Hamburguesa Clásica",
      "descripcion": "Doble carne 100% res, queso, lechuga, tomate en pan brioche",
      "precio": 89,
      "categoria": "Hamburguesas",
      "imagen_url": "https://...",
      "tiempo_preparacion": 15
    }
  ],
  "categorias": ["Hamburguesas", "Bebidas", "Postres", "Extras"],
  "inventario": {
    "necesita_variantes": true,
    "tracking_stock": true,
    "control_proveedores": false,
    "campos_adicionales": ["ingredientes", "tiempo_preparacion", "alergenos"]
  },
  "operaciones": {
    "modelo": "hibrido",
    "delivery": true,
    "pickup": true,
    "horarios": "Lun-Dom 10:00-22:00",
    "zona_cobertura": "Ciudad de México (Zona Centro)",
    "metodos_pago": ["efectivo", "tarjeta", "transferencia"]
  },
  "funcionalidades_requeridas": [
    "catalogo_online",
    "carrito_compras",
    "tracking_pedidos",
    "sistema_inventario",
    "reportes_ventas"
  ],
  "referencias_visuales": [
    "https://pinterest.com/board/hamburguesas",
    "https://instagram.com/shakeshack"
  ]
}
```

### Uso del API

**POST /api/constructor/orquestador**

```typescript
// Request
{
  "id_negocio": "uuid-opcional", // Si ya existe
  "mensaje": "Quiero crear un negocio de hamburguesas",
  "historial_mensajes": [], // Conversaciones previas
  "negocio_parcial": null, // Info ya recopilada
  "fase_actual": "descubrimiento"
}

// Response
{
  "respuesta": "¡Excelente! Hamburguesas es un negocio con gran potencial...",
  "modelo_usado": "gemini-1.5-flash",
  "provider": "gemini",
  "fase_actual": "descubrimiento",
  "informacion_extraida": {
    "tipo_negocio": "restaurante",
    "productos_mencionados": ["hamburguesas"],
    "modelo_negocio": "local"
  },
  "timestamp": "2026-03-01T..."
}
```

**GET /api/constructor/orquestador?id_negocio=uuid**
Obtiene el progreso actual de construcción.

### Tabla: construccion_progreso
```sql
CREATE TABLE construccion_progreso (
  id UUID PRIMARY KEY,
  id_negocio UUID REFERENCES negocios(id),
  fase_actual TEXT, -- descubrimiento, productos, identidad, etc.
  negocio_parcial JSONB, -- Info recopilada
  historial_mensajes JSONB, -- Conversación completa
  ultima_actualizacion TIMESTAMPTZ
);
```

---

## 🎛️ ADMINISTRADOR

### Objetivo
Gestionar **todos los aspectos operativos** del negocio una vez creado.

### Capacidades

#### 1. Gestión de Inventario 📦

**Agregar Producto:**
```typescript
Administrador: "Claro, vamos a agregar un nuevo producto. Necesito:
- Nombre del producto
- Descripción corta
- Precio de venta
- Categoría
- ¿Tienes imagen? (URL o descripción)
- Stock inicial
- ¿Tiene variantes? (tallas, colores, etc.)"
```

**Control de Stock:**
```
🟢 Stock alto: >50 unidades
🟡 Stock medio: 20-50 unidades
🔴 Stock bajo: <20 unidades (reordenar)
⚫ Agotado: 0 unidades

Alertas automáticas cuando stock < umbral
```

#### 2. Gestión de Imágenes 📸

**3 Opciones de Obtención:**
1. **Subir propias** - URL de Drive/Dropbox
2. **Bancos gratuitos** - Unsplash, Pexels
3. **Generar con IA** - Descripción detallada

**Organización:**
```
📁 Productos/
  📁 Hamburguesas/
    - hamburguesa-clasica-1.jpg (principal)
    - hamburguesa-clasica-2.jpg (detalle)
  📁 Bebidas/
  📁 Postres/
📁 Logo/
📁 Banner/
```

**Mejores Prácticas:**
- Fondo blanco o neutro
- Alta resolución (min 1000x1000px)
- Consistencia visual
- Múltiples ángulos (3-5 fotos)
- Optimización web

#### 3. Estructura de BD Adaptativa 🗄️

El Administrador crea/modifica la BD según industria:

**Ejemplo: Restaurante**
```sql
-- Productos
ALTER TABLE productos ADD COLUMN tiempo_preparacion INT;
ALTER TABLE productos ADD COLUMN ingredientes TEXT[];
ALTER TABLE productos ADD COLUMN alergenos TEXT[];

-- Pedidos
CREATE TABLE pedidos (
  id UUID PRIMARY KEY,
  tipo TEXT, -- delivery/pickup
  estado TEXT, -- pendiente/listo/entregado
  tiempo_entrega_estimado INT
);
```

**Ejemplo: Tienda Ropa**
```sql
-- Variantes
CREATE TABLE variantes (
  id_producto UUID REFERENCES productos(id),
  color TEXT,
  talla TEXT,
  sku TEXT,
  stock INT,
  precio_ajustado NUMERIC
);
```

#### 4. Reportes y Análisis 📊

**Dashboard Automático:**
```
📊 RESUMEN GENERAL
💰 Ventas Hoy: $2,450
📦 Productos: 87 activos | 5 agotados
👥 Clientes: 23 pedidos | 18 nuevos
⭐ Rating: 4.8/5 (52 reseñas)

🔥 TOP 5 PRODUCTOS
1. Hamburguesa Clásica (34 vendidas) - $2,006
2. Papas Fritas (28 vendidas) - $420

⚠️ ALERTAS DE INVENTARIO
- Pan hamburguesa: 12 unidades (reabastecer)
- Queso amarillo: 8 unidades (reabastecer)

📈 TENDENCIAS
- Horario pico: 2pm-4pm, 8pm-10pm
- Día más fuerte: Sábado
- Categoría top: Hamburguesas (65%)
```

**Reportes Personalizados:**
- Ventas por período
- Productos más vendidos
- Análisis de inventario
- Clientes frecuentes
- Horarios de demanda
- Margen por producto
- Forecast de stock

#### 5. Publicación y Deployment 🚀

**Gestión de Landing:**
```
🌐 https://tu-negocio.maket.ai

Editable:
✏️ Info del negocio
✏️ Banner principal
✏️ Sección 'Acerca de'
✏️ Galería de productos
✏️ Contacto y redes sociales
✏️ Colores y fuentes

Opciones:
1. Editar contenido
2. Activar/desactivar secciones
3. Cambiar orden
4. Personalizar diseño
5. Dominio propio
```

**Proceso de Publicación:**
```
✅ Negocio configurado
✅ Productos agregados (15)
✅ Imágenes subidas
⏳ Revisar landing
⬜ Publicar
⬜ Compartir enlace
```

#### 6. Edición de BD Segura 🛠️

**Operaciones:**
- Agregar campos a tablas
- Modificar estructura
- Limpiar datos duplicados
- Migrar información
- Importar desde Excel/CSV
- Exportar respaldos

⚠️ **Siempre hace backup antes de cambios grandes**

#### 7. Recomendaciones Inteligentes 🧠

Basado en datos del negocio:

```
📈 OPORTUNIDADES:
- 'Hamburguesa BBQ' tiene alta demanda pero baja disponibilidad
  → Aumenta stock de ingredientes

- Clientes que compran hamburguesa casi siempre piden bebida
  → Crea combo con descuento

💡 NUEVAS IDEAS:
- Producto sugerido: 'Hamburguesa Kids'
- Categoría faltante: 'Salsas'
- Cross-sell: '¿Quieres agregar papas?' (+23% conversion)

🎯 MARKETING:
- Email a clientes inactivos 30+ días
- Promoción para exceso de inventario
- Programa lealtad: 10 compras = 1 gratis
```

### Uso del API

**POST /api/administrador**

```typescript
// Request
{
  "id_negocio": "uuid-requerido",
  "mensaje": "Quiero agregar un nuevo producto",
  "historial_mensajes": [],
  "accion": "agregar_producto", // opcional
  "contexto": {} // info adicional
}

// Response
{
  "respuesta": "Perfecto, vamos a agregar...",
  "modelo_usado": "gemini-1.5-flash",
  "provider": "gemini",
  "accion_ejecutada": {
    "tipo": "producto_agregado",
    "producto": { ... }
  },
  "timestamp": "2026-03-01T..."
}
```

**GET /api/administrador?id_negocio=uuid**
Obtiene dashboard con métricas e insights.

```json
{
  "negocio": {
    "nombre": "Burger House",
    "tipo": "restaurante",
    "estado": "activo"
  },
  "inventario": {
    "total_productos": 25,
    "productos_activos": 23,
    "productos_sin_stock": 2,
    "valor_total_inventario": 15400
  },
  "alertas": [
    {
      "tipo": "stock_bajo",
      "mensaje": "5 productos con stock bajo",
      "productos": [...]
    }
  ],
  "recomendaciones": [...]
}
```

---

## Flujo de Trabajo Completo

### Etapa 1: Construcción (Con Orquestador)
```
1. Usuario: "Quiero crear una tienda de hamburguesas"
2. Orquestador: Hace preguntas progresivas (7 fases)
3. Recopila: Productos, precios, imágenes, referencias
4. Genera: JSON completo de especificación
5. Crea: Negocio en BD con estructura adaptativa
```

### Etapa 2: Operación (Con Administrador)
```
1. Usuario: "Agrega producto 'Hamburguesa Vegana'"
2. Administrador: Solicita info (precio, descripción, imagen)
3. Crea: Entrada en BD, optimiza imagen, activa en catálogo
4. Sugiere: "También podrías crear categoría 'Vegano'"
5. Reporta: "Listo! Ya está visible en tu tienda"
```

### Etapa 3: Optimización (Administrador Proactivo)
```
1. Administrador analiza datos
2. Detecta: Hamburguesa BBQ se agota rápido
3. Sugiere: Aumentar stock o subir precio
4. Identifica: Combo hamburguesa+bebida tiene alta conversión
5. Recomienda: Crear paquete promocional
```

---

## Integraciones

### Con CRM
Ambos agentes pueden acceder a perfiles de clientes:
```typescript
// En conversación
const { perfil } = await obtenerOCrearPerfil(supabase, id_negocio, {
  email: email_cliente
});
```

### Con IA Multi-Provider
Utilizan el ClienteIA unificado:
```typescript
const cliente_ia = crearClienteDesdeEnv(); // Gemini o OpenAI
const respuesta = await cliente_ia.generarRespuesta(mensajes);
```

### Con Analytics
El Administrador genera insights basados en:
- Ventas históricas
- Comportamiento de clientes
- Tendencias de inventario
- Patrones temporales

---

## Configuración

### Variables de Entorno
```env
# API Keys (al menos una)
GEMINI_API_KEY=AIza...
OPENAI_API_KEY=sk-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Migraciones SQL
```bash
# 1. Crear tabla de progreso de construcción
psql < sql/schema-construccion-progreso.sql

# 2. (Opcional) CRM completo
psql < sql/schema-perfiles-clientes.sql
```

---

## Casos de Uso

### Caso 1: Nuevo Emprendedor sin Experiencia
```
Usuario: "Quiero vender algo pero no sé qué"
Orquestador: 
- Descubre habilidades y pasiones
- Propone 3 tipos de negocio posibles
- Guía para elegir el más viable
- Construye paso a paso
```

### Caso 2: Negocio Existente que se Digitaliza
```
Usuario: "Tengo restaurante físico, quiero tienda online"
Orquestador:
- Recopila menú existente
- Fotografía productos
- Define zonas de entrega
- Crea estructura para pedidos online
```

### Caso 3: Expansión de Catálogo
```
Usuario: "Quiero agregar 20 productos nuevos"
Administrador:
- Importa desde Excel/CSV
- Optimiza imágenes automáticamente
- Asigna categorías inteligentes
- Publica en lote
```

### Caso 4: Crisis Operativa
```
Administrador detecta:
- Ingrediente clave agotado
- 5 pedidos pendientes lo necesitan

Administrador ejecuta:
1. Notifica al dueño
2. Marca productos como "temporalmente agotado"
3. Sugiere sustitutos a clientes pendientes
4. Genera orden de compra a proveedor
```

---

## Mejores Prácticas

### Para el Orquestador
✅ Una pregunta a la vez  
✅ Valida progresivamente  
✅ Recopila imágenes temprano  
✅ Estructura BD según industria  
✅ Genera JSON completo al final

### Para el Administrador
✅ Pregunta antes de acciones destructivas  
✅ Explica consecuencias  
✅ Ofrece preview antes de aplicar  
✅ Respalda automáticamente  
✅ Sugiere mejoras proactivamente

---

## Roadmap

### En Desarrollo
- [ ] Integración con Stripe para pagos
- [ ] Sistema de notificaciones push
- [ ] App móvil para administración
- [ ] Generador de QR codes personalizados
- [ ] Sistema de cupones y descuentos

### Planeado
- [ ] WhatsApp Business API integration
- [ ] Análisis predictivo de demanda
- [ ] Recomendaciones de productos con ML
- [ ] Multi-idioma (inglés, portugués)
- [ ] Marketplace multi-vendor

---

## Soporte

**Documentación completa:** `/src/lib/templates/README.md`  
**Ejemplos de uso:** `/examples/`  
**Referencia API:** `/docs/api-reference.md`

**¿Preguntas?** Abre un issue en GitHub.
