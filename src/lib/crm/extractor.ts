/**
 * Servicio de Extracción de Información con IA
 * 
 * Analiza conversaciones usando IA (OpenAI o Gemini) para detectar:
 * - Preferencias de productos
 * - Contexto de compra
 * - Sentimiento del cliente
 * - Intención (consulta, compra, queja)
 * - Datos de contacto mencionados
 */

import { InformacionExtraida, PROMPT_EXTRACCION_INFO } from "./perfil-cliente";
import { ClienteIA, type ProveedorIA } from "../ia/cliente-ia";

/**
 * Mensaje de una conversación
 */
export interface MensajeConversacion {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

/**
 * Configuración del extractor
 */
export interface ConfiguracionExtractor {
  api_key: string;
  provider?: ProveedorIA; // "openai" | "gemini"
  modelo?: string;
  temperatura?: number; // 0.0 - 1.0 (default: 0.3)
  catalogo_productos?: string[]; // Lista de productos conocidos
}

/**
 * Extraer información de una conversación usando OpenAI
 */
export async function extraerInformacionConversacion(
  mensajes: MensajeConversacion[],
  config: ConfiguracionExtractor
): Promise<InformacionExtraida> {
  const {
    api_key,
    provider = "gemini",
    modelo,
    temperatura = 0.3,
    catalogo_productos = []
  } = config;
  
  // Preparar el contexto del catálogo
  let contexto_catalogo = "";
  if (catalogo_productos.length > 0) {
    contexto_catalogo = `\n\nCATÁLOGO DE PRODUCTOS DISPONIBLE:\n${catalogo_productos.join(", ")}`;
  }
  
  // Construir el prompt con la conversación
  const conversation_text = mensajes
    .map(m => `${m.role === "user" ? "Cliente" : "Asistente"}: ${m.content}`)
    .join("\n");
  
  const prompt_completo = `${PROMPT_EXTRACCION_INFO}${contexto_catalogo}\n\nCONVERSACIÓN A ANALIZAR:\n${conversation_text}`;
  
  try {
    // Usar cliente unificado de IA
    const cliente = new ClienteIA({
      provider,
      api_key,
      modelo,
      temperatura
    });
    
    // Extraer información en formato JSON
    const informacion = await cliente.extraerJSON<InformacionExtraida>(
      prompt_completo,
      "Analiza la conversación anterior y extrae la información en formato JSON."
    );
    
    // Normalizar y validar
    return normalizarInformacionExtraida(informacion);
    
  } catch (error) {
    console.error("Error extrayendo información con IA:", error);
    
    // Fallback: extracción básica sin IA
    return extraerInformacionBasica(mensajes);
  }
}

/**
 * Normalizar información extraída para asegurar formato consistente
 */
function normalizarInformacionExtraida(info: any): InformacionExtraida {
  return {
    preferencias_detectadas: {
      productos: Array.isArray(info.preferencias_detectadas?.productos) 
        ? info.preferencias_detectadas.productos 
        : [],
      categorias: Array.isArray(info.preferencias_detectadas?.categorias)
        ? info.preferencias_detectadas.categorias
        : [],
      rango_precio: info.preferencias_detectadas?.rango_precio || null
    },
    contexto_detectado: {
      ocasion: info.contexto_detectado?.ocasion || null,
      para_quien: info.contexto_detectado?.para_quien || null,
      urgencia: info.contexto_detectado?.urgencia || null,
      objeciones: Array.isArray(info.contexto_detectado?.objeciones)
        ? info.contexto_detectado.objeciones
        : []
    },
    sentimiento: ["positivo", "neutral", "negativo"].includes(info.sentimiento)
      ? info.sentimiento
      : "neutral",
    intencion: ["consulta", "comparacion", "compra", "queja"].includes(info.intencion)
      ? info.intencion
      : "consulta",
    datos_contacto: {
      nombre: info.datos_contacto?.nombre || null,
      email: info.datos_contacto?.email || null,
      telefono: info.datos_contacto?.telefono || null
    },
    notas: info.notas || null
  };
}

/**
 * Extracción básica sin IA (fallback)
 * Usa regex y reglas simples
 */
function extraerInformacionBasica(
  mensajes: MensajeConversacion[]
): InformacionExtraida {
  const mensajes_cliente = mensajes
    .filter(m => m.role === "user")
    .map(m => m.content.toLowerCase());
  
  const texto_completo = mensajes_cliente.join(" ");
  
  // Detectar sentimiento básico
  const palabras_positivas = ["gracias", "excelente", "perfecto", "genial", "me gusta", "bueno"];
  const palabras_negativas = ["mal", "problema", "no funciona", "lento", "no me gusta", "horrible"];
  
  const positivas = palabras_positivas.filter(p => texto_completo.includes(p)).length;
  const negativas = palabras_negativas.filter(p => texto_completo.includes(p)).length;
  
  let sentimiento: "positivo" | "neutral" | "negativo" = "neutral";
  if (positivas > negativas) sentimiento = "positivo";
  if (negativas > positivas) sentimiento = "negativo";
  
  // Detectar intención básica
  let intencion: "consulta" | "comparacion" | "compra" | "queja" = "consulta";
  if (texto_completo.includes("comprar") || texto_completo.includes("precio")) {
    intencion = "compra";
  } else if (texto_completo.includes("mejor") || texto_completo.includes("diferencia")) {
    intencion = "comparacion";
  } else if (texto_completo.includes("problema") || texto_completo.includes("queja")) {
    intencion = "queja";
  }
  
  // Detectar email
  const email_regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const email_match = texto_completo.match(email_regex);
  
  // Detectar teléfono
  const telefono_regex = /(\+?[0-9]{1,3}[\s-]?)?(\([0-9]{3}\)|[0-9]{3})[\s-]?[0-9]{3}[\s-]?[0-9]{4}/g;
  const telefono_match = texto_completo.match(telefono_regex);
  
  return {
    preferencias_detectadas: {
      productos: [],
      categorias: [],
      rango_precio: null
    },
    contexto_detectado: {
      ocasion: null,
      para_quien: null,
      urgencia: null,
      objeciones: []
    },
    sentimiento,
    intencion,
    datos_contacto: {
      nombre: null,
      email: email_match ? email_match[0] : null,
      telefono: telefono_match ? telefono_match[0] : null
    },
    notas: "Extracción básica sin IA (fallback)"
  };
}

/**
 * Extraer solo sentimiento de una conversación (más rápido/barato)
 */
export async function extraerSentimiento(
  mensajes: MensajeConversacion[],
  config: ConfiguracionExtractor
): Promise<"positivo" | "neutral" | "negativo"> {
  const { api_key, provider = "gemini", modelo } = config;
  
  const conversation_text = mensajes
    .filter(m => m.role === "user")
    .map(m => m.content)
    .join("\n");
  
  try {
    const cliente = new ClienteIA({
      provider,
      api_key,
      modelo,
      temperatura: 0.1,
      max_tokens: 10
    });
    
    const respuesta = await cliente.generarRespuesta([
      {
        role: "system",
        content: "Analiza el sentimiento del cliente en esta conversación. Responde solo con: 'positivo', 'neutral' o 'negativo'."
      },
      {
        role: "user",
        content: conversation_text
      }
    ]);
    
    const sentimiento = respuesta.contenido.toLowerCase().trim();
    
    if (["positivo", "neutral", "negativo"].includes(sentimiento)) {
      return sentimiento as any;
    }
    
    return "neutral";
    
  } catch (error) {
    console.error("Error extrayendo sentimiento:", error);
    return "neutral";
  }
}

/**
 * Calcular sentiment score numérico (-1 a +1)
 */
export function calcularSentimentScore(
  sentimiento: "positivo" | "neutral" | "negativo"
): number {
  switch (sentimiento) {
    case "positivo": return 1;
    case "neutral": return 0;
    case "negativo": return -1;
  }
}

/**
 * Combinar múltiples extracciones para actualizar perfil
 */
export function combinarInformacionExtraida(
  extracciones: InformacionExtraida[]
): InformacionExtraida {
  if (extracciones.length === 0) {
    throw new Error("Debe haber al menos una extracción");
  }
  
  if (extracciones.length === 1) {
    return extracciones[0];
  }
  
  // Combinar productos (únicos)
  const productos_set = new Set<string>();
  extracciones.forEach(e => {
    e.preferencias_detectadas.productos.forEach(p => productos_set.add(p));
  });
  
  // Combinar categorías (únicas)
  const categorias_set = new Set<string>();
  extracciones.forEach(e => {
    e.preferencias_detectadas.categorias.forEach(c => categorias_set.add(c));
  });
  
  // Calcular rango de precio combinado
  const rangos = extracciones
    .map(e => e.preferencias_detectadas.rango_precio)
    .filter(r => r !== null) as { min: number; max: number }[];
  
  let rango_precio: { min: number; max: number } | null = null;
  if (rangos.length > 0) {
    rango_precio = {
      min: Math.min(...rangos.map(r => r.min)),
      max: Math.max(...rangos.map(r => r.max))
    };
  }
  
  // Combinar objeciones
  const objeciones_set = new Set<string>();
  extracciones.forEach(e => {
    e.contexto_detectado.objeciones.forEach(o => objeciones_set.add(o));
  });
  
  // Usar la última extracción para valores únicos
  const ultima = extracciones[extracciones.length - 1];
  
  // Calcular sentimiento promedio
  const sentiment_scores = extracciones.map(e => calcularSentimentScore(e.sentimiento));
  const avg_score = sentiment_scores.reduce((a, b) => a + b, 0) / sentiment_scores.length;
  
  let sentimiento: "positivo" | "neutral" | "negativo" = "neutral";
  if (avg_score > 0.3) sentimiento = "positivo";
  if (avg_score < -0.3) sentimiento = "negativo";
  
  return {
    preferencias_detectadas: {
      productos: Array.from(productos_set),
      categorias: Array.from(categorias_set),
      rango_precio
    },
    contexto_detectado: {
      ocasion: ultima.contexto_detectado.ocasion,
      para_quien: ultima.contexto_detectado.para_quien,
      urgencia: ultima.contexto_detectado.urgencia,
      objeciones: Array.from(objeciones_set)
    },
    sentimiento,
    intencion: ultima.intencion,
    datos_contacto: ultima.datos_contacto,
    notas: `Combinado de ${extracciones.length} conversaciones`
  };
}

export default {
  extraerInformacionConversacion,
  extraerSentimiento,
  calcularSentimentScore,
  combinarInformacionExtraida,
  extraerInformacionBasica
};
