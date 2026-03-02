/**
 * Utilidades universales para industrias / tipos de negocio.
 *
 * Mapea `tipo_negocio` (texto libre de la BD) a iconos, colores
 * y etiquetas para usarlos en la tienda pública, dashboard, etc.
 */

export interface IndustriaInfo {
  emoji: string;
  label: string;
  colorClase: string; // Tailwind bg-* class
}

const MAPA_INDUSTRIA: Array<{ keywords: string[]; info: IndustriaInfo }> = [
  {
    keywords: ["ropa", "moda", "vestimenta", "textil", "fashion"],
    info: { emoji: "👕", label: "Moda", colorClase: "bg-pink-100 dark:bg-pink-500/10" },
  },
  {
    keywords: ["restaurant", "comida", "aliment", "cafeteria", "cocina", "food"],
    info: { emoji: "🍽️", label: "Restaurante", colorClase: "bg-orange-100 dark:bg-orange-500/10" },
  },
  {
    keywords: ["tecnologia", "tech", "electronica", "software", "computadora", "celular"],
    info: { emoji: "💻", label: "Tecnología", colorClase: "bg-blue-100 dark:bg-blue-500/10" },
  },
  {
    keywords: ["gym", "fitness", "deporte", "ejercicio", "entrenamiento"],
    info: { emoji: "💪", label: "Fitness", colorClase: "bg-green-100 dark:bg-green-500/10" },
  },
  {
    keywords: ["salud", "farma", "medic", "clinica", "bienestar"],
    info: { emoji: "🏥", label: "Salud", colorClase: "bg-emerald-100 dark:bg-emerald-500/10" },
  },
  {
    keywords: ["belleza", "spa", "cosmet", "peluqu", "estetica"],
    info: { emoji: "💅", label: "Belleza", colorClase: "bg-purple-100 dark:bg-purple-500/10" },
  },
  {
    keywords: ["educacion", "libros", "cursos", "digital", "capacitacion"],
    info: { emoji: "📚", label: "Educación", colorClase: "bg-yellow-100 dark:bg-yellow-500/10" },
  },
  {
    keywords: ["joya", "accesori", "bisuteria"],
    info: { emoji: "💎", label: "Joyería", colorClase: "bg-amber-100 dark:bg-amber-500/10" },
  },
  {
    keywords: ["hogar", "mueble", "deco", "jardin", "casa"],
    info: { emoji: "🏠", label: "Hogar", colorClase: "bg-stone-100 dark:bg-stone-500/10" },
  },
  {
    keywords: ["mascota", "veterinar", "pet"],
    info: { emoji: "🐾", label: "Mascotas", colorClase: "bg-lime-100 dark:bg-lime-500/10" },
  },
  {
    keywords: ["arte", "artesania", "manualidad", "handmade"],
    info: { emoji: "🎨", label: "Artesanías", colorClase: "bg-rose-100 dark:bg-rose-500/10" },
  },
  {
    keywords: ["servicio", "consultoria", "agencia", "profesional"],
    info: { emoji: "🏢", label: "Servicios", colorClase: "bg-slate-100 dark:bg-slate-500/10" },
  },
];

/** Detecta industria a partir de tipo_negocio (texto libre). */
export function detectarIndustria(tipo_negocio: string = ""): IndustriaInfo {
  const t = tipo_negocio.toLowerCase().trim();
  for (const entrada of MAPA_INDUSTRIA) {
    if (entrada.keywords.some((k) => t.includes(k))) {
      return entrada.info;
    }
  }
  return { emoji: "📦", label: "Negocio", colorClase: "bg-zinc-100 dark:bg-zinc-500/10" };
}

/**
 * Obtiene el emoji adecuado para una categoría de producto.
 * Considera tanto el tipo de negocio como el nombre de la categoría.
 */
export function emojiCategoria(
  nombre_categoria: string,
  tipo_negocio: string = ""
): string {
  const c = nombre_categoria.toLowerCase();
  const t = tipo_negocio.toLowerCase();

  // Ropa
  if (c.includes("camis") || c.includes("polo") || c.includes("blusa")) return "👕";
  if (c.includes("pantalon") || c.includes("jean") || c.includes("short")) return "👖";
  if (c.includes("zapat") || c.includes("calzad") || c.includes("sneaker")) return "👟";
  if (c.includes("acces") || c.includes("gorr") || c.includes("bols") || c.includes("colgan")) return "👜";
  if (c.includes("vestid") || c.includes("falda")) return "👗";
  // Comida
  if (c.includes("bebida") || c.includes("jugo") || c.includes("cafe")) return "☕";
  if (c.includes("postre") || c.includes("dulce") || c.includes("pastel")) return "🍰";
  if (c.includes("pizza") || c.includes("hambur")) return "🍔";
  // Tech
  if (c.includes("celular") || c.includes("movil") || c.includes("phone")) return "📱";
  if (c.includes("laptop") || c.includes("comput")) return "💻";
  if (c.includes("audifo") || c.includes("auricular")) return "🎧";
  // Fitness
  if (c.includes("supleme") || c.includes("proteina")) return "💊";
  if (c.includes("equipo") || c.includes("pesa")) return "🏋️";
  // Servicios
  if (c.includes("consultoria") || c.includes("asesoria")) return "📋";
  // Fallback por industria
  return detectarIndustria(t).emoji;
}
