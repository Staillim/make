/**
 * Sistema de Notificaciones Multi-Canal
 * 
 * Envía notificaciones personalizadas a clientes según su perfil
 * y preferencias de contacto.
 * 
 * Canales soportados:
 * - Email (transaccional y marketing)
 * - WhatsApp (via WhatsApp Business API)
 * - SMS (via Twilio o similar)
 */

import { PerfilCliente, SegmentoCliente } from "./perfil-cliente";

/**
 * Tipos de notificaciones disponibles
 */
export type TipoNotificacion =
  | "descuento"               // Oferta especial con descuento
  | "recordatorio"            // Recordatorio de carrito abandonado, próxima compra, etc.
  | "recomendacion"           // Productos recomendados basados en perfil
  | "reactivacion"            // Para clientes inactivos
  | "cumpleanos"              // Felicitación + gift
  | "nuevo_producto"          // Lanzamiento de producto relevante
  | "vip_exclusivo"           // Ofertas exclusivas para VIPs
  | "seguimiento"             // Follow-up post-compra
  | "encuesta";               // Solicitar feedback

/**
 * Configuración de un template de notificación
 */
export interface TemplateNotificacion {
  id: string;
  tipo: TipoNotificacion;
  segmentos_objetivo: SegmentoCliente[];
  
  // Contenido por canal
  email?: {
    asunto: string;
    html: string;
    texto_plano: string;
  };
  whatsapp?: {
    mensaje: string;
    incluir_imagen?: boolean;
    url_cta?: string;
  };
  sms?: {
    mensaje: string; // Max 160 caracteres
  };
  
  // Variables dinámicas disponibles
  variables: string[]; // ['nombre', 'descuento', 'producto', 'dias_inactivo']
  
  // Configuración de envío
  frecuencia_maxima_dias: number; // No enviar más de 1 cada X días
  mejor_hora_envio?: string; // "09:00-12:00", "18:00-21:00"
}

/**
 * Resultado de envío de notificación
 */
export interface ResultadoEnvio {
  exito: boolean;
  canal: "email" | "whatsapp" | "sms";
  mensaje_id?: string;
  error?: string;
  timestamp: Date;
}

/**
 * Compilar template con variables dinámicas
 */
export function compilarTemplate(
  template: string,
  variables: Record<string, any>
): string {
  let resultado = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    resultado = resultado.replace(regex, String(value));
  }
  
  return resultado;
}

/**
 * Determinar el mejor canal según perfil del cliente
 */
export function determinarMejorCanal(perfil: PerfilCliente): "email" | "whatsapp" | "sms" | null {
  // Respetar preferencia del cliente
  if (!perfil.preferencias_contacto.acepta_promociones) {
    return null;
  }
  
  const { canal_preferido } = perfil.preferencias_contacto;
  
  // Verificar que tengamos los datos de contacto necesarios
  if (canal_preferido === "email" && perfil.email) {
    return "email";
  }
  
  if (canal_preferido === "whatsapp" && perfil.telefono) {
    return "whatsapp";
  }
  
  if (canal_preferido === "sms" && perfil.telefono) {
    return "sms";
  }
  
  // Fallback: usar el primero disponible
  if (perfil.email) return "email";
  if (perfil.telefono) return "whatsapp";
  
  return null;
}

/**
 * Crear variables dinámicas del perfil para templates
 */
export function crearVariablesPerfil(
  perfil: PerfilCliente,
  extras?: Record<string, any>
): Record<string, any> {
  return {
    nombre: perfil.nombre || "Cliente",
    email: perfil.email || "",
    telefono: perfil.telefono || "",
    
    // Comportamiento
    total_compras: perfil.comportamiento.total_compras,
    dias_inactivo: perfil.segmento.dias_desde_ultima_visita,
    
    // Segmentación
    segmento: perfil.segmento.tipo,
    es_vip: perfil.segmento.tipo === "vip",
    
    // Productos favoritos (primeros 3)
    productos_favoritos: perfil.preferencias.productos_favoritos.slice(0, 3).join(", "),
    
    // Valor lifetime
    valor_gastado: perfil.comportamiento.valor_total_comprado.toFixed(2),
    
    // Extras opcionales
    ...extras
  };
}

