import { notFound } from "next/navigation";
import { ShoppingCart, Search, Heart, Menu, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { emojiCategoria, detectarIndustria } from "@/lib/utils/industria";

export const revalidate = 60; // ISR: revalida cada 60 s

export default async function TiendaPage({
  params,
}: {
  params: Promise<{ id_negocio: string }>;
}) {
  const { id_negocio } = await params;
  const supabase = createClient();

  // Cargar negocio, marca, tema, categorÃ­as y productos en paralelo
  const [
    { data: negocio },
    { data: marca },
    { data: tema },
    { data: categorias },
    { data: productos },
  ] = await Promise.all([
    supabase.from("negocios").select("*").eq("id_negocio", id_negocio).single(),
    supabase.from("marca").select("*").eq("id_negocio", id_negocio).maybeSingle(),
    supabase.from("tema").select("*").eq("id_negocio", id_negocio).maybeSingle(),
    supabase.from("categorias").select("*").eq("id_negocio", id_negocio).order("orden"),
    supabase
      .from("productos")
      .select("*, categorias(nombre)")
      .eq("id_negocio", id_negocio)
      .eq("estado", "activo")
      .limit(24),
  ]);

  if (!negocio) notFound();

  // â”€â”€ Valores con fallback seguro â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const nombre_tienda = marca?.nombre_negocio ?? negocio.nombre ?? "Mi Tienda";
  const slogan = marca?.slogan ?? "Bienvenido a nuestra tienda";
  const color_primario = marca?.color_primario ?? "#4f46e5";
  const tipo_negocio = tema?.tipo_negocio ?? "otro";
  const industria = detectarIndustria(tipo_negocio);

  // CategorÃ­as desde BD; si no hay, se infieren de los productos
  const nombres_categorias: string[] =
    categorias && categorias.length > 0
      ? categorias.map((c: any) => c.nombre)
      : [...new Set((productos ?? []).map((p: any) => p.categorias?.nombre ?? "General"))].slice(0, 8);

  const lista_productos = productos ?? [];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button aria-label="Abrir menÃº" className="lg:hidden text-zinc-600 dark:text-zinc-400">
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                <span className="mr-2">{industria.emoji}</span>{nombre_tienda}
              </h1>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
              {nombres_categorias.slice(0, 6).map((cat) => (
                <a
                  key={cat}
                  href={`#cat-${cat.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  {cat}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button aria-label="Buscar productos" className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900">
                <Search size={20} />
              </button>
              <button aria-label="Lista de deseos" className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900">
                <Heart size={20} />
              </button>
              <button aria-label="Carrito de compras" className="relative p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900">
                <ShoppingCart size={20} />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section
        className="relative py-20 md:py-32"
        style={{ background: `linear-gradient(135deg, ${color_primario}cc, ${color_primario}66)` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-6xl mb-4">{industria.emoji}</div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">{slogan}</h2>
          <p className="text-lg text-white/70 mb-8">{industria.label} Â· {tipo_negocio}</p>
          <a
            href="#productos"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-zinc-100 transition-colors shadow-lg"
          >
            Ver productos
          </a>
        </div>
      </section>

      {/* â”€â”€ CategorÃ­as â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {nombres_categorias.length > 0 && (
        <section className="py-12 bg-zinc-50 dark:bg-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 text-center">CategorÃ­as</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {nombres_categorias.map((cat) => (
                <a
                  key={cat}
                  href={`#cat-${cat.toLowerCase().replace(/\s/g, "-")}`}
                  className="group flex flex-col items-center gap-2 p-4 bg-white dark:bg-zinc-800 rounded-2xl hover:shadow-lg transition-all border border-zinc-100 dark:border-zinc-700"
                >
                  <div className={`w-12 h-12 rounded-full ${industria.colorClase} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <span className="text-xl">{emojiCategoria(cat, tipo_negocio)}</span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 text-center">{cat}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* â”€â”€ Productos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="productos" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Productos destacados</h2>
            <span className="text-sm text-zinc-400">{lista_productos.length} productos</span>
          </div>

          {lista_productos.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">{industria.emoji}</div>
              <p className="text-zinc-500 text-lg">PrÃ³ximamente agregaremos productos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lista_productos.map((producto: any) => {
                const cat_nombre = producto.categorias?.nombre ?? "General";
                const imagen = Array.isArray(producto.imagenes) && producto.imagenes.length > 0
                  ? producto.imagenes[0]
                  : null;

                return (
                  <div
                    key={producto.id_producto}
                    id={`cat-${cat_nombre.toLowerCase().replace(/\s/g, "-")}`}
                    className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950 hover:shadow-xl transition-all"
                  >
                    <div className="aspect-square bg-linear-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 relative overflow-hidden">
                      {imagen ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imagen} alt={producto.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                          {emojiCategoria(cat_nombre, tipo_negocio)}
                        </div>
                      )}
                      <button
                        aria-label={`Agregar ${producto.nombre} a favoritos`}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Heart size={18} />
                      </button>
                      {producto.stock === 0 && (
                        <span className="absolute top-3 left-3 px-2 py-1 bg-zinc-900/80 text-white text-[10px] font-semibold rounded-full">
                          Agotado
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">{cat_nombre}</span>
                      <h3 className="font-semibold text-zinc-900 dark:text-white mt-1 line-clamp-2">{producto.nombre}</h3>
                      {producto.descripcion && (
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{producto.descripcion}</p>
                      )}
                      <div className="flex items-center justify-between mt-3 gap-2">
                        <span className="text-lg font-bold text-zinc-900 dark:text-white">
                          ${Number(producto.precio).toLocaleString("es")}
                        </span>
                        <button
                          disabled={producto.stock === 0}
                          className="px-3 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* â”€â”€ Chat Widget (Agente Vendedor) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          aria-label="Abrir chat con agente vendedor"
          className="w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          style={{ backgroundColor: color_primario }}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {/* â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span>{industria.emoji}</span> {nombre_tienda}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{slogan}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">CategorÃ­as</h4>
              <ul className="space-y-2">
                {nombres_categorias.slice(0, 6).map((cat) => (
                  <li key={cat}>
                    <a href={`#cat-${cat.toLowerCase().replace(/\s/g, "-")}`} className="text-sm hover:text-white transition-colors">
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">InformaciÃ³n</h4>
              <ul className="space-y-2">
                {["Sobre nosotros", "PolÃ­tica de devoluciones", "EnvÃ­os", "Contacto"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-xs text-zinc-600">
            <p>
              Tienda creada con <span className="text-indigo-400 font-semibold">Maket AI</span>
              {" Â· "}
              <span className="font-mono opacity-50">{id_negocio.slice(0, 8)}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
