import { Bot } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Maket AI</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Crea negocios autónomos con inteligencia artificial. Sin código,
              sin complicaciones.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Producto
            </h4>
            <ul className="space-y-2">
              {["Características", "Agentes IA", "Plantillas", "Precios"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-zinc-500 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Empresa
            </h4>
            <ul className="space-y-2">
              {["Sobre nosotros", "Blog", "Contacto", "Empleo"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              {[
                "Términos de servicio",
                "Política de privacidad",
                "Política de cookies",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            © 2026 Maket AI. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            {["Twitter", "GitHub", "Discord"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-zinc-600 hover:text-white transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
