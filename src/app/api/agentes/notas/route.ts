/**
 * API Route: /api/agentes/notas
 *
 * CRUD de notas de agentes. Permite:
 * - GET  → Obtener notas de un agente para un negocio
 * - POST → Guardar una nueva nota manualmente
 * - DELETE → Archivar una nota (no borra, sólo desactiva)
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import {
  obtenerNotasAgente,
  guardarNotaAgente,
  archivarNota,
  type TipoAgente,
  type ImportanciaNota,
  type CategoriaNotaAgente,
} from "@/lib/agentes/notas-agente";

/**
 * GET /api/agentes/notas?id_negocio=...&tipo_agente=...&importancia=...&limit=...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id_negocio = searchParams.get("id_negocio");
    const tipo_agente = searchParams.get("tipo_agente") as TipoAgente | null;
    const importancia = searchParams.get("importancia") as ImportanciaNota | undefined;
    const categoria = searchParams.get("categoria") as CategoriaNotaAgente | undefined;
    const limite = Number(searchParams.get("limit") || "50");

    if (!id_negocio || !tipo_agente) {
      return NextResponse.json(
        { error: "id_negocio y tipo_agente son requeridos" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const notas = await obtenerNotasAgente(supabase, id_negocio, tipo_agente, {
      limite,
      importancia,
      categoria,
    });

    return NextResponse.json({
      notas,
      total: notas.length,
      tipo_agente,
      id_negocio,
    });
  } catch (error: any) {
    console.error("[/api/agentes/notas GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/agentes/notas — guardar nota manualmente
 * Body: { id_negocio, tipo_agente, contenido, importancia, categoria, tags }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id_negocio,
      tipo_agente,
      contenido,
      importancia = "media",
      categoria = "otro",
      tags = [],
    } = body;

    if (!id_negocio || !tipo_agente || !contenido) {
      return NextResponse.json(
        { error: "id_negocio, tipo_agente y contenido son requeridos" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const nota = await guardarNotaAgente(
      supabase,
      id_negocio,
      tipo_agente as TipoAgente,
      { importancia, categoria, contenido, tags },
      { fuente: "manual" }
    );

    if (!nota) {
      return NextResponse.json(
        { error: "Error guardando nota" },
        { status: 500 }
      );
    }

    return NextResponse.json({ nota, mensaje: "Nota guardada correctamente" });
  } catch (error: any) {
    console.error("[/api/agentes/notas POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/agentes/notas?id=<nota_id>  — archivar nota
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id es requerido" }, { status: 400 });
    }

    const supabase = createClient();
    const exito = await archivarNota(supabase, id);

    if (!exito) {
      return NextResponse.json(
        { error: "Error archivando nota" },
        { status: 500 }
      );
    }

    return NextResponse.json({ mensaje: "Nota archivada correctamente" });
  } catch (error: any) {
    console.error("[/api/agentes/notas DELETE]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
