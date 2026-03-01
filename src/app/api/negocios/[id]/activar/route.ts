import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Update in database
    const result = {
      id_negocio: id,
      estado: "activo",
      url_tienda: `/tienda/${id}`,
      fecha_activacion: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Error al activar negocio" },
      { status: 500 }
    );
  }
}
