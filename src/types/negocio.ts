export type EstadoNegocio = "en_configuracion" | "activo" | "pausado" | "eliminado";
export type TipoProducto = "fisico" | "digital" | "mixto";
export type AlcanceNegocio = "local" | "nacional" | "internacional";
export type TipoAgente = "vendedor" | "administrador";

export interface Negocio {
  id_negocio: string;
  id_usuario: string;
  nombre: string | null;
  estado: EstadoNegocio;
  fecha_creacion: string;
  url_tienda: string | null;
}

export interface Tema {
  id_tema: string;
  id_negocio: string;
  tipo_negocio: string;
  categoria_principal: string;
  tipo_producto: TipoProducto;
  alcance: AlcanceNegocio;
  descripcion_ia: string;
}

export interface Marca {
  id_marca: string;
  id_negocio: string;
  nombre_negocio: string;
  slogan: string;
  color_primario: string;
  color_secundario: string;
  color_acento: string;
  estilo_visual: string;
  publico_objetivo: {
    edad: string;
    genero: string;
    intereses: string[];
  };
  tono_comunicacion: string;
  logo_url: string | null;
}

export interface ConfiguracionVisual {
  id_config: string;
  id_negocio: string;
  id_plantilla: string;
  configuracion: {
    colores: {
      primario: string;
      secundario: string;
      acento: string;
      fondo: string;
      texto: string;
    };
    tipografia: {
      principal: string;
      secundaria: string;
    };
    secciones: Record<string, boolean>;
    layout: {
      productos_por_fila: number;
      modo_oscuro: boolean;
      header_sticky: boolean;
      header_estilo: string;
    };
    textos: Record<string, string>;
    logo_url: string | null;
  };
}

export interface Plantilla {
  id_plantilla: string;
  nombre: string;
  descripcion: string;
  preview_url: string;
  tipo_plan: "free" | "premium";
  categorias_compatibles: string[];
}

export interface Categoria {
  id_categoria: string;
  id_negocio: string;
  nombre: string;
  orden: number;
}

export interface Producto {
  id_producto: string;
  id_negocio: string;
  id_categoria: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenes: string[];
  variantes: Record<string, string[]>;
  stock: number;
  estado: "activo" | "borrador" | "agotado";
}

export interface ReglasNegocio {
  id_regla: string;
  id_negocio: string;
  dominio_permitido: string;
  dominios_bloqueados: string[];
  palabras_clave: string[];
  palabras_prohibidas: string[];
}

export interface Agente {
  id_agente: string;
  id_negocio: string;
  tipo: TipoAgente;
  nombre: string;
  personalidad: string;
  prompt_base: string;
  avatar_url: string | null;
  estado: "activo" | "inactivo";
}

export interface ConfigComercial {
  id_config: string;
  id_negocio: string;
  metodos_pago: string[];
  politica_devoluciones: string;
  tiempo_entrega: string;
  zonas_envio: string[];
  costo_envio: Record<string, number>;
  moneda: string;
}

export interface Automatizacion {
  id_automatizacion: string;
  id_negocio: string;
  tipo: string;
  activo: boolean;
  configuracion: Record<string, unknown>;
}
