# MAKET AI — BLUEPRINT TÉCNICO
> Fuente única de verdad. Actualizado: Marzo 2026

---

## 1. Visión
SaaS multi-tenant donde cualquier emprendedor crea su negocio digital completo en una conversación. El Orquestador recopila la información, la guarda en Supabase, y la tienda pública funciona automáticamente en `/tienda/[id_negocio]`.

**Principio de diseño:** TODO funciona para CUALQUIER industria (ropa, restaurante, gym, tech, artesanías, servicios, etc.). Cero hardcoding por industria.

---

## 2. Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 15 (App Router) + React 19 + TypeScript |
| Estilos | Tailwind CSS v4 (canonical: `bg-linear-to-*`) |
| Backend | Next.js API Routes |
| Base de datos | Supabase (PostgreSQL + RLS) |
| IA | OpenAI GPT-4o-mini / Google Gemini 1.5-flash (via `ClienteIA`) |
| Estado | Zustand (`auth-store`, `constructor-store`, `negocio-store`) |
| Hosting | Netlify (config: `netlify.toml`) |

---

## 3. Arquitectura de Agentes

```
Usuario → ChatWindow → /api/constructor/orquestador  ← Agente Constructor
                                ↓ (guardar progreso)
                         construccion_progreso (Supabase)
                                ↓ (activar negocio)
                         negocios + marca + tema + categorias + productos

Cliente final → /tienda/[id_negocio]  ← carga real desde Supabase
                                ↓ (chat flotante)
               /api/constructor/mensaje  ← Agente Vendedor (con notas)
               /api/administrador       ← Agente Admin (con notas)

Memoria persistente de agentes → notas_agente (tabla)
   Protocolo: [[NOTA_AGENTE:{...}]] en respuesta → extraído y guardado
```

---

## 4. Estado Actual del Código

| Componente | Estado | Ruta |
|------------|--------|------|
| Auth (login/registro) | ✅ Operativo | `(auth)/` |
| Dashboard | ✅ UI lista | `(dashboard)/dashboard/` |
| Constructor UI | ✅ Conectado a IA real | `ChatWindow.tsx` |
| Orquestador API | ✅ Con activación y marcadores | `/api/constructor/orquestador` |
| Tienda pública | ✅ BD real + universal | `/tienda/[id_negocio]/` |
| Agente Vendedor | ✅ Con notas persistentes | `/api/constructor/mensaje` |
| Agente Admin | ✅ Con notas persistentes | `/api/administrador` |
| Sistema de Notas | ✅ Completo | `src/lib/agentes/notas-agente.ts` |
| API Notas | ✅ CRUD REST | `/api/agentes/notas` |
| Industry Helper | ✅ Universal | `src/lib/utils/industria.ts` |
| Templates Vendedor | ✅ | `src/lib/templates/vendedor.ts` |
| Templates Admin | ✅ | `src/lib/templates/admin-universal.ts` |
| Templates Constructor | ✅ | `src/lib/templates/constructor.ts` |
| CRM | ✅ Básico | `src/lib/crm/` |

---

## 5. Protocolo de Marcadores (Agentes IA)

Los agentes incluyen marcadores en su respuesta que el API extrae antes de devolver texto al cliente:

| Marcador | Quién lo usa | Efecto |
|----------|-------------|--------|
| `[[AVANZAR_FASE]]` | Orquestador | Avanza la UI al siguiente paso |
| `[[ACTIVAR_NEGOCIO]]` | Orquestador | Crea negocio activo en BD |
| `[[OPCIONES:["a","b"]]]` | Orquestador | Envía opciones rápidas al frontend |
| `[[NOTA_AGENTE:{...}]]` | Vendedor / Admin | Guarda nota en `notas_agente` |

---

## 6. Flujo de Creación de Negocio (Universal)

```
1. Usuario inicia constructor → ChatWindow llama /api/constructor/orquestador
2. Orquestador guía (6 fases): descubrimiento → productos → identidad → operaciones → agentes → activacion
3. Cada respuesta del usuario extrae JSON estructurado (tipo_negocio, nombre, etc.)
4. [[AVANZAR_FASE]] → el sidebar del constructor avanza
5. [[ACTIVAR_NEGOCIO]] → API escribe en: negocios + marca + tema → estado: "activo"
6. Tienda disponible inmediatamente en /tienda/[id_negocio]
7. Agente vendedor ligado al negocio, lee su configuración desde BD
```

