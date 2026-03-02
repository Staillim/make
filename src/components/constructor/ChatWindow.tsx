"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ProgressSidebar } from "./ProgressSidebar";
import { useConstructorStore, useNegocioStore } from "@/lib/store";
import type { MensajeChat, FaseConstructor, OpcionRapida } from "@/types";
import { Bot, Loader2 } from "lucide-react";

interface ChatWindowProps {
  idNegocio: string;
}

// Bot responses per phase
function getBotResponse(
  fase: FaseConstructor,
  userMessage?: string
): { contenido: string; opciones?: OpcionRapida[]; avanzar?: boolean } {
  switch (fase) {
    case "inicio":
      return {
        contenido:
          "¡Hola! 👋 Soy tu asistente para crear tu negocio autónomo.\n\nVamos a construirlo paso a paso. Será rápido y sencillo.\n\n¿Qué tipo de negocio quieres crear?",
        opciones: [
          { label: "🛍️ Tienda de ropa", valor: "tienda_ropa" },
          { label: "💻 Tecnología", valor: "tecnologia" },
          { label: "🎨 Artesanías", valor: "artesanias" },
          { label: "🍔 Alimentos", valor: "alimentos" },
          { label: "📚 Productos digitales", valor: "digital" },
        ],
        avanzar: true,
      };

    case "tipo_negocio":
      return {
        contenido: `¡Excelente elección! Veo que quieres crear un negocio de "${userMessage}".\n\n¿Tus productos serán físicos o digitales?`,
        opciones: [
          { label: "📦 Físicos", valor: "fisico" },
          { label: "💾 Digitales", valor: "digital" },
          { label: "🔄 Ambos", valor: "mixto" },
        ],
        avanzar: false,
      };

    case "plantilla":
      return {
        contenido:
          "Perfecto. Ahora vamos a elegir una plantilla para tu tienda.\n\nEstas son las plantillas disponibles para tu tipo de negocio:",
        opciones: [
          { label: "✨ Minimal", valor: "minimal" },
          { label: "🎯 Modern", valor: "modern" },
          { label: "🏛️ Classic", valor: "classic" },
          { label: "🌈 Colorful", valor: "colorful" },
        ],
        avanzar: true,
      };

    case "marca":
      return {
        contenido:
          "¡Buena elección! Ahora definamos la identidad de tu marca.\n\n¿Cómo se llamará tu negocio?",
        avanzar: false,
      };

    case "personalizacion":
      return {
        contenido:
          "¡Me encanta el nombre! 🎨 Ahora vamos a personalizar tu plantilla.\n\n¿Qué estilo visual prefieres?",
        opciones: [
          { label: "🖤 Minimalista", valor: "minimalista" },
          { label: "✨ Elegante", valor: "elegante" },
          { label: "🎉 Juvenil", valor: "juvenil" },
          { label: "💼 Profesional", valor: "profesional" },
        ],
        avanzar: true,
      };

    case "catalogo":
      return {
        contenido:
          "Perfecto. Ahora configuremos tu catálogo de productos.\n\n¿Qué categorías de productos tendrás?",
        opciones: [
          { label: "👕 Camisetas", valor: "camisetas" },
          { label: "👖 Pantalones", valor: "pantalones" },
          { label: "👟 Zapatos", valor: "zapatos" },
          { label: "👜 Accesorios", valor: "accesorios" },
        ],
        avanzar: true,
      };

    case "reglas_dominio":
      return {
        contenido:
          "He generado las reglas de dominio automáticamente para tu negocio. Esto asegura que los agentes IA solo operen dentro de tu nicho.\n\n✅ Dominio: Moda y accesorios\n❌ Bloqueado: Comida, tecnología, salud\n🔑 Keywords: ropa, estilo, moda, outfit\n\n¿Deseas ajustar algo?",
        opciones: [
          { label: "✅ Todo bien", valor: "confirmar" },
          { label: "✏️ Ajustar", valor: "ajustar" },
        ],
        avanzar: true,
      };

    case "agentes":
      return {
        contenido:
          "¡Genial! Ahora vamos a configurar tus agentes IA.\n\n¿Cómo quieres que se llame tu asesora de ventas?",
        opciones: [
          { label: "👩 Sofía", valor: "Sofia" },
          { label: "👩 Luna", valor: "Luna" },
          { label: "👩 María", valor: "Maria" },
          { label: "🤖 Personalizado", valor: "personalizado" },
        ],
        avanzar: false,
      };

    case "comercial":
      return {
        contenido:
          "Perfecto. Ahora configuremos la parte comercial.\n\n¿Qué métodos de pago aceptarás?",
        opciones: [
          { label: "💳 Tarjeta", valor: "tarjeta" },
          { label: "🏦 Transferencia", valor: "transferencia" },
          { label: "🚚 Contra entrega", valor: "contra_entrega" },
          { label: "💰 Todos", valor: "todos" },
        ],
        avanzar: true,
      };

    case "automatizaciones":
      return {
        contenido:
          "¡Casi terminamos! Activa las automatizaciones que desees:\n\n📦 Alertas de stock bajo\n🤝 Recomendaciones automáticas\n🔄 Cross-selling\n📊 Reporte diario\n\n¿Quieres activar todas?",
        opciones: [
          { label: "✅ Activar todas", valor: "todas" },
          { label: "📦 Solo alertas", valor: "alertas" },
          { label: "📊 Solo reportes", valor: "reportes" },
        ],
        avanzar: true,
      };

    case "activacion":
      return {
        contenido:
          "🎉 ¡Tu negocio está listo!\n\nHemos configurado:\n✅ Tipo de negocio y dominio\n✅ Plantilla personalizada\n✅ Identidad de marca\n✅ Catálogo de productos\n✅ Reglas de dominio\n✅ Agente vendedor IA\n✅ Agente administrador IA\n✅ Métodos de pago\n✅ Automatizaciones\n\n¿Deseas activarlo ahora?",
        opciones: [
          { label: "🚀 ¡Activar ahora!", valor: "activar" },
          { label: "👀 Ver preview primero", valor: "preview" },
        ],
        avanzar: true,
      };

    default:
      return {
        contenido: "Gracias por tu respuesta. Continuemos con el siguiente paso.",
        avanzar: true,
      };
  }
}

