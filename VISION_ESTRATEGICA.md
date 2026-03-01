# 🎯 Visión Estratégica: Maket AI - Sistema de 3 Agentes Inteligentes

## 📋 Objetivo General

Crear una **plataforma SaaS multi-industria** que permita a cualquier emprendedor, de **CUALQUIER tipo de negocio**, configurar su sistema de ventas y administración de manera completamente automatizada. 

### 🌍 **Funciona para CUALQUIER Negocio:**
- 🍔 **Restaurantes** → Pedidos, menú, delivery
- 👗 **Tiendas de ropa** → Tallas, colores, outfits
- 💻 **Tecnología/E-commerce** → Especificaciones, compatibilidad, soporte
- 🏠 **Servicios** → Citas, cotizaciones, agendamiento
- 🎓 **Educación** → Cursos, inscripciones, materiales
- 💊 **Salud/Farmacia** → Productos, recetas, consultas
- 🏋️ **Fitness/Gym** → Membresías, rutinas, clases
- 🎨 **Arte/Design** → Portfolio, comisiones, proyectos
- ...y **CUALQUIER otro tipo de negocio**

**A medida que el dueño proporciona instrucciones**, el sistema genera automáticamente:

1. ✅ **Landing page personalizada** adaptada al tipo de negocio
2. ✅ **Tres agentes inteligentes** especializados por industria:
   - 🤖 **Orquestador** → Crea y configura todo el negocio
   - 💬 **Asesor de Ventas** → Interactúa con clientes y vende (adaptado al negocio)
   - 📊 **Administrador** → Gestiona operaciones y toma decisiones (adaptado al negocio)

---

## 🌐 Adaptación Multi-Industria

El sistema se adapta **automáticamente** a cualquier tipo de negocio mediante:

### 1. **Detección Inteligente del Tipo de Negocio**

```typescript
// Fase 1 del Orquestador
DUEÑO: "Quiero crear una tienda de ropa online"
    ↓
IA detecta:
    - Tipo: "tienda_ropa"
    - Categoría: "e-commerce"
    - Industria: "moda"
    ↓
Sistema carga automáticamente:
    - Plantilla de landing: fashion_modern
    - Agente vendedor: fashion_advisor (Sofía)
    - Agente admin: retail_manager (Max)
    - Estructura de catálogo: productos con tallas/colores
    - Campos personalizados: marca, temporada, género
```

### 2. **Plantillas de Agentes por Industria**

```typescript
// lib/agents/prompts/templates/

BIBLIOTECA DE PLANTILLAS:
├── restaurante_vendedor.ts      → María (toma pedidos, sugiere combos)
├── tienda_ropa_vendedor.ts      → Sofía (asesora tallas, crea outfits)
├── tecnologia_vendedor.ts       → Alex (especificaciones técnicas)
├── servicios_vendedor.ts        → Luna (agenda citas, cotiza)
├── salud_vendedor.ts            → Dr. Carlos (productos médicos)
├── fitness_vendedor.ts          → Coach Mike (planes, rutinas)
├── educacion_vendedor.ts        → Prof. Ana (cursos, materiales)
└── ...más según se necesiten
```

### 3. **Configuración de Catálogo Adaptado**

| Tipo de Negocio | Campos del Catálogo | Variantes |
|----------------|---------------------|-----------|
| **Restaurante** | Ingredientes, calorías, tiempo prep | Tamaños, extras |
| **Ropa** | Marca, material, temporada | Tallas, colores |
| **Tecnología** | Especificaciones, compatibilidad | Almacenamiento, RAM |
| **Servicios** | Duración, requisitos | Horarios disponibles |
| **Educación** | Duración, nivel, instructor | Modalidad (online/presencial) |
| **Salud** | Principio activo, presentación | Dosis, cantidad |

---

## 🎭 Ejemplos por Industria

### 📱 **Caso 1: Tienda de Ropa Online**

#### Configuración Automática del Orquestador:

```
DUEÑO: "Quiero crear una tienda de ropa para jóvenes"
    ↓
ORQUESTADOR detecta: tipo = "tienda_ropa", target = "jóvenes"
    ↓
FASE 1-3: Configuración inicial
    ├─ Plantilla: fashion_modern (colores vibrantes)
    ├─ Marca: "Urban Style"
    ├─ Tono: casual, juvenil, trendy
    └─ Colores: negro, naranja, blanco
    ↓
FASE 5: Catálogo
    ORQUESTADOR: "¿Qué productos ofrecerás?"
    DUEÑO: "Camisetas, jeans, zapatos, accesorios"
    ↓
    Sistema genera:
    ├─ Categorías: [Tops, Bottoms, Calzado, Accesorios]
    ├─ Campos: {tallas: [XS,S,M,L,XL], colores: [], marca: ""}
    └─ Variantes: combinaciones talla + color
    ↓
FASE 7: Agentes
    Sistema crea:
    ├─ SOFÍA (Vendedor)
    │   Plantilla: tienda_ropa_vendedor
    │   Personalidad: fashionista, moderna, amigable
    │   Capacidades: asesorar tallas, crear outfits, combinar prendas
    │
    └─ MAX (Administrador)
        Plantilla: retail_manager
        Capacidades: control de inventario por talla/color
                    promociones por temporada
                    análisis de tendencias
```

#### Conversación con Sofía (Vendedor):

```
CLIENTE: "Busco algo casual para el fin de semana"
    ↓
SOFÍA (verifica perfil):
    - Cliente nuevo (sin historial)
    - Contexto: "casual", "fin de semana"
    ↓
SOFÍA responde:
    "¡Hola! Para un look casual perfecto, te recomiendo:
    
    ✨ Combo Weekend Vibes:
    - Camiseta Urban ($25) - Perfecta para el clima
    - Jean Relaxed Fit ($45) - Súper cómodo
    - Sneakers Classic ($35)
    
    Total: $105 (o $95 con el combo weekend 🎉)
    
    ¿Qué talla usas normalmente?"

CLIENTE: "M en camisetas, 32 en jeans"
    ↓
SOFÍA:
    "Perfecto! Tengo todo en stock:
    - Camiseta Urban talla M
    - Jean Relaxed 32
    - Sneakers... ¿qué número calzas?"

CLIENTE: "43"
    ↓
SOFÍA (verifica stock):
    - Sneakers 43: ✅ disponible
    ↓
SOFÍA:
    "Genial! Todo disponible. ¿Te gustaría agregar un accesorio?
    Tenemos gorras ($15) que combinan perfecto con el outfit 🧢"

CLIENTE: "No, solo eso"
    ↓
SOFÍA:
    "¡Listo! Tu pedido:
    - Camiseta Urban (M) Negro
    - Jean Relaxed (32) Azul
    - Sneakers Classic (43) Blanco/Negro
    
    Subtotal: $105
    Descuento Combo: -$10
    Total: $95
    
    ¿Confirmo tu pedido? 🛍️"
```

#### Max (Administrador) en acción:

```
MAX analiza cada hora:
    ├─ Detecta: Camisetas talla M se están agotando
    │   Stock actual: 5 unidades
    │   Velocidad de venta: 3/día
    │   Proyección: agotamiento en 1.6 días
    │
    ├─ DECISIÓN AUTÓNOMA:
    │   Generar orden de reposición
    │   Producto: Camiseta Urban talla M
    │   Cantidad: 30 unidades
    │   Razón: "Alta demanda detectada + stock crítico"
    │
    └─ Crea alerta para dueño: "⚠️ Reposición necesaria"
```

