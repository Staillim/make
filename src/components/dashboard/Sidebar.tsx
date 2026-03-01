"use client";

import { Bot, LayoutDashboard, Store, Settings, LogOut, Crown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useAuthStore } from "@/lib/store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/negocios", label: "Mis Negocios", icon: Store },
  { href: "/dashboard/configuracion", label: "Configuración", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">Maket AI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-600/10 text-indigo-400"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Plan badge */}
      <div className="p-4">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <Crown size={16} className="text-yellow-500" />
            <span className="text-sm font-medium text-white capitalize">
              Plan {user?.plan || "free"}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mb-3">
            {user?.plan === "premium"
              ? "Acceso completo a todas las funciones"
              : "Actualiza para desbloquear más funciones"}
          </p>
          {user?.plan !== "premium" && (
            <button className="w-full text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Actualizar a Premium →
            </button>
          )}
        </div>
      </div>

      {/* User info & logout */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.nombre || "Usuario"}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-800/50 transition-all"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
