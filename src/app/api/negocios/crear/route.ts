import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_usuario } = body;

    if (!id_usuario) {
      return NextResponse.json(
        { error: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    // Get user info to check plan limits
    const { data: usuario, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('plan')
      .eq('id_usuario', id_usuario)
      .single();

    if (userError || !usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Check plan limits (free = 1 business, premium = unlimited)
    if (usuario.plan === 'free') {
      const { count } = await supabaseAdmin
        .from('negocios')
        .select('*', { count: 'exact', head: true })
        .eq('id_usuario', id_usuario);

      if (count && count >= 1) {
        return NextResponse.json(
          { error: "Plan gratuito limitado a 1 negocio. Actualiza a Premium para crear más." },
          { status: 403 }
        );
      }
    }

    // Save to database
    const { data: negocio, error } = await supabaseAdmin
      .from('negocios')
      .insert({
        id_usuario,
        estado: 'en_configuracion',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating business:', error);
      return NextResponse.json(
        { error: "Error al crear negocio" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id_negocio: negocio.id_negocio,
      id_usuario: negocio.id_usuario,
      nombre: negocio.nombre,
      estado: negocio.estado,
      fecha_creacion: negocio.fecha_creacion,
      url_tienda: negocio.url_tienda,
    }, { status: 201 });
  } catch (error) {
    console.error('Create business error:', error);
    return NextResponse.json(
      { error: "Error al crear negocio" },
      { status: 500 }
    );
  }
}
