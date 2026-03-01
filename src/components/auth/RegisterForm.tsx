"use client";

import { useState } from "react";
import { Button, Input, Card } from "@/components/ui";
import { Bot, User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export function RegisterForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmar_password: "",
    aceptar_terminos: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!form.email.trim()) newErrors.email = "El email es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Email no válido";
    if (form.password.length < 8)
      newErrors.password = "Mínimo 8 caracteres";
    if (form.password !== form.confirmar_password)
      newErrors.confirmar_password = "Las contraseñas no coinciden";
    if (!form.aceptar_terminos)
      newErrors.aceptar_terminos = "Debes aceptar los términos";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const userId = crypto.randomUUID();
    login({
      id_usuario: userId,
      nombre: form.nombre,
      email: form.email,
      plan: "free",
    });

    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-indigo-950 to-zinc-950 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-zinc-800 bg-zinc-950/80 backdrop-blur-xl" padding="lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Maket AI</span>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Crea tu cuenta
        </h1>
        <p className="text-zinc-500 text-center mb-8">
          Empieza a construir tu negocio autónomo
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre completo"
            name="nombre"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={handleChange}
            error={errors.nombre}
            icon={<User size={18} />}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            icon={<Mail size={18} />}
          />

          <div className="relative">
            <Input
              label="Contraseña"
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock size={18} />}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-zinc-400 hover:text-zinc-200"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Input
            label="Confirmar contraseña"
            name="confirmar_password"
            type="password"
            placeholder="Repite tu contraseña"
            value={form.confirmar_password}
            onChange={handleChange}
            error={errors.confirmar_password}
            icon={<Lock size={18} />}
          />

          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="aceptar_terminos"
                checked={form.aceptar_terminos}
                onChange={handleChange}
                className="mt-1 rounded border-zinc-600 bg-zinc-800 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-zinc-400">
                Acepto los{" "}
                <Link href="#" className="text-indigo-400 hover:underline">
                  términos de servicio
                </Link>{" "}
                y la{" "}
                <Link href="#" className="text-indigo-400 hover:underline">
                  política de privacidad
                </Link>
              </span>
            </label>
            {errors.aceptar_terminos && (
              <p className="mt-1 text-sm text-red-500">{errors.aceptar_terminos}</p>
            )}
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Crear cuenta
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs text-zinc-600">O</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Google login */}
        <Button variant="outline" fullWidth className="border-zinc-700 text-zinc-300">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continuar con Google
        </Button>

        <p className="text-center text-sm text-zinc-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Inicia sesión
          </Link>
        </p>
      </Card>
    </div>
  );
}
