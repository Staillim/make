export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id_usuario: string
          nombre: string
          email: string
          password_hash: string
          plan: 'free' | 'premium'
          fecha_registro: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id_usuario?: string
          nombre: string
          email: string
          password_hash: string
          plan?: 'free' | 'premium'
          fecha_registro?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id_usuario?: string
          nombre?: string
          email?: string
          password_hash?: string
          plan?: 'free' | 'premium'
          fecha_registro?: string
          created_at?: string
          updated_at?: string
        }
      }
      negocios: {
        Row: {
          id_negocio: string
          id_usuario: string
          nombre: string | null
          estado: 'en_configuracion' | 'activo' | 'pausado'
          fecha_creacion: string
          fecha_activacion: string | null
          url_tienda: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id_negocio?: string
          id_usuario: string
          nombre?: string | null
          estado?: 'en_configuracion' | 'activo' | 'pausado'
          fecha_creacion?: string
          fecha_activacion?: string | null
          url_tienda?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id_negocio?: string
          id_usuario?: string
          nombre?: string | null
          estado?: 'en_configuracion' | 'activo' | 'pausado'
          fecha_creacion?: string
          fecha_activacion?: string | null
          url_tienda?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tema: {
        Row: {
          id_tema: string
          id_negocio: string
          tipo_negocio: string
          categoria_principal: string
          tipo_producto: 'fisico' | 'digital' | 'mixto'
          alcance: 'local' | 'nacional' | 'internacional'
          descripcion_ia: string | null
          created_at: string
        }
        Insert: {
          id_tema?: string
          id_negocio: string
          tipo_negocio: string
          categoria_principal: string
          tipo_producto: 'fisico' | 'digital' | 'mixto'
          alcance: 'local' | 'nacional' | 'internacional'
          descripcion_ia?: string | null
          created_at?: string
        }
        Update: {
          id_tema?: string
          id_negocio?: string
          tipo_negocio?: string
          categoria_principal?: string
          tipo_producto?: 'fisico' | 'digital' | 'mixto'
          alcance?: 'local' | 'nacional' | 'internacional'
          descripcion_ia?: string | null
          created_at?: string
        }
      }
      marca: {
        Row: {
          id_marca: string
          id_negocio: string
          nombre_negocio: string
          slogan: string | null
          color_primario: string
          color_secundario: string | null
          color_acento: string | null
          estilo_visual: string
          publico_objetivo: any | null
          tono_comunicacion: string
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id_marca?: string
          id_negocio: string
          nombre_negocio: string
          slogan?: string | null
          color_primario: string
          color_secundario?: string | null
          color_acento?: string | null
          estilo_visual: string
          publico_objetivo?: any | null
          tono_comunicacion: string
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id_marca?: string
          id_negocio?: string
          nombre_negocio?: string
          slogan?: string | null
          color_primario?: string
          color_secundario?: string | null
          color_acento?: string | null
          estilo_visual?: string
          publico_objetivo?: any | null
          tono_comunicacion?: string
          logo_url?: string | null
          created_at?: string
        }
      }
      plantillas: {
        Row: {
          id_plantilla: string
          nombre: string
          descripcion: string
          preview_url: string | null
          tipo_plan: 'free' | 'premium'
          categorias_compatibles: any | null
          configuracion_base: any | null
          created_at: string
        }
        Insert: {
          id_plantilla?: string
          nombre: string
          descripcion: string
          preview_url?: string | null
          tipo_plan: 'free' | 'premium'
          categorias_compatibles?: any | null
          configuracion_base?: any | null
          created_at?: string
        }
        Update: {
          id_plantilla?: string
          nombre?: string
          descripcion?: string
          preview_url?: string | null
          tipo_plan?: 'free' | 'premium'
          categorias_compatibles?: any | null
          configuracion_base?: any | null
          created_at?: string
        }
      }
      configuracion_visual: {
        Row: {
          id_config: string
          id_negocio: string
          id_plantilla: string
          configuracion: any
          ultima_modificacion: string
          created_at: string
        }
        Insert: {
          id_config?: string
          id_negocio: string
          id_plantilla: string
          configuracion: any
          ultima_modificacion?: string
          created_at?: string
        }
        Update: {
          id_config?: string
          id_negocio?: string
          id_plantilla?: string
          configuracion?: any
          ultima_modificacion?: string
          created_at?: string
        }
      }
      categorias: {
        Row: {
          id_categoria: string
          id_negocio: string
          nombre: string
          orden: number
          created_at: string
        }
        Insert: {
          id_categoria?: string
          id_negocio: string
          nombre: string
          orden: number
          created_at?: string
        }
        Update: {
          id_categoria?: string
          id_negocio?: string
          nombre?: string
          orden?: number
          created_at?: string
        }
      }
      productos: {
        Row: {
          id_producto: string
          id_negocio: string
          id_categoria: string
          nombre: string
          descripcion: string | null
          precio: number
          imagenes: any | null
          variantes: any | null
          stock: number
          estado: 'activo' | 'borrador' | 'agotado'
          created_at: string
          updated_at: string
        }
        Insert: {
          id_producto?: string
          id_negocio: string
          id_categoria: string
          nombre: string
          descripcion?: string | null
          precio: number
          imagenes?: any | null
          variantes?: any | null
          stock?: number
          estado?: 'activo' | 'borrador' | 'agotado'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id_producto?: string
          id_negocio?: string
          id_categoria?: string
          nombre?: string
          descripcion?: string | null
          precio?: number
          imagenes?: any | null
          variantes?: any | null
          stock?: number
          estado?: 'activo' | 'borrador' | 'agotado'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}