---

### 💻 **Caso 2: Tienda de Tecnología / E-commerce**

#### Configuración del Orquestador:

```
DUEÑO: "Quiero vender laptops y accesorios tecnológicos"
    ↓
ORQUESTADOR detecta: tipo = "tecnologia", categoria = "e-commerce"
    ↓
FASE 5: Catálogo
    Sistema genera:
    ├─ Categorías: [Laptops, Accesorios, Componentes]
    ├─ Campos específicos:
    │   - Marca: [HP, Dell, Lenovo, Apple]
    │   - Procesador: [i3, i5, i7, i9, Ryzen]
    │   - RAM: [4GB, 8GB, 16GB, 32GB]
    │   - Almacenamiento: [256GB, 512GB, 1TB SSD]
    │   - Pantalla: [13", 14", 15.6", 17"]
    └─ Especificaciones técnicas detalladas
    ↓
FASE 7: Agentes
    Sistema crea:
    ├─ ALEX (Vendedor Técnico)
    │   Plantilla: tecnologia_vendedor
    │   Personalidad: experto, claro, preciso
    │   Capacidades: comparar specs, recomendar según uso
    │
    └─ MAX (Administrador)
        Capacidades: control de garantías
                    compatibilidad de productos
                    alertas de actualizaciones
```

#### Conversación con Alex (Vendedor):

```
CLIENTE: "Necesito una laptop para diseño gráfico"
    ↓
ALEX (analiza requisitos):
    - Uso: diseño gráfico (requiere GPU dedicada, RAM alta)
    - Sin presupuesto mencionado
    ↓
ALEX responde:
    "Para diseño gráfico necesitas potencia 💪
    
    Te recomiendo estas opciones:
    
    🥇 Dell XPS 15 ($1,200)
    - Intel i7 11th Gen
    - 16GB RAM
    - NVIDIA GTX 1650 Ti
    - 512GB SSD
    - Pantalla 15.6" 4K
    ✅ Perfecta para Adobe Suite
    
    🥈 HP Pavilion Creator ($900)
    - AMD Ryzen 7
    - 16GB RAM
    - NVIDIA GTX 1650
    - 512GB SSD
    - Pantalla 15.6" FHD
    ✅ Excelente relación calidad/precio
    
    ¿Qué programas usarás principalmente?"

CLIENTE: "Photoshop, Illustrator, algo de video"
    ↓
ALEX:
    "Entonces la Dell XPS 15 es tu mejor opción 🎯
    
    Para video editing, también te recomiendo:
    - Upgrade a 32GB RAM (+$150)
    - Mouse de precisión Logitech MX Master ($80)
    
    ¿Te interesa la laptop sola o con los extras?"

CLIENTE: "Solo la laptop por ahora"
    ↓
ALEX:
    "Perfecto! Dell XPS 15:
    - Garantía: 1 año incluido
    - Envío: Gratis
    - Configuración inicial: Sin costo
    
    Total: $1,200
    
    ¿Necesitas ayuda con specs de algo más?"
```

---

### 🏋️ **Caso 3: Gimnasio / Centro Fitness**

#### Configuración del Orquestador:

```
DUEÑO: "Quiero vender membresías de gimnasio y clases"
    ↓
ORQUESTADOR detecta: tipo = "servicios", categoria = "fitness"
    ↓
FASE 5: Catálogo (de servicios)
    Sistema genera:
    ├─ Categorías: [Membresías, Clases Grupales, Entrenamiento Personal]
    ├─ Campos:
    │   - Duración: [1 mes, 3 meses, 6 meses, 1 año]
    │   - Tipo: [Solo gym, Gym+clases, Premium]
    │   - Horario: [Mañana, Tarde, Flexible]
    └─ Capacidad y horarios disponibles
    ↓
FASE 7: Agentes
    Sistema crea:
    ├─ COACH MIKE (Vendedor)
    │   Plantilla: fitness_vendedor
    │   Personalidad: motivador, energético, profesional
    │   Capacidades: evaluar nivel, recomendar plan
    │
    └─ MAX (Administrador)
        Capacidades: gestión de horarios
                    control de capacidad de clases
                    seguimiento de asistencias
```

#### Conversación con Coach Mike:

```
CLIENTE: "Quiero empezar a entrenar, nunca he ido a un gym"
    ↓
COACH MIKE:
    "¡Genial que des el primer paso! 💪
    
    Para principiantes, te recomiendo nuestro plan STARTER:
    
    🎯 Plan Starter (3 meses - $120)
    - Acceso al gym 24/7
    - Inducción personalizada
    - 2 clases grupales/semana
    - App con rutinas
    - Seguimiento mensual
    
    Incluye:
    ✅ Evaluación física inicial gratis
    ✅ Plan de entrenamiento personalizado
    ✅ Soporte en app
    
    ¿Cuáles son tus objetivos? (perder peso, ganar músculo, tonificar)"

CLIENTE: "Quiero perder peso"
    ↓
COACH MIKE:
    "Perfecto! Para pérdida de peso te armaré un plan con:
    
    - Cardio 3x/semana
    - Entrenamiento funcional 2x/semana
    - Clases recomendadas: Spinning, Zumba
    
    ¿Prefieres entrenar en la mañana o tarde?"

CLIENTE: "Tardes, después de las 6pm"
    ↓
COACH MIKE:
    "Excelente. Tenemos:
    - Spinning martes/jueves 6:30pm
    - Zumba lunes/miércoles 7:00pm
    
    Con el Plan Starter tienes 2 clases por semana incluidas.
    
    ¿Te gustaría agregar asesoría nutricional? (+$30/mes)
    Te ayudará a lograr tus objetivos más rápido"

CLIENTE: "Sí, agrégala"
    ↓
COACH MIKE:
    "¡Increíble decisión! 🎉
    
    Tu plan:
    - Membresía Starter (3 meses)
    - Asesoría nutricional
    - Horario: Tardes
    
    Total: $210 ($70/mes x 3)
    Ahorro vs mensual: $30
    
    Inicias: Próximo lunes
    Evaluación física: Este viernes 6pm
    
    ¿Confirmo tu membresía?"
```

---

### 🎓 **Caso 4: Plataforma de Cursos Online**

#### Configuración del Orquestador:

```
DUEÑO: "Quiero vender cursos de programación online"
    ↓
ORQUESTADOR detecta: tipo = "educacion", categoria = "cursos_online"
    ↓
FASE 5: Catálogo
    Sistema genera:
    ├─ Categorías: [Principiante, Intermedio, Avanzado]
    ├─ Campos:
    │   - Duración: en horas
    │   - Modalidad: [En vivo, Grabado, Híbrido]
    │   - Nivel: [Básico, Intermedio, Avanzado]
    │   - Instructor: nombre
    │   - Certificado: sí/no
    └─ Materiales incluidos
    ↓
FASE 7: Agentes
    Sistema crea:
    ├─ PROF. ANA (Vendedor)
    │   Plantilla: educacion_vendedor
    │   Personalidad: profesional, clara, orientadora
    │   Capacidades: evaluar nivel, recomendar ruta
    │
    └─ MAX (Administrador)
        Capacidades: gestión de inscripciones
                    seguimiento de progreso
                    análisis de completitud
```

#### Conversación con Prof. Ana:

```
CLIENTE: "Quiero aprender Python pero no sé programar"
    ↓
PROF. ANA:
    "¡Perfecto! Python es ideal para empezar 🐍
    
    Para principiantes sin experiencia, te recomiendo:
    
    📚 Ruta: Fundamentos de Programación
    
    1️⃣ Python Desde Cero ($49)
       - 20 horas de video
       - 50+ ejercicios prácticos
       - Proyecto final
       - Certificado
       Duración: 4 semanas
    
    2️⃣ Fundamentos de Programación ($89)
       - Todo lo anterior +
       - Lógica de programación
       - Estructura de datos
       - Sesiones en vivo
       Duración: 8 semanas
    
    ¿Tienes experiencia previa en algún lenguaje?"

CLIENTE: "No, ninguno"
    ↓
PROF. ANA:
    "Entonces Python Desde Cero es perfecto para ti.
    
    El curso incluye:
    ✅ Sintaxis básica de Python
    ✅ Variables, condicionales, bucles
    ✅ Funciones y módulos
    ✅ Proyecto: Crear tu primera app
    ✅ Acceso de por vida
    ✅ Certificado al completar
    
    Inicia: Próximo lunes
    Modalidad: Videos + ejercicios a tu ritmo
    
    💡 Tip: Si agregas el curso de Git ($29), 
    aprenderás control de versiones (esencial para programadores)
    
    ¿Solo Python o con Git?"

CLIENTE: "Los dos"
    ↓
PROF. ANA:
    "¡Excelente decisión! 
    
    Bundle Programador Junior:
    - Python Desde Cero
    - Git & GitHub Esencial
    
    Precio normal: $78
    Bundle: $69 (ahorro $9)
    
    Acceso inmediato a ambos cursos
    Soporte del instructor en foro
    Certificado por cada curso
    
    ¿Confirmo tu inscripción?"
```

---

## 🔧 Implementación Multi-Industria

### **1. Sistema de Detección Automática**

```typescript
// lib/agents/orquestador/detectarTipo.ts

export async function detectarTipoNegocio(descripcion: string): Promise<DeteccionNegocio> {
  const prompt = `
  Analiza esta descripción de negocio y determina:
  1. Tipo de negocio (restaurante, tienda_ropa, tecnologia, servicios, etc.)
  2. Categoría específica
  3. Target demográfico
  4. Palabras clave del dominio
  
  Descripción: "${descripcion}"
  
  Responde en JSON:
  {
    "tipo": "",
    "categoria": "",
    "target": "",
    "keywords": [],
    "industria": ""
  }
  `;
  
  const respuesta = await llamarIA(prompt);
  const deteccion = JSON.parse(respuesta);
  
  return {
    tipo: deteccion.tipo,
    categoria: deteccion.categoria,
    plantillaLanding: obtenerPlantillaLanding(deteccion.tipo),
    plantillaVendedor: `${deteccion.tipo}_vendedor`,
    plantillaAdmin: `${deteccion.tipo}_admin`,
    camposCatalogo: obtenerEstructuraCatalogo(deteccion.tipo),
    reglasNegocio: generarReglasAutomaticas(deteccion)
  };
}

// Ejemplos de salida:
// "tienda de ropa para jóvenes" → tipo: "tienda_ropa", plantilla: "fashion_modern"
// "restaurante de hamburguesas" → tipo: "restaurante", plantilla: "restaurant_modern"
// "tienda de laptops" → tipo: "tecnologia", plantilla: "tech_clean"
// "gimnasio" → tipo: "servicios", categoria: "fitness", plantilla: "fitness_energy"
```

### **2. Catálogos Dinámicos por Tipo**

```typescript
// lib/agents/orquestador/catalogos.ts

export function obtenerEstructuraCatalogo(tipoNegocio: string): CamposCatalogo {
  const estructuras = {
    "restaurante": {
      camposBase: ["nombre", "descripcion", "precio", "imagen"],
      camposEspecificos: ["ingredientes", "calorias", "tiempo_prep", "alergenos"],
      variantes: ["tamaños", "extras"],
      unidad: "porción"
    },
    
    "tienda_ropa": {
      camposBase: ["nombre", "descripcion", "precio", "imagen"],
      camposEspecificos: ["marca", "material", "temporada", "genero"],
      variantes: ["tallas", "colores"],
      unidad: "pieza"
    },
    
    "tecnologia": {
      camposBase: ["nombre", "descripcion", "precio", "imagen"],
      camposEspecificos: ["marca", "modelo", "especificaciones", "garantia"],
      variantes: ["almacenamiento", "ram", "color"],
      unidad: "unidad"
    },
    
    "servicios": {
      camposBase: ["nombre", "descripcion", "precio", "imagen"],
      camposEspecificos: ["duracion", "requisitos", "nivel"],
      variantes: ["horarios", "modalidad"],
      unidad: "sesión"
    },
    
    "educacion": {
      camposBase: ["nombre", "descripcion", "precio", "imagen"],
      camposEspecificos: ["duracion_horas", "nivel", "instructor", "certificado"],
      variantes: ["modalidad"],
      unidad: "curso"
    },
    
    "salud": {
      camposBase: ["nombre", "descripcion", "precio", "imagen"],
      camposEspecificos: ["principio_activo", "presentacion", "receta_requerida"],
      variantes: ["dosis", "cantidad"],
      unidad: "unidad"
    }
  };
  
  return estructuras[tipoNegocio] || estructuras["servicios"]; // fallback
}
```

### **3. Generador Universal de Agentes**

```typescript
// lib/agents/generator.ts

export async function generarAgenteVendedor(config: ConfigAgente): Promise<AgenteConfig> {
  const { tipoNegocio, marca, catalogo, personalidad } = config;
  
  // 1. Cargar plantilla base
  let plantillaPrompt: string;
  try {
    const modulo = await import(`./prompts/templates/${tipoNegocio}_vendedor.ts`);
    plantillaPrompt = modulo.default;
  } catch {
    // Si no existe plantilla específica, usar genérica
    plantillaPrompt = await import(`./prompts/templates/generic_vendedor.ts`).default;
  }
  
  // 2. Personalizar con datos del negocio
  const prompt = plantillaPrompt
    .replace('{NOMBRE_NEGOCIO}', marca.nombre)
    .replace('{TIPO_NEGOCIO}', tipoNegocio)
    .replace('{TONO}', personalidad)
    .replace('{CATALOGO}', JSON.stringify(catalogo, null, 2))
    .replace('{REGLAS}', JSON.stringify(config.reglasDominio, null, 2));
  
  // 3. Determinar capacidades según tipo
  const capacidades = obtenerCapacidadesPorTipo(tipoNegocio);
  
  return {
    nombre: obtenerNombreAgente(tipoNegocio), // "María", "Sofía", "Alex", etc.
    prompt_base: prompt,
    configuracion: {
      modelo: 'gpt-4',
      temperatura: 0.7,
      max_tokens: 500,
      capacidades
    }
  };
}

function obtenerCapacidadesPorTipo(tipo: string): string[] {
  const capacidadesPorTipo = {
    "restaurante": ["upselling", "combos", "personalizacion_pedido"],
    "tienda_ropa": ["asesorar_tallas", "crear_outfits", "combinar_prendas"],
    "tecnologia": ["comparar_specs", "recomendar_uso", "soporte_tecnico"],
    "servicios": ["agendar_citas", "cotizar", "evaluar_requisitos"],
    "educacion": ["evaluar_nivel", "recomendar_ruta", "explicar_contenido"],
    "salud": ["verificar_compatibilidad", "recomendar_dosificacion", "explicar_uso"]
  };
  
  return capacidadesPorTipo[tipo] || ["asesorar", "recomendar", "vender"];
}

function obtenerNombreAgente(tipo: string): string {
  const nombresPorTipo = {
    "restaurante": "María",
    "tienda_ropa": "Sofía",
    "tecnologia": "Alex",
    "servicios": "Luna",
    "educacion": "Prof. Ana",
    "salud": "Dr. Carlos",
    "fitness": "Coach Mike"
  };
  
  return nombresPorTipo[tipo] || "Asistente";
}
```

