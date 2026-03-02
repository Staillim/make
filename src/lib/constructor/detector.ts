/**
 * Detector de Tipo de Negocio
 * Usa IA para clasificar automáticamente la industria según la descripción del usuario
 * Soporta: OpenAI y Google Gemini
 */

import type { IndustriaTipo } from "../templates/vendedor";
import { crearClienteDesdeEnv } from "../ia/cliente-ia";

/**
 * Resultado de la detección de industria
 */
export interface DeteccionIndustria {
  tipo: IndustriaTipo;
  confianza: number; // 0-100
  razonamiento: string;
  categorias_sugeridas?: string[];
  tipo_producto?: "fisico" | "digital" | "mixto";
  alcance_sugerido?: "local" | "nacional" | "internacional";
}

/**
 * Opciones de configuración para la detección
 */
export interface OpcionesDeteccion {
  incluirRazonamiento?: boolean;
  incluirSugerencias?: boolean;
  umbralConfianza?: number; // mínimo para aceptar clasificación
}

/**
 * Detecta automáticamente el tipo de industria según la descripción del negocio
 * @param descripcion - Descripción del negocio proporcionada por el usuario
 * @param opciones - Opciones de configuración
 * @returns Resultado de la detección con tipo, confianza y detalles
 */
export async function detectarTipoNegocio(
  descripcion: string,
  opciones: OpcionesDeteccion = {}
): Promise<DeteccionIndustria> {
  const {
    incluirRazonamiento = true,
    incluirSugerencias = true,
    umbralConfianza = 70,
  } = opciones;

  // TODO: Integrar con OpenAI API
  // Por ahora, implementamos lógica de fallback con palabras clave

  const prompt = construirPromptDeteccion(descripcion, {
    incluirRazonamiento,
    incluirSugerencias,
  });

  try {
    // Intentar con IA (OpenAI o Gemini)
    const cliente = crearClienteDesdeEnv();
    cliente.setTemperatura(0.3); // Baja temperatura para consistencia
    
    const resultadoIA = await cliente.extraerJSON<DeteccionIndustria>(
      SYSTEM_PROMPT_DETECTOR,
      prompt
    );
    
    // Validar y retornar
    if (resultadoIA.confianza >= umbralConfianza) {
      return resultadoIA;
    }
    
    // Si confianza baja, usar palabras clave
    console.warn(`Confianza IA baja (${resultadoIA.confianza}%), usando fallback`);
    const resultado = detectarPorPalabrasClave(descripcion);

    if (resultado.confianza < umbralConfianza) {
      console.warn(
        `Confianza baja (${resultado.confianza}%) en detección para: "${descripcion}"`
      );
      // Si la confianza es muy baja, usar tipo genérico
      if (resultado.confianza < 50) {
        return {
          tipo: "otro",
          confianza: resultado.confianza,
          razonamiento: "No se pudo determinar con certeza el tipo de negocio",
        };
      }
    }

    return resultado;
  } catch (error) {
    console.error("Error al detectar tipo de negocio con IA:", error);
    // Fallback a detección por palabras clave
    console.log("Usando detección por palabras clave (fallback)");
    return detectarPorPalabrasClave(descripcion);
  }
}

/**
 * System prompt para el detector de industria
 */
