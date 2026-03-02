/**
 * API Route: /api/constructor/orquestador
 * 
 * Endpoint para interactuar con el Orquestador durante el proceso
 * de construcción del negocio.
 * 
 * El Orquestador ayuda al dueño a definir:
 * - Tipo de negocio
 * - Productos/servicios
 * - Modelo de negocio
 * - Referencias visuales
 * - Estructura de inventario
 */

import { NextResponse } from "next/server";
import { crearClienteDesdeEnv } from "@/lib/ia/cliente-ia";
import { generarPromptOrquestador } from "@/lib/templates/constructor";
import { createClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id_negocio, // Opcional: ID si ya existe el negocio en construcción
      mensaje,
      historial_mensajes = [],
      negocio_parcial = null, // Información ya recopilada
      fase_actual = "descubrimiento" // descubrimiento, productos, identidad, operaciones, inventario
    } = body;

    if (!mensaje) {
      return NextResponse.json(
        { error: "Mensaje es requerido" },
        { status: 400 }
      );
    }

    // 1. Generar prompt del Orquestador con contexto
    const prompt_sistema = generarPromptOrquestador({
      negocio_parcial,
      fase_actual,
      historial: historial_mensajes
    });

    // 2. Preparar mensajes para la IA
    const mensajes_ia = [
      { role: "system", content: prompt_sistema },
      ...historial_mensajes.map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      })),
      { role: "user", content: mensaje }
    ];

    // 3. Generar respuesta del Orquestador
    const cliente_ia = crearClienteDesdeEnv();
    const respuesta = await cliente_ia.generarRespuesta(mensajes_ia);

    // 4. Si hay ID de negocio, guardar el progreso
    if (id_negocio) {
      try {
        const supabase = createClient();
        
        // Guardar snapshot del progreso en una tabla de construcción
        await supabase
          .from("construccion_progreso")
          .upsert({
            id_negocio,
            fase_actual,
            negocio_parcial,
            ultima_actualizacion: new Date().toISOString(),
            historial_mensajes: [...historial_mensajes, 
              { role: "user", content: mensaje },
              { role: "assistant", content: respuesta.contenido }
            ]
          });
      } catch (error) {
        console.error("Error guardando progreso:", error);
        // No bloqueamos la respuesta si falla el guardado
      }
    }

    // 5. Intentar extraer información estructurada de la respuesta
    let informacion_extraida = null;
    try {
      // Si el usuario proporcionó información clave, extraerla
      if (mensaje.length > 50) { // Respuestas sustanciales
        informacion_extraida = await extraerInformacionNegocio(
          mensaje,
          respuesta.contenido
        );
      }
    } catch (error) {
      console.error("Error extrayendo información:", error);
    }

    return NextResponse.json({
      respuesta: respuesta.contenido,
      modelo_usado: respuesta.modelo_usado,
      provider: respuesta.provider,
      fase_actual,
      informacion_extraida,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Error en orquestador:", error);
    return NextResponse.json(
      { error: error.message || "Error procesando mensaje" },
      { status: 500 }
    );
  }
}

/**
 * Extraer información estructurada del mensaje del usuario
 * usando IA
 */
async function extraerInformacionNegocio(
  mensaje_usuario: string,
  respuesta_orquestador: string
): Promise<any> {
  const cliente_ia = crearClienteDesdeEnv();
  
  const prompt = `Analiza este intercambio entre el Orquestador y el usuario para extraer información estructurada sobre el negocio que están construyendo.

USUARIO: ${mensaje_usuario}
ORQUESTADOR: ${respuesta_orquestador}

Extrae en JSON:
{
  "tipo_negocio": "restaurante|tienda_ropa|tecnologia|gimnasio|educacion|servicios|otro",
  "nombre_negocio": "...",
  "productos_mencionados": ["..."],
  "precios_mencionados": [89, 120],
  "categorias_mencionadas": ["..."],
  "modelo_negocio": "local|online|hibrido",
  "referencias_visuales": ["URL1", "URL2"],
  "campos_inventario_requeridos": ["variantes", "stock", "..."]
}

Solo extrae lo que fue explícitamente mencionado. Si no hay información, usa null o [].`;

  try {
    const info = await cliente_ia.extraerJSON<any>(
      prompt,
      "Extrae la información en formato JSON."
    );
    return info;
  } catch (error) {
    return null;
  }
}

/**
 * GET: Obtener el progreso de construcción de un negocio
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_negocio = searchParams.get("id_negocio");

    if (!id_negocio) {
      return NextResponse.json(
        { error: "id_negocio es requerido" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("construccion_progreso")
      .select("*")
      .eq("id_negocio", id_negocio)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Progreso no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      fase_actual: data.fase_actual,
      negocio_parcial: data.negocio_parcial,
      historial_mensajes: data.historial_mensajes || [],
      ultima_actualizacion: data.ultima_actualizacion
    });

  } catch (error: any) {
    console.error("Error obteniendo progreso:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
