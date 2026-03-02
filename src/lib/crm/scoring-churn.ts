/**
 * Sistema de Scoring de Churn
 * 
 * Calcula la probabilidad de que un cliente deje de comprar
 * basado en múltiples señales de comportamiento.
 * 
 * Metodología:
 * - RFM (Recency, Frequency, Monetary)
 * - Engagement histórico
 * - Patrones de declive
 * - Respuesta a campañas
 */

import type { PerfilCliente } from "./perfil-cliente";

/**
 * Scoring de churn (0-100)
 * - 0-30: Bajo riesgo de churn (cliente activo)
 * - 31-60: Riesgo medio (monitorear)
 * - 61-100: Alto riesgo de churn (acción inmediata)
 */
export interface ChurnScore {
  score: number; // 0-100 (100 = máximo riesgo)
  nivel_riesgo: "bajo" | "medio" | "alto" | "critico";
  factores_contribuyentes: {
    recency_score: number; // 0-30 (peso: 30%)
    frequency_score: number; // 0-30 (peso: 30%)
    monetary_score: number; // 0-20 (peso: 20%)
    engagement_score: number; // 0-20 (peso: 20%)
  };
  acciones_sugeridas: string[];
  probabilidad_retencion: number; // 0-100 (100 = fácil de retener)
  valor_lifetime_en_riesgo: number; // $ que se perdería si hace churn
}

/**
 * Calcular churn score de un cliente
 */
export function calcularChurnScore(perfil: PerfilCliente): ChurnScore {
  const factores = {
    recency_score: calcularRecencyScore(perfil),
    frequency_score: calcularFrequencyScore(perfil),
    monetary_score: calcularMonetaryScore(perfil),
    engagement_score: calcularEngagementDeclineScore(perfil)
  };
  
  // Score total (0-100, 100 = máximo riesgo)
  const score = 
    factores.recency_score +
    factores.frequency_score +
    factores.monetary_score +
    factores.engagement_score;
  
  const nivel_riesgo = determinarNivelRiesgo(score);
  const acciones_sugeridas = generarAccionesSugeridas(score, factores, perfil);
  const probabilidad_retencion = calcularProbabilidadRetencion(perfil, score);
  const valor_lifetime_en_riesgo = perfil.comportamiento.valor_total_comprado;
  
  return {
    score,
    nivel_riesgo,
    factores_contribuyentes: factores,
    acciones_sugeridas,
    probabilidad_retencion,
    valor_lifetime_en_riesgo
  };
}

/**
 * Recency Score (0-30)
 * Días desde última compra/visita
 */
function calcularRecencyScore(perfil: PerfilCliente): number {
  const dias = perfil.segmento.dias_desde_ultima_visita;
  
  if (dias <= 7) return 0; // Muy activo
  if (dias <= 14) return 5; // Activo
  if (dias <= 30) return 10; // Normal
  if (dias <= 60) return 20; // En riesgo
  if (dias <= 90) return 25; // Alto riesgo
  return 30; // Crítico (>90 días)
}

/**
 * Frequency Score (0-30)
 * Declive en frecuencia de compras
 */
function calcularFrequencyScore(perfil: PerfilCliente): number {
  const { total_compras, frecuencia_visitas } = perfil.comportamiento;
  
  // Cliente nuevo, no hay patrón
  if (total_compras === 0) return 15;
  if (total_compras === 1) return 10;
  
  // Analizar declive
  // Si frecuencia_visitas es null o es muy larga → alto riesgo
  if (!frecuencia_visitas) {
    // Sin patrón establecido
    return total_compras >= 3 ? 5 : 15;
  }
  
  // frecuencia_visitas = "cada_semana" | "cada_mes" | etc
  const frecuencias_ordenadas = [
    "diaria",
    "cada_semana", 
    "cada_2_semanas",
    "cada_mes",
    "cada_2_meses",
    "cada_3_meses"
  ];
  
  const index = frecuencias_ordenadas.indexOf(frecuencia_visitas || "");
  
  if (index <= 1) return 0; // Muy frecuente
  if (index === 2) return 5; // Frecuente
  if (index === 3) return 15; // Normal
  if (index === 4) return 25; // Esporádico
  return 30; // Muy esporádico
}

/**
 * Monetary Score (0-20)
 * Declive en valor gastado
 */
function calcularMonetaryScore(perfil: PerfilCliente): number {
  const { promedio_ticket, total_compras } = perfil.comportamiento;
  
  if (total_compras === 0) return 20; // Nunca compró
  if (total_compras === 1) return 15; // Solo 1 compra
  
  // Analizar ticket promedio
  if (promedio_ticket >= 100) return 0; // High value
  if (promedio_ticket >= 50) return 5; // Medium-high
  if (promedio_ticket >= 25) return 10; // Medium
  if (promedio_ticket >= 10) return 15; // Low-medium
  return 20; // Low value
}

/**
 * Engagement Decline Score (0-20)
 * Basado en nivel de engagement actual
 */