const SYSTEM_PROMPT_DETECTOR = `Eres un experto clasificador de negocios.

Tu tarea es analizar descripciones de negocios y clasificarlas en una de estas categorías:

1. **restaurante**: Negocios de comida, bebidas, cafeterías, bares, food trucks
2. **tienda_ropa**: Tiendas de ropa, moda, accesorios, calzado, joyería
3. **tecnologia**: Venta de dispositivos electrónicos, gadgets, computadoras, smartphones
4. **gimnasio**: Gimnasios, estudios de fitness, entrenamiento personal, yoga, pilates
5. **educacion**: Cursos online, tutorías, academias, capacitación, e-learning
6. **servicios**: Servicios profesionales, consultoría, asesorías, freelancing
7. **otro**: Cualquier negocio que no encaje claramente en las anteriores

DEBES responder SOLO con JSON válido en este formato exacto:
{
  "tipo": "categoria_detectada",
  "confianza": 85,
  "razonamiento": "Explicación breve de por qué elegiste esta categoría",
  "categorias_sugeridas": ["Categoría 1", "Categoría 2", "Categoría 3"],
  "tipo_producto": "fisico",
  "alcance_sugerido": "local"
}

Reglas:
- confianza: número del 0 al 100 (qué tan seguro estás)
- tipo_producto: "fisico" | "digital" | "mixto"
- alcance_sugerido: "local" | "nacional" | "internacional"
- categorias_sugeridas: 3-5 categorías de productos que podría vender este negocio

Ejemplos:

Input: "Quiero vender hamburguesas y papas fritas"
Output: {"tipo": "restaurante", "confianza": 95, "razonamiento": "Venta de comida rápida", "categorias_sugeridas": ["Hamburguesas", "Papas fritas", "Bebidas", "Combos"], "tipo_producto": "fisico", "alcance_sugerido": "local"}

Input: "Ropa urbana para jóvenes"
Output: {"tipo": "tienda_ropa", "confianza": 90, "razonamiento": "Venta de ropa con enfoque en estilo urbano", "categorias_sugeridas": ["Camisetas", "Jeans", "Zapatos", "Gorras"], "tipo_producto": "fisico", "alcance_sugerido": "nacional"}

Responde SOLO con el JSON, sin texto adicional.`;

/**
 * Construye el prompt para la IA
 */
function construirPromptDeteccion(
  descripcion: string,
  opciones: { incluirRazonamiento: boolean; incluirSugerencias: boolean }
): string {
  return `Analiza esta descripción de negocio y clasifícala en una de estas categorías:

CATEGORÍAS DISPONIBLES:
- restaurante: Negocios de comida, bebidas, cafeterías, restaurantes
- tienda_ropa: Tiendas de ropa, moda, accesorios, calzado
- tecnologia: Venta de dispositivos electrónicos, gadgets, computadoras
- gimnasio: Gimnasios, estudios de fitness, entrenamiento personal
- educacion: Cursos online, tutorías, academias, capacitación
- servicios: Servicios profesionales, consultoría, asesorías
- otro: Cualquier otro tipo que no encaje en las anteriores

DESCRIPCIÓN DEL NEGOCIO:
"${descripcion}"

RESPONDE EN FORMATO JSON:
{
  "tipo": "categoria_detectada",
  "confianza": 85,
  ${opciones.incluirRazonamiento ? '"razonamiento": "Explicación breve",' : ""}
  ${opciones.incluirSugerencias ? '"categorias_sugeridas": ["cat1", "cat2"],' : ""}
  ${opciones.incluirSugerencias ? '"tipo_producto": "fisico|digital|mixto",' : ""}
  ${opciones.incluirSugerencias ? '"alcance_sugerido": "local|nacional|internacional"' : ""}
}`;
}

/**
 * Detección por palabras clave (fallback cuando no hay IA disponible)
 * @param descripcion - Descripción del negocio
 * @returns Resultado de detección
 */
