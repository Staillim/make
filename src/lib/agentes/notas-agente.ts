/**
 * Sistema de Notas de Agentes
 *
 * Cada agente (vendedor, administrador, orquestador, marketing)
 * puede tomar notas propias sobre lo que considera importante.
 * Las notas se persisten en BD y se inyectan en el prompt del agente
 * al inicio de cada conversación para dotarle de memoria a largo plazo.
 *
 * Flujo:
 * 1. Al iniciar una conversación, se cargan notas del agente desde BD
 * 2. Las notas se inyectan en el system prompt como "memoria"
 * 3. El agente puede guardar nuevas notas con el marcador [[NOTA_AGENTE:{...}]]
 * 4. El API parsea el marcador, guarda la nota, y la elimina de la respuesta antes de enviar al cliente
 *
 * Escalable: funciona para cualquier tipo de agente presente o futuro.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type TipoAgente = "vendedor" | "administrador" | "orquestador" | "marketing";
export type ImportanciaNota = "alta" | "media" | "baja";
export type CategoriaNotaAgente =
  | "patron_venta"
  | "preferencia_cliente"
  | "oportunidad"
  | "problema_recurrente"
  | "insight_negocio"
  | "alerta"
  | "aprendizaje_ia"
  | "evento_especial"
  | "otro";

/**
 * Estructura de una nota de agente en la BD
 */
