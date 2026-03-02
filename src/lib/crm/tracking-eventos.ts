/**
 * Sistema de Tracking de Eventos Granular
 * 
 * Captura todas las interacciones del usuario para análisis
 * de comportamiento, patrones y scoring avanzado.
 * 
 * Eventos capturados:
 * - Navegación (vistas, búsquedas, tiempo en página)
 * - Interacciones (clicks, scrolls, hover)
 * - Conversaciones (mensajes, intents, sentimiento)
 * - Carrito (agregar, quitar, abandonar)
 * - Compras (conversión, productos, monto)
 * - Campañas (open, click, conversion)
 */

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Tipos de eventos disponibles
 */
export type TipoEvento =
  // Navegación
  | "visita_tienda"
  | "vista_producto"
  | "busqueda"
  | "vista_categoria"
  | "tiempo_en_pagina"
  
  // Interacciones
  | "click_producto"
  | "hover_producto"
  | "scroll_catalogo"
  | "filtro_aplicado"
  | "ordenamiento_aplicado"
  
  // Conversación
  | "mensaje_usuario"
  | "mensaje_agente"
  | "intent_detectado"
  | "sentimiento_detectado"
  | "escalado_humano"
  
  // Carrito
  | "producto_agregado_carrito"
  | "producto_quitado_carrito"
  | "carrito_actualizado"
  | "checkout_iniciado"
  | "carrito_abandonado"
  
  // Compra
  | "compra_completada"
  | "compra_fallida"
  | "metodo_pago_seleccionado"
  
  // Campañas
  | "campana_recibida"
  | "campana_abierta"
  | "campana_click"
  | "campana_conversion"
  | "campana_opt_out"
  
  // Usuario
  | "registro"
  | "login"
  | "perfil_actualizado"
  | "preferencias_guardadas";

/**
 * Estructura de un evento
 */
export interface Evento {
  id?: string;
  id_perfil: string;
  id_negocio: string;
  tipo_evento: TipoEvento;
  timestamp: Date;
  
  // Metadatos específicos del evento (JSON flexible)
  detalles: Record<string, any>;
  
  // Contexto técnico
  contexto?: {
    dispositivo?: "mobile" | "tablet" | "desktop";
    navegador?: string;
    url?: string;
    referrer?: string;
    sesion_id?: string;
    ip?: string;
    user_agent?: string;
  };
  
  // Enriquecimiento post-procesado
  enriquecido?: boolean;
  procesado_en?: Date;
}

/**
 * Métricas agregadas por usuario
 */
export interface MetricasUsuario {
  id_perfil: string;
  periodo: {
    inicio: Date;
    fin: Date;
  };
  
  // Navegación
  total_visitas: number;
  total_productos_vistos: number;
  total_busquedas: number;
  tiempo_promedio_sesion: number; // minutos
  
  // Interacciones
  total_clicks: number;
  productos_con_hover: number;
  filtros_usados: string[];
  
  // Conversación
  total_mensajes_enviados: number;
  total_conversaciones: number;
  intents_mas_comunes: string[];
  sentimiento_promedio: number; // -1 a +1
  escalaciones_humano: number;
  
  // Carrito
  productos_agregados_carrito: number;
  productos_quitados_carrito: number;
  checkouts_iniciados: number;
  carritos_abandonados: number;
  tasa_abandono_carrito: number; // %
  
  // Compras
  total_compras: number;
  valor_total_comprado: number;
  ticket_promedio: number;
  productos_comprados: string[];
  categorias_compradas: string[];
  tasa_conversion: number; // %
  
  // Campañas
  campanas_recibidas: number;
  campanas_abiertas: number;
  campanas_clickeadas: number;
  campanas_convertidas: number;
  tasa_apertura: number; // %
  tasa_click: number; // %
  tasa_conversion_campana: number; // %
}

/**
 * Registrar evento en la base de datos
 */