---

## 🎯 Ventajas del Sistema Multi-Industria

### ✅ **Para el Usuario (Dueño del Negocio)**

1. **Sin código**: Solo conversación con el Orquestador
2. **Adaptación automática**: El sistema detecta su industria
3. **Agentes especializados**: No es un chatbot genérico
4. **Escalable**: Puede crear N negocios de diferentes tipos

### ✅ **Para los Clientes Finales**

1. **Experiencia personalizada**: El agente vendedor conoce su industria
2. **Lenguaje apropiado**: Términos técnicos o casuales según negocio
3. **Recomendaciones relevantes**: Basadas en el tipo de producto/servicio
4. **Interfaz adaptada**: Landing acorde al negocio

### ✅ **Para la Plataforma (Maket AI)**

1. **Un solo codebase**: Sirve para todas las industrias
2. **Plantillas reutilizables**: Fácil agregar nuevos tipos
3. **Escalabilidad**: Miles de negocios diversos
4. **Datos valiosos**: Aprende de múltiples industrias

---

### 1. **Orquestador (Constructor del Negocio)**

#### 🎯 Función Principal
Automatizar la creación completa del negocio mediante conversación con el dueño.

#### ✨ Características
- **Conversacional**: Dialoga con el dueño paso a paso
- **11 Fases estructuradas**: Desde tipo de negocio hasta activación
- **Interpretación inteligente**: Entiende instrucciones en lenguaje natural
- **Generación automática**: Crea landing, configura agentes, prepara catálogo
- **Adaptativo**: Se ajusta según tipo de industria detectada

#### 📝 Flujo de Trabajo

```
DUEÑO: "Quiero crear un restaurante de hamburguesas"
    ↓
ORQUESTADOR: Detecta → tipo: 'restaurante', categoria: 'comida_rapida'
    ↓
FASE 1-2: Tipo de negocio y plantilla
    ├─ Selecciona plantilla de landing para restaurante
    └─ Prepara estructuras de datos para menú y pedidos
    ↓
FASE 3: Identidad de marca
    ORQUESTADOR: "¿Cómo se llamará tu restaurante?"
    DUEÑO: "Burger King's"
    ORQUESTADOR: "¿Qué colores representan tu marca?"
    DUEÑO: "Rojo y amarillo, estilo vibrante y juvenil"
    ↓
FASE 4-5: Personalización y catálogo
    ORQUESTADOR: "¿Qué productos ofrecerás?"
    DUEÑO: "Hamburguesas, papas fritas, bebidas, combos"
    ↓
    Sistema genera automáticamente:
    ├─ Categorías: Hamburguesas, Acompañamientos, Bebidas, Combos
    ├─ Estructura de ingredientes
    └─ Sistema de variantes (tamaños, extras)
    ↓
FASE 6: Reglas de dominio (AUTOMÁTICO)
    Sistema detecta:
    ├─ Dominio permitido: "comida rápida, hamburguesas, fast food"
    ├─ Dominios bloqueados: "pizza, sushi, tecnología, ropa"
    └─ Keywords: ["hamburguesa", "burger", "papas", "combo"]
    ↓
FASE 7: Configuración de agentes (AUTOMÁTICO)
    Sistema genera:
    ├─ MARÍA (Vendedor)
    │   └─ Prompt basado en plantilla "restaurante_vendedor"
    │       ├─ Personalidad: amigable y entusiasta
    │       ├─ Catálogo: productos del menú
    │       ├─ Reglas: solo sugerir del menú actual
    │       └─ Capacidades: upselling, combos, personalización
    │
    └─ MAX (Administrador)
        └─ Prompt basado en plantilla "restaurante_admin"
            ├─ Capacidades: gestión inventario
            ├─ Alertas: stock bajo, pedidos atrasados
            └─ Decisiones: precios dinámicos, promociones
    ↓
FASE 8-9: Configuración comercial y automatizaciones
    ORQUESTADOR: "¿Qué métodos de pago aceptarás?"
    DUEÑO: "Tarjeta, efectivo y transferencia"
    ↓
    ORQUESTADOR: "¿Tiempo de entrega estimado?"
    DUEÑO: "20-30 minutos"
    ↓
FASE 10-11: Preview y activación
    Sistema muestra:
    ├─ Preview de la landing page
    ├─ Configuración de María y Max
    └─ Catálogo completo
    ↓
    DUEÑO: "Activar negocio"
    ↓
    Sistema:
    ├─ Genera URL pública: maket-ai.com/tienda/burger-kings
    ├─ Activa agentes María y Max
    └─ ✅ NEGOCIO OPERATIVO
```

#### 🛠️ Implementación

```typescript
// lib/agents/orquestador.ts

interface OrquestadorState {
  faseActual: number;
  datosRecopilados: {
    tipoNegocio?: string;
    categoria?: string;
    marca?: any;
    catalogo?: any;
    configuracion?: any;
  };
  negocio: {
    id_negocio: string;
    id_usuario: string;
  };
}

export class AgenteOrquestador {
  private state: OrquestadorState;
  
  constructor(idNegocio: string, idUsuario: string) {
    this.state = {
      faseActual: 1,
      datosRecopilados: {},
      negocio: { id_negocio: idNegocio, id_usuario: idUsuario }
    };
  }
  
  async procesarMensaje(mensaje: string): Promise<string> {
    switch(this.state.faseActual) {
      case 1: return await this.fase1_tipoNegocio(mensaje);
      case 2: return await this.fase2_plantilla(mensaje);
      case 3: return await this.fase3_marca(mensaje);
      case 4: return await this.fase4_personalizacion(mensaje);
      case 5: return await this.fase5_catalogo(mensaje);
      case 6: return await this.fase6_reglasAutomaticas();
      case 7: return await this.fase7_configurarAgentes();
      case 8: return await this.fase8_comercial(mensaje);
      case 9: return await this.fase9_automatizaciones(mensaje);
      case 10: return await this.fase10_preview();
      case 11: return await this.fase11_activacion();
      default: return "Negocio completado";
    }
  }
  
  private async fase1_tipoNegocio(mensaje: string): Promise<string> {
    // Detectar tipo de negocio con IA
    const deteccion = await detectarTipoNegocio(mensaje);
    
    this.state.datosRecopilados.tipoNegocio = deteccion.tipo;
    this.state.datosRecopilados.categoria = deteccion.categoria;
    
    // Guardar en BD
    await supabase
      .from('negocios')
      .update({ 
        tipo_negocio: deteccion.tipo,
        categoria: deteccion.categoria 
      })
      .eq('id_negocio', this.state.negocio.id_negocio);
    
    this.state.faseActual = 2;
    
    return `Perfecto, detecté que quieres crear un ${deteccion.tipo}. 
            Vamos a la siguiente fase: selección de plantilla.`;
  }
  
  private async fase7_configurarAgentes(): Promise<string> {
    const { tipoNegocio, marca, catalogo } = this.state.datosRecopilados;
    
    // 1. Generar configuración de MARÍA (Vendedor)
    const mariaConfig = await generarAgenteVendedor({
      tipoNegocio,
      plantilla: `${tipoNegocio}_vendedor`, // "restaurante_vendedor"
      marca,
      catalogo,
      personalidad: marca.tono_comunicacion
    });
    
    // 2. Generar configuración de MAX (Administrador)
    const maxConfig = await generarAgenteAdministrador({
      tipoNegocio,
      plantilla: `${tipoNegocio}_admin`,
      capacidades: ['inventario', 'precios', 'reportes']
    });
    
    // 3. Guardar en BD
    await supabase.from('agentes').insert([
      {
        id_negocio: this.state.negocio.id_negocio,
        tipo: 'vendedor',
        nombre: 'María',
        prompt_base: mariaConfig.prompt,
        configuracion: mariaConfig.config,
        estado: 'activo'
      },
      {
        id_negocio: this.state.negocio.id_negocio,
        tipo: 'administrador',
        nombre: 'Max',
        prompt_base: maxConfig.prompt,
        configuracion: maxConfig.config,
        estado: 'activo'
      }
    ]);
    
    this.state.faseActual = 8;
    
    return `Excelente. He configurado tus agentes inteligentes:
            
            🤖 María - Tu asesora de ventas
            Personalidad: ${marca.tono_comunicacion}
            Especialidad: ${tipoNegocio}
            
            📊 Max - Tu administrador
            Capacidades: Inventario, reportes, decisiones automáticas
            
            Ahora configuremos los aspectos comerciales...`;
  }
}

// Función auxiliar: Generar agente vendedor
async function generarAgenteVendedor(params: any) {
  const { tipoNegocio, plantilla, marca, catalogo, personalidad } = params;
  
  // Cargar plantilla base
  const plantillaPrompt = await import(`./prompts/templates/${plantilla}.ts`);
  
  // Personalizar con datos del negocio
  const prompt = plantillaPrompt.default
    .replace('{NOMBRE_NEGOCIO}', marca.nombre)
    .replace('{TONO}', personalidad)
    .replace('{CATALOGO}', JSON.stringify(catalogo))
    .replace('{REGLAS}', JSON.stringify(await getReglasDominio(params)));
  
  return {
    prompt,
    config: {
      modelo: 'gpt-4',
      temperatura: 0.7,
      max_tokens: 500,
      capacidades: ['upselling', 'personalizacion', 'combos']
    }
  };
}
```

