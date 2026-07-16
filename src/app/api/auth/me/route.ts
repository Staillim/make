import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionUser } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("maket_session")?.value;
  const user = getSessionUser(token);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({
    id_usuario: user.id_usuario,
    nombre: user.nombre,
    email: user.email,
    plan: user.plan,
  });
}