export async function registrarEvento(
  supabase: SupabaseClient,
  evento: Evento
): Promise<{ exito: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("eventos_clientes")
      .insert({
        id_perfil: evento.id_perfil,
        id_negocio: evento.id_negocio,
        tipo_evento: evento.tipo_evento,
        detalles: evento.detalles,
        timestamp: evento.timestamp.toISOString(),
        contexto: evento.contexto || null
      });
    
    if (error) {
      return { exito: false, error: error.message };
    }
    
    return { exito: true };
    
  } catch (error: any) {
    return { exito: false, error: error.message };
  }
}

/**
 * Registrar múltiples eventos en batch
 */
export async function registrarEventosBatch(
  supabase: SupabaseClient,
  eventos: Evento[]
): Promise<{ exito: boolean; insertados: number; error?: string }> {
  try {
    const registros = eventos.map(e => ({
      id_perfil: e.id_perfil,
      id_negocio: e.id_negocio,
      tipo_evento: e.tipo_evento,
      detalles: e.detalles,
      timestamp: e.timestamp.toISOString(),
      contexto: e.contexto || null
    }));
    
    const { data, error } = await supabase
      .from("eventos_clientes")
      .insert(registros)
      .select();
    
    if (error) {
      return { exito: false, insertados: 0, error: error.message };
    }
    
    return { exito: true, insertados: data?.length || 0 };
    
  } catch (error: any) {
    return { exito: false, insertados: 0, error: error.message };
  }
}

/**
 * Obtener métricas agregadas de un usuario
 */
export async function obtenerMetricasUsuario(
  supabase: SupabaseClient,
  id_perfil: string,
  dias_atras: number = 30
): Promise<MetricasUsuario | null> {
  try {
    const fecha_inicio = new Date();
    fecha_inicio.setDate(fecha_inicio.getDate() - dias_atras);
    
    // Obtener todos los eventos del periodo
    const { data: eventos, error } = await supabase
      .from("eventos_clientes")
      .select("*")
      .eq("id_perfil", id_perfil)
      .gte("timestamp", fecha_inicio.toISOString())
      .order("timestamp", { ascending: true });
    
    if (error || !eventos || eventos.length === 0) {
      return null;
    }
    
    // Calcular métricas agregadas
    const metricas: MetricasUsuario = {
      id_perfil,
      periodo: {
        inicio: fecha_inicio,
        fin: new Date()
      },
      
      // Navegación
      total_visitas: contarEventos(eventos, ["visita_tienda"]),
      total_productos_vistos: contarEventos(eventos, ["vista_producto"]),
      total_busquedas: contarEventos(eventos, ["busqueda"]),
      tiempo_promedio_sesion: calcularTiempoPromedioSesion(eventos),
      
      // Interacciones
      total_clicks: contarEventos(eventos, ["click_producto"]),
      productos_con_hover: contarEventos(eventos, ["hover_producto"]),
      filtros_usados: extraerValoresUnicos(eventos, "filtro_aplicado", "filtro"),
      
      // Conversación
      total_mensajes_enviados: contarEventos(eventos, ["mensaje_usuario"]),
      total_conversaciones: contarSesionesUnicas(eventos, "mensaje_usuario"),
      intents_mas_comunes: extraerValoresFrecuentes(eventos, "intent_detectado", "intent", 5),
      sentimiento_promedio: calcularSentimientoPromedio(eventos),
      escalaciones_humano: contarEventos(eventos, ["escalado_humano"]),
      
      // Carrito
      productos_agregados_carrito: contarEventos(eventos, ["producto_agregado_carrito"]),
      productos_quitados_carrito: contarEventos(eventos, ["producto_quitado_carrito"]),
      checkouts_iniciados: contarEventos(eventos, ["checkout_iniciado"]),
      carritos_abandonados: contarEventos(eventos, ["carrito_abandonado"]),
      tasa_abandono_carrito: calcularTasaAbandono(eventos),
      
      // Compras
      total_compras: contarEventos(eventos, ["compra_completada"]),
      valor_total_comprado: sumarValores(eventos, "compra_completada", "monto"),
      ticket_promedio: calcularTicketPromedio(eventos),
      productos_comprados: extraerValoresUnicos(eventos, "compra_completada", "productos"),
      categorias_compradas: extraerValoresUnicos(eventos, "compra_completada", "categorias"),
      tasa_conversion: calcularTasaConversion(eventos),
      
      // Campañas
      campanas_recibidas: contarEventos(eventos, ["campana_recibida"]),
      campanas_abiertas: contarEventos(eventos, ["campana_abierta"]),
      campanas_clickeadas: contarEventos(eventos, ["campana_click"]),
      campanas_convertidas: contarEventos(eventos, ["campana_conversion"]),
      tasa_apertura: calcularTasaCampana(eventos, "campana_abierta", "campana_recibida"),
      tasa_click: calcularTasaCampana(eventos, "campana_click", "campana_abierta"),
      tasa_conversion_campana: calcularTasaCampana(eventos, "campana_conversion", "campana_recibida")
    };
    
    return metricas;
    
  } catch (error) {
    console.error("Error obteniendo métricas:", error);
    return null;
  }
}