/**
 * Templates predefinidos de notificaciones
 */
export const TEMPLATES_NOTIFICACIONES: Record<TipoNotificacion, TemplateNotificacion> = {
  descuento: {
    id: "descuento-general",
    tipo: "descuento",
    segmentos_objetivo: ["recurrente", "vip"],
    email: {
      asunto: "🎉 {{nombre}}, tenemos {{descuento}}% OFF especial para ti",
      html: `
        <h2>¡Hola {{nombre}}! 👋</h2>
        <p>Como cliente valioso, tenemos un descuento especial de <strong>{{descuento}}%</strong> para ti.</p>
        <p>Usa el código: <code>{{codigo}}</code></p>
        <a href="{{url_tienda}}" style="background: #007bff; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">
          Comprar ahora
        </a>
        <p><small>Válido hasta {{fecha_expiracion}}</small></p>
      `,
      texto_plano: `¡Hola {{nombre}}! Tenemos {{descuento}}% OFF para ti. Código: {{codigo}}. Válido hasta {{fecha_expiracion}}.`
    },
    whatsapp: {
      mensaje: `🎉 ¡Hola {{nombre}}! Tenemos {{descuento}}% OFF especial para ti. Usa el código *{{codigo}}* 🛍️ Válido hasta {{fecha_expiracion}}`,
      url_cta: "{{url_tienda}}"
    },
    sms: {
      mensaje: `{{nombre}}: {{descuento}}% OFF con código {{codigo}}. Válido hasta {{fecha_expiracion}}. {{url_tienda}}`
    },
    variables: ["nombre", "descuento", "codigo", "fecha_expiracion", "url_tienda"],
    frecuencia_maxima_dias: 14
  },
  
  recomendacion: {
    id: "recomendacion-productos",
    tipo: "recomendacion",
    segmentos_objetivo: ["recurrente", "vip"],
    email: {
      asunto: "{{nombre}}, productos perfectos para ti 🎯",
      html: `
        <h2>Hola {{nombre}} 👋</h2>
        <p>Basado en tus compras anteriores, creemos que te encantarán estos productos:</p>
        {{productos_html}}
        <a href="{{url_tienda}}">Ver más productos</a>
      `,
      texto_plano: `Hola {{nombre}}, basado en tus gustos, te recomendamos: {{productos_texto}}`
    },
    whatsapp: {
      mensaje: `¡Hola {{nombre}}! 🎯 Tenemos productos perfectos para ti:\n\n{{productos_texto}}\n\n¿Quieres saber más?`,
      incluir_imagen: true
    },
    sms: {
      mensaje: `{{nombre}}: Productos nuevos que te pueden gustar. {{url_tienda}}`
    },
    variables: ["nombre", "productos_html", "productos_texto", "url_tienda"],
    frecuencia_maxima_dias: 7
  },
  
  reactivacion: {
    id: "reactivacion-30dias",
    tipo: "reactivacion",
    segmentos_objetivo: ["inactivo", "en_riesgo"],
    email: {
      asunto: "💙 {{nombre}}, te extrañamos!",
      html: `
        <h2>¡Hola {{nombre}}! 💙</h2>
        <p>Hace {{dias_inactivo}} días que no te vemos. ¿Todo bien?</p>
        <p>Te dejamos <strong>{{descuento}}% de descuento</strong> en tu próxima compra.</p>
        <p>Código: <code>{{codigo}}</code></p>
        <a href="{{url_tienda}}">Volver a la tienda</a>
      `,
      texto_plano: `Hola {{nombre}}, te extrañamos! {{descuento}}% OFF con código {{codigo}}.`
    },
    whatsapp: {
      mensaje: `💙 ¡Hola {{nombre}}! Hace {{dias_inactivo}} días que no te vemos. Te dejamos {{descuento}}% OFF con código *{{codigo}}* ¡Esperamos verte pronto! 🎁`
    },
    sms: {
      mensaje: `Te extrañamos {{nombre}}! {{descuento}}% OFF con {{codigo}}. {{url_tienda}}`
    },
    variables: ["nombre", "dias_inactivo", "descuento", "codigo", "url_tienda"],
    frecuencia_maxima_dias: 30,
    mejor_hora_envio: "09:00-12:00"
  },
  
  recordatorio: {
    id: "recordatorio-carrito",
    tipo: "recordatorio",
    segmentos_objetivo: ["nuevo", "recurrente", "vip"],
    email: {
      asunto: "🛒 {{nombre}}, dejaste algo en tu carrito",
      html: `
        <h2>¡No te olvides! 🛒</h2>
        <p>Hola {{nombre}}, dejaste estos productos en tu carrito:</p>
        {{productos_html}}
        <p>¿Los terminamos de comprar?</p>
        <a href="{{url_carrito}}">Completar compra</a>
      `,
      texto_plano: `Hola {{nombre}}, dejaste productos en tu carrito: {{productos_texto}}. Complétalos aquí: {{url_carrito}}`
    },
    whatsapp: {
      mensaje: `🛒 ¡Hola {{nombre}}! Dejaste productos en tu carrito:\n\n{{productos_texto}}\n\n¿Los terminamos de comprar? 😊`,
      url_cta: "{{url_carrito}}"
    },
    sms: {
      mensaje: `{{nombre}}: Productos en tu carrito esperándote. {{url_carrito}}`
    },
    variables: ["nombre", "productos_html", "productos_texto", "url_carrito"],
    frecuencia_maxima_dias: 1
  },
  
  cumpleanos: {
    id: "cumpleanos-cliente",
    tipo: "cumpleanos",
    segmentos_objetivo: ["recurrente", "vip"],
    email: {
      asunto: "🎂 ¡Feliz cumpleaños {{nombre}}!",
      html: `
        <h2>🎂 ¡Feliz cumpleaños {{nombre}}! 🎉</h2>
        <p>En tu día especial, queremos regalarte <strong>{{descuento}}% de descuento</strong>.</p>
        <p>Código: <code>{{codigo}}</code></p>
        <p>¡Que tengas un día increíble! 🎈</p>
        <a href="{{url_tienda}}">Usa tu regalo</a>
      `,
      texto_plano: `¡Feliz cumpleaños {{nombre}}! 🎂 Te regalamos {{descuento}}% OFF con código {{codigo}}.`
    },
    whatsapp: {
      mensaje: `🎂 ¡Feliz cumpleaños {{nombre}}! 🎉 Te regalamos {{descuento}}% OFF con código *{{codigo}}*. ¡Que lo disfrutes! 🎈`
    },
    sms: {
      mensaje: `Feliz cumpleaños {{nombre}}! {{descuento}}% OFF de regalo. Código: {{codigo}}`
    },
    variables: ["nombre", "descuento", "codigo", "url_tienda"],
    frecuencia_maxima_dias: 365
  },
  
  nuevo_producto: {
    id: "lanzamiento-producto",
    tipo: "nuevo_producto",
    segmentos_objetivo: ["recurrente", "vip"],
    email: {
      asunto: "🚀 {{nombre}}, mira esto nuevo!",
      html: `
        <h2>¡Novedad! 🚀</h2>
        <p>Hola {{nombre}}, acabamos de lanzar:</p>
        <h3>{{producto_nombre}}</h3>
        <p>{{producto_descripcion}}</p>
        <p><strong>Precio lanzamiento: \${{producto_precio}}</strong></p>
        <a href="{{url_producto}}">Ver producto</a>
      `,
      texto_plano: `Hola {{nombre}}, nuevo producto: {{producto_nombre}}. \${{producto_precio}}. {{url_producto}}`
    },
    whatsapp: {
      mensaje: `🚀 ¡Hola {{nombre}}! Lanzamos algo nuevo:\n\n*{{producto_nombre}}*\n{{producto_descripcion}}\n\nPrecio: \${{producto_precio}} 💰`,
      incluir_imagen: true,
      url_cta: "{{url_producto}}"
    },
    sms: {
      mensaje: `{{producto_nombre}} nuevo! \${{producto_precio}}. {{url_producto}}`
    },
    variables: ["nombre", "producto_nombre", "producto_descripcion", "producto_precio", "url_producto"],
    frecuencia_maxima_dias: 3
  },
  
  vip_exclusivo: {
    id: "vip-exclusivo",
    tipo: "vip_exclusivo",
    segmentos_objetivo: ["vip"],
    email: {
      asunto: "⭐ {{nombre}}, acceso exclusivo VIP",
      html: `
        <h2>⭐ Exclusivo para ti, {{nombre}}</h2>
        <p>Como cliente VIP, tienes acceso anticipado a:</p>
        <h3>{{oferta_titulo}}</h3>
        <p>{{oferta_descripcion}}</p>
        <p><strong>Solo para VIPs: {{descuento}}% adicional</strong></p>
        <a href="{{url_exclusiva}}">Acceso VIP</a>
      `,
      texto_plano: `VIP {{nombre}}: Acceso exclusivo a {{oferta_titulo}}. {{descuento}}% OFF. {{url_exclusiva}}`
    },
    whatsapp: {
      mensaje: `⭐ ¡Hola {{nombre}}! Como cliente VIP tienes acceso exclusivo:\n\n*{{oferta_titulo}}*\n\n{{descuento}}% adicional 💎`,
      url_cta: "{{url_exclusiva}}"
    },
    sms: {
      mensaje: `VIP {{nombre}}: {{oferta_titulo}}. {{descuento}}% OFF. {{url_exclusiva}}`
    },
    variables: ["nombre", "oferta_titulo", "oferta_descripcion", "descuento", "url_exclusiva"],
    frecuencia_maxima_dias: 7
  },
  
  seguimiento: {
    id: "seguimiento-compra",
    tipo: "seguimiento",
    segmentos_objetivo: ["nuevo", "recurrente", "vip"],
    email: {
      asunto: "¿Cómo te fue con tu compra, {{nombre}}?",
      html: `
        <h2>Hola {{nombre}} 👋</h2>
        <p>Esperamos que estés disfrutando tu compra de {{producto_nombre}}.</p>
        <p>¿Todo salió bien? Nos encantaría saber tu opinión 😊</p>
        <a href="{{url_encuesta}}">Dejar opinión</a>
      `,
      texto_plano: `Hola {{nombre}}, ¿cómo te fue con {{producto_nombre}}? Cuéntanos: {{url_encuesta}}`
    },
    whatsapp: {
      mensaje: `¡Hola {{nombre}}! 👋 ¿Cómo te fue con tu compra de {{producto_nombre}}? Nos encantaría saber tu opinión 😊`
    },
    sms: {
      mensaje: `{{nombre}}: ¿Cómo te fue con tu compra? Cuéntanos: {{url_encuesta}}`
    },
    variables: ["nombre", "producto_nombre", "url_encuesta"],
    frecuencia_maxima_dias: 7
  },
  
  encuesta: {
    id: "encuesta-satisfaccion",
    tipo: "encuesta",
    segmentos_objetivo: ["recurrente", "vip"],
    email: {
      asunto: "{{nombre}}, tu opinión vale oro 💎",
      html: `
        <h2>Hola {{nombre}} 💎</h2>
        <p>Tu opinión es super valiosa para nosotros.</p>
        <p>¿Nos regalas 2 minutos para contestar esta encuesta?</p>
        <a href="{{url_encuesta}}">Responder encuesta</a>
        <p><small>Como agradecimiento, te daremos {{incentivo}}</small></p>
      `,
      texto_plano: `Hola {{nombre}}, tu opinión es importante. Encuesta de 2 min: {{url_encuesta}}. Regalo: {{incentivo}}`
    },
    whatsapp: {
      mensaje: `¡Hola {{nombre}}! 💎 Tu opinión vale oro. ¿2 minutos para una encuesta? Te daremos {{incentivo}} como gracias 🎁`
    },
    sms: {
      mensaje: `{{nombre}}: Tu opinión importa. 2 min: {{url_encuesta}}. Regalo: {{incentivo}}`
    },
    variables: ["nombre", "url_encuesta", "incentivo"],
    frecuencia_maxima_dias: 90
  }
};