export interface NotaAgente {
  id: string;
  id_negocio: string;
  tipo_agente: TipoAgente;
  contenido: string;
  importancia: ImportanciaNota;
  categoria: CategoriaNotaAgente;
  tags: string[];
  fuente: "conversacion" | "analisis" | "manual";
  id_conversacion?: string;
  activa: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Estructura que el agente incluye en su respuesta para guardar una nota
 */
export interface NuevaNota {
  importancia: ImportanciaNota;
  categoria: CategoriaNotaAgente;
  contenido: string;
  tags?: string[];
}

// Regex para detectar el marcador de nota en la respuesta del agente
const MARCADOR_NOTA = /\[\[NOTA_AGENTE:(\{[\s\S]*?\})\]\]/g;

/**
 * Obtener todas las notas activas de un agente para un negocio
 */
export async function obtenerNotasAgente(
  supabase: SupabaseClient,
  id_negocio: string,
  tipo_agente: TipoAgente,
  opciones?: {
    limite?: number;
    importancia?: ImportanciaNota;
    categoria?: CategoriaNotaAgente;
    tags?: string[];
  }
): Promise<NotaAgente[]> {
  let query = supabase
    .from("notas_agente")
    .select("*")
    .eq("id_negocio", id_negocio)
    .eq("tipo_agente", tipo_agente)
    .eq("activa", true)
    .order("importancia", { ascending: false }) // alta primero
    .order("created_at", { ascending: false });

  if (opciones?.importancia) {
    query = query.eq("importancia", opciones.importancia);
  }
  if (opciones?.categoria) {
    query = query.eq("categoria", opciones.categoria);
  }
  if (opciones?.tags && opciones.tags.length > 0) {
    query = query.overlaps("tags", opciones.tags);
  }
  if (opciones?.limite) {
    query = query.limit(opciones.limite);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[NotasAgente] Error obteniendo notas:", error.message);
    return [];
  }
  return (data || []) as NotaAgente[];
}

/**
 * Guardar una nueva nota del agente
 */
export async function guardarNotaAgente(
  supabase: SupabaseClient,
  id_negocio: string,
  tipo_agente: TipoAgente,
  nota: NuevaNota,
  opciones?: {
    fuente?: "conversacion" | "analisis" | "manual";
    id_conversacion?: string;
  }
): Promise<NotaAgente | null> {
  const { data, error } = await supabase
    .from("notas_agente")
    .insert({
      id_negocio,
      tipo_agente,
      contenido: nota.contenido,
      importancia: nota.importancia || "media",
      categoria: nota.categoria || "otro",
      tags: nota.tags || [],
      fuente: opciones?.fuente || "conversacion",
      id_conversacion: opciones?.id_conversacion || null,
      activa: true,
    })
    .select()
    .single();

  if (error) {
    console.error("[NotasAgente] Error guardando nota:", error.message);
    return null;
  }
  return data as NotaAgente;
}

/**
 * Archivar (desactivar) una nota
 */
export async function archivarNota(
  supabase: SupabaseClient,
  id_nota: string
): Promise<boolean> {
  const { error } = await supabase
    .from("notas_agente")
    .update({ activa: false, updated_at: new Date().toISOString() })
    .eq("id", id_nota);

  return !error;
}

/**
 * Formatear notas como texto para inyectar en el system prompt del agente.
 * Máximo 30 notas para no saturar el contexto.
 */
export function formatearNotasParaPrompt(notas: NotaAgente[]): string {
  if (notas.length === 0) {
    return "No tienes notas guardadas aún. Cuando detectes algo importante, guárdalo.";
  }

  const porImportancia = {
    alta: notas.filter((n) => n.importancia === "alta"),
    media: notas.filter((n) => n.importancia === "media"),
    baja: notas.filter((n) => n.importancia === "baja"),
  };

  const lineas: string[] = [];

  if (porImportancia.alta.length > 0) {
    lineas.push("🔴 **ALTA IMPORTANCIA:**");
    porImportancia.alta.slice(0, 10).forEach((n) => {
      lineas.push(`- [${n.categoria}] ${n.contenido}${n.tags.length > 0 ? ` #${n.tags.join(" #")}` : ""}`);
    });
  }

  if (porImportancia.media.length > 0) {
    lineas.push("🟡 **MEDIA IMPORTANCIA:**");
    porImportancia.media.slice(0, 15).forEach((n) => {
      lineas.push(`- [${n.categoria}] ${n.contenido}`);
    });
  }

  if (porImportancia.baja.length > 0) {
    lineas.push("⚪ **BAJA IMPORTANCIA:**");
    porImportancia.baja.slice(0, 5).forEach((n) => {
      lineas.push(`- ${n.contenido}`);
    });
  }

  return lineas.join("\n");
}

/**
 * Genera el bloque de instrucciones de notas para añadir al system prompt.
 * Se llama antes de construir el prompt del agente.
 *
 * @param notasFormateadas - Resultado de formatearNotasParaPrompt()
 * @returns Bloque de texto listo para insertar en el prompt
 */
export function generarBloquePrompNotas(notasFormateadas: string): string {
  return `
---
## 📝 TU MEMORIA PERSONAL (Notas guardadas)

${notasFormateadas}

---
## 📌 CÓMO GUARDAR NUEVAS NOTAS

Cuando detectes algo importante (patrón de cliente, oportunidad de venta, problema recurrente, insight del negocio, preferencia detectada, etc.), incluye al FINAL de tu respuesta el siguiente marcador (invisible para el usuario):

[[NOTA_AGENTE:{"importancia":"alta|media|baja","categoria":"patron_venta|preferencia_cliente|oportunidad|problema_recurrente|insight_negocio|alerta|aprendizaje_ia|evento_especial|otro","contenido":"descripción clara y accionable de la nota","tags":["tag1","tag2"]}]]

**Cuándo guardar una nota:**
- Detectas un patrón repetitivo en las preguntas o compras
- Un cliente menciona algo que puede afectar ventas futuras
- Observas algo sobre el negocio que el dueño debería saber
- Detectas una oportunidad de mejora o venta cruzada
- Se presentó un problema que podría repetirse

**No guardes notas por cada conversación** — solo cuando sea genuinamente valioso.
---`;
}

/**
 * Parsea la respuesta del agente buscando marcadores de nota.
 * Extrae las notas y limpia la respuesta para enviar al cliente.
 *
 * @returns { notas: NuevaNota[], respuestaLimpia: string }
 */
export function parsearNotasDeRespuesta(respuesta: string): {
  notas: NuevaNota[];
  respuestaLimpia: string;
} {
  const notas: NuevaNota[] = [];
  let respuestaLimpia = respuesta;

  const matches = [...respuesta.matchAll(MARCADOR_NOTA)];

  for (const match of matches) {
    try {
      const nota = JSON.parse(match[1]) as NuevaNota;
      if (nota.contenido && nota.importancia && nota.categoria) {
        notas.push(nota);
      }
    } catch (e) {
      console.warn("[NotasAgente] No se pudo parsear nota:", match[1]);
    }
    // Eliminar el marcador de la respuesta
    respuestaLimpia = respuestaLimpia.replace(match[0], "").trim();
  }

  return { notas, respuestaLimpia };
}

/**
 * Pipeline completo: parsea respuesta y guarda notas automáticamente en BD.
 * Retorna la respuesta limpia (sin marcadores).
 */
export async function procesarNotasDeRespuesta(
  supabase: SupabaseClient,
  respuesta: string,
  id_negocio: string,
  tipo_agente: TipoAgente,
  id_conversacion?: string
): Promise<string> {
  const { notas, respuestaLimpia } = parsearNotasDeRespuesta(respuesta);

  for (const nota of notas) {
    try {
      await guardarNotaAgente(supabase, id_negocio, tipo_agente, nota, {
        fuente: "conversacion",
        id_conversacion,
      });
      console.log(`[NotasAgente] Nota guardada (${tipo_agente}): ${nota.contenido.slice(0, 60)}...`);
    } catch (e) {
      console.error("[NotasAgente] Error guardando nota:", e);
    }
  }

  return respuestaLimpia;
}