/**
 * Helpers para cálculo de métricas
 */

function contarEventos(eventos: any[], tipos: TipoEvento[]): number {
  return eventos.filter(e => tipos.includes(e.tipo_evento)).length;
}

function calcularTiempoPromedioSesion(eventos: any[]): number {
  // Agrupar eventos por sesión y calcular duración
  const sesiones = new Map<string, { inicio: Date; fin: Date }>();
  
  eventos.forEach(e => {
    const sesion_id = e.contexto?.sesion_id || "default";
    const timestamp = new Date(e.timestamp);
    
    if (!sesiones.has(sesion_id)) {
      sesiones.set(sesion_id, { inicio: timestamp, fin: timestamp });
    } else {
      const sesion = sesiones.get(sesion_id)!;
      if (timestamp < sesion.inicio) sesion.inicio = timestamp;
      if (timestamp > sesion.fin) sesion.fin = timestamp;
    }
  });
  
  const duraciones = Array.from(sesiones.values()).map(s =>
    (s.fin.getTime() - s.inicio.getTime()) / (1000 * 60) // minutos
  );
  
  if (duraciones.length === 0) return 0;
  return duraciones.reduce((a, b) => a + b, 0) / duraciones.length;
}

function extraerValoresUnicos(
  eventos: any[],
  tipo: TipoEvento,
  campo: string
): string[] {
  const valores = new Set<string>();
  
  eventos
    .filter(e => e.tipo_evento === tipo)
    .forEach(e => {
      const valor = e.detalles?.[campo];
      if (Array.isArray(valor)) {
        valor.forEach(v => valores.add(String(v)));
      } else if (valor) {
        valores.add(String(valor));
      }
    });
  
  return Array.from(valores);
}

function extraerValoresFrecuentes(
  eventos: any[],
  tipo: TipoEvento,
  campo: string,
  top_n: number
): string[] {
  const contador = new Map<string, number>();
  
  eventos
    .filter(e => e.tipo_evento === tipo)
    .forEach(e => {
      const valor = e.detalles?.[campo];
      if (valor) {
        const count = contador.get(valor) || 0;
        contador.set(valor, count + 1);
      }
    });
  
  return Array.from(contador.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, top_n)
    .map(([valor]) => valor);
}

function calcularSentimientoPromedio(eventos: any[]): number {
  const sentimientos = eventos
    .filter(e => e.tipo_evento === "sentimiento_detectado")
    .map(e => {
      const s = e.detalles?.sentimiento;
      if (s === "positivo") return 1;
      if (s === "negativo") return -1;
      return 0;
    });
  
  if (sentimientos.length === 0) return 0;
  return sentimientos.reduce((a, b) => a + b, 0) / sentimientos.length;
}

function contarSesionesUnicas(eventos: any[], tipo: TipoEvento): number {
  const sesiones = new Set(
    eventos
      .filter(e => e.tipo_evento === tipo)
      .map(e => e.contexto?.sesion_id || "default")
  );
  return sesiones.size;
}

function sumarValores(eventos: any[], tipo: TipoEvento, campo: string): number {
  return eventos
    .filter(e => e.tipo_evento === tipo)
    .reduce((sum, e) => sum + (Number(e.detalles?.[campo]) || 0), 0);
}

