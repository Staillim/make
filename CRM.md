# Sistema CRM - Customer Relationship Management

Sistema inteligente de perfiles de clientes que aprende de cada conversación y personaliza la experiencia de venta.

## 📋 Índice

1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Componentes](#componentes)
4. [Flujo de Uso](#flujo-de-uso)
5. [Integración con Agentes](#integración-con-agentes)
6. [API Reference](#api-reference)
7. [Ejemplos](#ejemplos)

---

## 🎯 Visión General

### ¿Qué hace el sistema CRM?

El sistema CRM transforma agentes de venta simples en asesores personalizados que **aprenden de cada interacción**:

- ✅ **Aprende preferencias** automáticamente (productos favoritos, presupuesto, estilo)
- ✅ **Segmenta clientes** en 5 categorías (nuevo, recurrente, vip, inactivo, en_riesgo)
- ✅ **Personaliza recomendaciones** según historial de conversaciones
- ✅ **Calcula métricas** (engagement 0-100, probabilidad de compra 0-100)
- ✅ **Envía notificaciones** multi-canal (email, WhatsApp, SMS)
- ✅ **Automatiza campañas** con triggers personalizados

### ¿Por qué es revolucionario?

**Antes del CRM:**
```
Cliente: "Hola"
Agente: "¡Hola! ¿En qué puedo ayudarte?"
```

**Con el CRM:**
```
Cliente: "Hola"
Agente (María): "¡Hola de nuevo Juan! 😊 ¿Lo de siempre? Tu Hamburguesa BBQ 
               la última vez te encantó. O si quieres probar algo nuevo, 
               tenemos una Pizza Margherita que por tu gusto por las 
               hamburguesas creo te va a fascinar."
```

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Cliente)                        │
│              Conversa con el agente de IA                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   API ENDPOINT                               │
│           /api/constructor/mensaje                           │
│                                                              │
│  1. Buscar perfil del cliente (email/teléfono)              │
│  2. Obtener resumen del perfil                               │
│  3. Inyectar resumen en prompt del agente                    │
│  4. Llamar a OpenAI con contexto personalizado               │
│  5. Guardar conversación + extraer info con IA               │
│  6. Actualizar perfil del cliente                            │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────┐         ┌──────────────────┐
│    OpenAI    │         │    Supabase DB   │
│              │         │                  │
│ - GPT-4 Chat │         │ ✓ perfiles       │
│ - Extracción │         │ ✓ conversaciones │
│              │         │ ✓ eventos        │
└──────────────┘         │ ✓ notificaciones │
                         └──────────────────┘
```

### Flujo de Datos

```
Conversación → Extracción IA → Actualización Perfil → Segmentación Automática
                                        ↓
                               Trigger Notificaciones
                                        ↓
                            Campañas Automatizadas
```

---

## 🧩 Componentes

### 1. **perfil-cliente.ts**
Tipos y lógica de negocio.

```typescript
import { PerfilCliente, generarResumenPerfil } from '@/lib/crm/perfil-cliente';

// Genera resumen markdown para inyectar en prompt
const resumen = generarResumenPerfil(perfil);
```

**Interfaces principales:**
- `PerfilCliente` - Estructura completa del perfil (80+ campos)
- `InformacionExtraida` - Resultado del análisis de IA
- `ResumenPerfil` - Resumen para el agente
- `SegmentoCliente` - 5 segmentos: nuevo, recurrente, vip, inactivo, en_riesgo

**Funciones clave:**
- `generarResumenPerfil()` - Crea texto para inyectar en prompt
- `determinarSegmento()` - Calcula segmento automáticamente
- `calcularEngagement()` - Score 0-100 (RFM: Recency, Frequency, Monetary)
- `calcularProbabilidadCompra()` - Score 0-100 predictivo

### 2. **extractor.ts**
Extracción de información con IA.

```typescript
import { extraerInformacionConversacion } from '@/lib/crm/extractor';

const info = await extraerInformacionConversacion(mensajes, {
  openai_api_key: process.env.OPENAI_API_KEY!,
  catalogo_productos: ["Hamburguesa BBQ", "Pizza Margherita"]
});

// info.preferencias_detectadas.productos → ["Hamburguesa BBQ"]
// info.sentimiento → "positivo" | "neutral" | "negativo"
// info.intencion → "compra" | "consulta" | "comparacion" | "queja"
```

**Detecta automáticamente:**
- Productos y categorías de interés
- Rango de precio preferido
- Contexto de compra (ocasión, para quién, urgencia)
- Objeciones y puntos de dolor
- Sentimiento e intención
- Datos de contacto si se mencionan

### 3. **notificaciones.ts**
Sistema de notificaciones multi-canal.

```typescript
import { 
  determinarNotificacionOptima, 
  puedeRecibirNotificacion 
} from '@/lib/crm/notificaciones';

// Determina qué notificación enviar
const tipo = determinarNotificacionOptima(perfil, {
  tiene_carrito_abandonado: true,
  es_cumpleanos: false
}); // → "recordatorio"

// Verifica si puede recibir notificación
const { puede } = puedeRecibirNotificacion(perfil, tipo);
```

**9 tipos de notificaciones:**
- `descuento` - Oferta con código de descuento
- `recomendacion` - Productos personalizados
- `reactivacion` - Para clientes inactivos
- `recordatorio` - Carrito abandonado
- `cumpleanos` - Felicitación con regalo
- `nuevo_producto` - Lanzamiento relevante
- `vip_exclusivo` - Solo para VIPs
- `seguimiento` - Post-compra
- `encuesta` - Feedback

**Templates incluidos** para cada tipo (email + WhatsApp + SMS).

### 4. **perfil-helper.ts**
Funciones de alto nivel.

```typescript
import { 
  obtenerOCrearPerfil,
  registrarConversacion,
  obtenerResumenParaAgente
} from '@/lib/crm/perfil-helper';

// Crear o buscar perfil
const { perfil } = await obtenerOCrearPerfil(supabase, id_negocio, {
  email: "cliente@example.com"
});

// Registrar conversación con extracción IA
await registrarConversacion(
  supabase, 
  perfil.id, 
  id_negocio, 
  mensajes,
  { openai_api_key: process.env.OPENAI_API_KEY! }
);

// Obtener resumen para agente
const { resumen } = await obtenerResumenParaAgente(supabase, id_negocio, {
  email: "cliente@example.com"
});
```

### 5. **Base de Datos** (Supabase PostgreSQL)

**5 tablas principales:**

#### `perfiles_clientes`
```sql
-- Perfil completo del cliente
id UUID PRIMARY KEY
id_negocio UUID -- Multi-tenant
nombre, email, telefono
preferencias JSONB -- productos_favoritos, categorias_interes, rango_precio
total_conversaciones INTEGER
total_compras INTEGER
valor_total_comprado DECIMAL
tipo_segmento TEXT -- nuevo, recurrente, vip, inactivo, en_riesgo
nivel_engagement INTEGER -- 0-100
probabilidad_compra INTEGER -- 0-100
```

#### `conversaciones_clientes`
```sql
-- Historial completo de chats
id UUID PRIMARY KEY
id_perfil UUID REFERENCES perfiles_clientes(id)
mensajes JSONB -- [{role, content, timestamp}]
informacion_extraida JSONB -- Resultado del análisis IA
sentiment_score DECIMAL -- -1 a +1
resultado TEXT -- compra, consulta, abandono, queja
```

#### `eventos_clientes`
```sql
-- Eventos granulares de comportamiento
tipo_evento TEXT -- visita, producto_visto, producto_consultado, compra
detalles JSONB
timestamp TIMESTAMPTZ
```

#### `notificaciones_programadas`
```sql
-- Cola de notificaciones multi-canal
tipo_notificacion TEXT
canal TEXT -- email, whatsapp, sms
estado TEXT -- pendiente, enviada, fallida
programada_para TIMESTAMPTZ
abierta BOOLEAN
conversion BOOLEAN
```

#### `campanas_automatizadas`
```sql
-- Configuración de campañas automatizadas
trigger_tipo TEXT -- inactividad, cumpleanos, carrito_abandonado
trigger_condiciones JSONB -- {dias_inactividad: 30}
segmento_objetivo TEXT[] -- ['recurrente', 'vip']
template_mensaje TEXT -- "Hola {{nombre}}, te extrañamos!"
total_conversiones INTEGER
```

---

## 🔄 Flujo de Uso

### Paso 1: Cliente Inicia Conversación

```typescript
// Frontend envía mensaje al backend
const response = await fetch('/api/constructor/mensaje', {
  method: 'POST',
  body: JSON.stringify({
    id_negocio: "uuid-del-negocio",
    id_sesion: "session-id",
    mensaje: "Hola, quiero una hamburguesa",
    contexto_usuario: {
      email: "cliente@example.com" // Opcional
    }
  })
});
```

### Paso 2: Backend Busca Perfil

```typescript
// En /api/constructor/mensaje/route.ts
import { obtenerOCrearPerfil, obtenerResumenParaAgente } from '@/lib/crm';

// Buscar perfil del cliente
const { perfil } = await obtenerOCrearPerfil(supabase, id_negocio, {
  email: contexto_usuario?.email
});

// Obtener resumen para el agente
const { resumen } = await obtenerResumenParaAgente(supabase, id_negocio, {
  email: contexto_usuario?.email
});
```

### Paso 3: Inyectar Perfil en Prompt

```typescript
import { prompt as promptRestaurante } from '@/lib/templates/vendedor/restaurante';

// Reemplazar placeholders
let prompt_final = promptRestaurante;

// 1. Inyectar perfil del cliente
if (resumen) {
  prompt_final = prompt_final.replace('{{PERFIL_CLIENTE}}', resumen);
} else {
  // Cliente nuevo, sin perfil
  prompt_final = prompt_final.replace('{{PERFIL_CLIENTE}}', 'Cliente nuevo - primera visita 🆕');
}

// 2. Inyectar catálogo de productos
const catalogo = productos.map(p => `- ${p.nombre}: ${p.descripcion} ($${p.precio})`).join('\n');
prompt_final = prompt_final.replace('{{PRODUCTOS_CATALOGO}}', catalogo);
```

**Resultado del prompt inyectado:**

```markdown
Eres María, una mesera experimentada...

## INFORMACIÓN DEL CLIENTE

**CLIENTE VIP** ⭐
Engagement: 85% | Prob. Compra: 75%
Visitas: 12 | Compras: 8
Ticket promedio: $156.50

❤️ Le gusta: Hamburguesa BBQ, Pizza Margherita
🔍 Categorías: Hamburguesas, Pizzas
💰 Rango: $10 - $25
💬 Estilo: casual

🎯 ESTRATEGIA:
- ⭐ Cliente VIP - trato especial
- Ofrecer productos premium o exclusivos
- Mencionar beneficios de lealtad

## IMPORTANTE: Productos que Vendes
- Hamburguesa BBQ: Carne Angus con salsa BBQ casera ($15.99)
- Pizza Margherita: Tomate, mozzarella, albahaca fresca ($12.50)
...
```

### Paso 4: Llamar a OpenAI con Contexto

```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: prompt_final // Incluye perfil + catálogo
    },
    ...mensajes_anteriores,
    {
      role: "user",
      content: "Hola, quiero una hamburguesa"
    }
  ]
});
```

**Respuesta del agente:**

```
¡Hola de nuevo! 😊 Veo que eres fan de nuestra Hamburguesa BBQ, ¿verdad? 
¡Es una de las favoritas! ¿La quieres como siempre o quieres probar 
nuestra nueva versión premium con doble carne? Como cliente VIP, 
te puedo dar un 10% de descuento en esta nueva versión. 🍔⭐
```

### Paso 5: Guardar Conversación y Extraer Info

```typescript
import { registrarConversacion } from '@/lib/crm';

