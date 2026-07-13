"use client";

import { Button } from "@/components/ui";
import { Bot, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">Maket AI</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Características
          </a>
          <a
            href="#agentes"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Agentes
          </a>
          <a
            href="#planes"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Precios
          </a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              Iniciar sesión
            </Button>
          </Link>
          <Link href="/registro">
            <Button size="sm">Crear mi negocio</Button>
          </Link>
        </div>

        {/* Mobile menu */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-6 py-4 space-y-4">
          <a
            href="#features"
            className="block text-sm text-zinc-400 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Características
          </a>
          <a
            href="#agentes"
            className="block text-sm text-zinc-400 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Agentes
          </a>
          <a
            href="#planes"
            className="block text-sm text-zinc-400 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Precios
          </a>
          <div className="pt-4 flex flex-col gap-2">
            <Link href="/login">
              <Button variant="outline" fullWidth size="sm">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/registro">
              <Button fullWidth size="sm">
                Crear mi negocio
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
