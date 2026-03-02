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

## 📞 Soporte

Si tienes dudas sobre cómo integrar el catálogo en tu flujo, revisa:
- [index.ts](./index.ts) - Funciones helpers
- [PROGRESO_DESARROLLO.md](../../../PROGRESO_DESARROLLO.md) - Estado del proyecto