function calcularTicketPromedio(eventos: any[]): number {
  const compras = eventos.filter(e => e.tipo_evento === "compra_completada");
  if (compras.length === 0) return 0;
  
  const total = sumarValores(eventos, "compra_completada", "monto");
  return total / compras.length;
}

function calcularTasaAbandono(eventos: any[]): number {
  const checkouts = contarEventos(eventos, ["checkout_iniciado"]);
  const abandonos = contarEventos(eventos, ["carrito_abandonado"]);
  
  if (checkouts === 0) return 0;
  return (abandonos / checkouts) * 100;
}

function calcularTasaConversion(eventos: any[]): number {
  const visitas = contarEventos(eventos, ["visita_tienda"]);
  const compras = contarEventos(eventos, ["compra_completada"]);
  
  if (visitas === 0) return 0;
  return (compras / visitas) * 100;
}

function calcularTasaCampana(
  eventos: any[],
  tipo_numerador: TipoEvento,
  tipo_denominador: TipoEvento
): number {
  const denominador = contarEventos(eventos, [tipo_denominador]);
  if (denominador === 0) return 0;
  
  const numerador = contarEventos(eventos, [tipo_numerador]);
  return (numerador / denominador) * 100;
}

/**
 * Eventos helpers para frontend
 */

export function crearEventoVistaProducto(
  id_perfil: string,
  id_negocio: string,
  producto: { id: string; nombre: string; precio: number; categoria: string },
  contexto?: Evento["contexto"]
): Evento {
  return {
    id_perfil,
    id_negocio,
    tipo_evento: "vista_producto",
    timestamp: new Date(),
    detalles: {
      producto_id: producto.id,
      producto_nombre: producto.nombre,
      producto_precio: producto.precio,
      categoria: producto.categoria
    },
    contexto
  };
}

export function crearEventoCarrito(
  id_perfil: string,
  id_negocio: string,
  accion: "agregar" | "quitar",
  producto: { id: string; nombre: string; cantidad: number },
  carrito_actual: { items: number; total: number },
  contexto?: Evento["contexto"]
): Evento {
  return {
    id_perfil,
    id_negocio,
    tipo_evento: accion === "agregar" ? "producto_agregado_carrito" : "producto_quitado_carrito",
    timestamp: new Date(),
    detalles: {
      producto_id: producto.id,
      producto_nombre: producto.nombre,
      cantidad: producto.cantidad,
      carrito_items: carrito_actual.items,
      carrito_total: carrito_actual.total
    },
    contexto
  };
}

export function crearEventoCompra(
  id_perfil: string,
  id_negocio: string,
  compra: {
    id_pedido: string;
    productos: { id: string; nombre: string; cantidad: number; precio: number }[];
    total: number;
    metodo_pago: string;
  },
  contexto?: Evento["contexto"]
): Evento {
  return {
    id_perfil,
    id_negocio,
    tipo_evento: "compra_completada",
    timestamp: new Date(),
    detalles: {
      pedido_id: compra.id_pedido,
      productos: compra.productos.map(p => p.nombre),
      categorias: [], // TODO: extraer categorías
      total: compra.total,
      items: compra.productos.reduce((sum, p) => sum + p.cantidad, 0),
      metodo_pago: compra.metodo_pago
    },
    contexto
  };
}

export function crearEventoCampana(
  id_perfil: string,
  id_negocio: string,
  campana_id: string,
  accion: "recibida" | "abierta" | "click" | "conversion",
  detalles_extra?: Record<string, any>,
  contexto?: Evento["contexto"]
): Evento {
  const tipo_map = {
    recibida: "campana_recibida",
    abierta: "campana_abierta",
    click: "campana_click",
    conversion: "campana_conversion"
  };
  
  return {
    id_perfil,
    id_negocio,
    tipo_evento: tipo_map[accion] as TipoEvento,
    timestamp: new Date(),
    detalles: {
      campana_id,
      ...detalles_extra
    },
    contexto
  };
}

export default {
  registrarEvento,
  registrarEventosBatch,
  obtenerMetricasUsuario,
  crearEventoVistaProducto,
  crearEventoCarrito,
  crearEventoCompra,
  crearEventoCampana
};
