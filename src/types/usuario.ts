export type Plan = "free" | "premium";

export interface Usuario {
  id_usuario: string;
  nombre: string;
  email: string;
  password_hash?: string;
  plan: Plan;
  fecha_registro: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  confirmar_password: string;
  aceptar_terminos: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthSession {
  id_usuario: string;
  nombre: string;
  email: string;
  plan: Plan;
}
