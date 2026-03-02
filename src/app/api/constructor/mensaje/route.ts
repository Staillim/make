import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { crearClienteDesdeEnv } from "@/lib/ia/cliente-ia";
import { 
  obtenerOCrearPerfil, 
  obtenerResumenParaAgente,
  registrarConversacion 
} from "@/lib/crm";
import { obtenerTemplateVendedor, inyectarCatalogo } from "@/lib/templates/vendedor";
import {
  obtenerNotasAgente,
  formatearNotasParaPrompt,
  generarBloquePrompNotas,
  procesarNotasDeRespuesta,
} from "@/lib/agentes/notas-agente";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      id_negocio, 
      fase, 
      mensaje,
      email_cliente,
      telefono_cliente,
      historial_mensajes = []
    } = body;

    if (!id_negocio || !fase || !mensaje) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    // 1. Obtener información del negocio
    const { data: negocio, error: errorNegocio } = await supabase
      .from("negocios")
      .select("*, productos(*)")
      .eq("id", id_negocio)
      .single();
    
    if (errorNegocio || !negocio) {
      return NextResponse.json(
        { error: "Negocio no encontrado" },
        { status: 404 }
      );
    }
    
    // 2. Obtener o crear perfil del cliente (si hay identificación)
    let perfil_cliente: any = null;
    let resumen_perfil: string = "";
    
    if (email_cliente || telefono_cliente) {
      try {
        const { perfil } = await obtenerOCrearPerfil(supabase, id_negocio, {
          email: email_cliente,
          telefono: telefono_cliente
        });
        
        perfil_cliente = perfil;
        
        // Obtener resumen para el agente
        const { resumen } = await obtenerResumenParaAgente(supabase, id_negocio, {
          email: email_cliente,
          telefono: telefono_cliente
        });
        
        resumen_perfil = resumen || "Cliente nuevo, primera interacción.";
      } catch (error) {
        console.error("Error obteniendo perfil:", error);
        // Continuar sin perfil
      }
    }
    
    // 3. Obtener template del agente según industria
    let prompt_sistema = "";
    
    try {
      const template = obtenerTemplateVendedor(negocio.tipo_negocio || "otro");
      
      // Inyectar catálogo de productos
      let prompt_con_catalogo = inyectarCatalogo(
        template.prompt,
        negocio.productos || []
      );
      
      // Inyectar perfil del cliente si existe
      if (resumen_perfil) {
        prompt_con_catalogo = prompt_con_catalogo.replace(
          "{{PERFIL_CLIENTE}}",
          resumen_perfil
        );
      } else {
        // Remover placeholder si no hay perfil
        prompt_con_catalogo = prompt_con_catalogo.replace(
          "{{PERFIL_CLIENTE}}",
          "Cliente nuevo, primera interacción."
        );
      }
      
      prompt_sistema = prompt_con_catalogo;
    } catch (error) {
      console.error("Error obteniendo template:", error);
      prompt_sistema = `Eres un asistente de ventas para ${negocio.nombre}. Ayuda al cliente de forma amigable y profesional.`;
    }

    // 3b. Inyectar notas del agente vendedor en el prompt
    try {
      const notas = await obtenerNotasAgente(supabase, id_negocio, "vendedor", { limite: 30 });
      const bloque = generarBloquePrompNotas(formatearNotasParaPrompt(notas));
      if (bloque) prompt_sistema += "\n\n" + bloque;
    } catch (error) {
      console.error("Error cargando notas del agente vendedor:", error);
    }
    
    // 4. Preparar mensajes para IA
    const mensajes_ia = [
      { role: "system" as const, content: prompt_sistema },
      ...historial_mensajes.map((m: any) => ({
        role: m.rol === "user" ? "user" as const : "assistant" as const,
        content: m.contenido
      })),
      { role: "user" as const, content: mensaje }
    ];
    
    // 5. Generar respuesta con IA
    const cliente_ia = crearClienteDesdeEnv();
    const respuesta_ia = await cliente_ia.generarRespuesta(mensajes_ia);

    // 5b. Procesar notas del agente (extraer marcadores [[NOTA_AGENTE:{...}]] y guardar)
    let contenido_final = respuesta_ia.contenido;
    try {
      contenido_final = await procesarNotasDeRespuesta(
        supabase,
        respuesta_ia.contenido,
        id_negocio,
        "vendedor",
        body.id_sesion
      );
    } catch (error) {
      console.error("Error procesando notas del vendedor:", error);
    }
    
    // 6. Registrar conversación en el CRM (si hay perfil)
    if (perfil_cliente) {
      try {
        await registrarConversacion(
          supabase,
          perfil_cliente.id,
          id_negocio,
          [
            { role: "user", content: mensaje },
            { role: "assistant", content: contenido_final }
          ],
          {
            api_key: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || "",
            provider: process.env.GEMINI_API_KEY ? "gemini" : "openai",
            catalogo_productos: negocio.productos?.map((p: any) => p.nombre) || []
          }
        );
      } catch (error) {
        console.error("Error registrando conversación en CRM:", error);
        // Continuar sin registrar
      }
    }
    
    // 7. Responder al cliente
    const respuesta = {
      id: crypto.randomUUID(),
      rol: "bot" as const,
      contenido: contenido_final,
      timestamp: new Date().toISOString(),
      fase,
      modelo_usado: respuesta_ia.modelo_usado,
      provider: respuesta_ia.provider
    };

    return NextResponse.json(respuesta);
    
  } catch (error) {
    console.error("Error procesando mensaje:", error);
    return NextResponse.json(
      { error: "Error al procesar mensaje", detalle: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

