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
};
