/**
 * Sistema de Analytics de Campañas
 * 
 * Análisis de performance de campañas de marketing:
 * - CTR (Click-Through Rate)
 * - CR (Conversion Rate)
 * - AOV (Average Order Value / Ticket promedio)
 * - Lift Analysis (vs control group)
 * - A/B Testing
 * - ROI por campaña
 */

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Métricas de una campaña
 */
export interface MetricasCampana {
  campana_id: string;
  nombre_campana: string;
  tipo_campana: string;
  canal: "email" | "whatsapp" | "sms" | "push";
  fecha_inicio: Date;
  fecha_fin?: Date;
  
  // Alcance
  total_enviadas: number;
  total_entregadas: number;
  total_fallidas: number;
  tasa_entrega: number; // %
  
  // Engagement
  total_abiertas: number;
  total_clicks: number;
  total_conversiones: number;
  
  // Tasas
  tasa_apertura: number; // % (abiertas / entregadas)
  tasa_click: number; // % (clicks / abiertas)
  tasa_conversion: number; // % (conversiones / enviadas)
  tasa_click_to_conversion: number; // % (conversiones / clicks)
  
  // Valor
  ingresos_generados: number;
  aov: number; // Average order value
  costo_campana: number;
  roi: number; // Return on investment (%)
  
  // Segmentación
  segmentos_objetivo: string[];
  performance_por_segmento?: Record<string, PerformanceSegmento>;
}

export interface PerformanceSegmento {
  segmento: string;
  enviadas: number;
  abiertas: number;
  clicks: number;
  conversiones: number;
  ingresos: number;
  tasa_apertura: number;
  tasa_conversion: number;
}

/**
 * Configuración de una campaña A/B
 */
export interface CampanaAB {
  id: string;
  nombre: string;
  variantes: {
    id: string;
    nombre: string; // "A", "B", "Control"
    porcentaje_trafico: number; // % de usuarios asignados
    template_mensaje: string;
    asunto?: string;
    imagen_url?: string;
  }[];
  fecha_inicio: Date;
  fecha_fin: Date;
  metricas_por_variante?: Record<string, MetricasCampana>;
  ganador?: string; // ID de variante ganadora
}

/**
 * Análisis de Lift (vs grupo de control)
 */
export interface AnalisisLift {
  campana_id: string;
  grupo_tratamiento: {
    usuarios: number;
    conversiones: number;
    tasa_conversion: number;
    ingresos: number;
    aov: number;
  };
  grupo_control: {
    usuarios: number;
    conversiones: number;
    tasa_conversion: number;
    ingresos: number;
    aov: number;
  };
  lift: {
    conversion_lift: number; // % mejora en conversión
    ingreso_lift: number; // % mejora en ingresos
    significancia_estadistica: boolean;
    p_value: number;
  };
  recomendacion: string;
}

/**
 * Obtener métricas de una campaña
 */