// Sub-step logic within phases  
const FASE_SUBSTEPS: Partial<Record<FaseConstructor, number>> = {
  tipo_negocio: 2, // tipo + tipo_producto
  marca: 3, // nombre + slogan + colores
  agentes: 2, // vendedor + admin
};

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
  const subStepRef = useRef<number>(0);
  const inicializadoRef = useRef(false);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensajes]);

  // Initial bot message
  useEffect(() => {
    if (!inicializadoRef.current && mensajes.length === 0) {
      inicializadoRef.current = true;
      const response = getBotResponse("inicio");
      setTimeout(() => {
        agregarMensaje({
          id: crypto.randomUUID(),
          rol: "bot",
          contenido: response.contenido,
          timestamp: new Date().toISOString(),
          opciones: response.opciones,
        });
        avanzarFase(); // Move from inicio to tipo_negocio
      }, 500);
    }
  }, []);

  const sendMessage = (texto: string) => {
    // Add user message
    const userMsg: MensajeChat = {
      id: crypto.randomUUID(),
      rol: "usuario",
      contenido: texto,
      timestamp: new Date().toISOString(),
    };
    agregarMensaje(userMsg);

    // Show typing indicator
    setCargando(true);

    const faseActual = progreso.fase_actual;
    const maxSubSteps = FASE_SUBSTEPS[faseActual] || 1;
    subStepRef.current += 1;

    setTimeout(() => {
      const shouldAdvance = subStepRef.current >= maxSubSteps;

      if (shouldAdvance) {
        subStepRef.current = 0;

        // If activation phase and user says activate
        if (faseActual === "activacion" && (texto.includes("activar") || texto === "activar")) {
          actualizarNegocio(idNegocio, {
            estado: "activo",
            nombre: "Mi Negocio",
            url_tienda: `/tienda/${idNegocio}`,
          });

          agregarMensaje({
            id: crypto.randomUUID(),
            rol: "bot",
            contenido:
              "🚀 ¡Felicidades! Tu negocio ha sido activado exitosamente.\n\n🔗 Tu tienda está disponible en:\nmaketai.com/tienda/" +
              idNegocio.slice(0, 8) +
              "\n\nPuedes volver al dashboard para gestionar tu negocio o visitar tu nueva tienda.",
            timestamp: new Date().toISOString(),
          });
          setCargando(false);
          return;
        }

        // Advance to next phase
        avanzarFase();

        // Get next phase response
        const nextFase = progreso.fase_actual;
        // We need the next one after advancing
        const faseIndex =
          [
            "inicio",
            "tipo_negocio",
            "plantilla",
            "marca",
            "personalizacion",
            "catalogo",
            "reglas_dominio",
            "agentes",
            "comercial",
            "automatizaciones",
            "activacion",
          ].indexOf(faseActual) + 1;
        const siguienteFase = [
          "inicio",
          "tipo_negocio",
          "plantilla",
          "marca",
          "personalizacion",
          "catalogo",
          "reglas_dominio",
          "agentes",
          "comercial",
          "automatizaciones",
          "activacion",
        ][faseIndex] as FaseConstructor;

        const response = getBotResponse(siguienteFase || faseActual, texto);

        agregarMensaje({
          id: crypto.randomUUID(),
          rol: "bot",
          contenido: response.contenido,
          timestamp: new Date().toISOString(),
          opciones: response.opciones,
        });
      } else {
        // Sub-step response
        let subResponse = "";
        if (faseActual === "tipo_negocio") {
          subResponse =
            "Perfecto, productos " + texto + ". ¿Venderás a nivel local o internacional?";
        } else if (faseActual === "marca") {
          if (subStepRef.current === 1) {
            subResponse = `¡"${texto}" es un gran nombre! ¿Tienes un slogan? Si no, puedo sugerirte uno.`;
          } else {
            subResponse = "Excelente. ¿Qué colores representan tu marca? Puedo sugerirte paletas.";
          }
        } else if (faseActual === "agentes") {
          subResponse = `Perfecto, ${texto} será tu agente de ventas. ¿Y cómo quieres que se llame tu agente administrador?`;
        } else {
          subResponse = "Entendido. Continuemos con el siguiente punto.";
        }

        agregarMensaje({
          id: crypto.randomUUID(),
          rol: "bot",
          contenido: subResponse,
          timestamp: new Date().toISOString(),
        });
      }

      setCargando(false);
    }, 1000);
  };

  const handleOptionClick = (valor: string) => {
    sendMessage(valor);
  };

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
