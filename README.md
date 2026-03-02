# Maket AI  Universal AI Business Platform

Turn any business idea into a live online store with an AI sales agent  in minutes.  
Supports any industry, any language, from day one.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) + React 19 |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| AI | OpenAI GPT-4o-mini / Google Gemini 1.5-flash |
| State | Zustand |
| Deploy | Netlify |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
# OPENAI_API_KEY or GOOGLE_AI_API_KEY

# 3. Run DB migrations in Supabase SQL editor:
#    supabase-schema.sql
#    schema-notas-agente.sql
#    schema-construccion-progreso.sql

# 4. Start dev server
npm run dev
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI  at least one required
OPENAI_API_KEY=
GOOGLE_AI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Project Structure

```
src/
  app/
    (auth)/           Login & Register pages
    (dashboard)/      Owner dashboard (create / manage businesses)
    api/
      auth/           Login, Register endpoints
      constructor/
        orquestador/  AI agent that builds the business (6-phase flow)
        mensaje/      AI sales agent (vendedor) for the storefront
      negocios/       CRUD: list, create, activate businesses
    tienda/[id]/      Public storefront (ISR, loaded from DB)
  components/
    constructor/      ChatWindow, ChatInput, ProgressSidebar
    dashboard/        BusinessCard, BusinessList, Header, Sidebar
    landing/          Hero, Features, Pricing, Testimonials, Navbar
  lib/
    ia/               Unified AI client (OpenAI + Gemini)
    templates/
      constructor.ts  Universal orquestador prompt (all industries)
      vendedor/       Vendedor agent per industry + universal fallback
    agentes/
      notas-agente.ts  Persistent agent memory (notes system)
    utils/
      industria.ts    Industry detector + emoji helpers
    crm/              Client profiling & conversation history
    store/            Zustand stores (auth, negocio, constructor)
```

---

## Architecture

See [BLUEPRINT.md](BLUEPRINT.md) for the full architecture, database schema, agent protocol, marker system, and 14-day roadmap.

---

## Key Features

- **Universal Constructor**  AI-guided 6-phase business setup for any industry
- **Live Storefront**  Auto-generated tienda with ISR, brand colors, product catalog
- **AI Vendedor**  Sales agent customized per industry, supports agent memory (notes)
- **Multilanguage**  Detects `navigator.language`; responds in the user's language
- **Agent Memory**  `[[NOTA_AGENTE:{...}]]` markers persist key facts across sessions
- **CRM**  Client profiles, session history, purchase tracking

---

## API Reference

### `POST /api/constructor/orquestador`
Drives the 6-phase business creation flow.

```json
{
  "id_negocio": "uuid | null",
  "mensaje": "string",
  "historial_mensajes": [],
  "negocio_parcial": {},
  "fase_actual": "descubrimiento | productos | identidad | operaciones | agentes | activacion",
  "es_inicio": false,
  "idioma": "es"
}
```

Response markers parsed server-side: `[[AVANZAR_FASE]]`, `[[ACTIVAR_NEGOCIO]]`, `[[OPCIONES:[...]]]`

### `POST /api/constructor/mensaje`
Vendedor AI agent for the storefront chat widget.

```json
{
  "id_negocio": "uuid",
  "fase": "vendedor",
  "mensaje": "string",
  "historial_mensajes": [],
  "email_cliente": "optional",
  "idioma": "es"
}
```

---

## 14-Day Roadmap

| Day | Milestone |
|-----|-----------|
| 1 | Run DB migrations, verify Supabase connection |
| 2 | Auth flow end-to-end (register  dashboard) |
| 3 | Orquestador creates a real negocio in DB |
| 4 | Tienda loads correctly for the new negocio |
| 5 | Cart store + checkout flow (basic) |
| 7 | Vendedor chat widget on tienda |
| 10 | Agent memory (notas) verified in production |
| 12 | Google OAuth + UI polish |
| 14 | Deploy to Netlify  first live demo |

See [BLUEPRINT.md](BLUEPRINT.md) for detailed task breakdown.
