"use client";

import { Bot, User } from "lucide-react";
import type { MensajeChat } from "@/types";
import { clsx } from "clsx";

interface ChatMessageProps {
  mensaje: MensajeChat;
  onOptionClick?: (valor: string) => void;
}

export function ChatMessage({ mensaje, onOptionClick }: ChatMessageProps) {
  const isBot = mensaje.rol === "bot";

  return (
    <div
      className={clsx(
        "flex gap-3 mb-4",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div
        className={clsx(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isBot
            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
            : "bg-indigo-600 text-white"
        )}
      >
        {/* Message text */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {mensaje.contenido}
        </p>

        {/* Quick options */}
        {mensaje.opciones && mensaje.opciones.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {mensaje.opciones.map((opcion) => (
              <button
                key={opcion.valor}
                onClick={() => onOptionClick?.(opcion.valor)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
              >
                {opcion.icono && <span className="mr-1">{opcion.icono}</span>}
                {opcion.label}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p
          className={clsx(
            "text-[10px] mt-2",
            isBot ? "text-zinc-400" : "text-indigo-200"
          )}
        >
          {new Date(mensaje.timestamp).toLocaleTimeString("es", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-lg bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center shrink-0 mt-1">
          <User className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
        </div>
      )}
    </div>
  );
}
