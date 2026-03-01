import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Update in database
    const { data: negocio, error } = await supabaseAdmin
      .from('negocios')
      .update({
        estado: 'activo',
        fecha_activacion: new Date().toISOString(),
        url_tienda: `/tienda/${id}`,
      })
      .eq('id_negocio', id)
      .select()
      .single();

    if (error) {
      console.error('Activate business error:', error);
      return NextResponse.json(
        { error: "Error al activar negocio" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id_negocio: negocio.id_negocio,
      estado: negocio.estado,
      url_tienda: negocio.url_tienda,
      fecha_activacion: negocio.fecha_activacion,
    });
  } catch (error) {
    console.error('Activate business error:', error);
    return NextResponse.json(
      { error: "Error al activar negocio" },
      { status: 500 }
    );
  }
}
