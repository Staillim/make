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

// ---------------------------------------------------------------------------
// Helpers: parse special markers injected by the AI into its response
// ---------------------------------------------------------------------------

/** Strip and detect [[AVANZAR_FASE]] */
function parsearAvanzarFase(texto: string): { texto: string; avanzar: boolean } {
  const avanzar = /\[\[AVANZAR_FASE\]\]/i.test(texto);
  return { texto: texto.replace(/\[\[AVANZAR_FASE\]\]/gi, "").trim(), avanzar };
}

/** Strip and detect [[ACTIVAR_NEGOCIO]] */
function parsearActivarNegocio(texto: string): { texto: string; activar: boolean } {
  const activar = /\[\[ACTIVAR_NEGOCIO\]\]/i.test(texto);
  return { texto: texto.replace(/\[\[ACTIVAR_NEGOCIO\]\]/gi, "").trim(), activar };
}

/** Strip and extract [[OPCIONES:["a","b"]]] */
function parsearOpciones(texto: string): { texto: string; opciones: string[] } {
  const match = texto.match(/\[\[OPCIONES:([\s\S]*?)\]\]/i);
  let opciones: string[] = [];
  if (match) {
    try { opciones = JSON.parse(match[1]); } catch { opciones = []; }
  }
  return { texto: texto.replace(/\[\[OPCIONES:[\s\S]*?\]\]/gi, "").trim(), opciones };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id_negocio = null,
      mensaje,
      historial_mensajes = [],
      negocio_parcial = null,
      fase_actual = "descubrimiento",
      es_inicio = false,
      idioma = undefined,
    } = body;

    if (!mensaje) {
      return NextResponse.json({ error: "Mensaje es requerido" }, { status: 400 });
    }

    // 1. Generar prompt del Orquestador con contexto
    const prompt_sistema = generarPromptOrquestador({
      negocio_parcial,
      fase_actual,
      historial: historial_mensajes,
      es_inicio,
      idioma,
    });

    // 2. Preparar mensajes para la IA
    const mensajes_ia = [
      { role: "system" as const, content: prompt_sistema },
      ...historial_mensajes.map((m: any) => ({
        role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: mensaje },
    ];

    // 3. Generar respuesta del Orquestador
    const cliente_ia = crearClienteDesdeEnv();
    const respuesta_raw = await cliente_ia.generarRespuesta(mensajes_ia);

    // 4. Parsear marcadores del modelo antes de devolver al cliente
    let texto = respuesta_raw.contenido;

    const { texto: texto2, avanzar } = parsearAvanzarFase(texto);
    texto = texto2;

    const { texto: texto3, activar } = parsearActivarNegocio(texto);
    texto = texto3;

    const { texto: texto4, opciones } = parsearOpciones(texto);
    texto = texto4;

    // 5. Extraer información estructurada del mensaje del usuario
    let informacion_extraida: Record<string, any> | null = null;
    if (mensaje.length > 20) {
      try {
        informacion_extraida = await extraerInformacionNegocio(mensaje, texto);
      } catch (e) {
        console.error("Error extrayendo info:", e);
      }
    }

    // 6. Activar negocio en BD si el orquestador lo indica
    let negocio_activado = false;
    if (activar && id_negocio) {
      try {
        const supabase = createClient();
        const info = { ...negocio_parcial, ...informacion_extraida };

        // Actualizar estado del negocio
        await supabase
          .from("negocios")
          .update({
            nombre: info.nombre_negocio ?? "Mi Negocio",
            estado: "activo",
            fecha_activacion: new Date().toISOString(),
            url_tienda: `/tienda/${id_negocio}`,
          })
          .eq("id_negocio", id_negocio);

        // Guardar identidad de marca si hay datos
        if (info.nombre_negocio) {
          await supabase.from("marca").upsert({
            id_negocio,
            nombre_negocio: info.nombre_negocio ?? "Mi Negocio",
            slogan: info.slogan ?? null,
            color_primario: info.color_primario ?? "#4f46e5",
            estilo_visual: info.estilo_visual ?? "moderno",
            tono_comunicacion: info.tono_comunicacion ?? "amigable",
            nombre_agente_vendedor: info.nombre_agente_vendedor ?? null,
          });
        }

        // Guardar tema
        if (info.tipo_negocio) {
          await supabase.from("tema").upsert({
            id_negocio,
            tipo_negocio: info.tipo_negocio ?? "otro",
            categoria_principal: info.categorias_mencionadas?.[0] ?? "General",
            tipo_producto: info.tipo_producto ?? "fisico",
            alcance: info.alcance ?? "local",
          });
        }

        negocio_activado = true;
      } catch (error) {
        console.error("Error activando negocio:", error);
      }
    }

    // 7. Guardar progreso en BD (si hay id_negocio)
    if (id_negocio && !activar) {
      try {
        const supabase = createClient();
        await supabase.from("construccion_progreso").upsert({
          id_negocio,
          fase_actual,
          negocio_parcial: { ...negocio_parcial, ...informacion_extraida },
          ultima_actualizacion: new Date().toISOString(),
          historial_mensajes: [
            ...historial_mensajes,
            { role: "user", content: mensaje },
            { role: "assistant", content: texto },
          ],
        });
      } catch (error) {
        console.error("Error guardando progreso:", error);
      }
    }

    return NextResponse.json({
      respuesta: texto,
      modelo_usado: respuesta_raw.modelo_usado,
      provider: respuesta_raw.provider,
      fase_actual,
      avanzar_fase: avanzar,
      negocio_activado,
      opciones_rapidas: opciones.length > 0
        ? opciones.map((o) => ({ label: o, valor: o }))
        : null,
      informacion_extraida,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("Error en orquestador:", error);
    return NextResponse.json({ error: error.message || "Error procesando mensaje" }, { status: 500 });
  }
}

/**
 * Extraer información estructurada del mensaje del usuario
 */
async function extraerInformacionNegocio(
  mensaje_usuario: string,
  respuesta_orquestador: string
): Promise<Record<string, any> | null> {
  const cliente_ia = crearClienteDesdeEnv();

  const prompt = `Analiza este intercambio y extrae información estructurada del negocio que están configurando.

USUARIO: ${mensaje_usuario}
ORQUESTADOR: ${respuesta_orquestador}

Devuelve SOLO un objeto JSON con los campos que se mencionaron explícitamente. Si un campo no fue mencionado, no lo incluyas.

Campos posibles:
{
  "tipo_negocio": "restaurante|tienda_ropa|tecnologia|gimnasio|educacion|servicios|salud|belleza|hogar|otro",
  "nombre_negocio": "...",
  "slogan": "...",
  "color_primario": "#rrggbb",
  "estilo_visual": "minimalista|elegante|juvenil|profesional|moderno",
  "tono_comunicacion": "formal|amigable|casual|profesional",
  "tipo_producto": "fisico|digital|mixto",
  "alcance": "local|nacional|internacional",
  "categorias_mencionadas": ["..."],
  "productos_mencionados": [{"nombre":"...","precio":0}],
  "metodos_pago": ["tarjeta","transferencia","efectivo","otro"],
  "nombre_agente_vendedor": "..."
}`;

  try {
    return await cliente_ia.extraerJSON<Record<string, any>>(
      prompt,
      "Extrae la información en formato JSON."
    );
  } catch {
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