---

### 2. **María - Asesor de Ventas** 💬

#### 🎯 Función Principal
Interactuar con clientes, entender preferencias y guiar en el proceso de compra.

#### ✨ Características

**1. Aprendizaje de Preferencias**
```sql
-- Perfil automático por cliente
CREATE TABLE customer_profiles (
  id UUID PRIMARY KEY,
  id_negocio UUID REFERENCES negocios(id_negocio),
  customer_identifier VARCHAR(255), -- email o nombre
  
  -- Lo que aprende automáticamente
  average_spend DECIMAL(10,2),
  favorite_products JSONB,
  never_buys JSONB,      -- ["Cebolla", "Tomate"]
  always_buys JSONB,     -- ["Salsa extra", "Queso extra"]
  preferred_time TIME,
  purchase_frequency VARCHAR(20),
  
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trigger automático que actualiza el perfil
CREATE TRIGGER actualizar_perfil_maria
AFTER INSERT ON ventas
WHEN NEW.estado = 'completada'
EXECUTE FUNCTION analizar_preferencias_cliente();
```

**2. Redirección Contextual**

María siempre dirige las conversaciones hacia los productos del negocio:

```typescript
// lib/agents/prompts/templates/restaurante_vendedor.ts

export default `
Eres María, asesora de ventas de {NOMBRE_NEGOCIO}.

PERSONALIDAD: {TONO}

CATÁLOGO DISPONIBLE:
{CATALOGO}

REGLAS DE DOMINIO:
- SOLO puedes sugerir productos del catálogo arriba
- NUNCA menciones productos fuera del dominio "{TIPO_NEGOCIO}"
- SI el cliente pregunta por algo que no tenemos, ofrece la alternativa más cercana

ESTRATEGIA DE VENTA:
1. Escuchar atentamente el pedido completo
2. Confirmar y personalizar según historial
3. Hacer UNA sugerencia estratégica (upselling)
4. Agregar al carrito solo lo confirmado
5. Finalizar con amabilidad

EJEMPLO DE CONVERSACIÓN:

Cliente: "Quiero una hamburguesa"

María (interno): 
  - Verifico perfil del cliente
  - Historial: siempre pide sin cebolla
  - Nunca ha probado los combos
  
María (respuesta): 
"¡Perfecto! Tengo nuestra SmartBurger Clásica ($5.99).
Como siempre, ¿la preparo sin cebolla? 😊

💡 Tip: Si agregas papas y bebida ahora, ahorras $2 con el combo."

Cliente: "Ok, el combo con Sprite"

María: "Excelente elección 🎉
- Combo SmartBurger Clásica
- Sin cebolla
- Con Sprite
Total: $9.99

¿Confirmo tu pedido?"
`;
```

**3. Integración con Carrito y Órdenes**

```typescript
// lib/agents/maria.ts

export class AgenteMaria {
  private perfilCliente?: CustomerProfile;
  private carrito: CartItem[] = [];
  
  async procesarMensaje(mensaje: string, clienteId: string): Promise<string> {
    // 1. Cargar perfil del cliente
    this.perfilCliente = await getCustomerProfile(clienteId, this.idNegocio);
    
    // 2. Generar contexto personalizado
    const contexto = this.generarContexto();
    
    // 3. Enviar a IA con contexto
    const respuesta = await llamarIA({
      prompt: this.promptBase,
      contexto,
      mensaje,
      historial: this.historial
    });
    
    // 4. Detectar acciones (agregar al carrito, finalizar orden)
    const acciones = this.detectarAcciones(respuesta);
    
    // 5. Ejecutar acciones
    for (const accion of acciones) {
      await this.ejecutarAccion(accion);
    }
    
    return respuesta;
  }
  
  private generarContexto(): string {
    if (!this.perfilCliente) return "";
    
    return `
    👤 PERFIL DEL CLIENTE:
    - Promedio de gasto: $${this.perfilCliente.average_spend}
    - Productos favoritos: ${this.perfilCliente.favorite_products.join(', ')}
    - Nunca pide: ${this.perfilCliente.never_buys.join(', ')}
    - Siempre pide: ${this.perfilCliente.always_buys.join(', ')}
    
    💡 USA ESTE PERFIL PARA:
    - Sugerir productos en su rango de precio
    - Preparar sin los ingredientes que no le gustan
    - Ofrecer sus extras favoritos automáticamente
    `;
  }
  
  private async ejecutarAccion(accion: Action) {
    switch(accion.tipo) {
      case 'agregar_carrito':
        await this.agregarAlCarrito(accion.producto);
        break;
      case 'finalizar_orden':
        await this.crearOrden();
        break;
      case 'aplicar_descuento':
        await this.aplicarDescuento(accion.codigo);
        break;
    }
  }
  
  private async crearOrden(): Promise<void> {
    const orden = {
      id_negocio: this.idNegocio,
      customer_identifier: this.clienteId,
      items: this.carrito,
      total: this.calcularTotal(),
      estado: 'pendiente'
    };
    
    await supabase.from('ventas').insert(orden);
    
    // Trigger automático actualizará el perfil del cliente
    this.carrito = [];
  }
}
```

---

### 3. **Max - Administrador** 📊

#### 🎯 Función Principal
Gestionar operaciones internas y tomar decisiones autónomas sobre el negocio.