// Al finalizar la conversación o cada X mensajes
await registrarConversacion(
  supabase,
  perfil.id,
  id_negocio,
  mensajes, // Todos los mensajes user/assistant
  {
    openai_api_key: process.env.OPENAI_API_KEY!,
    catalogo_productos: productos.map(p => p.nombre)
  },
  {
    resultado: "compra", // o "consulta", "abandono"
    duracion_minutos: 5
  }
);
```

**Esto automáticamente:**
1. ✅ Analiza la conversación con GPT-4
2. ✅ Extrae preferencias (productos, categorías, presupuesto)
3. ✅ Detecta sentimiento (positivo/neutral/negativo)
4. ✅ Identifica intención (compra/consulta/queja)
5. ✅ Actualiza el perfil del cliente
6. ✅ Recalcula segmento y métricas (trigger automático)

### Paso 6: Segmentación Automática

```sql
-- PostgreSQL trigger ejecuta automáticamente:
CREATE TRIGGER after_update_perfil
AFTER UPDATE ON perfiles_clientes
FOR EACH ROW
WHEN (
  OLD.total_conversaciones != NEW.total_conversaciones OR
  OLD.total_compras != NEW.total_compras
)
EXECUTE FUNCTION recalcular_segmento_cliente();
```

**Segmentos:**
- 🆕 `nuevo` - ≤1 conversación, 0 compras
- 🔄 `recurrente` - 2-4 visitas, engagement medio
- ⭐ `vip` - ≥5 compras, >$1000 gastado
- 😴 `inactivo` - >30 días sin visita
- ⚠️ `en_riesgo` - Era activo, ahora en declive

### Paso 7: Notificaciones Automáticas

```typescript
// Cron job diario (ejecutar con Vercel Cron o similar)
import { obtenerClientesParaNotificacion } from '@/lib/crm';

