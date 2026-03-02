/**
 * Barrel export para todos los prompts de agentes vendedores
 * Importa todos los templates y los exporta de forma organizada
 */

import baseTemplate from "./_base";
import restauranteTemplate from "./restaurante";
import tiendaRopaTemplate from "./tienda_ropa";
import tecnologiaTemplate from "./tecnologia";
import gimnasioTemplate from "./gimnasio";
import educacionTemplate from "./educacion";
import serviciosTemplate from "./servicios";

/**
 * Tipo de industria soportado
 */
export type IndustriaTipo =
  | "restaurante"
  | "tienda_ropa"
  | "tecnologia"
  | "gimnasio"
  | "educacion"
  | "servicios"
  | "otro";

/**
 * Metadata de un agente vendedor
 */
export interface AgenteMetadata {
  nombre: string;
  apellido?: string;
  rol: string;
  personalidad: string;
  industria: string;
  emojis: string[];
  tonoVoz: string;
  avatar: string;
  capacidades: string[];
  experticia: string[];
}

/**
 * Template completo de agente vendedor
 */
export interface AgenteTemplate {
  prompt: string;
  metadata: AgenteMetadata;
}

/**
 * Mapa de todos los templates por industria
 */
export const templates: Record<IndustriaTipo, AgenteTemplate> = {
  restaurante: restauranteTemplate,
  tienda_ropa: tiendaRopaTemplate,
  tecnologia: tecnologiaTemplate,
  gimnasio: gimnasioTemplate,
  educacion: educacionTemplate,
  servicios: serviciosTemplate,
  otro: baseTemplate,
};

/**
 * Obtiene el template de agente vendedor para una industria específica
 * @param industria - Tipo de industria
 * @returns Template del agente vendedor (o base si no existe)
 */
export function obtenerTemplateVendedor(
  industria: string
): AgenteTemplate {
  const industriaNormalizada = industria.toLowerCase().replace(/\s+/g, "_");
  return templates[industriaNormalizada as IndustriaTipo] || templates.otro;
}

/**
 * Lista todas las industrias soportadas
 * @returns Array de tipos de industria
 */
export function obtenerIndustriasDisponibles(): IndustriaTipo[] {
  return Object.keys(templates).filter((k) => k !== "otro") as IndustriaTipo[];
}

/**
 * Verifica si una industria tiene template específico
 * @param industria - Nombre de la industria
 * @returns true si existe template específico
 */
export function tieneTemplateEspecifico(industria: string): boolean {
  const industriaNormalizada = industria.toLowerCase().replace(/\s+/g, "_");
  return industriaNormalizada in templates && industriaNormalizada !== "otro";
}

/**
 * Estructura de un producto/servicio del catálogo
 */
export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  categoria?: string;
  disponible?: boolean;
  variantes?: { [key: string]: any }; // tallas, colores, etc.
}

/**
 * Formatea el catálogo de productos para inyección en el prompt
 * @param productos - Array de productos del negocio
 * @returns String formateado para el prompt
 */
function formatearCatalogo(productos: Producto[]): string {
  if (!productos || productos.length === 0) {
    return "⚠️ **Catálogo vacío** - Debes informar al cliente que aún no tienes productos cargados.";
  }

  const categorias: { [key: string]: Producto[] } = {};
  productos.forEach((p) => {
    const cat = p.categoria || "General";
    if (!categorias[cat]) categorias[cat] = [];
    categorias[cat].push(p);
  });

  let catalogo = "**Tu catálogo de productos/servicios:**\n\n";
  
  Object.keys(categorias).forEach((categoria) => {
    catalogo += `### ${categoria}\n`;
    categorias[categoria].forEach((prod) => {
      const disponibilidad = prod.disponible === false ? " ❌ (NO disponible)" : " ✅";
      const precio = prod.precio ? ` - $${prod.precio}` : "";
      catalogo += `- **${prod.nombre}**${precio}${disponibilidad}\n`;
      if (prod.descripcion) {
        catalogo += `  ${prod.descripcion}\n`;
      }
    });
    catalogo += "\n";
  });

  catalogo += "⚠️ **REGLA CRÍTICA:** Solo puedes ofrecer los productos listados arriba. Si no está en la lista, NO lo ofrezcas.";
  
  return catalogo;
}

/**
 * Inyecta el catálogo de productos en el prompt del agente
 * @param prompt - Prompt template con placeholder {{PRODUCTOS_CATALOGO}}
 * @param productos - Array de productos del negocio
 * @returns Prompt con catálogo inyectado
 */
export function inyectarCatalogo(prompt: string, productos: Producto[]): string {
  const catalogoFormateado = formatearCatalogo(productos);
  return prompt.replace("{{PRODUCTOS_CATALOGO}}", catalogoFormateado);
}

/**
 * Obtiene el prompt completo del agente con catálogo inyectado
 * @param industria - Tipo de industria
 * @param productos - Array de productos del negocio
 * @returns Prompt listo para usar
 */
export function obtenerPromptConCatalogo(
  industria: string,
  productos: Producto[]
): string {
  const template = obtenerTemplateVendedor(industria);
  return inyectarCatalogo(template.prompt, productos);
}

// Exportar templates individuales también
export {
  baseTemplate,
  restauranteTemplate,
  tiendaRopaTemplate,
  tecnologiaTemplate,
  gimnasioTemplate,
  educacionTemplate,
  serviciosTemplate,
};

export default {
  templates,
  obtenerTemplateVendedor,
  obtenerIndustriasDisponibles,
  tieneTemplateEspecifico,
  inyectarCatalogo,
  obtenerPromptConCatalogo,
};
