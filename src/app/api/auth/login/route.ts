import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyLogin, createSession } from "@/lib/db";

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

    const user = verifyLogin(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const { token, expires_at } = createSession(user.id_usuario);

    const response = NextResponse.json({
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      email: user.email,
      plan: user.plan,
    });
    response.cookies.set("maket_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(expires_at),
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
