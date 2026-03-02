/**
 * Helper Principal de Gestión de Perfiles de Cliente
 * 
 * Facilita la integración del sistema CRM con el resto de la aplicación.
 * Combina: perfiles, extracción IA, notificaciones, y actualización de métricas.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  PerfilCliente,
  ResumenPerfil,
  InformacionExtraida,
  generarResumenPerfil,
  determinarSegmento,
  calcularEngagement,
  calcularProbabilidadCompra
} from "./perfil-cliente";
import {
  extraerInformacionConversacion,
  calcularSentimentScore,
  type MensajeConversacion,
  type ConfiguracionExtractor
} from "./extractor";
import {
  determinarMejorCanal,
  crearVariablesPerfil,
  determinarNotificacionOptima,
  puedeRecibirNotificacion,
  type TipoNotificacion
} from "./notificaciones";

// CRM tables (perfiles_clientes, conversaciones_clientes, eventos_clientes)
// are defined in SQL migrations but not yet in database.types.ts auto-generated types.
// Using untyped client for CRM operations.
export type Supabase = SupabaseClient;

/**
 * Resultado de creación/actualización de perfil
 */
export interface ResultadoOperacionPerfil {
  exito: boolean;
  perfil?: PerfilCliente;
  error?: string;
  actualizaciones?: string[];
}

/**
 * Obtener o crear perfil de cliente
 * 
 * Busca por email o teléfono. Si no existe, crea uno nuevo.
 */
export async function obtenerOCrearPerfil(
  supabase: Supabase,
  id_negocio: string,
  identificador: { email?: string; telefono?: string; nombre?: string }
): Promise<ResultadoOperacionPerfil> {
  const { email, telefono, nombre } = identificador;
  
  if (!email && !telefono) {
    return {
      exito: false,
      error: "Debe proporcionar email o teléfono"
    };
  }
  
  try {
    // Buscar perfil existente
    let query = supabase
      .from("perfiles_clientes")
      .select("*")
      .eq("id_negocio", id_negocio);
    
    if (email) {
      query = query.eq("email", email);
    } else if (telefono) {
      query = query.eq("telefono", telefono);
    }
    
    const { data: perfil_existente, error: error_busqueda } = await query.single();
    
    // Si existe, devolverlo
    if (perfil_existente && !error_busqueda) {
      return {
        exito: true,
        perfil: perfil_existente as PerfilCliente
      };
    }
    
    // Si no existe, crear nuevo
    const ahora = new Date().toISOString();
    
    const nuevo_perfil = {
      id_negocio,
      nombre: nombre || "Cliente",
      email: email || null,
      telefono: telefono || null,
      preferencias: {
        productos_favoritos: [],
        categorias_interes: [],
        rango_precio_preferido: null,
        estilo_comunicacion: "casual",
        horario_preferido: null,
        dias_preferidos: []
      },
      primera_visita: ahora,
      ultima_visita: ahora,
      total_conversaciones: 0,
      total_compras: 0,
      valor_total_comprado: 0,
      promedio_ticket: 0,
      frecuencia_visitas: null,
      productos_comprados: [],
      productos_consultados: [],
      tipo_segmento: "nuevo",
      nivel_engagement: 0,
      probabilidad_compra: 50,
      valor_lifetime: 0,
      dias_desde_ultima_visita: 0,
      contexto: {
        ocasion_compra: null,
        quien_es_para: null,
        nivel_urgencia: null,
        objeciones_comunes: [],
        puntos_dolor: []
      },
      canal_preferido: "email",
      acepta_promociones: true,
      acepta_recordatorios: true,
      frecuencia_notificaciones: "semanal",
      mejor_hora_contacto: null,
      notas_internas: ""
    };
    
    const { data: perfil_creado, error: error_creacion } = await supabase
      .from("perfiles_clientes")
      .insert(nuevo_perfil)
      .select()
      .single();
    
    if (error_creacion) {
      return {
        exito: false,
        error: `Error creando perfil: ${error_creacion.message}`
      };
    }
    
    return {
      exito: true,
      perfil: perfil_creado as PerfilCliente,
      actualizaciones: ["Perfil creado"]
    };
    
  } catch (error: any) {
    return {
      exito: false,
      error: `Error: ${error.message}`
    };
  }
}

/**
 * Registrar conversación y extraer información con IA
 */