// Buscar clientes inactivos
const clientes_inactivos = await obtenerClientesParaNotificacion(
  supabase,
  id_negocio,
  "reactivacion",
  {
    segmentos: ["inactivo", "en_riesgo"],
    min_probabilidad_compra: 30
  }
);

// Enviar notificaciones personalizadas
for (const cliente of clientes_inactivos) {
  await enviarNotificacion(cliente, {
    tipo: "reactivacion",
    variables: {
      nombre: cliente.nombre,
      dias_inactivo: cliente.segmento.dias_desde_ultima_visita,
      descuento: 20,
      codigo: "VUELVE20"
    }
  });
}
```

---

## 🤝 Integración con Agentes

### Agentes Actualizados con CRM

Todos los agentes vendedores ahora soportan perfiles de clientes:

1. ✅ **María (Restaurante)** - Ya actualizada
2. ⬜ Alex (Gimnasio)
3. ⬜ Sofía (Boutique)
4. ⬜ Coach Mike (Fitness)
5. ⬜ Prof. Ana (Tutorías)
6. ⬜ Luna (Spa)

### Placeholders en Plantillas

Todos los prompts de agentes deben incluir:

```
## INFORMACIÓN DEL CLIENTE
{{PERFIL_CLIENTE}}

## IMPORTANTE: Productos que Vendes
{{PRODUCTOS_CATALOGO}}
```

### Ejemplo: María con Cliente VIP

**Prompt inyectado:**
```markdown
**CLIENTE VIP** ⭐
Engagement: 85% | Prob. Compra: 75%
❤️ Le gusta: Hamburguesa BBQ, Pizza Margherita

