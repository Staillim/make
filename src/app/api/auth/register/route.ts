import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createUser } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, password } = body;

    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    const user = createUser(nombre, email, password);

    const response = NextResponse.json({
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      email: user.email,
      plan: user.plan,
    });

    // La cookie de sesión se setea en /api/auth/login — acá solo creamos
    // el usuario y le pedimos al cliente que vaya a login, o auto-login
    // creando la sesión acá mismo.
    const { createSession } = await import("@/lib/db");
    const { token, expires_at } = createSession(user.id_usuario);
    response.cookies.set("maket_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(expires_at),
    });
    return response;
  } catch (error) {
    console.error("Register error:", error);
    const msg = error instanceof Error ? error.message : "Error al crear usuario";
    const status = msg.includes("ya está registrado") ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
