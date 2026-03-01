import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, password } = body;

    // Validate
    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // TODO: Hash password with bcrypt
    // TODO: Save to database
    // TODO: Create session/JWT

    const usuario = {
      id_usuario: crypto.randomUUID(),
      nombre,
      email,
      plan: "free" as const,
      fecha_registro: new Date().toISOString(),
    };

    return NextResponse.json(usuario, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}
