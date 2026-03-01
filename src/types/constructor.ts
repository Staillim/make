export type FaseConstructor =
  | "inicio"
  | "tipo_negocio"
  | "plantilla"
  | "marca"
  | "personalizacion"
  | "catalogo"
  | "reglas_dominio"
  | "agentes"
  | "comercial"
  | "automatizaciones"
  | "activacion"
  | "completado";

export interface MensajeChat {
  id: string;
  rol: "bot" | "usuario";
  contenido: string;
  timestamp: string;
  opciones?: OpcionRapida[];
  tipo_contenido?: "texto" | "galeria" | "selector_color" | "toggle_list";
  datos_extra?: Record<string, unknown>;
}

export interface OpcionRapida {
  label: string;
  valor: string;
  icono?: string;
}

export interface ProgresoConstructor {
  fase_actual: FaseConstructor;
  fases_completadas: FaseConstructor[];
  porcentaje: number;
}

export const FASES_ORDEN: FaseConstructor[] = [
  "inicio",
  "tipo_negocio",
  "plantilla",
  "marca",
  "personalizacion",
  "catalogo",
  "reglas_dominio",
  "agentes",
  "comercial",
  "automatizaciones",
  "activacion",
];

export const FASES_LABELS: Record<FaseConstructor, string> = {
  inicio: "Inicio",
  tipo_negocio: "Tipo de negocio",
  plantilla: "Plantilla",
  marca: "Identidad de marca",
  personalizacion: "Personalización",
  catalogo: "Catálogo",
  reglas_dominio: "Reglas de dominio",
  agentes: "Agentes IA",
  comercial: "Config. comercial",
  automatizaciones: "Automatizaciones",
  activacion: "Activación",
  completado: "Completado",
};
