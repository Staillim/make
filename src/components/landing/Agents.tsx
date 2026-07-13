import { Hammer, ShoppingCart, Settings } from "lucide-react";

const agents = [
  {
    icon: Hammer,
    name: "Agente Constructor",
    role: "Crea tu negocio",
    description:
      "Te guía paso a paso en una conversación para configurar tu tienda completa: marca, diseño, productos, pagos y más.",
    capabilities: [
      "Define tipo de negocio",
      "Asigna plantilla y diseño",
      "Configura identidad de marca",
      "Crea estructura de catálogo",
      "Establece reglas de dominio",
    ],
    gradient: "from-blue-500 to-cyan-500",
    bgGlow: "bg-blue-500/20",
  },
  {
    icon: ShoppingCart,
    name: "Agente Vendedor",
    role: "Atiende tus clientes",
    description:
      "Asesora a tus compradores en tiempo real, recomienda productos, responde dudas y cierra ventas automáticamente.",
    capabilities: [
      "Asesoría personalizada",
      "Recomendaciones inteligentes",
      "Cross-selling automático",
      "Respuestas 24/7",
      "Cierre de ventas",
    ],
    gradient: "from-indigo-500 to-purple-500",
    bgGlow: "bg-indigo-500/20",
  },
  {
    icon: Settings,
    name: "Agente Administrador",
    role: "Gestiona todo",
    description:
      "Monitorea tu inventario, genera reportes, envía alertas y te da insights diarios para optimizar tu negocio.",
    capabilities: [
      "Reportes automáticos",
      "Control de inventario",
      "Alertas inteligentes",
      "Métricas de rendimiento",
      "Sugerencias de mejora",
    ],
    gradient: "from-purple-500 to-pink-500",
    bgGlow: "bg-purple-500/20",
  },
];

export function Agents() {
  return (
    <section id="agentes" className="py-24 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            3 Agentes IA trabajando por ti
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
            Cada agente tiene un rol específico y está personalizado para tu
            negocio. Trabajan juntos las 24 horas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="relative group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 hover:border-transparent transition-all duration-300 overflow-hidden"
            >
              {/* Background glow */}
              <div
                className={`absolute -top-20 -right-20 w-40 h-40 ${agent.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <agent.icon className="w-7 h-7 text-white" />
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                  {agent.name}
                </h3>
                <p
                  className={`text-sm font-medium bg-gradient-to-r ${agent.gradient} bg-clip-text text-transparent mb-4`}
                >
                  {agent.role}
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                  {agent.description}
                </p>

                {/* Capabilities */}
                <ul className="space-y-2">
                  {agent.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${agent.gradient}`}
                      />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
