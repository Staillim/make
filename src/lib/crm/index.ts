/**
 * Sistema CRM - Customer Relationship Management
 * 
 * Sistema inteligente de gestión de perfiles de clientes que
 * aprende de cada conversación y personaliza la experiencia.
 * 
 * Características:
 * - Extracción automática de preferencias con IA
 * - Segmentación automática de clientes (5 segmentos)
 * - Notificaciones multi-canal (email, WhatsApp, SMS)
 * - Campañas automatizadas con triggers
 * - Scoring de engagement y probabilidad de compra
 * - 🆕 Scoring de churn (riesgo de abandono)
 * - 🆕 RFM scoring (Recency, Frequency, Monetary)
 * - 🆕 Tracking de eventos granular
 * - 🆕 Analytics de campañas con A/B testing
 * - 🆕 Análisis de lift vs control group
 * - Historial completo de conversaciones
 * 
 * @example
 * ```typescript
 * import { 
 *   obtenerOCrearPerfil, 
 *   registrarConversacion, 
 *   obtenerResumenParaAgente,
 *   calcularChurnScore,
 *   calcularRFMScore,
 *   registrarEvento,
 *   obtenerMetricasCampana
 * } from '@/lib/crm';
 * 
 * // 1. Obtener perfil del cliente
 * const { perfil } = await obtenerOCrearPerfil(supabase, id_negocio, {
 *   email: "cliente@example.com"
 * });
 * 
 * // 2. Calcular riesgo de churn
 * const churn = calcularChurnScore(perfil);
 * if (churn.nivel_riesgo === "alto") {
 *   // Activar campaña de retención
 * }
 * 
 * // 3. Tracking de eventos
 * await registrarEvento(supabase, {
 *   id_perfil: perfil.id,
 *   id_negocio,
 *   tipo_evento: "vista_producto",
 *   detalles: { producto: "Hamburguesa BBQ" },
 *   timestamp: new Date()
 * });
 * 
 * // 4. Analytics de campañas
 * const metricas = await obtenerMetricasCampana(supabase, campana_id);
 * console.log(`ROI: ${metricas.roi}%, Conversión: ${metricas.tasa_conversion}%`);
 * ```
 */

// Tipos y interfaces base
export type {
  PerfilCliente,
  ResumenPerfil,
  InformacionExtraida,
  SegmentoCliente,
  ConfiguracionNotificaciones
} from "./perfil-cliente";

// Funciones de perfil
export {
  generarResumenPerfil,
  determinarSegmento,
  calcularEngagement,
  calcularProbabilidadCompra,
  PROMPT_EXTRACCION_INFO
} from "./perfil-cliente";

// Extractor de información con IA
export type {
  MensajeConversacion,
  ConfiguracionExtractor
} from "./extractor";

export {
  extraerInformacionConversacion,
  extraerSentimiento,
  calcularSentimentScore,
  combinarInformacionExtraida
} from "./extractor";

// Sistema de notificaciones
export type {
  TipoNotificacion,
  TemplateNotificacion,
  ResultadoEnvio
} from "./notificaciones";

export {
  compilarTemplate,
  determinarMejorCanal,
  crearVariablesPerfil,
  determinarNotificacionOptima,
  puedeRecibirNotificacion,
  TEMPLATES_NOTIFICACIONES
} from "./notificaciones";

// Helper principal (funciones de alto nivel)
export type {
  ResultadoOperacionPerfil
} from "./perfil-helper";

export {
  obtenerOCrearPerfil,
  registrarConversacion,
  registrarCompra,
  obtenerResumenParaAgente,
  obtenerClientesParaNotificacion
} from "./perfil-helper";

// 🆕 Scoring de Churn y RFM
export type {
  ChurnScore,
  RFMScore,
  CarritoAbandonado
} from "./scoring-churn";

export {
  calcularChurnScore,
  calcularRFMScore,
  analizarCarritoAbandonado
} from "./scoring-churn";

// 🆕 Tracking de Eventos
export type {
  TipoEvento,
  Evento,
  MetricasUsuario
} from "./tracking-eventos";

export {
  registrarEvento,
  registrarEventosBatch,
  obtenerMetricasUsuario,
  crearEventoVistaProducto,
  crearEventoCarrito,
  crearEventoCompra,
  crearEventoCampana
} from "./tracking-eventos";

// 🆕 Analytics de Campañas
export type {
  MetricasCampana,
  PerformanceSegmento,
  CampanaAB,
  AnalisisLift,
  DashboardCampanas
} from "./analytics-campanas";

export {
  obtenerMetricasCampana,
  compararCampanas,
  calcularLift,
  obtenerDashboardCampanas
} from "./analytics-campanas";

/**
 * Inicializar el sistema CRM
 * 
 * Ejecuta la migración de base de datos si es necesario
 */
export async function inicializarCRM(supabase: any): Promise<{ exito: boolean; error?: string }> {
  try {
    // Verificar si las tablas existen
    const { error } = await supabase
      .from("perfiles_clientes")
      .select("id")
      .limit(1);
    
    if (error) {
      return {
        exito: false,
        error: "Las tablas CRM no existen. Por favor ejecuta sql/schema-perfiles-clientes.sql"
      };
    }
    
    return { exito: true };
    
  } catch (error: any) {
    return {
      exito: false,
      error: error.message
    };
  }
}