🎯 ESTRATEGIA:
- Cliente VIP - trato especial
- Ofrecer productos premium
```

**Conversación resultante:**

```
Cliente: "Hola"
María: "¡Qué gusto verte de nuevo! ⭐ Como cliente especial, 
       quiero contarte que hoy tenemos una Hamburguesa Premium Angus 
       con trufas que creo te va a fascinar. Sé que amas nuestra 
       Hamburguesa BBQ, esta es la versión de lujo. ¿Te animas?"

Cliente: "¿Cuánto cuesta?"
María: "La Premium está en $25.99, pero como eres cliente VIP, 
       te hago 15% de descuento. Quedaría en $22. ¿Qué dices?"

Cliente: "Dale"
María: "¡Perfecto! 🍔⭐ Te va a encantar. ¿La acompañas con algo? 
       Como siempre vienes en horario de almuerzo, ¿agregas 
       una bebida o postre?"
```

---

## 📚 API Reference

### `obtenerOCrearPerfil()`

Busca un perfil existente o crea uno nuevo.

```typescript
const resultado = await obtenerOCrearPerfil(
  supabase: SupabaseClient,
  id_negocio: string,
  identificador: {
    email?: string;
    telefono?: string;
    nombre?: string;
  }
): Promise<ResultadoOperacionPerfil>