#### ✨ Capacidades (15 funciones)

Inspirado en el MAX de 5palos:

**Categoría 1: Gestión de Inventario**
```typescript
// lib/agents/max/inventario.ts

export class MaxInventario {
  // 1. Detectar stock crítico
  async detectarStockCritico(): Promise<Alert[]> {
    const { data } = await supabase
      .from('productos')
      .select('*')
      .lte('stock', 'stock_minimo')
      .eq('id_negocio', this.idNegocio);
    
    const alertas: Alert[] = [];
    
    for (const producto of data) {
      // Analizar velocidad de venta
      const velocidad = await this.analizarVelocidadVenta(producto.id);
      
      // Calcular días hasta agotamiento
      const diasRestantes = producto.stock / velocidad;
      
      if (diasRestantes < 3) {
        alertas.push({
          tipo: 'stock_critico',
          producto: producto.nombre,
          severidad: 'alta',
          accion_recomendada: 'reposicion_urgente',
          razon: `Stock actual: ${producto.stock}. Se agotará en ${diasRestantes} días.`
        });
      }
    }
    
    return alertas;
  }
  
  // 2. Generar orden de reposición automática
  async generarOrdenReposicion(productoId: string): Promise<void> {
    const producto = await getProducto(productoId);
    const velocidad = await this.analizarVelocidadVenta(productoId);
    
    // Calcular cantidad óptima (15 días de inventario)
    const cantidadOptima = Math.ceil(velocidad * 15);
    
    await supabase.from('ordenes_reposicion').insert({
      id_negocio: this.idNegocio,
      producto_id: productoId,
      cantidad: cantidadOptima,
      razon: `Stock actual: ${producto.stock}. Velocidad: ${velocidad}/día.`,
      generado_por: 'max_auto',
      created_at: new Date()
    });
    
    // Log de decisión
    await this.logDecision({
      accion: 'orden_reposicion_creada',
      producto: producto.nombre,
      cantidad: cantidadOptima,
      razonamiento: `Anticipando agotamiento en ${producto.stock / velocidad} días`
    });
  }
  
  // 3. Optimizar niveles de stock
  async optimizarNivelesStock(): Promise<void> {
    const productos = await getProductos(this.idNegocio);
    
    for (const producto of productos) {
      const velocidad = await this.analizarVelocidadVenta(producto.id);
      
      // Calcular niveles óptimos
      const stockMinimo = Math.ceil(velocidad * 5); // 5 días mínimo
      const stockMaximo = Math.ceil(velocidad * 20); // 20 días máximo
      
      await supabase
        .from('productos')
        .update({ 
          stock_minimo: stockMinimo,
          stock_maximo: stockMaximo,
          updated_by: 'max_auto'
        })
        .eq('id', producto.id);
    }
  }
}
```

**Categoría 2: Optimización de Precios**
```typescript
// lib/agents/max/precios.ts

export class MaxPrecios {
  // 4. Precios dinámicos por demanda
  async ajustarPreciosDinamicos(): Promise<void> {
    const horaActual = new Date().getHours();
    const diaSemana = new Date().getDay();
    
    // Detectar hora pico
    const esHoraPico = (horaActual >= 12 && horaActual <= 14) || 
                       (horaActual >= 19 && horaActual <= 21);
    
    if (esHoraPico) {
      // Aumentar precios en productos de alta demanda
      const productosPopulares = await this.getProductosPopulares();
      
      for (const producto of productosPopulares) {
        await this.aplicarAjustePrecio(producto.id, 1.10); // +10%
      }
    } else {
      // Crear promociones en hora valle
      await this.crearPromocionHoraValle();
    }
  }
  
  // 5. Promociones automáticas
  async crearPromocionesInteligentes(): Promise<void> {
    // Detectar productos con stock alto y venta baja
    const productosLentos = await supabase
      .from('productos')
      .select('*, ventas_items(count)')
      .gte('stock', 'stock_maximo * 0.8')
      .having('ventas_items.count < 5');
    
    for (const producto of productosLentos.data) {
      // Crear promoción para acelerar venta
      await supabase.from('promociones').insert({
        id_negocio: this.idNegocio,
        tipo: 'descuento_porcentaje',
        valor: 20, // 20% descuento
        productos: [producto.id],
        activa: true,
        razon: `Stock alto (${producto.stock}), venta lenta`,
        generado_por: 'max_auto',
        vigencia_hasta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      });
    }
  }
}
```

**Categoría 3: Análisis y Reportes**
```typescript
// lib/agents/max/reportes.ts

export class MaxReportes {
  // 6. Reporte diario automático
  async generarReporteDiario(): Promise<Report> {
    const hoy = new Date();
    
    const reporte = {
      fecha: hoy,
      metricas: {
        ventasHoy: await this.getVentasHoy(),
        ingresosHoy: await this.getIngresosHoy(),
        ticketPromedio: await this.getTicketPromedio(),
        clientesNuevos: await this.getClientesNuevos(),
        productosMasVendidos: await this.getTopProductos(5)
      },
      alertas: await this.getAlertasActivas(),
      decisiones: await this.getDecisionesTomadas(),
      recomendaciones: await this.generarRecomendaciones()
    };
    
    // Enviar al dueño del negocio
    await this.enviarReporte(reporte);
    
    return reporte;
  }
  
  // 7. Análisis de rentabilidad por producto
  async analizarRentabilidad(): Promise<void> {
    const productos = await getProductos(this.idNegocio);
    
    for (const producto of productos) {
      const ventas = await getVentasProducto(producto.id, 30); // últimos 30 días
      const costo = producto.costo_produccion || 0;
      const precio = producto.precio;
      
      const margen = ((precio - costo) / precio) * 100;
      const rentabilidad = (precio - costo) * ventas.length;
      
      await supabase
        .from('analytics_productos')
        .upsert({
          producto_id: producto.id,
          margen_porcentaje: margen,
          rentabilidad_mensual: rentabilidad,
          ventas_mensuales: ventas.length,
          clasificacion: margen > 50 ? 'alta' : margen > 30 ? 'media' : 'baja'
        });
      
      // Si el producto no es rentable, alertar
      if (margen < 20) {
        await this.crearAlerta({
          tipo: 'rentabilidad_baja',
          producto: producto.nombre,
          margen: margen,
          recomendacion: 'Considerar aumentar precio o reducir costos'
        });
      }
    }
  }
}
```

**Categoría 4: Decisiones Autónomas**
```typescript
// lib/agents/max/decisiones.ts

export class MaxDecisiones {
  // Motor de decisiones
  async tomarDecisionesAutonomas(): Promise<void> {
    // Ejecutar cada hora
    const decisiones = [];
    
    // 1. Revisar inventario
    const alertasStock = await this.detectarStockCritico();
    for (const alerta of alertasStock) {
      if (alerta.severidad === 'alta') {
        await this.generarOrdenReposicion(alerta.producto_id);
        decisiones.push({
          tipo: 'reposicion_automatica',
          producto: alerta.producto,
          razon: alerta.razon
        });
      }
    }
    
    // 2. Ajustar precios
    await this.ajustarPreciosDinamicos();
    decisiones.push({
      tipo: 'ajuste_precios',
      razon: 'Optimización por hora del día'
    });
    
    // 3. Crear promociones
    const productosLentos = await this.detectarProductosLentos();
    if (productosLentos.length > 0) {
      await this.crearPromocionesInteligentes();
      decisiones.push({
        tipo: 'promociones_creadas',
        productos: productosLentos.map(p => p.nombre),
        razon: 'Acelerar venta de productos con stock alto'
      });
    }
    
    // 4. Log de todas las decisiones
    await supabase.from('autonomous_actions').insert(
      decisiones.map(d => ({
        id_negocio: this.idNegocio,
        action_type: d.tipo,
        decision_reason: d.razon,
        data_analyzed: d,
        created_by: 'max_auto',
        created_at: new Date()
      }))
    );
  }
  
  // API para que el dueño consulte decisiones
  async getDecisionesRecientes(limite: number = 10): Promise<Decision[]> {
    const { data } = await supabase
      .from('autonomous_actions')
      .select('*')
      .eq('id_negocio', this.idNegocio)
      .order('created_at', { ascending: false })
      .limit(limite);
    
    return data.map(d => ({
      fecha: d.created_at,
      tipo: d.action_type,
      razon: d.decision_reason,
      resultado: d.success ? 'Exitosa' : 'Fallida'
    }));
  }
}
```