function detectarPorPalabrasClave(descripcion: string): DeteccionIndustria {
  const texto = descripcion.toLowerCase();

  // Diccionario de palabras clave por industria
  const palabrasClave: Record<
    Exclude<IndustriaTipo, "otro">,
    { keywords: string[]; peso: number }[]
  > = {
    restaurante: [
      {
        keywords: [
          "comida",
          "restaurante",
          "cocina",
          "menú",
          "plato",
          "platillo",
          "chef",
          "mesero",
          "comer",
        ],
        peso: 3,
      },
      {
        keywords: [
          "hamburguesa",
          "pizza",
          "taco",
          "sushi",
          "pasta",
          "pollo",
          "carne",
          "vegetariano",
        ],
        peso: 5,
      },
      { keywords: ["café", "cafetería", "bar", "bebida", "cocktail"], peso: 3 },
      {
        keywords: [
          "delivery",
          "domicilio",
          "llevar",
          "pedido",
          "reserva",
          "mesa",
        ],
        peso: 2,
      },
    ],
    tienda_ropa: [
      {
        keywords: [
          "ropa",
          "moda",
          "vestido",
          "camisa",
          "pantalón",
          "zapato",
          "calzado",
        ],
        peso: 5,
      },
      { keywords: ["talla", "xl", "size", "outfit", "look", "estilo"], peso: 3 },
      {
        keywords: [
          "urbano",
          "casual",
          "formal",
          "deportivo",
          "elegante",
          "vintage",
        ],
        peso: 2,
      },
      {
        keywords: [
          "accesorio",
          "bolso",
          "cartera",
          "gorra",
          "gafas",
          "joyería",
        ],
        peso: 2,
      },
    ],
    tecnologia: [
      {
        keywords: [
          "tecnología",
          "tech",
          "electrónico",
          "dispositivo",
          "gadget",
        ],
        peso: 3,
      },
      {
        keywords: [
          "laptop",
          "computadora",
          "pc",
          "celular",
          "teléfono",
          "smartphone",
          "tablet",
        ],
        peso: 5,
      },
      {
        keywords: [
          "ram",
          "procesador",
          "almacenamiento",
          "pantalla",
          "batería",
          "cámara",
        ],
        peso: 4,
      },
      {
        keywords: ["apple", "samsung", "xiaomi", "huawei", "lenovo", "hp"],
        peso: 3,
      },
    ],
    gimnasio: [
      {
        keywords: [
          "gimnasio",
          "gym",
          "fitness",
          "entrenamiento",
          "ejercicio",
        ],
        peso: 5,
      },
      {
        keywords: [
          "pesas",
          "cardio",
          "musculación",
          "crossfit",
          "yoga",
          "pilates",
        ],
        peso: 4,
      },
      {
        keywords: [
          "membresía",
          "clase",
          "entrenador",
          "coach",
          "rutina",
          "plan",
        ],
        peso: 3,
      },
      {
        keywords: ["bajar peso", "músculo", "tonificar", "fuerza", "resistencia"],
        peso: 2,
      },
    ],
    educacion: [
      {
        keywords: [
          "curso",
          "educación",
          "aprender",
          "enseñar",
          "clase",
          "lección",
        ],
        peso: 5,
      },
      {
        keywords: [
          "online",
          "virtual",
          "e-learning",
          "academia",
          "escuela",
          "instituto",
        ],
        peso: 3,
      },
      {
        keywords: [
          "programación",
          "idiomas",
          "inglés",
          "matemáticas",
          "diseño",
          "marketing",
        ],
        peso: 3,
      },
      {
        keywords: [
          "certificado",
          "diploma",
          "profesor",
          "tutor",
          "estudiante",
          "alumno",
        ],
        peso: 2,
      },
    ],
    servicios: [
      {
        keywords: [
          "servicio",
          "consultoría",
          "asesoría",
          "consultor",
          "asesor",
        ],
        peso: 4,
      },
      {
        keywords: [
          "contable",
          "legal",
          "abogado",
          "contador",
          "diseño",
          "desarrollo",
        ],
        peso: 3,
      },
      {
        keywords: [
          "proyecto",
          "cliente",
          "propuesta",
          "cotización",
          "presupuesto",
        ],
        peso: 2,
      },
      {
        keywords: [
          "marketing",
          "publicidad",
          "redes sociales",
          "seo",
          "web",
          "app",
        ],
        peso: 2,
      },
    ],
  };

  // Calcular puntuación por industria
  const puntuaciones: Record<string, number> = {};

  for (const [industria, grupos] of Object.entries(palabrasClave)) {
    let puntuacion = 0;

    for (const grupo of grupos) {
      const coincidencias = grupo.keywords.filter((keyword) =>
        texto.includes(keyword)
      );
      puntuacion += coincidencias.length * grupo.peso;
    }

    puntuaciones[industria] = puntuacion;
  }

  // Encontrar la industria con mayor puntuación
  const industriaDetectada = Object.entries(puntuaciones).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0] as Exclude<IndustriaTipo, "otro">;

  const puntuacionMax = puntuaciones[industriaDetectada];

  // Calcular confianza (0-100)
  const confianza = Math.min(
    100,
    Math.round((puntuacionMax / (descripcion.split(" ").length * 2)) * 100)
  );

  // Determinar tipo de producto y alcance
  const tipoProducto = determinarTipoProducto(texto);
  const alcanceSugerido = determinarAlcance(texto);

  return {
    tipo: confianza > 30 ? industriaDetectada : "otro",
    confianza,
    razonamiento: `Detectado basado en palabras clave relacionadas con ${industriaDetectada}`,
    tipo_producto: tipoProducto,
    alcance_sugerido: alcanceSugerido,
  };
}

