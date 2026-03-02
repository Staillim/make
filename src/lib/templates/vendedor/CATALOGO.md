# Catálogo de Productos en Agentes Vendedores

## 🎯 Problema Resuelto

Los agentes vendedores **DEBEN conocer su inventario** para:
- Responder correctamente qué productos/servicios venden
- No inventar productos que no existen
- Redirigir amablemente cuando les piden algo no disponible

## 📦 Cómo Funciona

Cada prompt de vendedor ahora incluye:

```
## IMPORTANTE: Productos que Vendes
{{PRODUCTOS_CATALOGO}}

**SI TE PIDEN ALGO QUE NO VENDES:**
- Sé honesto: "No tenemos [producto] 😊"
- Ofrece alternativa similar
- NUNCA inventes productos que no existan
```

El placeholder `{{PRODUCTOS_CATALOGO}}` se reemplaza dinámicamente con el inventario real del negocio.

## 🔧 Uso en Código

### 1. Definir tus productos

```typescript
import { Producto } from "@/lib/templates/vendedor";

const productos: Producto[] = [
  {
    id: "1",
    nombre: "Hamburguesa Clásica",
    descripcion: "Carne 100% res, queso, lechuga, tomate",
    precio: 12.99,
    categoria: "Hamburguesas",
    disponible: true
  },
  {
    id: "2",
    nombre: "Pizza Margherita",
    descripcion: "Salsa de tomate, mozzarella, albahaca fresca",
    precio: 15.99,
    categoria: "Pizzas",
    disponible: false // ❌ No disponible
  },
  {
    id: "3",
    nombre: "Coca-Cola 500ml",
    precio: 2.50,
    categoria: "Bebidas",
    disponible: true
  }
];
```

### 2. Obtener prompt con catálogo inyectado

```typescript
import { obtenerPromptConCatalogo } from "@/lib/templates/vendedor";

// Opción 1: Función helper completa
const promptListo = obtenerPromptConCatalogo("restaurante", productos);

// Opción 2: Manual (más control)
import { obtenerTemplateVendedor, inyectarCatalogo } from "@/lib/templates/vendedor";

const template = obtenerTemplateVendedor("restaurante");
const promptListo = inyectarCatalogo(template.prompt, productos);
```

### 3. Usar el prompt con OpenAI

```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: promptListo // ✅ Prompt con catálogo inyectado
    },
    {
      role: "user",
      content: "Hola, ¿tienen pizzas?"
    }
  ]
});
```

## 📝 Formato del Catálogo Inyectado

El agente verá algo como esto:

```markdown
**Tu catálogo de productos/servicios:**

### Hamburguesas
- **Hamburguesa Clásica** - $12.99 ✅
  Carne 100% res, queso, lechuga, tomate

### Pizzas
- **Pizza Margherita** - $15.99 ❌ (NO disponible)
  Salsa de tomate, mozzarella, albahaca fresca

### Bebidas
- **Coca-Cola 500ml** - $2.5 ✅

⚠️ **REGLA CRÍTICA:** Solo puedes ofrecer los productos listados arriba.
```

## 🎭 Ejemplos de Respuestas del Agente

### ✅ Producto Disponible

**Cliente:** "Quiero una hamburguesa"

**María (Restaurante):** "¡Perfecto! Tengo la Hamburguesa Clásica 🍔 que es deliciosa: carne 100% res, queso, lechuga y tomate. Son $12.99. ¿Te la preparo?"

### ❌ Producto NO Disponible (pero existe)

**Cliente:** "¿Tienen pizza Margherita?"

**María:** "Lamentablemente la Pizza Margherita no está disponible hoy 😔 Pero tengo hamburguesas increíbles que te van a encantar. ¿Te animas?"

### 🚫 Producto de Otra Industria

**Cliente:** "Quiero una laptop"