/**
 * Determinar qué notificación enviar según el perfil y el contexto
 */
export function determinarNotificacionOptima(
  perfil: PerfilCliente,
  contexto: {
    tiene_carrito_abandonado?: boolean;
    es_cumpleanos?: boolean;
    dias_desde_ultima_compra?: number;
    productos_nuevos_relacionados?: any[];
  }
): TipoNotificacion | null {
  const { segmento, comportamiento } = perfil;
  
  // Prioridad 1: Cumpleaños (si es hoy)
  if (contexto.es_cumpleanos) {
    return "cumpleanos";
  }
  
  // Prioridad 2: Carrito abandonado (en primeras 24-48 horas)
  if (contexto.tiene_carrito_abandonado) {
    return "recordatorio";
  }
  
  // Prioridad 3: Cliente inactivo (reactivación)
  if (segmento.tipo === "inactivo" || segmento.tipo === "en_riesgo") {
    return "reactivacion";
  }
  
  // Prioridad 4: Cliente VIP con productos exclusivos
  if (segmento.tipo === "vip" && contexto.productos_nuevos_relacionados?.length) {
    return "vip_exclusivo";
  }
  
  // Prioridad 5: Productos nuevos relacionados con sus intereses
  if (contexto.productos_nuevos_relacionados?.length && segmento.tipo !== "nuevo") {
    return "nuevo_producto";
  }
  
  // Prioridad 6: Recomendación basada en perfil
  if (segmento.tipo === "recurrente" || segmento.tipo === "vip") {
    return "recomendacion";
  }
  
  // Prioridad 7: Descuento general (si no hay nada más específico)
  if (comportamiento.total_compras > 0) {
    return "descuento";
  }
  
  return null;
}