/**
 * Determina si los productos son físicos, digitales o mixtos
 */
function determinarTipoProducto(
  texto: string
): "fisico" | "digital" | "mixto" {
  const keywordsDigital = [
    "online",
    "digital",
    "virtual",
    "curso",
    "ebook",
    "software",
    "app",
    "descargable",
  ];
  const keywordsFisico = [
    "tienda",
    "local",
    "envío",
    "delivery",
    "producto",
    "stock",
    "inventario",
  ];

  const esDigital = keywordsDigital.some((k) => texto.includes(k));
  const esFisico = keywordsFisico.some((k) => texto.includes(k));

  if (esDigital && esFisico) return "mixto";
  if (esDigital) return "digital";
  return "fisico";
}

/**
 * Determina el alcance del negocio
 */
function determinarAlcance(
  texto: string
): "local" | "nacional" | "internacional" {
  if (
    texto.includes("internacional") ||
    texto.includes("mundo") ||
    texto.includes("global")
  ) {
    return "internacional";
  }
  if (
    texto.includes("nacional") ||
    texto.includes("país") ||
    texto.includes("colombia") ||
    texto.includes("méxico")
  ) {
    return "nacional";
  }
  return "local";
}

/**
 * Valida y normaliza un tipo de industria
 */
export function validarTipoIndustria(tipo: string): IndustriaTipo {
  const tiposValidos: IndustriaTipo[] = [
    "restaurante",
    "tienda_ropa",
    "tecnologia",
    "gimnasio",
    "educacion",
    "servicios",
    "otro",
  ];

  const tipoNormalizado = tipo.toLowerCase().replace(/\s+/g, "_");

  return tiposValidos.includes(tipoNormalizado as IndustriaTipo)
    ? (tipoNormalizado as IndustriaTipo)
    : "otro";
}

/**
 * Obtiene sugerencias de categorías según el tipo de negocio
 */
export function obtenerCategoriasSugeridas(
  tipo: IndustriaTipo
): string[] | undefined {
  const categorias: Record<Exclude<IndustriaTipo, "otro">, string[]> = {
    restaurante: [
      "Entradas",
      "Platos principales",
      "Bebidas",
      "Postres",
      "Combos",
    ],
    tienda_ropa: ["Camisetas", "Pantalones", "Zapatos", "Accesorios", "Ofertas"],
    tecnologia: [
      "Laptops",
      "Smartphones",
      "Accesorios",
      "Audio",
      "Gaming",
    ],
    gimnasio: [
      "Membresías",
      "Clases grupales",
      "Entrenamiento personal",
      "Suplementos",
    ],
    educacion: [
      "Cursos básicos",
      "Cursos avanzados",
      "Certificaciones",
      "Talleres",
    ],
    servicios: [
      "Paquete básico",
      "Paquete completo",
      "Consultoría",
      "Soporte",
    ],
  };

  return tipo !== "otro" ? categorias[tipo] : undefined;
}

export default {
  detectarTipoNegocio,
  validarTipoIndustria,
  obtenerCategoriasSugeridas,
};