**María (Restaurante):** "Jaja, me encantaría ayudarte pero somos un restaurante, no vendemos laptops 😅 ¿Te provoca una hamburguesa o algo de comer?"

### 🔍 Catálogo Vacío

Si no hay productos cargados, el agente verá:

```
⚠️ **Catálogo vacío** - Debes informar al cliente que aún no tienes productos cargados.
```

Y responderá algo como:

**María:** "Disculpa, aún estamos actualizando nuestro menú 😊 ¿Podrías volver más tarde o dejar tu contacto para avisarte cuando esté listo?"

## 🔄 Integración con Base de Datos

### Ejemplo con Supabase

```typescript
// En tu API route
import { createClient } from "@/lib/supabase";
import { obtenerPromptConCatalogo } from "@/lib/templates/vendedor";

export async function POST(req: Request) {
  const { id_negocio, mensaje } = await req.json();
  
  const supabase = createClient();
  
  // 1. Obtener info del negocio
  const { data: negocio } = await supabase
    .from("negocios")
    .select("industria")
    .eq("id", id_negocio)
    .single();
  
  // 2. Obtener productos del negocio
  const { data: productosDB } = await supabase
    .from("productos")
    .select("*")
    .eq("id_negocio", id_negocio);
  
  // 3. Formatear productos al tipo Producto
  const productos = productosDB.map(p => ({
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    categoria: p.categoria,
    disponible: p.stock > 0
  }));
  
  // 4. Obtener prompt con catálogo
  const systemPrompt = obtenerPromptConCatalogo(
    negocio.industria,
    productos
  );
  
  // 5. Llamar a OpenAI con el prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: mensaje }
    ]
  });
  
  return Response.json({ respuesta: response.choices[0].message.content });
}
```

## 📊 Productos con Variantes

Para productos con tallas, colores, etc.:

```typescript
const productos: Producto[] = [
  {
    id: "camisa-01",
    nombre: "Camisa Oxford",
    precio: 29.99,
    categoria: "Camisas",
    disponible: true,
    variantes: {
      tallas: ["S", "M", "L", "XL"],
      colores: ["Blanco", "Azul", "Negro"],
      tipo: "Manga larga"
    }
  }
];
```

El agente **Sofía (Tienda de Ropa)** verá y podrá mencionar las variantes:

**Cliente:** "¿Tienen camisas?"

**Sofía:** "Sí! Tengo la Camisa Oxford hermosa 👔 en tallas S, M, L y XL. Está disponible en blanco, azul y negro. ¿Qué talla y color prefieres?"

## ⚙️ Configuración Avanzada

### Productos Destacados

Puedes agregar un campo `destacado` para que el agente los mencione primero:

```typescript
{
  id: "1",
  nombre: "Hamburguesa del Chef",
  precio: 18.99,
  categoria: "Especiales",
  disponible: true,
  destacado: true // ⭐ El agente lo mencionará como recomendación
}
```

### Productos Temporales

```typescript
{
  id: "promo-verano",
  nombre: "Combo Verano",
  precio: 25.00,
  categoria: "Promociones",
  disponible: true,
  vigencia: {
    desde: "2026-06-01",
    hasta: "2026-08-31"
  }
}
```

## 🚀 Mejores Prácticas

1. **Actualiza el catálogo en tiempo real**: Cada vez que se crea/edita/elimina un producto, el próximo chat ya lo reflejará
2. **Marca productos agotados**: `disponible: false` en lugar de eliminarlos (el agente puede ofrecer alternativas)
3. **Usa categorías claras**: Facilita que el agente organice las recomendaciones
4. **Precios actualizados**: El agente puede mencionar precios con confianza
5. **Descripciones breves**: 1-2 líneas máximo por producto

## 🔒 Seguridad

- ✅ El agente SOLO puede ofrecer productos en el catálogo
- ✅ No puede inventar precios o productos
- ✅ Si el catálogo está vacío, informa al cliente
- ✅ Respeta el campo `disponible` (no ofrece productos agotados)