/**
 * Validar si el cliente puede recibir notificación según preferencias
 */
export function puedeRecibirNotificacion(
  perfil: PerfilCliente,
  tipo_notificacion: TipoNotificacion,
  ultima_notificacion_fecha?: Date
): { puede: boolean; razon?: string } {
  // Verificar que acepta notificaciones
  if (!perfil.preferencias_contacto.acepta_promociones) {
    return { puede: false, razon: "Cliente no acepta promociones" };
  }
  
  // Verificar frecuencia
  if (perfil.preferencias_contacto.frecuencia_notificaciones === "nunca") {
    return { puede: false, razon: "Cliente configuró 'nunca recibir'" };
  }
  
  // Verificar días desde última notificación
  if (ultima_notificacion_fecha) {
    const template = TEMPLATES_NOTIFICACIONES[tipo_notificacion];
    const dias_desde_ultima = Math.floor(
      (Date.now() - ultima_notificacion_fecha.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (dias_desde_ultima < template.frecuencia_maxima_dias) {
      return { 
        puede: false, 
        razon: `Debe esperar ${template.frecuencia_maxima_dias - dias_desde_ultima} días más` 
      };
    }
  }
  
  // Verificar que tengamos datos de contacto para el canal
  const canal = determinarMejorCanal(perfil);
  if (!canal) {
    return { puede: false, razon: "No hay canal de contacto disponible" };
  }
  
  return { puede: true };
}

export default {
  compilarTemplate,
  determinarMejorCanal,
  crearVariablesPerfil,
  determinarNotificacionOptima,
  puedeRecibirNotificacion,
  TEMPLATES_NOTIFICACIONES
};
