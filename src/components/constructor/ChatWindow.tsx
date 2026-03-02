"use client";

import { useEffect, useRef, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ProgressSidebar } from "./ProgressSidebar";
import { useConstructorStore, useNegocioStore } from "@/lib/store";
import type { MensajeChat, FaseConstructor, OpcionRapida } from "@/types";
import { Bot, Loader2 } from "lucide-react";

interface ChatWindowProps {
  idNegocio: string;
}

/** Mapeo UI-phase → API-phase usado por el Orquestador */
function uiPhaseToApiPhase(fase: FaseConstructor): string {
  const map: Partial<Record<FaseConstructor, string>> = {
    inicio: "descubrimiento",
    tipo_negocio: "descubrimiento",
    plantilla: "identidad",
    marca: "identidad",
    personalizacion: "identidad",
    catalogo: "productos",
    reglas_dominio: "productos",
    agentes: "agentes",
    comercial: "operaciones",
    automatizaciones: "activacion",
    activacion: "activacion",
    completado: "activacion",
  };
  return map[fase] ?? "descubrimiento";
}

export function ChatWindow({ idNegocio }: ChatWindowProps) {
  const {
    mensajes,
    progreso,
    cargando,
    agregarMensaje,
    avanzarFase,
    setCargando,
  } = useConstructorStore();

  const actualizarNegocio = useNegocioStore((s) => s.actualizarNegocio);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inicializadoRef = useRef(false);

  // Historial en formato IA (role: user | assistant)
  const historialIaRef = useRef<Array<{ role: "user" | "assistant"; content: string }>>([]);
  // Info parcial del negocio extraída por el orquestador
  const negocioParcialRef = useRef<Record<string, any>>({});
  // Detect browser language once (BCP-47: "es", "en", "pt", etc.)
  const idiomaRef = useRef<string>(
    typeof navigator !== "undefined"
      ? navigator.language.split("-")[0]
      : "es"
  );

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes]);

  /** Llama al Orquestador y procesa la respuesta */
  const callOrquestador = useCallback(
    async (
      mensaje: string,
      esInicio = false
    ): Promise<{ contenido: string; opciones?: OpcionRapida[] }> => {
      const fase_api = uiPhaseToApiPhase(progreso.fase_actual);

      const res = await fetch("/api/constructor/orquestador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_negocio: idNegocio,
          mensaje,
          historial_mensajes: historialIaRef.current,
          negocio_parcial: negocioParcialRef.current,
          fase_actual: fase_api,
          es_inicio: esInicio,
          idioma: idiomaRef.current,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Error en el servidor");
      }

      const data = await res.json();

      // Actualizar historial IA local
      historialIaRef.current = [
        ...historialIaRef.current,
        { role: "user", content: mensaje },
        { role: "assistant", content: data.respuesta },
      ];

      // Acumular información extraída
      if (data.informacion_extraida) {
        negocioParcialRef.current = {
          ...negocioParcialRef.current,
          ...data.informacion_extraida,
        };
      }

      // Avanzar fase en el sidebar
      if (data.avanzar_fase) {
        avanzarFase();
      }

      // Activar negocio en el store si el orquestador lo indica
      if (data.negocio_activado) {
        actualizarNegocio(idNegocio, {
          estado: "activo",
          nombre: negocioParcialRef.current.nombre_negocio ?? "Mi Negocio",
          url_tienda: `/tienda/${idNegocio}`,
        });
      }

      const opciones: OpcionRapida[] | undefined = data.opciones_rapidas
        ? data.opciones_rapidas.map((o: any) =>
            typeof o === "string" ? { label: o, valor: o } : o
          )
        : undefined;

      return { contenido: data.respuesta, opciones };
    },
    [idNegocio, progreso.fase_actual, avanzarFase, actualizarNegocio]
  );

  // Mensaje de bienvenida al montar el componente
  useEffect(() => {
    if (!inicializadoRef.current && mensajes.length === 0) {
      inicializadoRef.current = true;
      setCargando(true);
      callOrquestador("START", true)
        .then(({ contenido, opciones }) => {
          agregarMensaje({
            id: crypto.randomUUID(),
            rol: "bot",
            contenido,
            timestamp: new Date().toISOString(),
            opciones,
          });
        })
        .catch(() => {
          agregarMensaje({
            id: crypto.randomUUID(),
            rol: "bot",
            contenido:
              "¡Hola! 👋 Soy tu asistente para crear tu negocio. ¿Qué tipo de negocio quieres crear?",
            timestamp: new Date().toISOString(),
            opciones: [
              { label: "🛍️ Tienda de ropa", valor: "Tienda de ropa" },
              { label: "🍔 Restaurante", valor: "Restaurante" },
              { label: "💻 Tecnología", valor: "Tecnología" },
              { label: "💪 Fitness / Gym", valor: "Fitness" },
              { label: "🎨 Artesanías", valor: "Artesanías" },
            ],
          });
        })
        .finally(() => setCargando(false));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = async (texto: string) => {
    // Mostrar mensaje del usuario inmediatamente
    const userMsg: MensajeChat = {
      id: crypto.randomUUID(),
      rol: "usuario",
      contenido: texto,
      timestamp: new Date().toISOString(),
    };
    agregarMensaje(userMsg);
    setCargando(true);

    try {
      const { contenido, opciones } = await callOrquestador(texto);
      agregarMensaje({
        id: crypto.randomUUID(),
        rol: "bot",
        contenido,
        timestamp: new Date().toISOString(),
        opciones,
      });
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      agregarMensaje({
        id: crypto.randomUUID(),
        rol: "bot",
        contenido:
          "Lo siento, tuve un problema de conexión. ¿Puedes repetir tu mensaje?",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setCargando(false);
    }
  };

  const handleOptionClick = (valor: string) => sendMessage(valor);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Progress sidebar */}
      <ProgressSidebar progreso={progreso} />

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900">
        {/* Chat header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Agente Constructor
            </h2>
            <p className="text-xs text-green-500">● En línea</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            {mensajes.map((msg) => (
              <ChatMessage
                key={msg.id}
                mensaje={msg}
                onOptionClick={handleOptionClick}
              />
            ))}

            {/* Typing indicator */}
            {cargando && (
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-1">
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  <span className="text-xs text-zinc-500 ml-2">
                    Escribiendo...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={cargando} />
      </div>
    </div>
  );
}
