import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb, getSessionUser } from "@/lib/db";

// GET /api/negocios — lista de negocios del usuario logueado
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("maket_session")?.value;
    const user = getSessionUser(token);
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const db = getDb();
    const { data: negocios, error } = await db
      .from<{
        id_negocio: string;
        id_usuario: string;
        nombre: string | null;
        estado: string;
        fecha_creacion: string;
        fecha_activacion: string | null;
        url_tienda: string | null;
        created_at: string;
        updated_at: string;
      }>("negocios")
      .select("id_negocio, id_usuario, nombre, estado, fecha_creacion, fecha_activacion, url_tienda, created_at, updated_at")
      .eq("id_usuario", user.id_usuario)
      .order("fecha_creacion", { ascending: false });
    if (error) {
      console.error("Error fetching businesses:", error);
      return NextResponse.json({ error: "Error al obtener negocios" }, { status: 500 });
    }
    return NextResponse.json({ negocios: negocios || [] });
  } catch (error) {
    console.error("Unexpected error in GET /api/negocios:", error);
    return NextResponse.json({ error: "Error inesperado del servidor" }, { status: 500 });
  }
}

// POST /api/negocios — crear negocio
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("maket_session")?.value;
    const user = getSessionUser(token);
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const body = await request.json();
    const { nombre } = body;
    if (!nombre || (nombre as string).trim() === "") {
      return NextResponse.json({ error: "El nombre del negocio es requerido" }, { status: 400 });
    }

    // Límite de plan: free = 1 negocio
    if (user.plan === "free") {
      const db = getDb();
      const { data: existing } = await db
        .from<{ id_negocio: string }>("negocios")
        .select("id_negocio")
        .eq("id_usuario", user.id_usuario);
      if (existing && existing.length >= 1) {
        return NextResponse.json(
          { error: "Plan gratuito limitado a 1 negocio. Actualiza a Premium para crear más." },
          { status: 403 }
        );
      }
    }

    const db = getDb();
    const id_negocio = crypto.randomUUID();
    const { data, error } = await db
      .from<{
        id_negocio: string;
        id_usuario: string;
        nombre: string | null;
        estado: string;
        fecha_creacion: string;
        url_tienda: string | null;
      }>("negocios")
      .insert({
        id_negocio,
        id_usuario: user.id_usuario,
        nombre: (nombre as string).trim(),
        estado: "en_configuracion",
      });
    if (error || !data || !data[0]) {
      console.error("Error creating business:", error);
      return NextResponse.json({ error: "Error al crear negocio" }, { status: 500 });
    }
    return NextResponse.json({ negocio: data[0] }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error in POST /api/negocios:", error);
    return NextResponse.json({ error: "Error inesperado del servidor" }, { status: 500 });
  }
}

// DELETE /api/negocios?id=<id>
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("maket_session")?.value;
    const user = getSessionUser(token);
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id_negocio = searchParams.get("id");
    if (!id_negocio) {
      return NextResponse.json({ error: "ID del negocio es requerido" }, { status: 400 });
    }
    const db = getDb();
    const { error } = await db
      .from("negocios")
      .delete()
      .eq("id_negocio", id_negocio)
      .eq("id_usuario", user.id_usuario);
    if (error) {
      console.error("Error deleting business:", error);
      return NextResponse.json({ error: "Error al eliminar negocio" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error in DELETE /api/negocios:", error);
    return NextResponse.json({ error: "Error inesperado del servidor" }, { status: 500 });
  }
}
