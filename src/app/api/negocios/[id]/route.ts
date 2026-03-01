import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Fetch from database
    const negocio = {
      id_negocio: id,
      nombre: "Mi Negocio",
      estado: "activo",
    };

    return NextResponse.json(negocio);
  } catch {
    return NextResponse.json(
      { error: "Negocio no encontrado" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Delete from database
    return NextResponse.json({ deleted: id });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar negocio" },
      { status: 500 }
    );
  }
}
