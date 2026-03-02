/**
 * API Route: /api/administrador
 * 
 * Endpoint para interactuar con el Administrador Universal.
 * 
 * El Administrador ayuda con:
 * - Gestión de inventario y productos
 * - Administración de catálogo
 * - Subida y gestión de imágenes
 * - Reportes y análisis
 * - Edición de base de datos
 * - Publicación de la tienda
 */

import { NextResponse } from "next/server";
import { crearClienteDesdeEnv } from "@/lib/ia/cliente-ia";
import adminUniversalTemplate from "@/lib/templates/admin-universal";
import { createClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id_negocio,
      mensaje,
      historial_mensajes = [],
      accion = null, // "agregar_producto", "editar_inventario", "generar_reporte", etc.
      contexto = {} // Información adicional según la acción
    } = body;

    if (!id_negocio || !mensaje) {
      return NextResponse.json(
        { error: "id_negocio y mensaje son requeridos" },
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

    // 2. Generar contexto para el Administrador
    const contexto_negocio = `
## INFORMACIÓN DEL NEGOCIO

**Nombre:** ${negocio.nombre || "Sin nombre"}
**Tipo:** ${negocio.tipo_negocio || "otro"}
**Descripción:** ${negocio.descripcion || "No especificada"}
**Estado:** ${negocio.estado || "borrador"}

**Productos actuales:** ${negocio.productos?.length || 0} productos
${negocio.productos && negocio.productos.length > 0 ? `
**Catálogo:**
${negocio.productos.slice(0, 10).map((p: any) => 
  `- ${p.nombre}: $${p.precio} (Stock: ${p.stock || 0})`
).join('\n')}
${negocio.productos.length > 10 ? `... y ${negocio.productos.length - 10} más` : ''}
` : ''}

${accion ? `**Acción solicitada:** ${accion}\n` : ''}
${Object.keys(contexto).length > 0 ? `**Contexto adicional:**\n${JSON.stringify(contexto, null, 2)}\n` : ''}
`;

    // 3. Preparar prompt del Administrador
    let prompt_sistema = adminUniversalTemplate.prompt + "\n\n" + contexto_negocio;

    // 4. Preparar mensajes para IA
    const mensajes_ia = [
      { role: "system", content: prompt_sistema },
      ...historial_mensajes.map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      })),
      { role: "user", content: mensaje }
    ];

    // 5. Generar respuesta del Administrador
    const cliente_ia = crearClienteDesdeEnv();
    const respuesta = await cliente_ia.generarRespuesta(mensajes_ia);

    // 6. Detectar si la respuesta incluye una acción ejecutable
    let accion_ejecutada = null;
    try {
      accion_ejecutada = await detectarYEjecutarAccion(
        mensaje,
        respuesta.contenido,
        negocio,
        supabase
      );
    } catch (error) {
      console.error("Error ejecutando acción:", error);
    }

    return NextResponse.json({
      respuesta: respuesta.contenido,
      modelo_usado: respuesta.modelo_usado,
      provider: respuesta.provider,
      accion_ejecutada,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Error en administrador:", error);
    return NextResponse.json(
      { error: error.message || "Error procesando solicitud" },
      { status: 500 }
    );
  }
}

/**
 * Detectar y ejecutar acciones del administrador
 */
async function detectarYEjecutarAccion(
  mensaje_usuario: string,
  respuesta_admin: string,
  negocio: any,
  supabase: any
): Promise<any> {
  const mensaje_lower = mensaje_usuario.toLowerCase();

  // Detectar intención de agregar producto
  if (
    mensaje_lower.includes("agregar producto") ||
    mensaje_lower.includes("nuevo producto") ||
    mensaje_lower.includes("añadir producto")
  ) {
    // Extraer información del producto con IA
    const cliente_ia = crearClienteDesdeEnv();
    
    try {
      const producto_info = await cliente_ia.extraerJSON<any>(
        `Extrae información de producto del siguiente mensaje. Si falta información, usa null.`,
        `${mensaje_usuario}\n\nRespuesta del administrador: ${respuesta_admin}\n\nExtrae en JSON: {nombre, descripcion, precio, categoria, stock}`
      );

      if (producto_info.nombre && producto_info.precio) {
        // Insertar producto en la BD
        const { data, error } = await supabase
          .from("productos")
          .insert({
            id_negocio: negocio.id,
            nombre: producto_info.nombre,
            descripcion: producto_info.descripcion || "",
            precio: parseFloat(producto_info.precio),
            categoria: producto_info.categoria || "General",
            stock: producto_info.stock || 0,
            activo: true
          })
          .select()
          .single();

        if (!error) {
          return {
            tipo: "producto_agregado",
            producto: data
          };
        }
      }
    } catch (error) {
      console.error("Error creando producto:", error);
    }
  }

  // Detectar intención de generar reporte
  if (
    mensaje_lower.includes("reporte") ||
    mensaje_lower.includes("análisis") ||
    mensaje_lower.includes("estadísticas")
  ) {
    // Generar reporte básico
    const total_productos = negocio.productos?.length || 0;
    const productos_activos = negocio.productos?.filter((p: any) => p.activo)?.length || 0;
    const valor_inventario = negocio.productos?.reduce(
      (sum: number, p: any) => sum + (p.precio * (p.stock || 0)), 
      0
    ) || 0;

    return {
      tipo: "reporte_generado",
      reporte: {
        total_productos,
        productos_activos,
        valor_inventario,
        timestamp: new Date().toISOString()
      }
    };
  }

  return null;
}

/**
 * GET: Obtener dashboard del administrador
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

    // Obtener negocio con productos
    const { data: negocio, error } = await supabase
      .from("negocios")
      .select("*, productos(*)")
      .eq("id", id_negocio)
      .single();

    if (error || !negocio) {
      return NextResponse.json(
        { error: "Negocio no encontrado" },
        { status: 404 }
      );
    }

    // Generar dashboard
    const dashboard = {
      negocio: {
        nombre: negocio.nombre,
        tipo: negocio.tipo_negocio,
        estado: negocio.estado
      },
      inventario: {
        total_productos: negocio.productos?.length || 0,
        productos_activos: negocio.productos?.filter((p: any) => p.activo)?.length || 0,
        productos_sin_stock: negocio.productos?.filter((p: any) => (p.stock || 0) === 0)?.length || 0,
        valor_total_inventario: negocio.productos?.reduce(
          (sum: number, p: any) => sum + (p.precio * (p.stock || 0)),
          0
        ) || 0
      },
      alertas: [],
      recomendaciones: []
    };

    // Agregar alertas
    const productos_bajo_stock = negocio.productos?.filter(
      (p: any) => p.activo && (p.stock || 0) > 0 && (p.stock || 0) < 10
    );
    
    if (productos_bajo_stock && productos_bajo_stock.length > 0) {
      dashboard.alertas.push({
        tipo: "stock_bajo",
        mensaje: `${productos_bajo_stock.length} productos con stock bajo`,
        productos: productos_bajo_stock.map((p: any) => ({
          nombre: p.nombre,
          stock: p.stock
        }))
      });
    }

    return NextResponse.json(dashboard);

  } catch (error: any) {
    console.error("Error obteniendo dashboard:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