export async function obtenerMetricasCampana(
  supabase: SupabaseClient,
  campana_id: string
): Promise<MetricasCampana | null> {
  try {
    // Obtener configuración de la campaña
    const { data: campana, error: error_campana } = await supabase
      .from("campanas_automatizadas")
      .select("*")
      .eq("id", campana_id)
      .single();
    
    if (error_campana || !campana) {
      return null;
    }
    
    // Obtener notificaciones de la campaña
    const { data: notificaciones, error: error_notifs } = await supabase
      .from("notificaciones_programadas")
      .select("*")
      .eq("campana_id", campana_id);
    
    if (error_notifs) {
      console.error("Error obteniendo notificaciones:", error_notifs);
      return null;
    }
    
    // Calcular métricas básicas
    const total_enviadas = notificaciones?.filter(n => n.estado === "enviada").length || 0;
    const total_fallidas = notificaciones?.filter(n => n.estado === "fallida").length || 0;
    const total_entregadas = total_enviadas;
    
    const total_abiertas = notificaciones?.filter(n => n.abierta === true).length || 0;
    const total_clicks = notificaciones?.filter(n => n.click_realizado === true).length || 0;
    const total_conversiones = notificaciones?.filter(n => n.conversion === true).length || 0;
    
    // Calcular tasas
    const tasa_entrega = total_enviadas > 0 
      ? (total_entregadas / (total_enviadas + total_fallidas)) * 100 
      : 0;
    
    const tasa_apertura = total_entregadas > 0 
      ? (total_abiertas / total_entregadas) * 100 
      : 0;
    
    const tasa_click = total_abiertas > 0 
      ? (total_clicks / total_abiertas) * 100 
      : 0;
    
    const tasa_conversion = total_enviadas > 0 
      ? (total_conversiones / total_enviadas) * 100 
      : 0;
    
    const tasa_click_to_conversion = total_clicks > 0 
      ? (total_conversiones / total_clicks) * 100 
      : 0;
    
    // Calcular ingresos (requiere join con compras)
    // TODO: implementar query para obtener ingresos reales
    const ingresos_generados = campana.ingresos_generados || 0;
    const aov = total_conversiones > 0 ? ingresos_generados / total_conversiones : 0;
    
    // ROI
    const costo_campana = campana.costo_campana || 0;
    const roi = costo_campana > 0 
      ? ((ingresos_generados - costo_campana) / costo_campana) * 100 
      : 0;
    
    return {
      campana_id,
      nombre_campana: campana.nombre,
      tipo_campana: campana.trigger_tipo,
      canal: campana.canal_principal || "email",
      fecha_inicio: new Date(campana.creado_en),
      fecha_fin: campana.fecha_fin ? new Date(campana.fecha_fin) : undefined,
      total_enviadas,
      total_entregadas,
      total_fallidas,
      tasa_entrega,
      total_abiertas,
      total_clicks,
      total_conversiones,
      tasa_apertura,
      tasa_click,
      tasa_conversion,
      tasa_click_to_conversion,
      ingresos_generados,
      aov,
      costo_campana,
      roi,
      segmentos_objetivo: campana.segmento_objetivo || []
    };
    
  } catch (error) {
    console.error("Error obteniendo métricas:", error);
    return null;
  }
}

/**
 * Comparar dos campañas (A/B testing)
 */
export async function compararCampanas(
  supabase: SupabaseClient,
  campana_a_id: string,
  campana_b_id: string
): Promise<{
  campana_a: MetricasCampana;
  campana_b: MetricasCampana;
  ganador: "A" | "B" | "empate";
  mejor_en: {
    tasa_apertura: "A" | "B";
    tasa_click: "A" | "B";
    tasa_conversion: "A" | "B";
    roi: "A" | "B";
  };
} | null> {
  const campana_a = await obtenerMetricasCampana(supabase, campana_a_id);
  const campana_b = await obtenerMetricasCampana(supabase, campana_b_id);
  
  if (!campana_a || !campana_b) {
    return null;
  }
  
  // Comparar métricas clave
  const mejor_en = {
    tasa_apertura: campana_a.tasa_apertura > campana_b.tasa_apertura ? "A" as const : "B" as const,
    tasa_click: campana_a.tasa_click > campana_b.tasa_click ? "A" as const : "B" as const,
    tasa_conversion: campana_a.tasa_conversion > campana_b.tasa_conversion ? "A" as const : "B" as const,
    roi: campana_a.roi > campana_b.roi ? "A" as const : "B" as const
  };
  
  // Determinar ganador (ponderación: conversión 50%, ROI 30%, click 20%)
  const score_a = 
    (campana_a.tasa_conversion * 0.5) +
    (campana_a.roi * 0.3) +
    (campana_a.tasa_click * 0.2);
  
  const score_b = 
    (campana_b.tasa_conversion * 0.5) +
    (campana_b.roi * 0.3) +
    (campana_b.tasa_click * 0.2);
  
  const diferencia_porcentual = Math.abs((score_a - score_b) / Math.max(score_a, score_b)) * 100;
  
  let ganador: "A" | "B" | "empate";
  if (diferencia_porcentual < 5) {
    ganador = "empate";
  } else {
    ganador = score_a > score_b ? "A" : "B";
  }
  
  return {
    campana_a,
    campana_b,
    ganador,
    mejor_en
  };
}

