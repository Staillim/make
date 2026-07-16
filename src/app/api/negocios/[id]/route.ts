import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, getSessionUser } from "@/lib/db";

type Negocio = {
  id_negocio: string;
  id_usuario: string;
  nombre: string | null;
  estado: "en_configuracion" | "activo" | "pausado";
  fecha_creacion: string;
  fecha_activacion: string | null;
  url_tienda: string | null;
  created_at: string;
  updated_at: string;
};

// GET /api/negocios/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("maket_session")?.value;
    const user = getSessionUser(token);
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const db = getDb();
    const { data: negocio, error } = await db
      .from<Negocio>("negocios")
      .select("id_negocio, id_usuario, nombre, estado, fecha_creacion, fecha_activacion, url_tienda, created_at, updated_at")
      .eq("id_negocio", id)
      .eq("id_usuario", user.id_usuario)
      .single();
    if (error || !negocio) {
      return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ negocio });
  } catch (error) {
    console.error("Get business error:", error);
    return NextResponse.json({ error: "Error al obtener negocio" }, { status: 500 });
  }
}

// PATCH /api/negocios/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("maket_session")?.value;
    const user = getSessionUser(token);
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();
    const allowedFields = ["nombre", "estado", "url_tienda"] as const;
    const updateData: Record<string, string | null> = {};
    for (const key of allowedFields) {
      const v = (body as Record<string, unknown>)[key];
      if (v !== undefined) updateData[key] = v as string | null;
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No hay campos válidos para actualizar" }, { status: 400 });
    }
    const db = getDb();
    const result = await db
      .from<Negocio>("negocios")
      .update(updateData)
      .eq("id_negocio", id)
      .eq("id_usuario", user.id_usuario);
    const data = result.data as Negocio[] | null;
    const error = result.error;
    if (error) {
      console.error("Update business error:", error);
      return NextResponse.json({ error: "Error al actualizar negocio" }, { status: 500 });
    }
    if (!data || !data[0]) {
      return NextResponse.json({ error: "Negocio no encontrado o sin permisos" }, { status: 404 });
    }
    return NextResponse.json({ negocio: data[0] });
  } catch (error) {
    console.error("Update business error:", error);
    return NextResponse.json({ error: "Error al actualizar negocio" }, { status: 500 });
  }
}

// DELETE /api/negocios/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("maket_session")?.value;
    const user = getSessionUser(token);
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { id } = await params;
    const db = getDb();
    const { error } = await db
      .from("negocios")
      .delete()
      .eq("id_negocio", id)
      .eq("id_usuario", user.id_usuario);
    if (error) {
      console.error("Delete business error:", error);
      return NextResponse.json({ error: "Error al eliminar negocio" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete business error:", error);
    return NextResponse.json({ error: "Error al eliminar negocio" }, { status: 500 });
  }
}