---

## 🔄 Flujo Completo del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    FASE 1: CREACIÓN DEL NEGOCIO                  │
└─────────────────────────────────────────────────────────────────┘

Dueño → "Quiero crear un restaurante de hamburguesas"
    ↓
ORQUESTADOR (11 fases conversacionales)
    ├─ Detecta tipo: restaurante
    ├─ Selecciona plantilla de landing
    ├─ Configura identidad de marca
    ├─ Genera estructura de catálogo
    ├─ Crea reglas de dominio automáticamente
    ├─ GENERA AGENTE MARÍA (vendedor)
    │   └─ Prompt: restaurante_vendedor + datos del negocio
    ├─ GENERA AGENTE MAX (administrador)
    │   └─ Prompt: restaurante_admin + capacidades
    ├─ Configura aspectos comerciales
    └─ ACTIVA EL NEGOCIO
    
    ↓
    
┌─────────────────────────────────────────────────────────────────┐
│                    RESULTADO: NEGOCIO OPERATIVO                  │
└─────────────────────────────────────────────────────────────────┘

✅ Landing page pública: maket-ai.com/tienda/burger-kings
✅ María (vendedor) activa y lista
✅ Max (administrador) tomando decisiones automáticas
✅ Base de datos configurada
✅ Catálogo cargado

    ↓
    
┌─────────────────────────────────────────────────────────────────┐
│                    FASE 2: OPERACIÓN DEL NEGOCIO                 │
└─────────────────────────────────────────────────────────────────┘

CLIENTE → Visita la landing page
    ↓
CLIENTE → Abre chat con María
    ↓
MARÍA:
    ├─ Carga perfil del cliente (si existe)
    ├─ "Hola! Bienvenido a Burger King's 🍔"
    └─ "¿Qué se te antoja hoy?"
    
CLIENTE: "Quiero una hamburguesa sin cebolla y papas"
    ↓
MARÍA:
    ├─ Verifica perfil: cliente nuevo (no hay historial)
    ├─ Busca en catálogo: hamburguesas disponibles
    ├─ Detecta personalización: sin cebolla
    ├─ Detecta producto adicional: papas
    └─ Responde:
        "Perfecto! Tengo:
        - SmartBurger Clásica ($5.99) sin cebolla
        - Papas grandes ($2.99)
        
        💡 Si lo conviertes en combo, ahorras $2 y llevas bebida.
        ¿Te interesa?"
    
CLIENTE: "Sí, el combo con Coca-Cola"
    ↓
MARÍA:
    ├─ Agrega al carrito:
    │   - Combo SmartBurger ($9.99)
    │   - Sin: cebolla
    │   - Bebida: Coca-Cola
    ├─ "¿Confirmo tu pedido?"
    
CLIENTE: "Sí"
    ↓
MARÍA:
    ├─ Crea orden en BD
    ├─ Estado: 'pendiente'
    └─ "¡Listo! Tu pedido #001 está en camino.
        Tiempo estimado: 20-30 min 🚀"
    
    ┌──────── TRIGGER AUTOMÁTICO ────────┐
    │                                    │
    │ 1. Orden completada                │
    │     ↓                              │
    │ 2. Actualizar perfil del cliente:  │
    │    - Primera compra                │
    │    - Gasto: $9.99                  │
    │    - Nunca pide: ["cebolla"]       │
    │     ↓                              │
    │ 3. Descontar stock:                │
    │    - Carne hamburguesa: -1         │
    │    - Pan: -1                       │
    │    - Papas: -150g                  │
    │    - Coca-Cola: -1                 │
    └────────────────────────────────────┘
    
    ↓
    
MAX (ejecuta cada hora):
    ├─ Detecta: stock de papas bajo (2kg restantes)
    ├─ Analiza velocidad: 500g/día
    ├─ Calcula: se agota en 4 días
    ┌─────────────────────────────┐
    │ DECISIÓN AUTÓNOMA DE MAX:    │
    │                             │
    │ Generar orden de reposición │
    │ Producto: Papas             │
    │ Cantidad: 15kg              │
    │ Razón: Stock crítico        │
    └─────────────────────────────┘
    │
    ├─ Crea alerta para el dueño
    └─ Log en autonomous_actions

```

---

## 🛠️ Plan de Implementación

### **Sprint 1: Infraestructura Base** (Semana 1-2)

#### Tareas:
- [ ] Crear tabla `agentes`
- [ ] Crear tabla `customer_profiles`
- [ ] Crear tabla `autonomous_actions`
- [ ] Crear tabla `business_settings`
- [ ] Implementar triggers automáticos
- [ ] Configurar RLS policies

```sql
-- Tabla de agentes
CREATE TABLE agentes (
  id_agente UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_negocio UUID REFERENCES negocios(id_negocio) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- 'constructor', 'vendedor', 'administrador'
  nombre VARCHAR(100),
  personalidad VARCHAR(100),
  prompt_base TEXT,
  plantilla_prompt VARCHAR(100),
  configuracion JSONB,
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de perfiles de clientes
CREATE TABLE customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_negocio UUID REFERENCES negocios(id_negocio) ON DELETE CASCADE,
  customer_identifier VARCHAR(255) NOT NULL,
  
  -- Estadísticas
  total_purchases INTEGER DEFAULT 0,
  average_spend DECIMAL(10,2),
  total_spent DECIMAL(12,2),
  
  -- Preferencias aprendidas
  favorite_products JSONB DEFAULT '[]',
  never_buys JSONB DEFAULT '[]',
  always_buys JSONB DEFAULT '[]',
  preferred_time TIME,
  
  last_purchase_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(id_negocio, customer_identifier)
);

-- Tabla de decisiones autónomas
CREATE TABLE autonomous_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_negocio UUID REFERENCES negocios(id_negocio) ON DELETE CASCADE,
  action_type VARCHAR(100),
  decision_reason TEXT,
  data_analyzed JSONB,
  action_taken JSONB,
  success BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(50) DEFAULT 'max_auto',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trigger para actualizar perfil