function calcularEngagementDeclineScore(perfil: PerfilCliente): number {
  const engagement = perfil.segmento.nivel_engagement;
  
  // Inversamente proporcional: bajo engagement = alto riesgo
  if (engagement >= 80) return 0; // Muy comprometido
  if (engagement >= 60) return 5; // Comprometido
  if (engagement >= 40) return 10; // Neutral
  if (engagement >= 20) return 15; // Descomprometido
  return 20; // Muy descomprometido
}

/**
 * Determinar nivel de riesgo según score
 */
function determinarNivelRiesgo(
  score: number
): "bajo" | "medio" | "alto" | "critico" {
  if (score <= 30) return "bajo";
  if (score <= 50) return "medio";
  if (score <= 75) return "alto";
  return "critico";
}

/**
 * Generar acciones sugeridas según score y factores
 */
function generarAccionesSugeridas(
  score: number,
  factores: ChurnScore["factores_contribuyentes"],
  perfil: PerfilCliente
): string[] {
  const acciones: string[] = [];
  
  // Acciones por nivel de riesgo
  if (score > 75) {
    acciones.push("🚨 ACCIÓN INMEDIATA: Contacto personal humano");
    acciones.push("💰 Ofrecer incentivo significativo (20-30% descuento)");
  } else if (score > 50) {
    acciones.push("⚠️ Campaña de retención con cupón personalizado");
    acciones.push("📧 Serie de emails de re-engagement (3 touchpoints)");
  } else if (score > 30) {
    acciones.push("📲 Recordatorio suave con recomendaciones");
    acciones.push("🎁 Programa de lealtad / puntos");
  }
  
  // Acciones específicas por factor
  if (factores.recency_score >= 20) {
    acciones.push("⏰ Recordatorio: 'Te extrañamos, vuelve pronto'");
  }
  
  if (factores.frequency_score >= 20) {
    acciones.push("🔄 Recordar productos favoritos para facilitar re-compra");
  }
  
  if (factores.monetary_score >= 15) {
    acciones.push("💵 Ofrecer bundle o combos para aumentar ticket");
  }
  
  if (factores.engagement_score >= 15) {
    acciones.push("⭐ Contenido exclusivo o early access para reactivar interés");
  }
  
  // Acciones según segmento
  if (perfil.segmento.tipo === "vip" && score > 40) {
    acciones.push("👑 VIP EN RIESGO: Atención prioritaria del gerente");
  }
  
  return acciones;
}

/**
 * Calcular probabilidad de retención (0-100)
 * 100 = muy probable que regrese con acción correcta
 */
function calcularProbabilidadRetencion(
  perfil: PerfilCliente,
  churn_score: number
): number {
  let probabilidad = 100 - churn_score;
  
  // Ajustes según historial
  const { total_compras, valor_total_comprado } = perfil.comportamiento;
  
  // Más compras = más probable retener
  if (total_compras >= 10) probabilidad += 10;
  else if (total_compras >= 5) probabilidad += 5;
  
  // Más valor gastado = más probable retener (sunk cost)
  if (valor_total_comprado >= 500) probabilidad += 10;
  else if (valor_total_comprado >= 200) probabilidad += 5;
  
  // Ajuste por segmento
  if (perfil.segmento.tipo === "vip") probabilidad += 15;
  else if (perfil.segmento.tipo === "recurrente") probabilidad += 5;
  
  // Ajuste por respuesta previa a campañas
  // TODO: implementar tracking de respuesta a campañas
  
  // Cap entre 0-100
  return Math.min(100, Math.max(0, probabilidad));
}

/**
 * RFM Scoring completo (estructura estándar)
 */
export interface RFMScore {
  recency: 1 | 2 | 3 | 4 | 5; // 5 = mejor (más reciente)
  frequency: 1 | 2 | 3 | 4 | 5; // 5 = mejor (más frecuente)
  monetary: 1 | 2 | 3 | 4 | 5; // 5 = mejor (más valor)
  rfm_string: string; // e.g. "555" (Champions), "111" (Lost)
  segmento_rfm: string; // "Champions", "Loyal Customers", "At Risk", etc.
}

/**
 * Calcular RFM Score
 */
export function calcularRFMScore(perfil: PerfilCliente): RFMScore {
  const recency = calcularRecencyBucket(perfil.segmento.dias_desde_ultima_visita);
  const frequency = calcularFrequencyBucket(perfil.comportamiento.total_compras);
  const monetary = calcularMonetaryBucket(perfil.comportamiento.valor_total_comprado);
  
  const rfm_string = `${recency}${frequency}${monetary}`;
  const segmento_rfm = clasificarSegmentoRFM(recency, frequency, monetary);
  
  return {
    recency,
    frequency,
    monetary,
    rfm_string,
    segmento_rfm
  };
}

function calcularRecencyBucket(dias: number): 1 | 2 | 3 | 4 | 5 {
  if (dias <= 7) return 5;
  if (dias <= 14) return 4;
  if (dias <= 30) return 3;
  if (dias <= 60) return 2;
  return 1;
}

