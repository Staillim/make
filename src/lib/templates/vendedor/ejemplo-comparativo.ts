/**
 * Ejemplo Comparativo: Agente Especializado vs Agente Universal
 * 
 * Este archivo demuestra las diferencias entre usar agentes especializados
 * (María, Alex, Sofía) y el agente universal adaptable.
 */

import {
  obtenerPromptConCatalogo,
  obtenerAgenteUniversal,
  obtenerPromptSegunEstrategia,
  obtenerAmbosPromptsParaComparar,
  Producto,
  MetadataNegocio,
} from "./index";

// ============================================================================
// CASO 1: Restaurante de Hamburguesas
// ============================================================================

console.log("=".repeat(80));
console.log("CASO 1: RESTAURANTE DE HAMBURGUESAS");
console.log("=".repeat(80) + "\n");

const productosRestaurante: Producto[] = [
  {
    id: "h1",
    nombre: "Hamburguesa Clásica",
    descripcion: "Carne 100% res, queso cheddar, lechuga, tomate",
    precio: 12.99,
    categoria: "Hamburguesas",
    disponible: true,
  },
  {
    id: "h2",
    nombre: "Hamburguesa BBQ Bacon",
    descripcion: "Carne, tocineta ahumada, cebolla caramelizada, salsa BBQ",
    precio: 14.99,
    categoria: "Hamburguesas",
    disponible: true,
  },
  {
    id: "b1",
    nombre: "Coca-Cola 500ml",
    precio: 2.50,
    categoria: "Bebidas",
    disponible: true,
  },
];

const metadataRestaurante: MetadataNegocio = {
  industria: "restaurante",
  nombreNegocio: "Burger Heaven",
  descripcionNegocio: "Las mejores hamburguesas artesanales de la ciudad",
  tono: "casual",
  objetivoVenta: "hacer que cada cliente pruebe nuestras hamburguesas y regrese por más",
  valorAgregado: "ingredientes frescos y recetas caseras con amor",
};

// OPCIÓN A: Usar agente especializado (María)
console.log("--- OPCIÓN A: AGENTE ESPECIALIZADO (MARÍA) ---\n");
const promptMaría = obtenerPromptConCatalogo("restaurante", productosRestaurante);
console.log("Longitud:", promptMaría.length, "caracteres");
console.log("Primeras líneas:");
console.log(promptMaría.substring(0, 500) + "...\n");

// OPCIÓN B: Usar agente universal
console.log("--- OPCIÓN B: AGENTE UNIVERSAL ADAPTADO ---\n");
const promptUniversalRestaurante = obtenerAgenteUniversal(
  metadataRestaurante,
  productosRestaurante
);
console.log("Longitud:", promptUniversalRestaurante.length, "caracteres");
console.log("Primeras líneas:");
console.log(promptUniversalRestaurante.substring(0, 500) + "...\n");

// ============================================================================
// CASO 2: Tienda de Tecnología
// ============================================================================

console.log("=".repeat(80));
console.log("CASO 2: TIENDA DE TECNOLOGÍA");
console.log("=".repeat(80) + "\n");

const productosTech: Producto[] = [
  {
    id: "laptop-01",
    nombre: "MacBook Air M2",
    descripcion: "Chip M2, 8GB RAM, 256GB SSD, pantalla Retina 13.6\"",
    precio: 1199.99,
    categoria: "Laptops",
    disponible: true,
  },
  {
    id: "phone-01",
    nombre: "iPhone 15 Pro",
    descripcion: "A17 Pro, cámara 48MP, Titanio, 128GB",
    precio: 999.99,
    categoria: "Smartphones",
    disponible: true,
  },
];

const metadataTech: MetadataNegocio = {
  industria: "tecnologia",
  nombreNegocio: "TechWorld",
  descripcionNegocio: "Lo último en tecnología y gadgets",
  tono: "profesional",
  objetivoVenta: "ayudar a encontrar el dispositivo perfecto según necesidades y presupuesto",
  valorAgregado: "asesoría técnica experta y soporte post-venta",
};

console.log("--- COMPARACIÓN LADO A LADO ---\n");
const comparacionTech = obtenerAmbosPromptsParaComparar(metadataTech, productosTech);

console.log("📊 ESPECIALIZADO (Alex):");
console.log("  - Longitud:", comparacionTech.especializado.length, "caracteres");
console.log("  - Personalidad: Geek apasionado con voz propia");
console.log("  - Vocabulario: 'specs', 'features', 'performance'");

