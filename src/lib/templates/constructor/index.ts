/**
 * Barrel export para agentes del Constructor
 * 
 * El constructor tiene un solo agente: El Orquestador
 * que ayuda al dueño del negocio a definir qué quiere construir
 */

import orquestadorTemplate from "./orquestador";

export interface ConstructorTemplate {
  prompt: string;
  metadata: {
    nombre: string;
    rol: string;
    personalidad: string;
    fase: string;
    emojis: string[];
    capacidades: string[];
    experticia: string[];
  };
}

/**
 * Obtener el template del Orquestador
 */
export function obtenerTemplateOrquestador(): ConstructorTemplate {
  return orquestadorTemplate;
}

/**
 * Generar prompt del orquestador con contexto
 */
export function generarPromptOrquestador(
  contexto?: {
    negocio_parcial?: any;
    fase_actual?: string;
    historial?: any[];
  }
): string {
  let prompt = orquestadorTemplate.prompt;
  
  if (contexto) {
    let contexto_adicional = "\n\n## CONTEXTO ACTUAL\n\n";
    
    if (contexto.negocio_parcial) {
      contexto_adicional += `**Información ya recopilada:**\n${JSON.stringify(contexto.negocio_parcial, null, 2)}\n\n`;
    }
    
    if (contexto.fase_actual) {
      contexto_adicional += `**Fase actual:** ${contexto.fase_actual}\n\n`;
    }
    
    if (contexto.historial && contexto.historial.length > 0) {
      contexto_adicional += `**Conversaciones previas:** ${contexto.historial.length} mensajes intercambiados\n`;
    }
    
    contexto_adicional += "Continúa la conversación desde donde quedamos, recuerda el contexto.";
    
    prompt += contexto_adicional;
  }
  
  return prompt;
}

// Export default
export default {
  obtenerTemplateOrquestador,
  generarPromptOrquestador,
  orquestador: orquestadorTemplate
};