export async function registrarConversacion(
  supabase: Supabase,
  id_perfil: string,
  id_negocio: string,
  mensajes: MensajeConversacion[],
  config_ia: ConfiguracionExtractor,
  opciones?: {
    resultado?: "compra" | "consulta" | "abandono" | "queja" | "en_progreso";
    duracion_minutos?: number;
  }
): Promise<ResultadoOperacionPerfil> {
  try {
    // Extraer información con IA
    const informacion_extraida = await extraerInformacionConversacion(mensajes, config_ia);
    
    // Calcular sentiment score
    const sentiment_score = calcularSentimentScore(informacion_extraida.sentimiento || "neutral");
    
    // Productos mencionados
    const productos_mencionados = informacion_extraida.preferencias_detectadas?.productos || [];
    
    // Guardar conversación
    const conversacion = {
      id_perfil,
      id_negocio,
      mensajes: mensajes.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp?.toISOString() || new Date().toISOString()
      })),
      informacion_extraida,
      productos_mencionados,
      resultado: opciones?.resultado || "en_progreso",
      duracion_minutos: opciones?.duracion_minutos || null,
      total_mensajes: mensajes.length,
      sentiment_score,
      inicio_conversacion: mensajes[0]?.timestamp?.toISOString() || new Date().toISOString(),
      fin_conversacion: mensajes[mensajes.length - 1]?.timestamp?.toISOString() || new Date().toISOString()
    };
    
    const { error: error_conversacion } = await supabase
      .from("conversaciones_clientes")
      .insert(conversacion);
    
    if (error_conversacion) {
      return {
        exito: false,
        error: `Error guardando conversación: ${error_conversacion.message}`
      };
    }
    
    // Actualizar perfil con la información extraída
    const resultado_actualizacion = await actualizarPerfilConInformacion(
      supabase,
      id_perfil,
      informacion_extraida
    );
    
    return resultado_actualizacion;
    
  } catch (error: any) {
    return {
      exito: false,
      error: `Error: ${error.message}`
    };
  }
}

/**
 * Actualizar perfil con información extraída
 */
