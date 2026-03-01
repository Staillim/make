import { NextResponse } from "next/server";

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

    // TODO: Check plan limits (free = 1 business, premium = unlimited)
    // TODO: Save to database

    const negocio = {
      id_negocio: crypto.randomUUID(),
      id_usuario,
      nombre: null,
      estado: "en_configuracion" as const,
      fecha_creacion: new Date().toISOString(),
      url_tienda: null,
    };

    return NextResponse.json(negocio, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear negocio" },
      { status: 500 }
    );
  }
}
