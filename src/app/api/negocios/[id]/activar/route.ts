import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// POST /api/negocios/[id]/activar — marca un negocio como activo y genera
// el slug/url de la tienda pública.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const result = await db
      .from<{
        id_negocio: string;
        estado: string;
        url_tienda: string | null;
        fecha_activacion: string | null;
      }>("negocios")
      .update({
        estado: "activo",
        fecha_activacion: new Date().toISOString(),
        url_tienda: `/tienda/${id}`,
      })
      .eq("id_negocio", id);
    const data = result.data as Array<{
      id_negocio: string;
      estado: string;
      url_tienda: string | null;
      fecha_activacion: string | null;
    }> | null;
    const error = result.error;
    if (error || !data || !data[0]) {
      console.error("Activate business error:", error);
      return NextResponse.json({ error: "Error al activar negocio" }, { status: 500 });
    }
    const row = data[0];
    return NextResponse.json({
      id_negocio: row.id_negocio,
      estado: row.estado,
      url_tienda: row.url_tienda,
      fecha_activacion: row.fecha_activacion,
    });
  } catch (error) {
    console.error("Activate business error:", error);
    return NextResponse.json({ error: "Error al activar negocio" }, { status: 500 });
  }
}
