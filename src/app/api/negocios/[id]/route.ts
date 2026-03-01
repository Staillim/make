import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch from database
    const { data: negocio, error } = await supabaseAdmin
      .from('negocios')
      .select('*')
      .eq('id_negocio', id)
      .single();

    if (error || !negocio) {
      return NextResponse.json(
        { error: "Negocio no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id_negocio: negocio.id_negocio,
      id_usuario: negocio.id_usuario,
      nombre: negocio.nombre,
      estado: negocio.estado,
      fecha_creacion: negocio.fecha_creacion,
      fecha_activacion: negocio.fecha_activacion,
      url_tienda: negocio.url_tienda,
    });
  } catch (error) {
    console.error('Get business error:', error);
    return NextResponse.json(
      { error: "Negocio no encontrado" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete from database (cascade will handle related data)
    const { error } = await supabaseAdmin
      .from('negocios')
      .delete()
      .eq('id_negocio', id);

    if (error) {
      console.error('Delete business error:', error);
      return NextResponse.json(
        { error: "Error al eliminar negocio" },
        { status: 500 }
      );
    }

    return NextResponse.json({ deleted: id });
  } catch (error) {
    console.error('Delete business error:', error);
    return NextResponse.json(
      { error: "Error al eliminar negocio" },
      { status: 500 }
    );
  }
}
