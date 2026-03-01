import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // TODO: Verify password hash against database
    // TODO: Create session/JWT

    const usuario = {
      id_usuario: crypto.randomUUID(),
      nombre: "Usuario Demo",
      email,
      plan: "free" as const,
    };

    return NextResponse.json(usuario);
  } catch {
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