async function actualizarPerfilConInformacion(
  supabase: Supabase,
  id_perfil: string,
  informacion: InformacionExtraida
): Promise<ResultadoOperacionPerfil> {
  try {
    // Obtener perfil actual
    const { data: perfil_actual, error: error_obtener } = await supabase
      .from("perfiles_clientes")
      .select("*")
      .eq("id", id_perfil)
      .single();
    
    if (error_obtener || !perfil_actual) {
      return {
        exito: false,
        error: "Perfil no encontrado"
      };
    }
    
    const actualizaciones: string[] = [];
    
    // Merge preferencias
    const preferencias = perfil_actual.preferencias || {
      productos_favoritos: [],
      categorias_interes: []
    };
    
    // Agregar productos nuevos
    const productos_nuevos = (informacion.preferencias_detectadas?.productos || []).filter(
      p => !preferencias.productos_favoritos.includes(p)
    );
    
    if (productos_nuevos.length > 0) {
      preferencias.productos_favoritos = [
        ...preferencias.productos_favoritos,
        ...productos_nuevos
      ].slice(0, 20); // Máximo 20 favoritos
      actualizaciones.push(`${productos_nuevos.length} productos agregados a favoritos`);
    }
    
    // Agregar categorías nuevas
    const categorias_nuevas = (informacion.preferencias_detectadas?.categorias || []).filter(
      c => !preferencias.categorias_interes.includes(c)
    );
    
    if (categorias_nuevas.length > 0) {
      preferencias.categorias_interes = [
        ...preferencias.categorias_interes,
        ...categorias_nuevas
      ].slice(0, 10); // Máximo 10 categorías
      actualizaciones.push(`${categorias_nuevas.length} categorías agregadas a intereses`);
    }
    
    // Actualizar rango de precio si es más específico
    if (informacion.preferencias_detectadas?.rango_precio) {
      preferencias.rango_precio_preferido = informacion.preferencias_detectadas.rango_precio;
      actualizaciones.push("Rango de precio actualizado");
    }
    
    // Merge contexto
    const contexto = perfil_actual.contexto || {
      objeciones_comunes: [],
      puntos_dolor: []
    };
    
    if (informacion.contexto_detectado?.ocasion) {
      contexto.ocasion_compra = informacion.contexto_detectado.ocasion;
      actualizaciones.push("Ocasión de compra detectada");
    }
    
    if (informacion.contexto_detectado?.para_quien) {
      contexto.quien_es_para = informacion.contexto_detectado.para_quien;
    }
    
    if (informacion.contexto_detectado?.urgencia) {
      contexto.nivel_urgencia = informacion.contexto_detectado.urgencia;
    }
    
    // Agregar nuevas objeciones
    const objeciones_nuevas = (informacion.contexto_detectado?.objeciones || []).filter(
      o => !contexto.objeciones_comunes.includes(o)
    );
    
    if (objeciones_nuevas.length > 0) {
      contexto.objeciones_comunes = [
        ...contexto.objeciones_comunes,
        ...objeciones_nuevas
      ].slice(0, 10);
      actualizaciones.push(`${objeciones_nuevas.length} objeciones detectadas`);
    }
    
    // Actualizar datos de contacto si se proporcionaron
    const updates: any = {
      preferencias,
      contexto,
      total_conversaciones: perfil_actual.total_conversaciones + 1,
      ultima_visita: new Date().toISOString(),
      ultima_actualizacion_ia: new Date().toISOString()
    };
    
    if (informacion.datos_contacto?.nombre && !perfil_actual.nombre) {
      updates.nombre = informacion.datos_contacto.nombre;
      actualizaciones.push("Nombre actualizado");
    }
    
    if (informacion.datos_contacto?.email && !perfil_actual.email) {
      updates.email = informacion.datos_contacto.email;
      actualizaciones.push("Email actualizado");
    }
    
    if (informacion.datos_contacto?.telefono && !perfil_actual.telefono) {
      updates.telefono = informacion.datos_contacto.telefono;
      actualizaciones.push("Teléfono actualizado");
    }
    
    // Agregar productos consultados
    const productos_consultados = [
      ...new Set([
        ...(perfil_actual.productos_consultados || []),
        ...(informacion.preferencias_detectadas?.productos || [])
      ])
    ].slice(0, 50); // Máximo 50
    
    updates.productos_consultados = productos_consultados;
    
    // Actualizar perfil
    const { data: perfil_actualizado, error: error_actualizar } = await supabase
      .from("perfiles_clientes")
      .update(updates)
      .eq("id", id_perfil)
      .select()
      .single();
    
    if (error_actualizar) {
      return {
        exito: false,
        error: `Error actualizando perfil: ${error_actualizar.message}`
      };
    }
    
    return {
      exito: true,
      perfil: perfil_actualizado as PerfilCliente,
      actualizaciones
    };
    
  } catch (error: any) {
    return {
      exito: false,
      error: `Error: ${error.message}`
    };
  }
}

/**
 * Registrar compra de cliente
 */
export async function registrarCompra(
  supabase: Supabase,
  id_perfil: string,
  monto: number,
  productos: string[]
): Promise<ResultadoOperacionPerfil> {
  try {
    // Obtener perfil actual
    const { data: perfil_actual, error } = await supabase
      .from("perfiles_clientes")
      .select("*")
      .eq("id", id_perfil)
      .single();
    
    if (error || !perfil_actual) {
      return {
        exito: false,
        error: "Perfil no encontrado"
      };
    }
    
    // Calcular nuevos valores
    const nuevo_total_compras = perfil_actual.total_compras + 1;
    const nuevo_valor_total = perfil_actual.valor_total_comprado + monto;
    const nuevo_promedio_ticket = nuevo_valor_total / nuevo_total_compras;
    
    // Agregar productos comprados
    const productos_comprados = [
      ...new Set([
        ...(perfil_actual.productos_comprados || []),
        ...productos
      ])
    ].slice(0, 100);
    
    // Actualizar productos favoritos (los que más compra)
    const preferencias = perfil_actual.preferencias || { productos_favoritos: [] };
    productos.forEach(p => {
      if (!preferencias.productos_favoritos.includes(p)) {
        preferencias.productos_favoritos.push(p);
      }
    });
    preferencias.productos_favoritos = preferencias.productos_favoritos.slice(0, 20);
    
    // Actualizar perfil
    const { data: perfil_actualizado, error: error_actualizar } = await supabase
      .from("perfiles_clientes")
      .update({
        total_compras: nuevo_total_compras,
        valor_total_comprado: nuevo_valor_total,
        promedio_ticket: nuevo_promedio_ticket,
        valor_lifetime: nuevo_valor_total,
        productos_comprados,
        preferencias,
        ultima_visita: new Date().toISOString()
      })
      .eq("id", id_perfil)
      .select()
      .single();
    
    if (error_actualizar) {
      return {
        exito: false,
        error: `Error actualizando perfil: ${error_actualizar.message}`
      };
    }
    
    // Registrar evento de compra
    await supabase.from("eventos_clientes").insert({
      id_perfil,
      id_negocio: perfil_actual.id_negocio,
      tipo_evento: "compra",
      detalles: {
        monto,
        productos,
        ticket_promedio: nuevo_promedio_ticket
      },
      timestamp: new Date().toISOString()
    });
    
    return {
      exito: true,
      perfil: perfil_actualizado as PerfilCliente,
      actualizaciones: [
        `Compra registrada: $${monto}`,
        `Total compras: ${nuevo_total_compras}`,
        `Valor lifetime: $${nuevo_valor_total.toFixed(2)}`
      ]
    };
    
  } catch (error: any) {
    return {
      exito: false,
      error: `Error: ${error.message}`
    };
  }
}

