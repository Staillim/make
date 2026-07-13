import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Update in database
    const update: Database["public"]["Tables"]["negocios"]["Update"] = {
      estado: "activo",
      fecha_activacion: new Date().toISOString(),
      url_tienda: `/tienda/${id}`,
    };
    const { data: negocio, error } = await supabaseAdmin
      .from("negocios")
      .update(update)
      .eq("id_negocio", id)
      .select()
      .single();

    if (error) {
      console.error("Activate business error:", error);
      return NextResponse.json(
        { error: "Error al activar negocio" },
        { status: 500 }
      );
    }

    // El select de Supabase devuelve un union con `null` por el `.single()`.
    // Forzamos el shape esperado para la respuesta.
    return NextResponse.json({
      id_negocio: (negocio as { id_negocio: string }).id_negocio,
      estado: (negocio as { estado: string }).estado,
      url_tienda: (negocio as { url_tienda: string | null }).url_tienda,
      fecha_activacion: (negocio as { fecha_activacion: string | null }).fecha_activacion,
    });
  } catch (error) {
    console.error("Activate business error:", error);
    return NextResponse.json(
      { error: "Error al activar negocio" },
      { status: 500 }
    );
  }
}