CREATE OR REPLACE FUNCTION actualizar_perfil_cliente()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.estado = 'completada' THEN
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
    ON CONFLICT (id_negocio, customer_identifier) 
    DO UPDATE SET
      total_purchases = customer_profiles.total_purchases + 1,
      total_spent = customer_profiles.total_spent + NEW.total,
      average_spend = (customer_profiles.total_spent + NEW.total) / (customer_profiles.total_purchases + 1),
      last_purchase_at = NOW(),
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_perfil
AFTER INSERT OR UPDATE ON ventas
FOR EACH ROW
EXECUTE FUNCTION actualizar_perfil_cliente();
```

### **Sprint 2: Orquestador (Agente Constructor)** (Semana 3-4)

#### Tareas:
- [ ] Implementar clase `AgenteOrquestador`
- [ ] Crear 11 métodos de fases
- [ ] Sistema de detección de tipo de negocio (IA)
- [ ] Generador de configuraciones de agentes
- [ ] API `/api/constructor/mensaje`
- [ ] Interfaz de chat del constructor

```typescript
// app/api/constructor/mensaje/route.ts

import { AgenteOrquestador } from '@/lib/agents/orquestador';

export async function POST(request: Request) {
  const { idNegocio, mensaje } = await request.json();
  
  // Cargar o crear instancia del orquestador
  const orquestador = await AgenteOrquestador.load(idNegocio);
  
  // Procesar mensaje
  const respuesta = await orquestador.procesarMensaje(mensaje);
  
  // Guardar estado
  await orquestador.save();
  
  return Response.json({ 
    respuesta,
    faseActual: orquestador.state.faseActual,
    progreso: (orquestador.state.faseActual / 11) * 100
  });
}
```

### **Sprint 3: María (Agente Vendedor)** (Semana 5-6)

#### Tareas:
- [ ] Crear plantillas de prompts por industria
- [ ] Implementar clase `AgenteMaria`
- [ ] Sistema de carga de perfiles
- [ ] Generador de contexto personalizado
- [ ] API `/api/tienda/[id]/chat`
- [ ] Widget de chat flotante en tienda

```typescript
// lib/agents/prompts/templates/restaurante_vendedor.ts

export default `
Eres María, asesora de ventas de {NOMBRE_NEGOCIO}.

PERSONALIDAD: {TONO}

CATÁLOGO DISPONIBLE:
{CATALOGO}

REGLAS ESTRICTAS:
- SOLO sugieres productos del catálogo
- NUNCA menciones productos fuera del dominio "restaurante"
- SI el cliente pregunta por algo no disponible, ofrece alternativa

PERFIL DEL CLIENTE:
{PERFIL_CLIENTE}

ESTRATEGIA:
1. Escuchar pedido completo
2. Usar perfil para personalizar
3. Hacer UNA sugerencia (upselling)
4. Confirmar y agregar al carrito
5. Enviar a cocina

EJEMPLO:
Cliente: "Quiero hamburguesa"
María: "Perfecto! Tengo SmartBurger Clásica ($5.99).
       Veo que siempre pides sin cebolla, ¿igual ahora? 😊
       💡 Con papas y bebida, ahorras $2 (Combo $9.99)"
`;
```

### **Sprint 4: Max (Agente Administrador)** (Semana 7-8)

#### Tareas:
- [ ] Implementar módulos de Max:
  - [ ] `MaxInventario`
  - [ ] `MaxPrecios`
  - [ ] `MaxReportes`
  - [ ] `MaxDecisiones`
- [ ] Cron job cada hora para decisiones automáticas
- [ ] Dashboard de decisiones de IA
- [ ] Sistema de alertas

```typescript
// lib/agents/max/index.ts

export class AgenteMax {
  private inventario: MaxInventario;
  private precios: MaxPrecios;
  private reportes: MaxReportes;
  private decisiones: MaxDecisiones;
  
  constructor(idNegocio: string) {
    this.inventario = new MaxInventario(idNegocio);
    this.precios = new MaxPrecios(idNegocio);
    this.reportes = new MaxReportes(idNegocio);
    this.decisiones = new MaxDecisiones(idNegocio);
  }
  
  // Ejecutado cada hora por cron
  async ejecutarCicloAutonomo(): Promise<void> {
    console.log(`[MAX] Iniciando ciclo autónomo para negocio ${this.idNegocio}`);
    
    // 1. Revisar inventario
    await this.inventario.detectarStockCritico();
    
    // 2. Ajustar precios
    await this.precios.ajustarPreciosDinamicos();
    
    // 3. Crear promociones si es necesario
    await this.precios.crearPromocionesInteligentes();
    
    // 4. Tomar decisiones autónomas
    await this.decisiones.tomarDecisionesAutonomas();
    
    console.log(`[MAX] Ciclo completado`);
  }
  
  // Reporte diario (ejecutado a las 9am)
  async generarReporteDiario(): Promise<void> {
    const reporte = await this.reportes.generarReporteDiario();
    await this.reportes.enviarReporte(reporte);
  }
}
```

### **Sprint 5: Generación Dinámica de Landing** (Semana 9-10)

#### Tareas:
- [ ] Sistema de plantillas por tipo de negocio
- [ ] Renderizador dinámico de componentes
- [ ] Editor visual (opcional)
- [ ] Preview en tiempo real

```typescript
// lib/landing/generator.ts

export async function generarLanding(idNegocio: string) {
  // 1. Obtener configuración del negocio
  const negocio = await getNegocio(idNegocio);
  const marca = await getMarca(idNegocio);
  const catalogo = await getCatalogo(idNegocio);
  const plantilla = await getPlantilla(negocio.id_plantilla);
  
  // 2. Cargar plantilla de landing
  const templateConfig = plantilla.configuracion;
  
  // 3. Personalizar con datos del negocio
  const landingConfig = {
    hero: {
      titulo: marca.nombre,
      subtitulo: marca.slogan,
      imagen: marca.logo_url,
      cta: 'Ver menú',
      colores: {
        primario: marca.color_primario,
        secundario: marca.color_secundario
      }
    },
    productos: {
      mostrar: true,
      categorias: catalogo.categorias,
      layout: 'grid',
      columnas: 3
    },
    chatWidget: {
      agente: 'María',
      posicion: 'bottom-right',
      color: marca.color_primario
    }
  };
  
  return landingConfig;
}
```

### **Sprint 6: Integración y Testing** (Semana 11-12)

#### Tareas:
- [ ] Pruebas end-to-end del flujo completo
- [ ] Optimización de prompts
- [ ] Ajuste de parámetros de IA
- [ ] Dashboard administrativo completo
- [ ] Documentación de uso

---

## 📊 Métricas de Éxito

### KPIs del Sistema:

**Para el Orquestador:**
- ✅ Tasa de completación de negocios (target: >80%)
- ✅ Tiempo promedio de creación (target: <30 min)
- ✅ Satisfacción del dueño (target: 4.5/5)

**Para María:**
- ✅ Tasa de conversión (visitante → compra)
- ✅ Ticket promedio vs industria
- ✅ Satisfacción del cliente
- ✅ Uso de personalización (% de conversaciones personalizadas)

**Para Max:**
- ✅ Precisión de decisiones (% de decisiones correctas)
- ✅ Reducción de quiebres de stock
- ✅ Aumento en rentabilidad por optimización de precios
- ✅ Tiempo ahorrado al dueño

---

## 🎯 Próximos Pasos Inmediatos

### Opción A: Empezar por el Orquestador (Recomendado)
1. Crear estructura de clases
2. Implementar Fase 1 (detección de tipo)
3. Implementar Fase 7 (generación de agentes)
4. Probar flujo completo simple

### Opción B: Empezar por María
1. Crear plantilla de prompt para restaurante
2. Implementar carga de perfiles
3. Sistema de contexto personalizado
4. Integración con carrito

### Opción C: Infraestructura completa
1. Crear todas las tablas
2. Implementar triggers
3. Configurar RLS
4. Datos de prueba

---

¿Por cuál quieres que empecemos? 🚀