console.log("\n📊 UNIVERSAL (Adaptado):");
console.log("  - Longitud:", comparacionTech.universal.length, "caracteres");
console.log("  - Personalidad: Profesional adaptado a tech");
console.log("  - Vocabulario: Generado dinámicamente para tech\n");

// ============================================================================
// CASO 3: Estrategia Automática (Nueva industria no especializada)
// ============================================================================

console.log("=".repeat(80));
console.log("CASO 3: FLORISTERÍA (No tiene agente especializado)");
console.log("=".repeat(80) + "\n");

const productosFloristeria: Producto[] = [
  {
    id: "r1",
    nombre: "Ramo de Rosas Rojas",
    descripcion: "12 rosas rojas frescas con follaje",
    precio: 45.00,
    categoria: "Ramos",
    disponible: true,
  },
  {
    id: "a1",
    nombre: "Arreglo Primaveral",
    descripcion: "Girasoles, margaritas y tulipanes en canasta",
    precio: 65.00,
    categoria: "Arreglos",
    disponible: true,
  },
];

const metadataFloristeria: MetadataNegocio = {
  industria: "floristeria",
  nombreNegocio: "Flores del Campo",
  descripcionNegocio: "Flores frescas y arreglos para toda ocasión",
  tono: "elegante",
  objetivoVenta: "ayudar a expresar sentimientos a través de flores perfectas",
  valorAgregado: "flores frescas del día y diseños únicos",
};

console.log("--- ESTRATEGIA AUTOMÁTICA ---\n");
const promptAutomatico = obtenerPromptSegunEstrategia(
  "automatico",
  metadataFloristeria,
  productosFloristeria
);

console.log("✅ Sistema detectó que NO hay agente especializado para 'floristeria'");
console.log("✅ Usó AGENTE UNIVERSAL automáticamente");
console.log("✅ Adaptó vocabulario, tono y estilo a floristería");
console.log("Longitud:", promptAutomatico.length, "caracteres\n");

// ============================================================================
// CASO 4: A/B Testing - Comparar rendimiento
// ============================================================================

console.log("=".repeat(80));
console.log("CASO 4: A/B TESTING - ¿Cuál convierte mejor?");
console.log("=".repeat(80) + "\n");

console.log("ESCENARIO: Gimnasio 'FitZone'");
console.log("OBJETIVO: Medir tasa de conversión en leads\n");

const productosGym: Producto[] = [
  {
    id: "memb-basic",
    nombre: "Membresía Básica",
    descripcion: "Acceso 24/7 al gimnasio",
    precio: 49.99,
    categoria: "Membresías",
    disponible: true,
  },
  {
    id: "memb-premium",
    nombre: "Membresía Premium",
    descripcion: "Básica + Clases grupales + Zona funcional",
    precio: 79.99,
    categoria: "Membresías",
    disponible: true,
  },
];

const metadataGym: MetadataNegocio = {
  industria: "gimnasio",
  nombreNegocio: "FitZone",
  descripcionNegocio: "Tu espacio para transformación física",
  tono: "juvenil",
  objetivoVenta: "motivar a comenzar su journey fitness",
};

console.log("🧪 EXPERIMENTO:");
console.log("  - Grupo A (50% tráfico): Agente especializado (Coach Mike)");
console.log("  - Grupo B (50% tráfico): Agente universal adaptado");
console.log("");
console.log("📊 MÉTRICAS A MEDIR:");
console.log("  1. Tasa de conversión (leads generados)");
console.log("  2. Tiempo promedio de conversación");
console.log("  3. Satisfacción del usuario (rating)");
console.log("  4. Engagement (mensajes por sesión)");
console.log("");

// Simular código de A/B testing
const experimentoAB = `
// En tu API route:
const strategy = Math.random() < 0.5 ? "especializado" : "universal";

const prompt = obtenerPromptSegunEstrategia(
  strategy,
  metadataGym,
  productosGym
);

// Trackear métricas
analytics.track('chat_started', {
  strategy: strategy,
  negocio_id: negocio.id,
  industria: negocio.industria
});
`;

console.log("CÓDIGO EJEMPLO:");
console.log(experimentoAB);

// ============================================================================
// CASO 5: Diferentes tonos con el mismo negocio
// ============================================================================

console.log("=".repeat(80));
console.log("CASO 5: MISMO NEGOCIO, DIFERENTES TONOS");
console.log("=".repeat(80) + "\n");

console.log("NEGOCIO: Consultoría de Negocios");
console.log("EXPERIMENTO: Ver cómo cambia el agente según el tono\n");

