/**
 * Índice de Templates para Agentes Administradores (Max)
 * Exporta todos los prompts de administración por industria
 */

import baseAdmin from './_base';
import restauranteAdmin from './restaurante';
import tiendaRopaAdmin from './tienda_ropa';
import tecnologiaAdmin from './tecnologia';
import gimnasioAdmin from './gimnasio';
import educacionAdmin from './educacion';
import serviciosAdmin from './servicios';

// Tipo para el template de administrador
export interface AdminTemplate {
  prompt: string;
  metadata: {
    nombre: string;
    apellido?: string;
    rol: string;
    personalidad: string;
    industria: string;
    especialidad?: string;
    emojis: string[];
    tonoVoz: string;
    avatar: string;
    capacidades: string[];
    kpis: string[];
    experticia: string[];
    integraciones?: string[];
  };
}

// Mapa de templates por industria
export const adminTemplates: Record<string, AdminTemplate> = {
  restaurante: restauranteAdmin,
  tienda_ropa: tiendaRopaAdmin,
  tecnologia: tecnologiaAdmin,
  gimnasio: gimnasioAdmin,
  educacion: educacionAdmin,
  servicios: serviciosAdmin,
  // Fallback genérico
  generico: baseAdmin,
  otro: baseAdmin,
};

/**
 * Obtiene el template de administrador para una industria específica
 * @param industria - Tipo de industria
 * @returns Template de administrador o fallback genérico
 */
export function obtenerTemplateAdmin(industria: string): AdminTemplate {
  const industriaNormalizada = industria.toLowerCase().replace(/\s+/g, '_');
  return adminTemplates[industriaNormalizada] || adminTemplates.generico;
}

/**
 * Verifica si existe un template específico para una industria
 * @param industria - Tipo de industria
 * @returns true si existe template específico, false si usará genérico
 */
export function tieneTemplateAdminEspecifico(industria: string): boolean {
  const industriaNormalizada = industria.toLowerCase().replace(/\s+/g, '_');
  return industriaNormalizada in adminTemplates && industriaNormalizada !== 'generico' && industriaNormalizada !== 'otro';
}

/**
 * Obtiene la lista de industrias con templates admin específicos
 * @returns Array de nombres de industrias disponibles
 */
export function obtenerIndustriasAdminDisponibles(): string[] {
  return Object.keys(adminTemplates).filter(
    (key) => key !== 'generico' && key !== 'otro'
  );
}

/**
 * Obtiene todos los KPIs de administración disponibles
 * @returns Array único de todos los KPIs
 */
export function obtenerTodosLosKPIsAdmin(): string[] {
  const kpisSet = new Set<string>();
  Object.values(adminTemplates).forEach((template) => {
    template.metadata.kpis.forEach((kpi) => kpisSet.add(kpi));
  });
  return Array.from(kpisSet);
}

/**
 * Obtiene todas las capacidades de administración disponibles
 * @returns Array único de todas las capacidades
 */
export function obtenerTodasLasCapacidadesAdmin(): string[] {
  const capacidadesSet = new Set<string>();
  Object.values(adminTemplates).forEach((template) => {
    template.metadata.capacidades.forEach((cap) => capacidadesSet.add(cap));
  });
  return Array.from(capacidadesSet);
}

// Exportaciones individuales para imports directos
export { baseAdmin, restauranteAdmin, tiendaRopaAdmin, tecnologiaAdmin, gimnasioAdmin, educacionAdmin, serviciosAdmin };

// Export default con todas las funciones helper
export default {
  templates: adminTemplates,
  obtenerTemplateAdmin,
  tieneTemplateAdminEspecifico,
  obtenerIndustriasAdminDisponibles,
  obtenerTodosLosKPIsAdmin,
  obtenerTodasLasCapacidadesAdmin,
};