// Retorna:
{
  exito: true,
  perfil: PerfilCliente,
  actualizaciones: ["Perfil creado"] // o ["Perfil encontrado"]
}
```

### `obtenerResumenParaAgente()`

Obtiene resumen markdown del perfil para inyectar en prompt.

```typescript
const { resumen, perfil } = await obtenerResumenParaAgente(
  supabase: SupabaseClient,
  id_negocio: string,
  identificador: { email?: string; telefono?: string }
): Promise<{ resumen: string | null; perfil: PerfilCliente | null }>

// Ejemplo de resumen generado:
`
**CLIENTE VIP** ⭐
Engagement: 85% | Prob. Compra: 75%
Visitas: 12 | Compras: 8
❤️ Le gusta: Hamburguesa BBQ, Pizza
🎯 ESTRATEGIA: Cliente VIP - trato especial
`
```

### `registrarConversacion()`

Guarda conversación y extrae información con IA.

```typescript
const resultado = await registrarConversacion(
  supabase: SupabaseClient,
  id_perfil: string,
  id_negocio: string,
  mensajes: MensajeConversacion[],
  config_ia: ConfiguracionExtractor,
  opciones?: {
    resultado?: "compra" | "consulta" | "abandono" | "queja";
    duracion_minutos?: number;
  }
): Promise<ResultadoOperacionPerfil>

// Mensajes format:
[
  { role: "user", content: "Hola", timestamp: new Date() },
  { role: "assistant", content: "¡Hola! ¿En qué puedo ayudarte?" },
  ...
]
```

### `registrarCompra()`

Registra una compra y actualiza métricas del perfil.

```typescript
const resultado = await registrarCompra(
  supabase: SupabaseClient,
  id_perfil: string,
  monto: number,
  productos: string[]
): Promise<ResultadoOperacionPerfil>

// Ejemplo:
await registrarCompra(supabase, perfil.id, 25.99, ["Hamburguesa BBQ"]);

// Actualiza automáticamente:
// - total_compras += 1
// - valor_total_comprado += 25.99
// - promedio_ticket recalculado
// - productos_comprados agregado
// - segmento recalculado (puede subir a VIP)
```

---

## 💡 Ejemplos

### Ejemplo 1: Primera Conversación (Cliente Nuevo)

```typescript
// Cliente llega sin email/teléfono
const { resumen } = await obtenerResumenParaAgente(supabase, id_negocio, {});
// resumen = null

// Prompt inyectado:
// {{PERFIL_CLIENTE}} → "Cliente nuevo - primera visita 🆕"

// Conversación:
Cliente: "Hola, quiero una hamburguesa"
María: "¡Hola! 😊 ¿Primera vez por aquí? Te va a encantar. 
       Tenemos varias hamburguesas increíbles. ¿Te gusta la carne 
       bien jugosa o más cocida? ¿Y qué tal los sabores ahumados?"

Cliente: "Jugosa y ahumado sí"
María: "¡Perfecto! Entonces la Hamburguesa BBQ es para ti. 
       Carne Angus jugosa con salsa BBQ casera ahumada. $15.99 🍔"

Cliente: "Dale, y mi email es juan@example.com"

// Al finalizar:
await registrarConversacion(supabase, perfil.id, id_negocio, mensajes, config);

// Ahora el perfil tiene:
// - nombre: "Juan" (si lo mencionó)
// - email: juan@example.com
// - productos_favoritos: ["Hamburguesa BBQ"]
// - categorias_interes: ["Hamburguesas"]
// - rango_precio_preferido: { min: 10, max: 20 }
// - tipo_segmento: "nuevo"
```

### Ejemplo 2: Cliente Recurrente

```typescript
// Segunda visita de Juan
const { resumen } = await obtenerResumenParaAgente(supabase, id_negocio, {
  email: "juan@example.com"
});

// resumen:
`
**CLIENTE RECURRENTE** 🔄
Engagement: 40% | Prob. Compra: 55%
Visitas: 2 | Compras: 1
❤️ Le gusta: Hamburguesa BBQ
💰 Rango: $10 - $20
🎯 ESTRATEGIA: Fidelizar - ofrecer variaciones de sus favoritos
`

// Conversación:
Cliente: "Hola María"
María: "¡Hola Juan! 😊 ¿Lo de siempre? Tu Hamburguesa BBQ la 
       última vez te encantó. O si quieres probar algo nuevo, 
       tenemos una Hamburguesa con Bacon que tiene ese mismo 
       sabor ahumado que te gusta. ¿Qué prefieres?"