/**
 * Obtener resumen de perfil para inyectar en prompt del agente
 */
export async function obtenerResumenParaAgente(
  supabase: Supabase,
  id_negocio: string,
  identificador: { email?: string; telefono?: string }
): Promise<{ resumen: string | null; perfil: PerfilCliente | null }> {
  const { email, telefono } = identificador;
  
  if (!email && !telefono) {
    return { resumen: null, perfil: null };
  }
  
  try {
    let query = supabase
      .from("perfiles_clientes")
      .select("*")
      .eq("id_negocio", id_negocio);
    
    if (email) {
      query = query.eq("email", email);
    } else if (telefono) {
      query = query.eq("telefono", telefono);
    }
    
    const { data: perfil, error } = await query.single();
    
    if (error || !perfil) {
      // Cliente nuevo, no hay resumen
      return { resumen: null, perfil: null };
    }
    
    // Generar resumen para el agente
    const resumen = generarResumenPerfil(perfil as PerfilCliente);
    
    return { resumen, perfil: perfil as PerfilCliente };
    
  } catch (error) {
    console.error("Error obteniendo resumen:", error);
    return { resumen: null, perfil: null };
  }
}

/**
 * Obtener clientes elegibles para una notificación
 */
export async function obtenerClientesParaNotificacion(
  supabase: Supabase,
  id_negocio: string,
  tipo_notificacion: TipoNotificacion,
  filtros_adicionales?: {
    segmentos?: string[];
    min_probabilidad_compra?: number;
    min_engagement?: number;
  }
): Promise<PerfilCliente[]> {
  try {
    let query = supabase
      .from("perfiles_clientes")
      .select("*")
      .eq("id_negocio", id_negocio)
      .eq("acepta_promociones", true);
    
    // Aplicar filtros según tipo de notificación
    if (tipo_notificacion === "vip_exclusivo") {
      query = query.eq("tipo_segmento", "vip");
    }
    
    if (filtros_adicionales?.segmentos && filtros_adicionales.segmentos.length > 0) {
      query = query.in("tipo_segmento", filtros_adicionales.segmentos);
    }
    
    if (filtros_adicionales?.min_probabilidad_compra) {
      query = query.gte("probabilidad_compra", filtros_adicionales.min_probabilidad_compra);
    }
    
    if (filtros_adicionales?.min_engagement) {
      query = query.gte("nivel_engagement", filtros_adicionales.min_engagement);
    }
    
    const { data: perfiles, error } = await query;
    
    if (error) {
      console.error("Error obteniendo clientes:", error);
      return [];
    }
    
    // Filtrar por preferencias de frecuencia
    return (perfiles || []).filter(perfil => {
      const validacion = puedeRecibirNotificacion(perfil as PerfilCliente, tipo_notificacion);
      return validacion.puede;
    }) as PerfilCliente[];
    
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export default {
  obtenerOCrearPerfil,
  registrarConversacion,
  registrarCompra,
  obtenerResumenParaAgente,
  obtenerClientesParaNotificacion
};
