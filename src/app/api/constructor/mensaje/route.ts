import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_negocio, fase, mensaje } = body;

    if (!id_negocio || !fase || !mensaje) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // TODO: Process with AI (OpenAI API)
    // TODO: Save conversation to database
    // TODO: Execute phase-specific functions

    const respuesta = {
      id: crypto.randomUUID(),
      rol: "bot" as const,
      contenido: "Respuesta del agente constructor",
      timestamp: new Date().toISOString(),
      fase,
    };

    return NextResponse.json(respuesta);
  } catch {
    return NextResponse.json(
      { error: "Error al procesar mensaje" },
      { status: 500 }
    );
  }
}
