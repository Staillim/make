/**
 * Sistema de Perfiles de Cliente Inteligente
 * 
 * Los agentes de IA aprenden de cada conversación y personalizan
 * recomendaciones basadas en el perfil del cliente.
 * 
 * Características:
 * - Detección automática de preferencias
 * - Historial de conversaciones
 * - Recomendaciones personalizadas
 * - Segmentación de clientes (nuevo, recurrente, inactivo, VIP)
 * - Notificaciones multi-canal (email, WhatsApp, SMS)
 */

/**
 * Perfil completo del cliente con toda su información
 */
export interface PerfilCliente {
  // Identificación
  id: string;
  id_negocio: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  
  // Preferencias detectadas por IA
  preferencias: {
    productos_favoritos: string[];           // IDs de productos que le gustan
    categorias_interes: string[];            // Categorías que consulta
    rango_precio_preferido?: {
      min: number;
      max: number;
    };
    estilo_comunicacion: "formal" | "casual" | "tecnico"; // Cómo le gusta que le hablen
    horario_preferido?: string;              // "mañana", "tarde", "noche"
    dias_preferidos?: string[];              // ["lunes", "viernes"]
  };
  
  // Historial de comportamiento
  comportamiento: {
    primera_visita: Date;
    ultima_visita: Date;
    total_conversaciones: number;
    total_compras: number;
    valor_total_comprado: number;
    promedio_ticket: number;
    productos_comprados: string[];           // IDs
    productos_consultados: string[];         // IDs
    frecuencia_visitas: "alta" | "media" | "baja"; // Calculado automático
  };
  
  // Segmentación automática
  segmento: {
    tipo: "nuevo" | "recurrente" | "vip" | "inactivo" | "en_riesgo";
    nivel_engagement: number;                // 0-100
    probabilidad_compra: number;             // 0-100 (calculado por IA)
    valor_lifetime: number;                  // LTV estimado
    dias_desde_ultima_visita: number;
  };
  
  // Información contextual detectada por IA
  contexto: {
    ocasion_compra?: string;                 // "cumpleaños", "aniversario", "uso diario"
    quien_es_para?: string;                  // "él mismo", "regalo", "familia"
    nivel_urgencia?: "alta" | "media" | "baja";
    objeciones_comunes?: string[];           // ["precio alto", "duda sobre talla"]
    puntos_dolor?: string[];                 // Problemas que busca resolver
  };
  
  // Preferencias de contacto
  preferencias_contacto: {
    canal_preferido: "email" | "whatsapp" | "sms" | "ninguno";
    acepta_promociones: boolean;
    acepta_recordatorios: boolean;
    frecuencia_notificaciones: "diaria" | "semanal" | "mensual" | "nunca";
    mejor_hora_contacto?: string;            // "09:00-12:00"
  };
  
  // Metadata
  metadata: {
    creado_en: Date;
    actualizado_en: Date;
    ultima_actualizacion_ia: Date;
    version_perfil: number;
    notas_internas?: string;
  };
}

/**
 * Extrae información del mensaje del cliente usando IA
 */
export interface InformacionExtraida {
  preferencias_detectadas?: {
    productos?: string[];
    categorias?: string[];
    rango_precio?: { min: number; max: number };
  };
  contexto_detectado?: {
    ocasion?: string;
    para_quien?: string;
    urgencia?: "alta" | "media" | "baja";
    objeciones?: string[];
  };
  sentimiento?: "positivo" | "neutral" | "negativo";
  intencion?: "consulta" | "comparacion" | "compra" | "queja";
  datos_contacto?: {
    nombre?: string;
    email?: string;
    telefono?: string;
  };
}

/**
 * Resumen del perfil para inyectar en el prompt del agente
 */
export interface ResumenPerfil {
  es_cliente_nuevo: boolean;
  total_conversaciones: number;
  productos_favoritos: string[];
  categorias_interes: string[];
  ultima_conversacion?: {
    fecha: Date;
    resumen: string;
  };
  recomendaciones_sugeridas: string[];      // IDs de productos a sugerir
  nivel_confianza: "nuevo" | "conocido" | "fiel";
  notas_importantes?: string[];             // "Prefiere talla L", "Alérgico a maní"
}

/**
 * Segmentación de clientes para campañas
 */
export type SegmentoCliente = 
  | "nuevo"           // Primera vez, hay que impresionar
  | "recurrente"      // Ha vuelto 2-5 veces, engagement medio
  | "vip"             // Compra frecuente, alto valor
  | "inactivo"        // No ha vuelto en >30 días
  | "en_riesgo";      // Antes era activo, ahora baja frecuencia

/**
 * Configuración de notificaciones por segmento
 */
export interface ConfiguracionNotificaciones {
  segmento: SegmentoCliente;
  canal: "email" | "whatsapp" | "sms";
  tipo: "descuento" | "recordatorio" | "recomendacion" | "reactivacion";
  mensaje_template: string;
  frecuencia_dias: number;
  condiciones: {
    dias_inactividad?: number;
    productos_relacionados?: boolean;
    descuento_porcentaje?: number;
  };
}