---

## 7. Esquema de Base de Datos

```
negocios          → PK: id_negocio, nombre, estado, url_tienda
usuarios          → PK: id_usuario, nombre, email, plan
marca             → FK: id_negocio | nombre_negocio, slogan, color_primario, estilo_visual
tema              → FK: id_negocio | tipo_negocio, categoria_principal, tipo_producto, alcance
categorias        → FK: id_negocio | nombre, orden
productos         → FK: id_negocio + id_categoria | nombre, precio, stock, imagenes, variantes
configuracion_visual → FK: id_negocio + id_plantilla | configuracion (JSON)
construccion_progreso → FK: id_negocio | fase_actual, negocio_parcial, historial_mensajes
notas_agente      → FK: id_negocio | tipo_agente, contenido, importancia, categoria, tags
```

**Migraciones pendientes de ejecutar en Supabase:**
- `schema-notas-agente.sql` — tabla `notas_agente` + ENUMs + RLS
- `schema-construccion-progreso.sql` — tabla `construccion_progreso`

---

## 8. Próximos Pasos (Prioridad)

### Semana 1 — Funcionalidad Core
1. **[DB]** Ejecutar `schema-notas-agente.sql` y `schema-construccion-progreso.sql` en Supabase dashboard
2. **[Tienda]** Implementar carrito de compras con estado en Zustand (`cart-store.ts`)
3. **[Constructor]** Guardar categorías y productos iniciales al activar el negocio (ampliar lógica en orquestador route `[[ACTIVAR_NEGOCIO]]`)
4. **[Auth]** Usar Supabase Auth en lugar del sistema JWT custom

### Semana 2 — Experiencia de Usuario
5. **[Tienda]** Chat widget funcional (conectar botón flotante al Agente Vendedor)
6. **[Dashboard]** Listar negocios desde BD real (ya existe `useNegocios` hook — verificar)
7. **[Pages]** Página de edición `/dashboard/negocio/[id]/editar` → conectar al Admin agent
8. **[UI]** Página de preview de tienda antes de activar

### Semana 3 — Escala y Producción
9. **[Escala]** Mover prompts de agentes a tabla `agent_templates` en BD (versionados por tipo_negocio)
10. **[Analytics]** Tabla `eventos_tienda` — clics, vistas, conversiones
11. **[CRM]** Completar `customer_profiles` y `conversaciones` (eliminar referencia a `sesiones_constructor` inexistente en `ejemplo-integracion.ts`)
12. **[Pagos]** Stripe integration en tienda pública
13. **[Landing]** Activar y conectar landing page pública con demo por industria

---

## 9. Variables de Entorno Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=          # O usar Gemini
GEMINI_API_KEY=          # Alternativa / complemento
```

---

## 10. Convenciones de Escalabilidad

- **Industrias**: siempre usar `detectarIndustria(tipo_negocio)` de `src/lib/utils/industria.ts` — nunca hardcode Industry-specific strings.
- **Agentes**: para agregar un nuevo agente (ej: "marketing"), solo agregar a `TipoAgente` en `notas-agente.ts` y crear su template y route.
- **Tienda**: toda la tienda pública lee 100% de BD — cambiar datos en BD = cambio instantáneo en tienda (con ISR 60s).
- **Multi-tenant**: cada query a Supabase filtra por `id_negocio`. RLS refuerza esto en BD.

---

## 11. Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/lib/utils/industria.ts` | Detección universal de industria → emoji, color, label |
| `src/lib/agentes/notas-agente.ts` | Sistema de memoria persistente de agentes |
| `src/lib/templates/constructor.ts` | Prompt del Orquestador con marcadores |
| `src/lib/templates/vendedor.ts` | Template del Agente Vendedor por industria |
| `src/lib/ia/cliente-ia.ts` | Cliente IA unificado (OpenAI + Gemini) |
| `src/lib/crm/` | CRM básico (perfiles, conversaciones) |
| `schema-notas-agente.sql` | Migración: tabla notas_agente |
| `schema-construccion-progreso.sql` | Migración: tabla construccion_progreso |
