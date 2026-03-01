# 📚 Biblioteca de Prompts - Agentes IA

Esta carpeta contiene todos los prompts especializados para los agentes vendedores según la industria del negocio.

## 📁 Estructura

```
templates/
├── vendedor/              # Agentes de venta por industria
│   ├── _base.ts          # ✅ Prompt genérico (fallback)
│   ├── restaurante.ts    # ✅ María (mesera)
│   ├── tienda_ropa.ts    # ✅ Sofía (asesora de moda)
│   ├── tecnologia.ts     # ✅ Alex (experto tech)
│   ├── gimnasio.ts       # ✅ Coach Mike (entrenador)
│   ├── educacion.ts      # ✅ Prof. Ana (tutora)
│   ├── servicios.ts      # ✅ Luna (consultora)
│   └── index.ts          # ✅ Barrel export + helpers
│
└── admin/                 # ⏳ Agentes administradores (próximamente)
    ├── _base.ts          # Max genérico
    ├── restaurante.ts    # Max para restaurantes
    └── ...
```

## 🎯 Uso

### Importar un template específico

```typescript
import { restauranteTemplate } from '@/lib/templates/vendedor';

const { prompt, metadata } = restauranteTemplate;

// Enviar a IA
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: prompt },
    { role: 'user', content: mensajeCliente }
  ]
});
```

### Cargar template según industria (recomendado)

```typescript
import { obtenerTemplateVendedor } from '@/lib/templates/vendedor';

// Cargar según tipo de negocio
const tipoNegocio = "restaurante"; // desde BD
const template = obtenerTemplateVendedor(tipoNegocio);

console.log(template.metadata.nombre); // "María"
console.log(template.metadata.rol);    // "Mesera"
```

### Detectar industria y cargar template

```typescript
import { detectarTipoNegocio } from '@/lib/constructor/detector';
import { obtenerTemplateVendedor } from '@/lib/templates/vendedor';

// El usuario describe su negocio
const descripcion = "Vendo hamburguesas y papas fritas";

// IA detecta la industria
const industria = await detectarTipoNegocio(descripcion); // "restaurante"

// Carga el template apropiado
const template = obtenerTemplateVendedor(industria);

// Usa el prompt
const agente = await crearAgente({
  nombre: template.metadata.nombre,
  prompt: template.prompt,
  ...template.metadata
});
```

## 🏗️ Estructura de un Template

Cada archivo de template exporta:

```typescript
export const prompt = `
  Prompt largo y detallado para el agente...
`;

export const metadata = {
  nombre: "María",
  apellido: "González",
  rol: "Mesera",
  personalidad: "cálida, conocedora",
  industria: "restaurante",
  emojis: ["🍔", "🍕", "😊"],
  tonoVoz: "conversacional, amigable",
  avatar: "mujer_joven_delantal",
  capacidades: [...],
  experticia: [...]
};

export default { prompt, metadata };
```

## ✨ Helpers Disponibles

### `obtenerTemplateVendedor(industria: string)`
Carga el template para una industria. Si no existe, retorna el genérico.

```typescript
const template = obtenerTemplateVendedor("gimnasio");
// Retorna template de Coach Mike
```

### `obtenerIndustriasDisponibles()`
Lista todas las industrias con template específico.

```typescript
const industrias = obtenerIndustriasDisponibles();
// ["restaurante", "tienda_ropa", "tecnologia", "gimnasio", "educacion", "servicios"]
```

### `tieneTemplateEspecifico(industria: string)`
Verifica si existe un template para la industria.

```typescript
tieneTemplateEspecifico("restaurante"); // true
tieneTemplateEspecifico("panaderia");   // false (usará _base.ts)
```

## 📝 Agregar Nueva Industria

1. **Crear archivo:** `vendedor/nueva_industria.ts`
2. **Definir prompt:** Detallado con personalidad única
3. **Exportar metadata:** Nombre, emojis, capacidades, etc.
4. **Agregar a index.ts:** Importar y añadir al mapa `templates`
5. **Actualizar tipo:** Agregar a `IndustriaTipo`

Ejemplo:

```typescript
// vendedor/panaderia.ts
export const prompt = `Eres Laura, una panadera experta...`;

export const metadata = {
  nombre: "Laura",
  rol: "Panadera",
  industria: "panaderia",
  // ...
};
```

```typescript
// vendedor/index.ts
import panaderiaTemplate from "./panaderia";

export type IndustriaTipo = 
  | "restaurante"
  | "panaderia" // ← agregar aquí
  | ...;

export const templates = {
  restaurante: restauranteTemplate,
  panaderia: panaderiaTemplate, // ← agregar aquí
  ...
};
```

## 🎭 Personalización de Agentes

Cada prompt está diseñado para:
- ✅ **Personalidad única** por industria
- ✅ **Vocabulario específico** del sector
- ✅ **Preguntas clave** relevantes
- ✅ **Formato de respuesta** optimizado
- ✅ **Emojis característicos** del negocio
- ✅ **Capacidades especializadas**

## 🔄 Sistema de Fallback

Si una industria no tiene template específico:
1. Se detecta con `obtenerTemplateVendedor(industria)`
2. No encuentra match → retorna `templates.otro`
3. Usa el agente genérico de `_base.ts`
4. Funciona para cualquier negocio, pero sin especialización

## 🚀 Roadmap

### ✅ Completado (Día 1)
- [x] Sistema base de templates
- [x] 6 industrias implementadas
- [x] Helper functions
- [x] Sistema de fallback

### ⏳ Próximos Pasos (Día 2)
- [ ] Templates de agentes administradores (Max)
- [ ] Función `detectarTipoNegocio()` con IA
- [ ] Tests unitarios de templates
- [ ] Documentación de cada agente

### 🔮 Futuro
- [ ] Templates multiidioma (ES, EN, PT)
- [ ] Variantes de personalidad por template
- [ ] Sistema de A/B testing de prompts
- [ ] Analytics de efectividad por prompt

## 📊 Métricas de Prompts

| Industria | Prompt Size | Emojis | Capacidades | Estado |
|-----------|-------------|--------|-------------|--------|
| Restaurante | ~450 líneas | 8 | 6 | ✅ |
| Tienda Ropa | ~420 líneas | 8 | 6 | ✅ |
| Tecnología | ~480 líneas | 9 | 6 | ✅ |
| Gimnasio | ~460 líneas | 9 | 6 | ✅ |
| Educación | ~470 líneas | 9 | 6 | ✅ |
| Servicios | ~450 líneas | 9 | 6 | ✅ |
| **Total** | **~2730 líneas** | **52** | **36** | **100%** |

## 💡 Tips de Uso

1. **Siempre usa metadata:** Configura nombre, avatar, emojis del agente
2. **Contextualiza:** Añade info del catálogo al prompt en runtime
3. **Personaliza:** Puedes modificar el prompt base agregando info del negocio
4. **Fallback:** Confía en el sistema de fallback para industrias nuevas
5. **Testing:** Prueba el prompt con casos edge antes de producción

---

**Última actualización:** Marzo 1, 2026  
**Desarrollado por:** Maket AI Team  
**Versión:** 1.0.0