/**
 * Sistema de prompt de extracción de información
 */
export const PROMPT_EXTRACCION_INFO = `Eres un asistente que analiza conversaciones de ventas y extrae información valiosa del cliente.

## Tu Tarea
Analiza el mensaje del cliente y extrae:

1. **Preferencias de Producto**
   - ¿Qué productos menciona con interés?
   - ¿Qué categorías le interesan?
   - ¿Qué rango de precio menciona o implica?

2. **Contexto de Compra**
   - ¿Para qué ocasión es? (cumpleaños, uso diario, regalo, etc.)
   - ¿Para quién es? (él mismo, pareja, hijo, amigo, etc.)
   - ¿Qué urgencia tiene? (alta: necesito ya, media: esta semana, baja: explorando)

3. **Objeciones o Dudas**
   - ¿Qué le preocupa? (precio, calidad, talla, envío, etc.)
   - ¿Qué necesita saber para decidir?

4. **Datos de Contacto** (si menciona)
   - Nombre
   - Email
   - Teléfono

5. **Sentimiento**
   - Positivo (entusiasmado, satisfecho)
   - Neutral (preguntando, explorando)
   - Negativo (frustrado, insatisfecho)

6. **Intención**
   - Consulta (solo preguntando)
   - Comparación (evaluando opciones)
   - Compra (listo para comprar)
   - Queja (problema con producto/servicio)

## Formato de Respuesta (JSON)
Responde SOLO con JSON válido, sin explicaciones adicionales:

\`\`\`json
{
  "preferencias_detectadas": {
    "productos": ["producto_1", "producto_2"],
    "categorias": ["categoria_1"],
    "rango_precio": { "min": 100, "max": 500 }
  },
  "contexto_detectado": {
    "ocasion": "cumpleaños de su esposa",
    "para_quien": "esposa",
    "urgencia": "alta",
    "objeciones": ["duda sobre talla", "precio un poco alto"]
  },
  "sentimiento": "positivo",
  "intencion": "compra",
  "datos_contacto": {
    "nombre": "Juan Pérez",
    "email": "juan@email.com",
    "telefono": "+521234567890"
  }
}
\`\`\`

## Reglas
- Si no detectas algo, omite ese campo del JSON
- Sé conservador: solo extrae info que esté clara en el mensaje
- Infiere contexto cuando sea obvio, pero no adivines
- Rango de precio: infiere basado en productos mencionados o frases como "económico", "premium", "hasta $X"
`;

/**
 * Genera resumen del perfil para inyectar en el prompt del agente
 */
export function generarResumenPerfil(perfil: PerfilCliente | null): string {
  if (!perfil) {
    return `**CLIENTE NUEVO** 🆕
- Es su primera visita
- No tenemos información previa
- Objetivo: Causar buena primera impresión y conocerlo`;
  }

  const { comportamiento, preferencias, segmento } = perfil;

  let resumen = `**PERFIL DEL CLIENTE** 👤\n\n`;

  // Segmentación
  const iconoSegmento = {
    nuevo: "🆕",
    recurrente: "🔄",
    vip: "⭐",
    inactivo: "😴",
    en_riesgo: "⚠️"
  }[segmento.tipo];

  resumen += `**Tipo:** ${iconoSegmento} ${segmento.tipo.toUpperCase()}\n`;
  resumen += `**Engagement:** ${segmento.nivel_engagement}% | **Prob. Compra:** ${segmento.probabilidad_compra}%\n`;
  resumen += `**Visitas:** ${comportamiento.total_conversaciones} | **Compras:** ${comportamiento.total_compras}\n`;
  
  if (comportamiento.total_compras > 0) {
    resumen += `**Ticket promedio:** $${comportamiento.promedio_ticket.toFixed(2)}\n`;
  }

  resumen += `\n`;

  // Preferencias
  if (preferencias.productos_favoritos.length > 0) {
    resumen += `**❤️ Le gusta:** ${preferencias.productos_favoritos.slice(0, 3).join(", ")}\n`;
  }

  if (preferencias.categorias_interes.length > 0) {
    resumen += `**🔍 Categorías de interés:** ${preferencias.categorias_interes.join(", ")}\n`;
  }

  if (preferencias.rango_precio_preferido) {
    const { min, max } = preferencias.rango_precio_preferido;
    resumen += `**💰 Rango de precio:** $${min} - $${max}\n`;
  }

  resumen += `**💬 Estilo preferido:** ${preferencias.estilo_comunicacion}\n`;

  // Última visita
  const diasDesdeUltima = segmento.dias_desde_ultima_visita;
  if (diasDesdeUltima > 0) {
    resumen += `\n**🕐 Última visita:** Hace ${diasDesdeUltima} día${diasDesdeUltima > 1 ? 's' : ''}\n`;
  }

  // Recomendaciones especiales según segmento
  resumen += `\n**🎯 ESTRATEGIA:**\n`;

  switch (segmento.tipo) {
    case "nuevo":
      resumen += `- Causar excelente primera impresión\n`;
      resumen += `- Hacer preguntas para conocer sus preferencias\n`;
      resumen += `- Ofrecer guía y asesoría completa\n`;
      break;
    case "recurrente":
      resumen += `- Reconocer que ya ha comprado antes\n`;
      resumen += `- Recomendar basado en compras previas\n`;
      resumen += `- Agradecer su confianza\n`;
      break;
    case "vip":
      resumen += `- ⭐ Cliente VIP - trato especial\n`;
      resumen += `- Ofrecer productos premium o exclusivos\n`;
      resumen += `- Mencionar beneficios de lealtad si hay\n`;
      break;
    case "inactivo":
      resumen += `- ¡Reconocer que hace tiempo no lo vemos!\n`;
      resumen += `- Preguntar cómo le fue con su última compra\n`;
      resumen += `- Ofrecer algo especial para reactivarlo\n`;
      break;
    case "en_riesgo":
      resumen += `- Cliente que solía ser activo, recuperarlo\n`;
      resumen += `- Preguntar si hubo algún problema\n`;
      resumen += `- Ofrecer incentivo para que regrese\n`;
      break;
  }

  return resumen;
}