Cliente: "La de bacon suena bien"
María: "¡Excelente elección! 🍔 ¿Con papas o ensalada?"
```

### Ejemplo 3: Cliente VIP

```typescript
// Juan después de 8 compras y $150 gastados
const { resumen, perfil } = await obtenerResumenParaAgente(supabase, id_negocio, {
  email: "juan@example.com"
});

// perfil.segmento.tipo = "vip" (calculado automáticamente)
// perfil.nivel_engagement = 85
// perfil.probabilidad_compra = 75

// resumen:
`
**CLIENTE VIP** ⭐
Engagement: 85% | Prob. Compra: 75%
Visitas: 12 | Compras: 8
Ticket promedio: $18.50
❤️ Le gusta: Hamburguesa BBQ, Hamburguesa Bacon, Pizza Margherita
💰 Rango: $10 - $25
💬 Estilo: casual
🎯 ESTRATEGIA:
- ⭐ Cliente VIP - trato especial
- Ofrecer productos premium o exclusivos
- Mencionar beneficios de lealtad
`

// Conversación:
Cliente: "Hola"
María: "¡Juan! Qué gusto verte de nuevo ⭐ Como cliente especial, 
       hoy tengo algo exclusivo para ti: Hamburguesa Trufa Premium. 
       Solo para VIPs. Tiene ese sabor ahumado que amas, pero con 
       un toque gourmet. Normalmente $28, pero para ti $25. 
       ¿Te animas a probarla?"

Cliente: "Suena interesante, ¿qué lleva?"
María: "Carne Angus premium, queso gruyere, cebolla caramelizada 
       con trufa, y salsa BBQ casera con un toque de miel. 
       Es espectacular 🍔⭐"
```

### Ejemplo 4: Cliente Inactivo (Reactivación)

```typescript
// Juan no visitó en 45 días
// Trigger automático detecta inactividad

// Sistema CRM envía notificación:
{
  canal: "email",
  asunto: "💙 Juan, te extrañamos!",
  mensaje: `
    Hola Juan,
    
    Hace 45 días que no te vemos. ¿Todo bien?
    
    Te dejamos 20% de descuento en tu próxima Hamburguesa BBQ 
    (sabemos que es tu favorita 😊).
    
    Código: VUELVE20
    
    ¡Esperamos verte pronto!
    - María y el equipo
  `
}

// Juan regresa:
Cliente: "Hola, tengo el código VUELVE20"
María: "¡JUAN! 💙 Qué felicidad verte de vuelta! Te extrañábamos mucho. 
       Sí, el 20% está activado. ¿Lo de siempre? Tu Hamburguesa BBQ 
       con papas fritas? Con descuento queda en $12.79 🍔"
```

---

## 🚀 Próximos Pasos

### Implementación Inmediata

1. ✅ Actualizar prompt de María (restaurante) - **COMPLETADO**
2. ⬜ Actualizar prompts de otros 5 agentes vendedores
3. ⬜ Integrar en `/api/constructor/mensaje/route.ts`
4. ⬜ Ejecutar migración SQL: `sql/schema-perfiles-clientes.sql`
5. ⬜ Configurar OpenAI API key en variables de entorno
6. ⬜ Probar flujo completo con cliente de prueba

### Features Futuras

- Dashboard de analytics de clientes por segmento
- Configuración de campañas automatizadas desde UI
- A/B testing de templates de notificaciones
- Integración con proveedores de email (SendGrid, Resend)
- Integración con WhatsApp Business API
- Webhooks para eventos de conversión
- Exportación de reportes de CRM

---

## 📞 Soporte

El sistema CRM está diseñado para ser plug-and-play con los agentes existentes. 

**Flujo mínimo de integración:**
1. Ejecutar SQL de migración
2. Agregar `{{PERFIL_CLIENTE}}` a prompts de agentes
3. Llamar `obtenerResumenParaAgente()` antes de invocar OpenAI
4. Llamar `registrarConversacion()` al finalizar chat

**¡Eso es todo!** El resto (extracción IA, segmentación, notificaciones) funciona automáticamente con triggers de base de datos.