## 📚 Tipos TypeScript

```typescript
export interface Producto {
  id: string;                          // Requerido - Identificador único
  nombre: string;                      // Requerido - Nombre del producto
  descripcion?: string;                // Opcional - Descripción breve
  precio?: number;                     // Opcional - Precio en moneda local
  categoria?: string;                  // Opcional - Para agrupar productos
  disponible?: boolean;                // Opcional - Default: true
  variantes?: { [key: string]: any };  // Opcional - Tallas, colores, etc.
}
```

## 🎯 Resultado

Con esta implementación, los agentes vendedores:

✅ Conocen exactamente qué venden  
✅ No inventan productos  
✅ Redirigen amablemente cuando les piden algo no disponible  
✅ Respetan el inventario real del negocio  
✅ Ofrecen alternativas inteligentes  

**Ejemplo real:**

**Cliente:** "Quiero una hamburguesa" (en tienda de tecnología)  
**Alex (Tech):** "Jaja, me encantaría ayudarte pero vendemos tecnología 😅 ¿Buscas algún gadget o dispositivo? Tenemos desde smartphones hasta laptops 💻"

---

## 🤖 Agente Universal vs Agentes Especializados

### Dos Enfoques Disponibles

**1️⃣ Agentes Especializados** (María, Alex, Sofía, etc.)
- ✅ Personalidad rica y memorable
- ✅ Vocabulario ultra-especializado
- ✅ Experiencia de usuario óptima
- ❌ Requiere crear archivo por industria

**2️⃣ Agente Universal** (Nuevo! 🆕)
- ✅ Se adapta a CUALQUIER industria dinámicamente
- ✅ Escalable a infinitas industrias sin código nuevo
- ✅ Personalización via metadata
- ❌ Personalidad ligeramente menos distintiva

### Cuándo Usar Cada Uno

#### Usa Especializado 👥
```typescript
const prompt = obtenerPromptConCatalogo("restaurante", productos);
// → María (mesera experta) con personalidad definida
```

**Mejor para:**
- 5-10 industrias principales bien definidas
- Máxima experiencia de usuario
- Personalidad de marca fuerte

#### Usa Universal 🌐
```typescript
const prompt = obtenerAgenteUniversal({
  industria: "floristeria",
  nombreNegocio: "Flores del Campo",
  tono: "elegante",
  descripcionNegocio: "Flores frescas para toda ocasión"
}, productos);
// → Agente adaptado dinámicamente a floristería
```

**Mejor para:**
- 20+ industrias diferentes
- Industrias no estándar (joyería, mascotas, etc.)
- Experimentación rápida sin crear archivos

#### Usa Estrategia Automática 🎯 (Recomendado)
```typescript
const prompt = obtenerPromptSegunEstrategia("automatico", metadata, productos);
// → Si existe especializado (restaurante, tech, ropa, gym, educación, servicios) → lo usa
// → Si NO existe (floristería, joyería, etc.) → usa universal automáticamente
```

**Mejor para:**
- Obtener lo mejor de ambos mundos
- Sistema que crece orgánicamente
- No preocuparse por qué estrategia usar

### Comparación A/B Testing

Puedes probar ambos enfoques con el mismo negocio:

```typescript
import { obtenerAmbosPromptsParaComparar } from "@/lib/templates/vendedor";

const { especializado, universal } = obtenerAmbosPromptsParaComparar(
  { industria: "restaurante", nombreNegocio: "Burger King" },
  productos
);

// Asignar aleatoriamente a usuarios
const promptFinal = Math.random() < 0.5 ? especializado : universal;

// Trackear métricas para ver cuál convierte mejor
analytics.track('agent_type', { 
  type: promptFinal === especializado ? 'especializado' : 'universal' 
});
```

### Personalización del Agente Universal

El agente universal acepta metadata completa:

