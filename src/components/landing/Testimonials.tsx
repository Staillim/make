import { Star } from "lucide-react";

const testimonios = [
  {
    nombre: "María González",
    negocio: "Boutique Elegance",
    avatar: "MG",
    texto:
      "Creé mi tienda de ropa en menos de 10 minutos. El agente constructor me guió en todo. ¡Increíble!",
    estrellas: 5,
  },
  {
    nombre: "Carlos Hernández",
    negocio: "TechShop Pro",
    avatar: "CH",
    texto:
      "El agente vendedor atiende a mis clientes mientras yo duermo. Las ventas han subido un 40% desde que lo activé.",
    estrellas: 5,
  },
  {
    nombre: "Ana Rodríguez",
    negocio: "Artesanías del Valle",
    avatar: "AR",
    texto:
      "Nunca pensé que pudiera tener un negocio online. La IA lo hizo todo por mí, solo tuve que responder preguntas.",
    estrellas: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
            Miles de emprendedores ya están usando la plataforma para crear
            negocios exitosos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonios.map((t) => (
            <div
              key={t.nombre}
              className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.estrellas }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                &ldquo;{t.texto}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {t.nombre}
                  </div>
                  <div className="text-xs text-zinc-500">{t.negocio}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
