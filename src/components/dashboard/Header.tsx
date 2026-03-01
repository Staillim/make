"use client";

import { Bell, Search } from "lucide-react";
import { useAuthStore } from "@/lib/store";

export function Header() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search size={20} className="text-zinc-400" />
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-transparent text-sm text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 focus:outline-none w-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:block">
            {user?.nombre || "Usuario"}
          </span>
        </div>
      </div>
    </header>
  );
}