/**
 * Análisis de Lift vs grupo de control
 */
export async function calcularLift(
  supabase: SupabaseClient,
  campana_id: string,
  periodo_dias: number = 30
): Promise<AnalisisLift | null> {
  try {
    // 1. Obtener usuarios que recibieron la campaña (grupo tratamiento)
    const { data: notifs_tratamiento, error: error_tratamiento } = await supabase
      .from("notificaciones_programadas")
      .select("id_perfil, conversion")
      .eq("campana_id", campana_id);
    
    if (error_tratamiento || !notifs_tratamiento) {
      return null;
    }
    
    const ids_tratamiento = notifs_tratamiento.map(n => n.id_perfil);
    const conversiones_tratamiento = notifs_tratamiento.filter(n => n.conversion).length;
    
    // 2. Obtener grupo de control (mismos segmentos pero sin campaña)
    // Simplificación: usuarios similares que NO recibieron la campaña
    const { data: perfiles_control, error: error_control } = await supabase
      .from("perfiles_clientes")
      .select("id, total_compras")
      .not("id", "in", `(${ids_tratamiento.join(",")})`)
      .limit(ids_tratamiento.length); // Mismo tamaño de muestra
    
    if (error_control || !perfiles_control) {
      return null;
    }
    
    // 3. Calcular conversiones del grupo control en el mismo periodo
    // TODO: implementar query para contar compras en el periodo
    const conversiones_control = Math.floor(perfiles_control.length * 0.02); // Placeholder: 2% baseline
    
    // 4. Calcular tasas de conversión
    const tasa_tratamiento = (conversiones_tratamiento / ids_tratamiento.length) * 100;
    const tasa_control = (conversiones_control / perfiles_control.length) * 100;
    
    // 5. Calcular lift
    const conversion_lift = tasa_control > 0 
      ? ((tasa_tratamiento - tasa_control) / tasa_control) * 100 
      : 0;
    
    // 6. Test de significancia (Chi-cuadrado simplificado)
    const { p_value, significativo } = testSignificancia(
      conversiones_tratamiento,
      ids_tratamiento.length,
      conversiones_control,
      perfiles_control.length
    );
    
    // 7. Generar recomendación
    let recomendacion = "";
    if (!significativo) {
      recomendacion = "⚠️ Diferencia no estadísticamente significativa. Continuar test o aumentar muestra.";
    } else if (conversion_lift > 20) {
      recomendacion = "✅ Lift significativo (>20%). Escalar campaña inmediatamente.";
    } else if (conversion_lift > 10) {
      recomendacion = "👍 Lift moderado (10-20%). Campaña efectiva, considerar optimizaciones.";
    } else if (conversion_lift > 0) {
      recomendacion = "🔍 Lift positivo pero bajo (<10%). Analizar segmentos específicos.";
    } else {
      recomendacion = "❌ Lift negativo. Detener campaña y revisar estrategia.";
    }
    
    return {
      campana_id,
      grupo_tratamiento: {
        usuarios: ids_tratamiento.length,
        conversiones: conversiones_tratamiento,
        tasa_conversion: tasa_tratamiento,
        ingresos: 0, // TODO: calcular ingresos reales
        aov: 0
      },
      grupo_control: {
        usuarios: perfiles_control.length,
        conversiones: conversiones_control,
        tasa_conversion: tasa_control,
        ingresos: 0,
        aov: 0
      },
      lift: {
        conversion_lift,
        ingreso_lift: 0, // TODO: calcular lift de ingresos
        significancia_estadistica: significativo,
        p_value
      },
      recomendacion
    };
    
  } catch (error) {
    console.error("Error calculando lift:", error);
    return null;
  }
}

/**
 * Test de significancia estadística (Chi-cuadrado)
 */
