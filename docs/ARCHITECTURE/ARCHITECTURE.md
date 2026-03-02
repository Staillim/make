# 🏗️ ARQUITECTURA DE SOFTWARE — Maket AI

> Documentación técnica detallada de la arquitectura del sistema.

---

## Tabla de Contenidos

- [1. Visión General](#1-visión-general)
- [2. Arquitectura de Capas](#2-arquitectura-de-capas)
- [3. Flujo de Datos](#3-flujo-de-datos)
- [4. Sistema de Agentes IA](#4-sistema-de-agentes-ia)
- [5. Base de Datos](#5-base-de-datos)
- [6. Seguridad](#6-seguridad)
- [7. Escalabilidad](#7-escalabilidad)
- [8. Decisiones Arquitectónicas](#8-decisiones-arquitectónicas)

---

## 1. Visión General

Maket AI es una **plataforma SaaS multi-tenant** que permite crear negocios digitales completos mediante conversación con agentes de IA.

**Principios fundamentales:**
1. **Universal desde día 1:** Funciona para cualquier industria sin hardcoding.
2. **AI-first:** Los agentes son el core, no un add-on.
3. **Serverless-native:** Next.js API Routes → Netlify Functions.
4. **Database-driven:** Toda configuración en BD, cero archivos estáticos de negocio.
5. **Multi-tenant seguro:** RLS estricto en Supabase.

---

## 2. Arquitectura de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  - Next.js App Router (React 19)                            │
│  - Tailwind CSS v4                                          │
│  - Zustand State Management                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                      API LAYER (BFF)                         │
│  - Next.js API Routes → Netlify Functions                   │
│  - Authentication middleware                                 │
│  - Business logic orchestration                              │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┬──────────────┐
        │                         │              │
┌───────▼──────────┐  ┌──────────▼─────┐  ┌────▼──────────┐
│   AI SERVICES    │  │  DATA LAYER    │  │  AUTH LAYER   │
│  - OpenAI API    │  │  - Supabase    │  │  - JWT        │
│  - Gemini API    │  │  - PostgreSQL  │  │  - Cookies    │
│  - ClienteIA     │  │  - RLS         │  │  - Middleware │
└──────────────────┘  └────────────────┘  └───────────────┘
```

### Responsabilidades por Capa

| Capa | Responsabilidad | Tecnología |
|------|----------------|------------|
| **Presentation** | UI, UX, state local | React 19, Zustand |
| **API (BFF)** | Orquestación, validación, lógica de negocio | Next.js API Routes |
| **AI Services** | Generación de respuestas con contexto | OpenAI, Gemini |
| **Data** | Persistencia, queries, RLS | Supabase (PostgreSQL) |
| **Auth** | Autenticación, autorización | JWT + HTTP-only cookies |

---

## 3. Flujo de Datos

### 3.1. Creación de Negocio (Constructor Flow)

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. INICIO                                                        │
│    Usuario → Dashboard → Click "Crear Negocio"                  │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ↓ Redirect
┌──────────────────────────────────────────────────────────────────┐
│ 2. UI CONSTRUCTOR                                                 │
│    /dashboard/negocio/[id]/constructor                           │
│    - ChatWindow.tsx (controla conversación)                      │
│    - ProgressSidebar.tsx (6 fases visuales)                      │
│    - Estado: Zustand constructor-store                           │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ↓ Usuario escribe mensaje
┌──────────────────────────────────────────────────────────────────┐
│ 3. CLIENT LOGIC                                                   │
│    ChatWindow.callOrquestador()                                  │
│    - Detecta idioma: navigator.language.split("-")[0]           │
│    - Acumula historial: historialIaRef                           │
│    - Extrae info parcial: negocioParcialRef                      │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ↓ POST /api/constructor/orquestador
┌──────────────────────────────────────────────────────────────────┐
│ 4. API ROUTE                                                      │
│    src/app/api/constructor/orquestador/route.ts                  │
│    - Recibe: mensaje, historial, fase_actual, idioma            │
│    - Genera prompt: generarPromptOrquestador(contexto)          │
│    - Llama IA: ClienteIA.generarRespuesta()                     │
│    - Parsea marcadores: [[AVANZAR_FASE]], [[ACTIVAR_NEGOCIO]]   │
│    - Extrae info: extraerInformacionNegocio()                   │
└──────┬───────────────────────────────────────────────────────────┘
       │
       │ Si [[ACTIVAR_NEGOCIO]]
       ↓
┌──────────────────────────────────────────────────────────────────┐
│ 5. DATABASE WRITE                                                 │
│    Supabase Transactions:                                        │
│    1. INSERT negocios (estado: activo)                          │
│    2. INSERT marca (colores, logo, estilo)                      │
│    3. INSERT tema (tipografía, espaciado)                       │
│    4. INSERT categorias (múltiples)                             │
│    5. INSERT productos (múltiples)                              │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ↓ Retorna respuesta + flags
┌──────────────────────────────────────────────────────────────────┐
│ 6. UI UPDATE                                                      │
│    ChatWindow procesa respuesta:                                 │
│    - Si avanzar_fase → avanzarFase() (Zustand)                  │
│    - Si negocio_activado → actualizarNegocio() + redirect       │
│    - Muestra respuesta limpia (sin marcadores)                   │
└──────────────────────────────────────────────────────────────────┘
       │
       ↓ Negocio activo
┌──────────────────────────────────────────────────────────────────┐
│ 7. TIENDA DISPONIBLE                                              │
│    /tienda/[id_negocio] → ISR cada 60s                          │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2. Atención al Cliente (Vendedor Flow)

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. CLIENTE VISITA TIENDA                                          │
│    GET /tienda/[id_negocio]                                      │
│    - Server Component (Next.js)                                  │
│    - ISR: revalidate 60s                                         │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ↓ Promise.all (paralelo)
┌──────────────────────────────────────────────────────────────────┐
│ 2. LOAD DATA                                                      │
│    Supabase queries (5 en paralelo):                             │
│    ├── negocios.single()                                         │
│    ├── marca.single()                                            │
│    ├── tema.single()                                             │
│    ├── categorias.select()                                       │
│    └── productos.select()                                        │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ↓ Si !negocio → notFound()
┌──────────────────────────────────────────────────────────────────┐
│ 3. RENDER STOREFRONT                                              │
│    - Hero con brand colors (marca.color_primario)               │
│    - Grid de productos con emojis                                │
│    - Chat widget flotante (próximamente)                        │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ↓ Cliente envía mensaje en chat
┌──────────────────────────────────────────────────────────────────┐
│ 4. VENDEDOR API                                                   │
│    POST /api/constructor/mensaje                                 │
│    - Carga negocio + productos                                   │
│    - Obtiene template vendedor según tipo_negocio               │
│    - Inyecta catálogo: inyectarCatalogo(prompt, productos)      │
│    - Carga perfil cliente (si existe)                           │
│    - Carga notas previas: obtenerNotasAgente()                  │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ↓ Genera respuesta
┌──────────────────────────────────────────────────────────────────┐
│ 5. AI GENERATION                                                  │
│    ClienteIA.generarRespuesta()                                  │
│    - Contexto completo: template + catálogo + perfil + notas    │
│    - Respuesta puede incluir: [[NOTA_AGENTE:{...}]]             │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ↓ Procesa marcadores
┌──────────────────────────────────────────────────────────────────┐
│ 6. SAVE NOTES                                                     │
│    procesarNotasDeRespuesta()                                    │
│    - Regex: /\[\[NOTA_AGENTE:(.*?)\]\]/gi                       │
│    - Parse JSON: tipo, contenido, contexto_adicional            │
│    - INSERT notas_agente                                         │
│    - Retorna respuesta limpia                                    │
└──────┬───────────────────────────────────────────────────────────┘
       │
       ↓ Retorna al cliente
┌──────────────────────────────────────────────────────────────────┐
│ 7. UI CHAT UPDATE                                                 │
│    Muestra respuesta del vendedor                                │
│    (sin marcadores visibles)                                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Sistema de Agentes IA

### 4.1. Arquitectura de Agentes

```
┌─────────────────────────────────────────────────────────────────┐
│                   BIBLIOTECA DE TEMPLATES                        │
│                   src/lib/templates/                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CONSTRUCTOR (Orquestador)                                       │
│  ├── constructor.ts → generarPromptOrquestador()                │
│  └── 6 fases: descubrimiento → productos → identidad →          │
│      operaciones → agentes → activacion                          │
│                                                                  │
│  VENDEDOR                                                        │
│  ├── vendedor/index.ts → obtenerTemplateVendedor()             │
│  ├── restaurante.ts → María (mesera)                           │
│  ├── tienda_ropa.ts → Sofía (asesora de moda)                  │
│  ├── tecnologia.ts → Alex (experto tech)                       │
│  ├── gimnasio.ts → Coach Mike                                  │
│  ├── educacion.ts → Prof. Ana                                  │
│  ├── servicios.ts → Luna                                       │
│  ├── agente-universal.ts → Fallback para cualquier industria   │
│  └── _base.ts → Template genérico                              │
│                                                                  │
│  ADMINISTRADOR                                                   │
│  └── admin/admin-universal.ts → Max (gestión autónoma)         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DETECCIÓN AUTOMÁTICA                          │
│                   src/lib/utils/industria.ts                     │
│                                                                  │
│  detectarIndustria(tipo_negocio: string)                        │
│  ├── Analiza keywords (ej: "hamburguesa" → restaurante)        │
│  ├── 12 industrias predefinidas                                │
│  └── Retorna: { emoji, label, colorClase }                     │
└─────────────────────────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    INYECCIÓN DINÁMICA                            │
│                                                                  │
│  inyectarCatalogo(prompt: string, productos: Producto[])        │
│  ├── Reemplaza {{PRODUCTOS_CATALOGO}}                          │
│  ├── Formato: "- Producto X: $precio (descripción)"            │
│  └── El agente CONOCE exactamente qué vende                     │
│                                                                  │
│  inyectarPerfil(prompt: string, perfil: PerfilCliente)          │
│  ├── Reemplaza {{PERFIL_CLIENTE}}                              │
│  └── Personalización basada en preferencias aprendidas          │
└─────────────────────────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MEMORIA PERSISTENTE                           │
│                   src/lib/agentes/notas-agente.ts                │
│                                                                  │
│  Protocolo:                                                      │
│  1. Agente incluye: [[NOTA_AGENTE:{"tipo":"preferencia",...}]] │
│  2. API extrae con regex                                        │
│  3. INSERT en tabla notas_agente                                │
│  4. Próxima conversación: carga notas relevantes                │
│                                                                  │
│  Tipos de nota:                                                  │
│  ├── preferencia → Gustos del cliente                           │
│  ├── contexto → Situación del negocio                          │
│  ├── recordatorio → Para seguimiento                            │
│  └── alerta → Requiere atención                                │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2. Protocolo de Marcadores

Los agentes IA incrustan marcadores invisibles en sus respuestas que el API procesa antes de devolver al cliente:

| Marcador | Ejemplo | Efecto |
| -------- | ------- | ------ |
| `[[AVANZAR_FASE]]` | `"Perfecto, tengo todo. [[AVANZAR_FASE]]"` | Sidebar avanza a la siguiente fase |
| `[[ACTIVAR_NEGOCIO]]` | `"¡Listo! [[ACTIVAR_NEGOCIO]]"` | Crea negocio activo en BD |
| `[[OPCIONES:[...]]]` | `[[OPCIONES:["Ropa","Comida"]]]` | Frontend muestra botones rápidos |
| `[[NOTA_AGENTE:{...}]]` | `[[NOTA_AGENTE:{"tipo":"preferencia","contenido":"Prefiere café negro"}]]` | Guarda en notas_agente |

**Procesamiento:**

```typescript
// 1. Parsear marcador
function parsearAvanzarFase(texto: string) {
  const avanzar = /\[\[AVANZAR_FASE\]\]/i.test(texto);
  return {
    texto: texto.replace(/\[\[AVANZAR_FASE\]\]/gi, "").trim(),
    avanzar
  };
}

// 2. Aplicar lógica
const { texto, avanzar } = parsearAvanzarFase(respuesta_ia);
if (avanzar) {
  // Actualizar fase en BD o estado
}

// 3. Retornar texto limpio al cliente
return { respuesta: texto, avanzar_fase: avanzar };
```

---

## 5. Base de Datos

### 5.1. Esquema Lógico

```
┌───────────────────┐
│     usuarios      │
├───────────────────┤
│ id_usuario (PK)   │──┐
│ nombre            │  │
│ email (UNIQUE)    │  │
│ password_hash     │  │
│ plan              │  │
│ fecha_registro    │  │
└───────────────────┘  │
                       │ 1:N
                       │
┌───────────────────┐  │
│     negocios      │◄─┘
├───────────────────┤
│ id_negocio (PK)   │──┬──────────────┐
│ id_usuario (FK)   │  │              │
│ nombre            │  │              │
│ tipo_negocio      │  │              │
│ url_tienda        │  │              │
│ estado            │  │              │
└───────────────────┘  │              │
                       │ 1:1          │ 1:N
                       │              │
        ┌──────────────┴─┐   ┌────────▼──────────┐
        │     marca      │   │    categorias     │
        ├────────────────┤   ├───────────────────┤
        │ id_marca (PK)  │   │ id_categoria (PK) │
        │ id_negocio(FK) │   │ id_negocio (FK)   │
        │ nombre_negocio │   │ nombre            │
        │ slogan         │   │ descripcion       │
        │ color_primario │   │ emoji             │
        │ logo_url       │   └───────────┬───────┘
        └────────────────┘               │ 1:N
                                         │
        ┌──────────────────┐   ┌─────────▼─────────┐
        │      tema        │   │    productos      │
        ├──────────────────┤   ├───────────────────┤
        │ id_tema (PK)     │   │ id_producto (PK)  │
        │ id_negocio (FK)  │   │ id_negocio (FK)   │
        │ tipografia       │   │ id_categoria (FK) │
        │ espaciado        │   │ nombre            │
        │ config_colores   │   │ descripcion       │
        └──────────────────┘   │ precio            │
                               │ imagenes (ARRAY)  │
                               │ stock             │
                               └───────────────────┘

        ┌──────────────────┐
        │  notas_agente    │
        ├──────────────────┤
        │ id_nota (PK)     │
        │ id_negocio (FK)  │
        │ tipo_agente      │
        │ tipo_nota        │
        │ contenido        │
        │ contexto_adicional (JSON)
        │ archivada        │
        │ fecha_creacion   │
        └──────────────────┘
```

### 5.2. Índices y Performance

```sql
-- Índices automáticos (PKs + FKs)
CREATE INDEX idx_negocios_usuario ON negocios(id_usuario);
CREATE INDEX idx_productos_negocio ON productos(id_negocio);
CREATE INDEX idx_productos_categoria ON productos(id_categoria);
CREATE INDEX idx_notas_negocio ON notas_agente(id_negocio);

-- Índices para queries frecuentes
CREATE INDEX idx_productos_activo ON productos(activo) WHERE activo = true;
CREATE INDEX idx_negocios_estado ON negocios(estado) WHERE estado = 'activo';
CREATE INDEX idx_notas_fecha ON notas_agente(fecha_creacion DESC);
```

### 5.3. Constraints y Validaciones

```sql
-- Tipo de negocio debe ser válido
ALTER TABLE negocios ADD CONSTRAINT check_tipo_negocio
  CHECK (tipo_negocio IN (
    'restaurante', 'tienda_ropa', 'tecnologia', 'gimnasio',
    'educacion', 'servicios', 'salud', 'belleza', 'hogar',
    'mascotas', 'arte', 'otro'
  ));

-- Estado del negocio
ALTER TABLE negocios ADD CONSTRAINT check_estado
  CHECK (estado IN ('borrador', 'configurando', 'activo', 'pausado'));

-- Tipo de agente
ALTER TABLE notas_agente ADD CONSTRAINT check_tipo_agente
  CHECK (tipo_agente IN ('vendedor', 'administrador', 'marketing', 'orquestador'));

-- Precio positivo
ALTER TABLE productos ADD CONSTRAINT check_precio_positivo
  CHECK (precio >= 0);
```

---

## 6. Seguridad

### 6.1. Autenticación (Auth Flow)

```
┌──────────────────────────────────────────────────────────────┐
│ 1. REGISTRO                                                   │
│    POST /api/auth/register                                   │
│    ├── Valida email único                                    │
│    ├── Hash password: bcrypt.hash(password, 12)             │
│    ├── INSERT usuarios                                       │
│    └── Genera JWT: sign({ id_usuario, email }, SECRET, 7d)  │
└──────┬───────────────────────────────────────────────────────┘
       │
       ↓ setHttpOnlyCookie()
┌──────────────────────────────────────────────────────────────┐
│ 2. COOKIE SEGURA                                              │
│    response.cookies.set('auth_token', jwt, {                 │
│      httpOnly: true,     // No accesible desde JS            │
│      secure: true,       // Solo HTTPS en producción         │
│      sameSite: 'lax',   // Protección CSRF                   │
│      maxAge: 604800      // 7 días                          │
│    })                                                         │
└──────┬───────────────────────────────────────────────────────┘
       │
       ↓ Redirect /dashboard
┌──────────────────────────────────────────────────────────────┐
│ 3. MIDDLEWARE PROTECTION                                      │
│    src/middleware.ts                                         │
│    - Se ejecuta en TODAS las requests                        │
│    - Rutas protegidas: /dashboard/*                          │
│    - Verifica cookie auth_token                              │
│    - Si no válido → redirect /login                          │
└──────────────────────────────────────────────────────────────┘
```

### 6.2. Row Level Security (RLS)

**Políticas implementadas en Supabase:**

```sql
-- 1. Usuarios solo ven sus propios negocios
CREATE POLICY "usuarios_own_negocios"
  ON negocios FOR ALL
  USING (auth.uid() = id_usuario);

-- 2. Productos visibles públicamente si negocio activo
CREATE POLICY "productos_public_read"
  ON productos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM negocios
      WHERE negocios.id_negocio = productos.id_negocio
      AND negocios.estado = 'activo'
    )
  );

-- 3. Solo dueño puede modificar productos
CREATE POLICY "productos_owner_write"
  ON productos FOR INSERT, UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM negocios
      WHERE negocios.id_negocio = productos.id_negocio
      AND negocios.id_usuario = auth.uid()
    )
  );

-- 4. Notas de agentes solo para dueño del negocio
CREATE POLICY "notas_owner_only"
  ON notas_agente FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM negocios
      WHERE negocios.id_negocio = notas_agente.id_negocio
      AND negocios.id_usuario = auth.uid()
    )
  );
```

### 6.3. Secrets Management

```bash
# .env.local (NUNCA commitear)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  # Seguro: limitado por RLS
SUPABASE_SERVICE_ROLE_KEY=...      # PELIGROSO: bypass RLS, solo servidor
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=...
NEXTAUTH_SECRET=...  # Generado con: openssl rand -base64 32
```

**En producción (Netlify):**
- Variables en `Site Settings → Environment Variables`
- Rotación de secrets cada 90 días
- Service role key NUNCA expuesto al frontend

---

## 7. Escalabilidad

### 7.1. Horizontal Scaling

```
                      ┌──────────────┐
                      │   Netlify    │
                      │  Edge CDN    │
                      └──────┬───────┘
                             │ Global distribution
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐         ┌─────▼────┐        ┌─────▼────┐
   │ Region  │         │ Region   │        │ Region   │
   │   US    │         │   EU     │        │   APAC   │
   └────┬────┘         └─────┬────┘        └─────┬────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                      ┌──────▼───────┐
                      │  Supabase    │
                      │ PostgreSQL   │
                      │ (región única)│
                      └──────────────┘
```

**Optimizaciones:**
- **ISR (Incremental Static Regeneration):** Tiendas públicas regeneradas cada 60s
- **Edge Caching:** Netlify CDN cachea assets estáticos
- **Database Connection Pooling:** Supabase Pooler (PgBouncer)
- **Lazy Loading:** Componentes React cargados on-demand

### 7.2. Vertical Scaling (Database)

**Plan de crecimiento:**

| Usuarios | Negocios | Productos | Supabase Plan | CPU/RAM |
|----------|----------|-----------|---------------|---------|
| 0-100 | 0-500 | 0-5K | Free | 0.5 CPU / 1GB |
| 100-1K | 500-5K | 5K-50K | Pro | 2 CPU / 4GB |
| 1K-10K | 5K-50K | 50K-500K | Team | 4 CPU / 8GB |
| 10K+ | 50K+ | 500K+ | Enterprise | Custom |

**Triggers de escalado:**
- Query latency > 500ms promedio
- Connection pool utilization > 80%
- Disk usage > 80%

---

## 8. Decisiones Arquitectónicas

### 8.1. Por qué Next.js App Router (no Pages Router)

**Pros:**
- Server Components por defecto → menos JS al cliente
- Layouts anidados → menos re-renders
- Streaming SSR → mejor perceived performance
- API Routes como Serverless Functions

**Contras:**
- Curva de aprendizaje más empinada
- Algunos paquetes aún no compatibles con RSC

**Decisión:** Los pros superan los contras para un SaaS moderno.

### 8.2. Por qué Supabase (no Firebase o MongoDB)

**Pros:**
- PostgreSQL (SQL robusto, ACID)
- RLS nativo (multi-tenant seguro)
- Auth incluido
- Real-time subscriptions (futuro)
- Edge Functions (alternativa a Netlify)

**Contras:**
- Vendor lock-in moderado
- Requiere aprender PostgreSQL

**Decisión:** RLS + SQL > NoSQL para este caso de uso.

### 8.3. Por qué Zustand (no Redux o Context API)

**Pros:**
- API minimal (< 50 líneas la mayoría de stores)
- No requiere Provider wrapping
- TypeScript excellent support
- Devtools soporte

**Contras:**
- Menos maduro que Redux
- Comunidad más pequeña

**Decisión:** Simplicidad > ecosystem size para un proyecto ágil.

### 8.4. Por qué Tailwind CSS v4 (no CSS Modules)

**Pros:**
- Utility-first → desarrollo rápido
- JIT compiler → CSS bundle pequeño
- Design system consistente
- Responsive design trivial

**Contras:**
- HTML "verboso"
- Requiere purge config

**Decisión:** Velocidad de desarrollo > "clean HTML".

---

**Última actualización:** Marzo 2026  
**Mantenedor:** Equipo Maket AI  
**Contacto:** Ver [CONTRIBUTING.md](CONTRIBUTING.md)