function calcularFrequencyBucket(compras: number): 1 | 2 | 3 | 4 | 5 {
  if (compras >= 10) return 5;
  if (compras >= 5) return 4;
  if (compras >= 3) return 3;
  if (compras >= 1) return 2;
  return 1;
}

function calcularMonetaryBucket(valor: number): 1 | 2 | 3 | 4 | 5 {
  if (valor >= 500) return 5;
  if (valor >= 200) return 4;
  if (valor >= 100) return 3;
  if (valor >= 50) return 2;
  return 1;
}

/**
 * Clasificar segmento según RFM
 * Basado en metodología estándar de marketing
 */
function clasificarSegmentoRFM(r: number, f: number, m: number): string {
  const score = r + f + m;
  
  // Champions: 555, 554, 544, 545, 454, 455, 445
  if (r >= 4 && f >= 4 && m >= 4) return "Champions";
  
  // Loyal Customers: 543+, 444, 435, 355, 354, 345, 344, 335
  if (r >= 3 && f >= 3 && m >= 3) return "Loyal Customers";
  
  // Potential Loyalists: 553, 551, 552, 541, 542, 533, 532, 531, 452, 451, 442, 441, 431, 453, 433, 432, 423, 353, 352, 351, 342, 341, 333, 323
  if (r >= 4 && f >= 1 && m >= 1) return "Potential Loyalists";
  
  // New Customers: 512, 511, 422, 421, 412, 411, 311
  if (r >= 4 && f <= 2 && m <= 2) return "New Customers";
  
  // Promising: 525, 524, 523, 522, 521, 515, 514, 513, 425,424, 413,414,415, 315, 314, 313
  if (r >= 3 && f <= 2 && m <= 5) return "Promising";
  
  // Need Attention: 535, 534, 443, 434, 343, 334, 325, 324
  if (r === 3 && f >= 3 && m >= 3) return "Need Attention";
  
  // About To Sleep: 331, 321, 312, 221, 213, 231, 241, 251
  if (r === 2 || r === 3) return "About To Sleep";
  
  // At Risk: 255, 254, 245, 244, 253, 252, 243, 242, 235, 234, 225, 224, 153, 152, 145, 143, 142, 135, 134, 133, 125, 124
  if (r <= 2 && f >= 2 && m >= 2) return "At Risk";
  
  // Can't Lose Them: 155, 154, 144, 214,215,115, 114, 113
  if (r <= 2 && f >= 4 && m >= 4) return "Can't Lose Them";
  
  // Hibernating: 332, 322, 231, 221, 213, 212, 211
  if (r <= 2 && f <= 2 && m <= 2) return "Hibernating";
  
  // Lost: 111, 112, 121, 131,141,151
  if (r === 1 && f <= 2 && m <= 2) return "Lost";
  
  return "Undefined";
}

/**
 * Análisis de patrones de abandono de carrito
 */
export interface CarritoAbandonado {
  id_perfil: string;
  productos: string[];
  valor_total: number;
  timestamp_abandono: Date;
  dias_transcurridos: number;
  probabilidad_conversion: number; // 0-100
  mensaje_recomendado: string;
}

/**
 * Detectar carritos abandonados con alta probabilidad de conversión
 */
export function analizarCarritoAbandonado(
  carrito: CarritoAbandonado,
  perfil: PerfilCliente
): { enviar_recordatorio: boolean; urgencia: "baja" | "media" | "alta" } {
  const { dias_transcurridos } = carrito;
  
  // Calcular probabilidad de conversión
  let probabilidad = 50; // Base
  
  // Ajustes según perfil
  if (perfil.segmento.tipo === "vip") probabilidad += 20;
  if (perfil.segmento.tipo === "recurrente") probabilidad += 10;
  if (perfil.segmento.probabilidad_compra >= 70) probabilidad += 15;
  
  // Ajuste por tiempo transcurrido (ventana óptima: 1-48 horas)
  if (dias_transcurridos < 1) probabilidad -= 10; // Muy pronto
  else if (dias_transcurridos <= 2) probabilidad += 10; // Ventana óptima
  else if (dias_transcurridos <= 7) probabilidad += 0; // Normal
  else probabilidad -= 20; // Muy tarde
  
  // Ajuste por valor del carrito
  if (carrito.valor_total >= 100) probabilidad += 10;
  else if (carrito.valor_total >= 50) probabilidad += 5;
  
  carrito.probabilidad_conversion = Math.min(100, Math.max(0, probabilidad));
  
  // Decidir si enviar recordatorio
  const enviar_recordatorio = probabilidad >= 40;
  
  // Determinar urgencia
  let urgencia: "baja" | "media" | "alta" = "media";
  if (dias_transcurridos >= 5) urgencia = "alta";
  else if (dias_transcurridos <= 1) urgencia = "baja";
  
  return { enviar_recordatorio, urgencia };
}

export default {
  calcularChurnScore,
  calcularRFMScore,
  analizarCarritoAbandonado
};