const productosConsultoria: Producto[] = [
  {
    id: "s1",
    nombre: "Consultoría Estratégica",
    descripcion: "Análisis de negocio y plan estratégico 90 días",
    precio: 5000.00,
    categoria: "Servicios",
    disponible: true,
  },
];

const tonos: Array<"casual" | "profesional" | "juvenil" | "elegante"> = [
  "casual",
  "profesional",
  "juvenil",
  "elegante",
];

tonos.forEach((tono) => {
  const metadata: MetadataNegocio = {
    industria: "servicios",
    nombreNegocio: "BizConsult Pro",
    tono: tono,
  };

  const prompt = obtenerAgenteUniversal(metadata, productosConsultoria);
  
  console.log(`--- TONO: ${tono.toUpperCase()} ---`);
  console.log("Primeras palabras del saludo:");
  
  // Extraer aproximadamente el saludo del prompt
  const saludoMatch = prompt.match(/Eres (un|una) .{50,200}/);
  if (saludoMatch) {
    console.log(saludoMatch[0] + "...");
  }
  console.log("");
});

// ============================================================================
// RESUMEN Y RECOMENDACIONES
// ============================================================================

console.log("=".repeat(80));
console.log("📊 RESUMEN COMPARATIVO");
console.log("=".repeat(80) + "\n");

console.log("┌─────────────────────────┬──────────────────────┬──────────────────────┐");
console.log("│ Característica          │ Especializado        │ Universal            │");
console.log("├─────────────────────────┼──────────────────────┼──────────────────────┤");
console.log("│ Personalidad            │ ⭐⭐⭐⭐⭐ Rica      │ ⭐⭐⭐ Buena         │");
console.log("│ Vocabulario específico  │ ⭐⭐⭐⭐⭐ Nativo    │ ⭐⭐⭐⭐ Muy bueno   │");
console.log("│ Flexibilidad            │ ⭐⭐⭐ Limitada     │ ⭐⭐⭐⭐⭐ Total     │");
console.log("│ Escalabilidad           │ ⭐⭐ Baja           │ ⭐⭐⭐⭐⭐ Alta      │");
console.log("│ Mantenimiento           │ ⭐⭐ Alto (6+ files)│ ⭐⭐⭐⭐⭐ Bajo      │");
console.log("│ Nueva industria         │ ⭐⭐ Crear archivo  │ ⭐⭐⭐⭐⭐ Automático│");
console.log("│ Customización           │ ⭐⭐⭐ Manual       │ ⭐⭐⭐⭐⭐ Dinámica  │");
console.log("│ UX / Experiencia        │ ⭐⭐⭐⭐⭐ Óptima   │ ⭐⭐⭐⭐ Excelente  │");
console.log("└─────────────────────────┴──────────────────────┴──────────────────────┘\n");

console.log("💡 RECOMENDACIONES:\n");

console.log("✅ USA ESPECIALIZADO si:");
console.log("   - Tienes 5-10 industrias principales bien definidas");
console.log("   - Priorizas experiencia de usuario excepcional");
console.log("   - Quieres personalidad de marca fuerte");
console.log("   - Tienes recursos para mantener múltiples archivos");

console.log("\n✅ USA UNIVERSAL si:");
console.log("   - Trabajas con 20+ industrias diferentes");
console.log("   - Necesitas escalabilidad rápida");
console.log("   - Quieres experimentar con nuevas industrias sin código");
console.log("   - Priorizas mantenimiento simple");

console.log("\n✅ USA ESTRATEGIA AUTOMÁTICA (Recomendado) si:");
console.log("   - Quieres lo mejor de ambos mundos");
console.log("   - Especializado para industrias comunes (mejor UX)");
console.log("   - Universal para industrias raras (máxima flexibilidad)");
console.log("   - El sistema decide automáticamente\n");

console.log("🎯 NUESTRO CASO (5palos_clone):");
console.log("   RECOMENDACIÓN: Estrategia Automática (Híbrido)");
console.log("   - 6 especializados ya creados (restaurante, tech, ropa, gym, educación, servicios)");
console.log("   - Universal para cualquier otra industria");
console.log("   - A/B testing fácil para optimizar conversión");
console.log("   - Escalable a infinitas industrias sin crear código\n");

console.log("=".repeat(80));
console.log("✨ ¡Ahora tienes AMBAS opciones implementadas!");
console.log("=".repeat(80));

/**
 * PARA EJECUTAR ESTE EJEMPLO:
 * 
 * $ npx tsx src/lib/templates/vendedor/ejemplo-comparativo.ts
 */