/**
 * Determina el segmento del cliente automáticamente
 */
export function determinarSegmento(perfil: PerfilCliente): SegmentoCliente {
  const { comportamiento, segmento } = perfil;
  const { total_conversaciones, total_compras, valor_total_comprado } = comportamiento;
  const diasInactivo = segmento.dias_desde_ultima_visita;

  // Cliente nuevo
  if (total_conversaciones <= 1 && total_compras === 0) {
    return "nuevo";
  }

  // Cliente inactivo (más de 30 días sin visitar)
  if (diasInactivo > 30) {
    return "inactivo";
  }

  // Cliente en riesgo (antes compraba seguido, ahora no)
  if (total_compras >= 3 && diasInactivo > 15 && diasInactivo <= 30) {
    return "en_riesgo";
  }

  // Cliente VIP (alta frecuencia y alto valor)
  if (total_compras >= 5 && valor_total_comprado > 1000) {
    return "vip";
  }

  // Cliente recurrente (ha vuelto pero no es VIP todavía)
  if (total_conversaciones >= 2 || total_compras >= 1) {
    return "recurrente";
  }

  return "nuevo";
}

/**
 * Calcula nivel de engagement (0-100)
 */
export function calcularEngagement(perfil: PerfilCliente): number {
  const { comportamiento, segmento } = perfil;
  
  let score = 0;
  
  // Conversaciones recientes (30 puntos)
  if (segmento.dias_desde_ultima_visita <= 7) score += 30;
  else if (segmento.dias_desde_ultima_visita <= 15) score += 20;
  else if (segmento.dias_desde_ultima_visita <= 30) score += 10;
  
  // Frecuencia de compras (30 puntos)
  if (comportamiento.total_compras >= 5) score += 30;
  else if (comportamiento.total_compras >= 3) score += 20;
  else if (comportamiento.total_compras >= 1) score += 10;
  
  // Valor gastado (20 puntos)
  if (comportamiento.valor_total_comprado >= 1000) score += 20;
  else if (comportamiento.valor_total_comprado >= 500) score += 15;
  else if (comportamiento.valor_total_comprado >= 100) score += 10;
  
  // Conversaciones totales (20 puntos)
  if (comportamiento.total_conversaciones >= 10) score += 20;
  else if (comportamiento.total_conversaciones >= 5) score += 15;
  else if (comportamiento.total_conversaciones >= 2) score += 10;
  
  return Math.min(100, score);
}

/**
 * Calcula probabilidad de compra basada en perfil (0-100)
 */
export function calcularProbabilidadCompra(perfil: PerfilCliente): number {
  const { comportamiento, segmento } = perfil;
  
  let probabilidad = 50; // Baseline
  
  // Historial de compras
  if (comportamiento.total_compras > 0) {
    const tasaConversion = comportamiento.total_compras / comportamiento.total_conversaciones;
    probabilidad += tasaConversion * 30;
  }
  
  // Recencia
  if (segmento.dias_desde_ultima_visita <= 7) probabilidad += 15;
  else if (segmento.dias_desde_ultima_visita > 30) probabilidad -= 20;
  
  // Engagement
  if (segmento.nivel_engagement >= 70) probabilidad += 10;
  else if (segmento.nivel_engagement <= 30) probabilidad -= 10;
  
  // Segmento
  switch (segmento.tipo) {
    case "vip": probabilidad += 20; break;
    case "recurrente": probabilidad += 10; break;
    case "inactivo": probabilidad -= 30; break;
    case "en_riesgo": probabilidad -= 15; break;
  }
  
  return Math.max(0, Math.min(100, probabilidad));
}

export default {
  generarResumenPerfil,
  determinarSegmento,
  calcularEngagement,
  calcularProbabilidadCompra,
  PROMPT_EXTRACCION_INFO
};