```typescript
interface MetadataNegocio {
  industria: string;                    // Tipo de negocio
  nombreNegocio?: string;               // Nombre comercial
  descripcionNegocio?: string;          // Breve descripción
  tono?: "casual" | "profesional" | "juvenil" | "elegante";  // Tono de comunicación
  objetivoVenta?: string;               // Qué quieres lograr
  valorAgregado?: string;               // Tu diferenciador
}
```

**Ejemplo: Mismo negocio, diferentes tonos**

```typescript
// Tono Casual (amigable)
obtenerAgenteUniversal({
  industria: "gimnasio",
  nombreNegocio: "FitZone",
  tono: "casual"
}, productos);
// → "¡Ey! ¿Qué onda? ¿Listo para ponerte en forma? 💪😊"

// Tono Profesional (formal)
obtenerAgenteUniversal({
  industria: "gimnasio",
  nombreNegocio: "Elite Fitness Club",
  tono: "profesional"
}, productos);
// → "Buenos días. ¿En qué puedo asistirle con sus objetivos fitness?"

// Tono Juvenil (energético)
obtenerAgenteUniversal({
  industria: "gimnasio",
  nombreNegocio: "PowerGym",
  tono: "juvenil"
}, productos);
// → "¡Woww! ¿Vienes a darlo todo? Esto va a estar brutal 🔥💯"
```

### Vocabulario Adaptable

El agente universal ajusta su vocabulario según la industria:

| Industria | Verbo Vender | Cliente | Producto | Emojis |
|-----------|--------------|---------|----------|--------|
| Restaurante | recomendar | cliente | platillo | 🍔🍕🍝😋 |
| Ropa | asesorar | amor/cliente | prenda | 👔👗✨💕 |
| Tecnología | asesorar | amigo | dispositivo | 💻📱⚡🔋 |
| Gimnasio | motivar | hermano/campeón | plan | 💪🏋️🔥💯 |
| Educación | orientar | estudiante | curso | 📚🎓💡✨ |
| Servicios | consultar | cliente | servicio | 💼📊🎯✅ |

### Ejemplo Completo - API Integration

```typescript
// En tu API route: /api/constructor/mensaje
import { 
  obtenerPromptSegunEstrategia,
  MetadataNegocio,
  Producto 
} from "@/lib/templates/vendedor";

export async function POST(req: Request) {
  const { id_negocio, mensaje } = await req.json();
  
  // 1. Obtener datos del negocio
  const negocio = await db.negocios.findUnique({ where: { id: id_negocio } });
  const productos = await db.productos.findMany({ where: { id_negocio } });
  
  // 2. Preparar metadata
  const metadata: MetadataNegocio = {
    industria: negocio.industria,
    nombreNegocio: negocio.nombre,
    descripcionNegocio: negocio.descripcion,
    tono: negocio.tono_comunicacion || "casual",
  };
  
  // 3. Obtener prompt (automático: usa especializado si existe, sino universal)
  const systemPrompt = obtenerPromptSegunEstrategia(
    "automatico",
    metadata,
    productos
  );
  
  // 4. Llamar a OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: mensaje }
    ]
  });
  
  return Response.json({ respuesta: response.choices[0].message.content });
}
```

### Ver Ejemplos Completos

Revisa los archivos de ejemplo:
- [ejemplo-catalogo.ts](./ejemplo-catalogo.ts) - Ejemplos de inyección de catálogo
- [ejemplo-comparativo.ts](./ejemplo-comparativo.ts) - Comparación especializado vs universal
- [agente-universal.ts](./agente-universal.ts) - Implementación completa

---

## 📞 Soporte

Si tienes dudas sobre cómo integrar el catálogo en tu flujo, revisa:
- [index.ts](./index.ts) - Funciones helpers
- [PROGRESO_DESARROLLO.md](../../../PROGRESO_DESARROLLO.md) - Estado del proyecto
