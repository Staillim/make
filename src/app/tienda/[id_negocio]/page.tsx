import { ShoppingCart, Search, Heart, Menu } from "lucide-react";

// This is a demo/sample store page rendered dynamically
// In production, it would load configuration from the database

export default async function TiendaPage({
  params,
}: {
  params: Promise<{ id_negocio: string }>;
}) {
  const { id_negocio } = await params;

  // TODO: Load store configuration from database
  // const config = await getStoreConfig(id_negocio);

  // Demo data
  const tienda = {
    nombre: "Urban Style",
    slogan: "Tu estilo, tu regla",
    color_primario: "#4f46e5",
    categorias: ["Camisetas", "Pantalones", "Zapatos", "Accesorios"],
    productos: [
      {
        id: "1",
        nombre: "Camiseta Minimal",
        precio: 35000,
        imagen: null,
        categoria: "Camisetas",
      },
      {
        id: "2",
        nombre: "Jeans Urban",
        precio: 89000,
        imagen: null,
        categoria: "Pantalones",
      },
      {
        id: "3",
        nombre: "Sneakers Pro",
        precio: 120000,
        imagen: null,
        categoria: "Zapatos",
      },
      {
        id: "4",
        nombre: "Gorra Classic",
        precio: 25000,
        imagen: null,
        categoria: "Accesorios",
      },
      {
        id: "5",
        nombre: "Hoodie Premium",
        precio: 95000,
        imagen: null,
        categoria: "Camisetas",
      },
      {
        id: "6",
        nombre: "Joggers Flex",
        precio: 75000,
        imagen: null,
        categoria: "Pantalones",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Store Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Menu + Logo */}
            <div className="flex items-center gap-4">
              <button className="lg:hidden text-zinc-600 dark:text-zinc-400">
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                {tienda.nombre}
              </h1>
            </div>

            {/* Categories */}
            <nav className="hidden lg:flex items-center gap-6">
              {tienda.categorias.map((cat) => (
                <a
                  key={cat}
                  href="#"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  {cat}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900">
                <Search size={20} />
              </button>
              <button className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900">
                <Heart size={20} />
              </button>
              <button className="relative p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900">
                <ShoppingCart size={20} />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-zinc-900 to-zinc-800 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {tienda.slogan}
          </h2>
          <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
            Descubre nuestra nueva colección con los mejores estilos y tendencias.
          </p>
          <a
            href="#productos"
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Ver colección
          </a>
        </div>
      </section>

      {/* Categories section */}
      <section className="py-12 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tienda.categorias.map((cat) => (
              <div
                key={cat}
                className="group relative bg-white dark:bg-zinc-800 rounded-2xl p-8 text-center cursor-pointer hover:shadow-lg transition-all border border-zinc-100 dark:border-zinc-700"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-500/10 mx-auto mb-4 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {cat === "Camisetas"
                      ? "👕"
                      : cat === "Pantalones"
                        ? "👖"
                        : cat === "Zapatos"
                          ? "👟"
                          : "👜"}
                  </span>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  {cat}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section id="productos" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Productos destacados
            </h2>
            <a
              href="#"
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Ver todos →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tienda.productos.map((producto) => (
              <div
                key={producto.id}
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950 hover:shadow-xl transition-all"
              >
                {/* Image placeholder */}
                <div className="aspect-square bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                    {producto.categoria === "Camisetas"
                      ? "👕"
                      : producto.categoria === "Pantalones"
                        ? "👖"
                        : producto.categoria === "Zapatos"
                          ? "👟"
                          : "👜"}
                  </div>
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Heart size={18} />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">
                    {producto.categoria}
                  </span>
                  <h3 className="font-semibold text-zinc-900 dark:text-white mt-1">
                    {producto.nombre}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">
                      ${producto.precio.toLocaleString("es")}
                    </span>
                    <button className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors">
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Widget placeholder */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-500/25 flex items-center justify-center hover:bg-indigo-700 transition-colors">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {/* Store Footer */}
      <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">
                {tienda.nombre}
              </h3>
              <p className="text-sm leading-relaxed">{tienda.slogan}</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Categorías</h4>
              <ul className="space-y-2">
                {tienda.categorias.map((cat) => (
                  <li key={cat}>
                    <a href="#" className="text-sm hover:text-white transition-colors">
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Información</h4>
              <ul className="space-y-2">
                {["Sobre nosotros", "Política de devoluciones", "Envíos", "Contacto"].map(
                  (item) => (
                    <li key={item}>
                      <a href="#" className="text-sm hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-xs text-zinc-600">
            <p>
              Tienda creada con{" "}
              <span className="text-indigo-400">Maket AI</span> · ID:{" "}
              {id_negocio.slice(0, 8)}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
