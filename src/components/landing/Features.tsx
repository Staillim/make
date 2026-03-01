import { Zap, Palette, ShieldCheck, Globe, Bot, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "IA Conversacional",
    description:
      "Crea tu negocio completo con solo una conversación. Nuestro agente te guía paso a paso.",
  },
  {
    icon: Palette,
    title: "Personalización Total",
    description:
      "Elige plantillas, colores, tipografías y configura cada detalle de tu tienda.",
  },
  {
    icon: Zap,
    title: "Automatización Inteligente",
    description:
      "Alertas de stock, recomendaciones automáticas, cross-selling y reportes diarios.",
  },
  {
    icon: Globe,
    title: "Vende al Mundo",
    description:
      "Configura envíos locales o internacionales, múltiples métodos de pago y monedas.",
  },
  {
    icon: ShieldCheck,
    title: "Reglas de Dominio",
    description:
      "La IA solo opera dentro del dominio de tu negocio. Control total y seguro.",
  },
  {
    icon: BarChart3,
    title: "Métricas en Tiempo Real",
    description:
      "Tu agente administrador te entrega reportes, análisis y sugerencias diarias.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Todo lo que necesitas para tu negocio
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
            Una plataforma completa que combina el poder de la IA con
            herramientas profesionales de e-commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
