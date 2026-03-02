/**
 * EJEMPLO DE INTEGRACIÓN CRM
 * 
 * Este archivo muestra cómo modificar /api/constructor/mensaje/route.ts
 * para integrar el sistema CRM con los agentes.
 * 
 * CAMBIOS NECESARIOS:
 * 1. Buscar/crear perfil del cliente al inicio de la conversación
 * 2. Inyectar resumen del perfil en el prompt del agente
 * 3. Guardar conversación y extraer información al finalizar
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { 
  obtenerOCrearPerfil,
  obtenerResumenParaAgente,
  registrarConversacion,
  registrarCompra
} from "@/lib/crm";
import type { MensajeConversacion } from "@/lib/crm";
import { detectarTipoNegocio } from "@/lib/constructor/detector";
import { obtenerTemplateVendedor } from "@/lib/templates/vendedor";

// Configuración de OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface RequestBody {
  id_negocio: string;
  id_sesion: string;
  mensaje: string;
  contexto_usuario?: {
    email?: string;
    telefono?: string;
    nombre?: string;
  };
  finalizar_conversacion?: boolean; // Indica si la conversación terminó
  compra_realizada?: {
    monto: number;
    productos: string[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { 
      id_negocio, 
      id_sesion, 
      mensaje, 
      contexto_usuario,
      finalizar_conversacion = false,
      compra_realizada
    } = body;
    
    // Validaciones
    if (!id_negocio || !mensaje) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos" },
        { status: 400 }
      );
    }
    
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key no configurada" },
        { status: 500 }
      );
    }
    
    const supabase = createClient();
    
    // ==================================================================
    // 🆕 PASO 1: BUSCAR O CREAR PERFIL DEL CLIENTE
    // ==================================================================
    let perfil_cliente = null;
    let resumen_perfil = null;
    
    if (contexto_usuario?.email || contexto_usuario?.telefono) {
      const resultado_perfil = await obtenerOCrearPerfil(
        supabase,
        id_negocio,
        {
          email: contexto_usuario?.email,
          telefono: contexto_usuario?.telefono,
          nombre: contexto_usuario?.nombre
        }
      );
      
      if (resultado_perfil.exito) {
        perfil_cliente = resultado_perfil.perfil;
        
        // Obtener resumen para inyectar en el prompt
        const { resumen } = await obtenerResumenParaAgente(
          supabase,
          id_negocio,
          {
            email: contexto_usuario?.email,
            telefono: contexto_usuario?.telefono
          }
        );
        
        resumen_perfil = resumen;
        
        console.log("✅ Perfil del cliente cargado:", {
          id: perfil_cliente?.id,
          segmento: perfil_cliente?.segmento.tipo,
          engagement: perfil_cliente?.segmento.nivel_engagement
        });
      }
    }
    
    // ==================================================================
    // PASO 2: OBTENER INFORMACIÓN DEL NEGOCIO
    // ==================================================================
    const { data: negocio, error: error_negocio } = await supabase
      .from("negocios")
      .select("*")
      .eq("id", id_negocio)
      .single();
    
    if (error_negocio || !negocio) {
      return NextResponse.json(
        { error: "Negocio no encontrado" },
        { status: 404 }
      );
    }
    
    // Detectar industria (o usar la configurada)
    const industria = negocio.industria || (await detectarTipoNegocio(negocio.descripcion || "")).tipo;
    
    // Obtener plantilla del agente según industria
    const plantilla_agente = obtenerTemplateVendedor(industria);
    
    // ==================================================================
    // PASO 3: OBTENER CATÁLOGO DE PRODUCTOS
    // ==================================================================
    const { data: productos, error: error_productos } = await supabase
      .from("productos")
      .select("*")
      .eq("id_negocio", id_negocio)
      .eq("activo", true);
    
    if (error_productos) {
      console.error("Error obteniendo productos:", error_productos);
    }
    
    // Formatear catálogo para el prompt
    const catalogo_productos = (productos || [])
      .map(p => `- **${p.nombre}**: ${p.descripcion} ($${p.precio})`)
      .join("\n");
    
    const catalogo_nombres = (productos || []).map(p => p.nombre);
    
    // ==================================================================
    // 🆕 PASO 4: INYECTAR PERFIL DEL CLIENTE EN EL PROMPT
    // ==================================================================
    let prompt_personalizado = plantilla_agente.prompt;
    
    // Inyectar perfil del cliente
    if (resumen_perfil) {
      prompt_personalizado = prompt_personalizado.replace(
        "{{PERFIL_CLIENTE}}",
        resumen_perfil
      );
    } else {
      // Cliente nuevo o sin identificar
      prompt_personalizado = prompt_personalizado.replace(
        "{{PERFIL_CLIENTE}}",
        "Cliente nuevo - primera visita 🆕\n\nEstrategia: Causar buena primera impresión, descubrir preferencias."
      );
    }
    
    // Inyectar catálogo de productos
    prompt_personalizado = prompt_personalizado.replace(
      "{{PRODUCTOS_CATALOGO}}",
      catalogo_productos || "No hay productos configurados aún."
    );
    
    // ==================================================================
    // PASO 5: OBTENER HISTORIAL DE CONVERSACIÓN
    // ==================================================================
    // Historial guardado en construccion_progreso.historial_mensajes
    const { data: progreso_sesion } = await supabase
      .from("construccion_progreso")
      .select("historial_mensajes")
      .eq("id_negocio", id_negocio)
      .maybeSingle();
    
    let mensajes_anteriores: any[] = [];
    
    if (progreso_sesion && progreso_sesion.historial_mensajes) {
      mensajes_anteriores = progreso_sesion.historial_mensajes;
    }
    
    // Agregar mensaje actual
    const mensajes_conversacion = [
      ...mensajes_anteriores,
      {
        role: "user",
        content: mensaje,
        timestamp: new Date().toISOString()
      }
    ];
    
    // ==================================================================
    // PASO 6: LLAMAR A OPENAI CON PROMPT PERSONALIZADO
    // ==================================================================
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: prompt_personalizado // Incluye perfil + catálogo
          },
          ...mensajes_conversacion
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI error: ${error}`);
    }
    
    const data = await response.json();
    const respuesta_agente = data.choices[0]?.message?.content;
    
    if (!respuesta_agente) {
      throw new Error("OpenAI no devolvió respuesta");
    }
    
    // Agregar respuesta del agente
    const mensajes_actualizados = [
      ...mensajes_conversacion,
      {
        role: "assistant",
        content: respuesta_agente,
        timestamp: new Date().toISOString()
      }
    ];
    
    // ==================================================================
    // PASO 7: GUARDAR SESIÓN ACTUALIZADA
    // ==================================================================
    await supabase
      .from("construccion_progreso")
      .upsert({
        id_negocio,
        historial_mensajes: mensajes_actualizados,
        ultima_actualizacion: new Date().toISOString()
      });
    
    // ==================================================================
    // 🆕 PASO 8: REGISTRAR CONVERSACIÓN Y EXTRAER INFORMACIÓN (SI FINALIZÓ)
    // ==================================================================
    if (finalizar_conversacion && perfil_cliente) {
      console.log("📊 Finalizando conversación, extrayendo información...");
      
      // Convertir mensajes a formato del CRM
      const mensajes_crm: MensajeConversacion[] = mensajes_actualizados.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
        timestamp: new Date(m.timestamp)
      }));
      
      // Registrar conversación con extracción de IA
      const resultado_registro = await registrarConversacion(
        supabase,
        perfil_cliente.id,
        id_negocio,
        mensajes_crm,
        {
          api_key: OPENAI_API_KEY!,
          provider: "openai",
          catalogo_productos: catalogo_nombres
        },
        {
          resultado: compra_realizada ? "compra" : "consulta",
          duracion_minutos: Math.round(
            (new Date().getTime() - new Date(mensajes_actualizados[0].timestamp).getTime()) 
            / (1000 * 60)
          )
        }
      );
      
      if (resultado_registro.exito) {
        console.log("✅ Conversación registrada:", resultado_registro.actualizaciones);
      } else {
        console.error("❌ Error registrando conversación:", resultado_registro.error);
      }
      
      // ==================================================================
      // 🆕 PASO 9: REGISTRAR COMPRA (SI SE REALIZÓ)
      // ==================================================================
      if (compra_realizada) {
        console.log("💰 Registrando compra...");
        
        const resultado_compra = await registrarCompra(
          supabase,
          perfil_cliente.id,
          compra_realizada.monto,
          compra_realizada.productos
        );
        
        if (resultado_compra.exito) {
          console.log("✅ Compra registrada:", resultado_compra.actualizaciones);
          
          // Verificar si el cliente subió de segmento
          if (resultado_compra.perfil?.segmento.tipo === "vip") {
            console.log("⭐ Cliente ascendió a VIP!");
            // Aquí podrías enviar una notificación de bienvenida al club VIP
          }
        } else {
          console.error("❌ Error registrando compra:", resultado_compra.error);
        }
      }
    }
    
    // ==================================================================
    // PASO 10: DEVOLVER RESPUESTA
    // ==================================================================
    return NextResponse.json({
      mensaje: respuesta_agente,
      agente: plantilla_agente.metadata.nombre,
      industria,
      // 🆕 Información adicional del CRM
      perfil_cliente: perfil_cliente ? {
        segmento: perfil_cliente.segmento.tipo,
        engagement: perfil_cliente.segmento.nivel_engagement,
        probabilidad_compra: perfil_cliente.segmento.probabilidad_compra,
        es_vip: perfil_cliente.segmento.tipo === "vip"
      } : null
    });
    
  } catch (error: any) {
    console.error("Error en /api/constructor/mensaje:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// ==================================================================
// EJEMPLO DE LLAMADA DESDE EL FRONTEND
// ==================================================================

/*

// 1. INICIO DE CONVERSACIÓN (primer mensaje)
const response1 = await fetch('/api/constructor/mensaje', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id_negocio: "uuid-del-negocio",
    id_sesion: "session-123",
    mensaje: "Hola, quiero una hamburguesa",
    contexto_usuario: {
      email: "cliente@example.com" // Opcional pero recomendado
    }
  })
});

const data1 = await response1.json();
console.log(data1.mensaje); // Respuesta del agente
console.log(data1.perfil_cliente); // { segmento: "nuevo", engagement: 0, ... }


// 2. MENSAJES INTERMEDIOS
const response2 = await fetch('/api/constructor/mensaje', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id_negocio: "uuid-del-negocio",
    id_sesion: "session-123",
    mensaje: "La quiero con queso extra",
    contexto_usuario: {
      email: "cliente@example.com"
    }
  })
});


// 3. FINALIZAR CONVERSACIÓN (sin compra)
const response3 = await fetch('/api/constructor/mensaje', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id_negocio: "uuid-del-negocio",
    id_sesion: "session-123",
    mensaje: "Gracias, luego vuelvo",
    contexto_usuario: {
      email: "cliente@example.com"
    },
    finalizar_conversacion: true // 🆕 IMPORTANTE: Activa extracción IA
  })
});

// ✅ Ahora el perfil del cliente se actualizó con:
// - productos consultados: ["Hamburguesa"]
// - preferencias detectadas: queso extra
// - sentimiento: neutral
// - intención: consulta
// - segmento recalculado


// 4. FINALIZAR CON COMPRA
const response4 = await fetch('/api/constructor/mensaje', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id_negocio: "uuid-del-negocio",
    id_sesion: "session-123",
    mensaje: "Perfecto, confirmo el pedido",
    contexto_usuario: {
      email: "cliente@example.com"
    },
    finalizar_conversacion: true,
    compra_realizada: { // 🆕 IMPORTANTE: Actualiza métricas
      monto: 17.99,
      productos: ["Hamburguesa BBQ"]
    }
  })
});

// ✅ Ahora el perfil del cliente tiene:
// - total_compras: 1
// - valor_total_comprado: 17.99
// - productos_comprados: ["Hamburguesa BBQ"]
// - productos_favoritos: ["Hamburguesa BBQ"]
// - segmento: "recurrente" (si ya tenía 1+ conversación)
// - probabilidad_compra: aumentó
// - engagement: aumentó

*/