function testSignificancia(
  conversiones_a: number,
  total_a: number,
  conversiones_b: number,
  total_b: number
): { p_value: number; significativo: boolean } {
  // Tabla de contingencia 2x2
  const no_conversiones_a = total_a - conversiones_a;
  const no_conversiones_b = total_b - conversiones_b;
  
  const n = total_a + total_b;
  const expected_conversiones_a = ((conversiones_a + conversiones_b) * total_a) / n;
  const expected_no_conversiones_a = ((no_conversiones_a + no_conversiones_b) * total_a) / n;
  const expected_conversiones_b = ((conversiones_a + conversiones_b) * total_b) / n;
  const expected_no_conversiones_b = ((no_conversiones_a + no_conversiones_b) * total_b) / n;
  
  // Chi-cuadrado
  const chi_squared = 
    Math.pow(conversiones_a - expected_conversiones_a, 2) / expected_conversiones_a +
    Math.pow(no_conversiones_a - expected_no_conversiones_a, 2) / expected_no_conversiones_a +
    Math.pow(conversiones_b - expected_conversiones_b, 2) / expected_conversiones_b +
    Math.pow(no_conversiones_b - expected_no_conversiones_b, 2) / expected_no_conversiones_b;
  
  // p-value aproximado (distribución chi-cuadrado con 1 grado de libertad)
  // Simplificación: chi > 3.84 → p < 0.05 (95% confianza)
  const p_value = chi_squared > 3.84 ? 0.04 : 0.10; // Aproximación burda
  const significativo = chi_squared > 3.84;
  
  return { p_value, significativo };
}

/**
 * Dashboard de campañas activas
 */
export interface DashboardCampanas {
  campanas_activas: number;
  total_usuarios_alcanzados: number;
  tasa_apertura_promedio: number;
  tasa_conversion_promedio: number;
  roi_promedio: number;
  ingresos_totales: number;
  campanas_top: MetricasCampana[];
  campanas_bajo_rendimiento: MetricasCampana[];
}

export async function obtenerDashboardCampanas(
  supabase: SupabaseClient,
  id_negocio: string,
  dias_atras: number = 30
): Promise<DashboardCampanas | null> {
  try {
    const fecha_inicio = new Date();
    fecha_inicio.setDate(fecha_inicio.getDate() - dias_atras);
    
    // Obtener todas las campañas del periodo
    const { data: campanas, error } = await supabase
      .from("campanas_automatizadas")
      .select("id")
      .eq("id_negocio", id_negocio)
      .eq("activa", true);
    
    if (error || !campanas) {
      return null;
    }
    
    // Obtener métricas de cada campaña
    const metricas_campanas = await Promise.all(
      campanas.map(c => obtenerMetricasCampana(supabase, c.id))
    );
    
    const metricas_validas = metricas_campanas.filter(m => m !== null) as MetricasCampana[];
    
    if (metricas_validas.length === 0) {
      return null;
    }
    
    // Calcular agregados
    const total_usuarios_alcanzados = metricas_validas.reduce((sum, m) => sum + m.total_enviadas, 0);
    const tasa_apertura_promedio = metricas_validas.reduce((sum, m) => sum + m.tasa_apertura, 0) / metricas_validas.length;
    const tasa_conversion_promedio = metricas_validas.reduce((sum, m) => sum + m.tasa_conversion, 0) / metricas_validas.length;
    const roi_promedio = metricas_validas.reduce((sum, m) => sum + m.roi, 0) / metricas_validas.length;
    const ingresos_totales = metricas_validas.reduce((sum, m) => sum + m.ingresos_generados, 0);
    
    // Top campañas (por ROI)
    const campanas_top = metricas_validas
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 5);
    
    // Bajo rendimiento (conversion < 2% y ROI < 0)
    const campanas_bajo_rendimiento = metricas_validas
      .filter(m => m.tasa_conversion < 2 && m.roi < 0)
      .sort((a, b) => a.roi - b.roi)
      .slice(0, 5);
    
    return {
      campanas_activas: metricas_validas.length,
      total_usuarios_alcanzados,
      tasa_apertura_promedio,
      tasa_conversion_promedio,
      roi_promedio,
      ingresos_totales,
      campanas_top,
      campanas_bajo_rendimiento
    };
    
  } catch (error) {
    console.error("Error obteniendo dashboard:", error);
    return null;
  }
}

export default {
  obtenerMetricasCampana,
  compararCampanas,
  calcularLift,
  obtenerDashboardCampanas
};
