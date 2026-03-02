#  Maket AI  Plataforma SaaS Multi-Negocio con IA

**La plataforma que permite a cualquier emprendedor crear y gestionar negocios autónomos con agentes de IA especializados.**

> Turn any business idea into a live online store with AI agents  in minutes.  
> Supports **any industry**, **any language**, from day one.

---

##  Índice

- [ Maket AI  Plataforma SaaS Multi-Negocio con IA](#-maket-ai--plataforma-saas-multi-negocio-con-ia)
  - [ Índice](#-índice)
  - [ La Visión](#-la-visión)
  - [ Características Principales](#-características-principales)
  - [ Arquitectura Multi-Tenant](#-arquitectura-multi-tenant)
  - [ Documentación Completa](#-documentación-completa)
  - [🔍 Estado del Proyecto (STATUS.md)](#-estado-del-proyecto)
  - [ Stack Tecnológico](#-stack-tecnológico)
  - [ Configuración y Deploy](#-configuración-y-deploy)
  - [ Estructura del Proyecto](#-estructura-del-proyecto)
  - [ Sistema de Agentes IA](#-sistema-de-agentes-ia)
  - [ Base de Datos](#-base-de-datos)
  - [ Arquitectura de Software](#-arquitectura-de-software)
  - [ API Reference](#-api-reference)
  - [ Autenticación y Seguridad](#-autenticación-y-seguridad)
  - [ Roadmap (14 días)](#-roadmap-14-días)
  - [ Testing](#-testing)
  - [ Contribuir](#-contribuir)
  - [ Licencia](#-licencia)

---

##  La Visión

Maket AI no está limitada a un solo tipo de negocio. Es una **plataforma modular y escalable** que se adapta automáticamente a diferentes industrias:

-  **Restaurantes**  Agente vendedor estilo "María" (toma pedidos, sugiere combos)
-  **Tiendas de ropa**  Agente vendedor estilo "Sofía" (asesora moda, crea outfits)
-  **Tecnología**  Agente vendedor técnico "Alex" (especificaciones, compatibilidad)
-  **Gimnasios**  Coach Mike (planes de entrenamiento, membresías)
-  **Educación**  Prof. Ana (cursos, tutorías)
-  **Servicios**  Luna (consultoría, agendamiento)
-  **Cualquier industria**  Sistema universal con detección automática

**Cada negocio obtiene agentes de IA que aprenden y se especializan según su contexto, productos y clientes.**

---

##  Características Principales

 **Implementado** |  **En desarrollo** |  **Planeado**

-  **Agente Constructor (Orquestador)**: Chat IA que crea negocios paso a paso (6 fases)
-  **Agente Vendedor**: Especializado por industria, con plantillas + universal fallback
-  **Sistema de Notas Persistentes**: Memoria de agentes con `[[NOTA_AGENTE:{...}]]`
-  **Tiendas Públicas**: `/tienda/[id_negocio]` carga real desde Supabase (ISR 60s)
-  **Detección Automática de Industria**: 12 industrias reconocidas + universal
-  **Multilanguage**: Detecta `navigator.language`, responde en 13 idiomas
-  **Plantillas Dinámicas**: Templates personalizables por tipo de negocio
-  **Auth completo**: JWT + HTTP-only cookies + RLS en Supabase
-  **Sistema CRM**: Perfiles de clientes (estructura lista, integración pendiente)
-  **Agente Administrador**: Max (plantillas listas, endpoints pendientes)
-  **Agente Marketing**: Campañas automatizadas (diseño en progreso)
-  **Carrito de compras**: Store Zustand preparado, UI pendiente
-  **Checkout**: Integración con Stripe/MercadoPago

---

##  Arquitectura Multi-Tenant

Maket AI está diseñada como una **plataforma SaaS multi-tenant** que soporta múltiples usuarios, cada uno con múltiples negocios:

```
Usuario 1
   Negocio 1.1 (Restaurante)  3 agentes IA especializados
   Negocio 1.2 (Tienda ropa)  3 agentes IA especializados
   Negocio 1.3 (Tecnología)  3 agentes IA especializados

Usuario 2
   Negocio 2.1 (Servicios)  3 agentes IA especializados
   Negocio 2.2 (Restaurante)  3 agentes IA especializados
```

**Cada negocio está completamente aislado con:**

-  **RLS (Row Level Security)** en Supabase
-  **Agentes IA personalizados** según tipo de industria
-  **Configuración independiente** almacenada en BD
-  **Base de datos lógicamente dedicada** por negocio

 Ver: [ARQUITECTURA_MULTI_NEGOCIO.md](ARQUITECTURA_MULTI_NEGOCIO.md)

---

##  Documentación Completa

### 📁 Estructura Organizada

La documentación está organizada en `docs/` con subcarpetas temáticas:

#### 📌 **CORE** - Documentos Esenciales
| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [**STATUS.md**](docs/CORE/STATUS.md) | 🔍 **Análisis crítico completo** - 3,770 LoC verificadas, scoring 8.0/10, roadmap MVP 4 semanas | 🔥 **CRÍTICO** |
| [BLUEPRINT.md](docs/CORE/BLUEPRINT.md) | Single source of truth técnico | ✅ Actualizado |
| [CONTRIBUTING.md](docs/CORE/CONTRIBUTING.md) | Guía de contribución (400+ líneas, git workflow, standards) | ✅ Actualizado |

#### 🏗️ **ARCHITECTURE** - Arquitectura Técnica
| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [ARCHITECTURE.md](docs/ARCHITECTURE/ARCHITECTURE.md) | Arquitectura de software detallada (800+ líneas, capas, data flows, RLS) | ✅ Actualizado |
| [ARQUITECTURA_MULTI_NEGOCIO.md](docs/ARCHITECTURE/ARQUITECTURA_MULTI_NEGOCIO.md) | Arquitectura multi-tenant (sistema de negocio único por usuario) | ✅ Vigente |
| [API_REFERENCE.md](docs/ARCHITECTURE/API_REFERENCE.md) | Referencia completa de APIs (600+ líneas, endpoints, ejemplos) | ✅ Actualizado |

#### ⚙️ **FEATURES** - Funcionalidades Específicas
| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [AGENTES_UNIVERSALES.md](docs/FEATURES/AGENTES_UNIVERSALES.md) | Sistema de agentes universal (Orquestador, Vendedor, Admin) | ✅ Vigente |
| [CRM.md](docs/FEATURES/CRM.md) | Sistema CRM detallado (600+ líneas, perfiles, scoring) | 🎨 Diseño (30% implementado) |
| [CRM_ANALYTICS.md](docs/FEATURES/CRM_ANALYTICS.md) | Analytics avanzado (1,500+ líneas, ROI, CLV, campanhas) | 🎨 Diseño (10% implementado) |
| [MIS_NEGOCIOS_COMPLETADO.md](docs/FEATURES/MIS_NEGOCIOS_COMPLETADO.md) | Funcionalidades "Mis Negocios" | ✅ Completado |

#### 📖 **GUIDES** - Guías y Referencias
| Documento | Descripción | Estado |
|-----------|-------------|--------|
| [GOOGLE_OAUTH_SETUP.md](docs/GUIDES/GOOGLE_OAUTH_SETUP.md) | Setup Google OAuth (paso a paso) | 📖 Guía |
| [RLS_FIX_INSTRUCTIONS.md](docs/GUIDES/RLS_FIX_INSTRUCTIONS.md) | Fix RLS policies (troubleshooting) | 📖 Guía |
| [PLAN.md](docs/GUIDES/PLAN.md) | Roadmap original del proyecto (18 secciones) | 📚 Referencia histórica |

#### 💻 **Documentación Técnica Interna**
- [src/lib/templates/README.md](src/lib/templates/README.md) - Biblioteca de prompts de agentes
- [src/lib/templates/vendedor/CATALOGO.md](src/lib/templates/vendedor/CATALOGO.md) - Sistema de catálogo
- [src/lib/templates/admin/README.md](src/lib/templates/admin/README.md) - Agentes admin

---

##  Stack Tecnológico

| Capa | Tecnología | Versión | Estado |
|------|-----------|---------|--------|
| **Framework** | Next.js | 15 (App Router) |  |
| **UI Library** | React | 19 |  |
| **Language** | TypeScript | 5.x |  |
| **Styling** | Tailwind CSS | v4 |  |
| **Database** | Supabase | PostgreSQL 15 |  |
| **Auth** | Supabase Auth | JWT + Cookies |  |
| **AI** | OpenAI GPT-4o-mini | API |  |
| **AI Fallback** | Google Gemini | 1.5-flash |  |
| **State Management** | Zustand | 4.x |  |
| **Icons** | Lucide React | Latest |  |
| **Deployment** | Netlify | Edge Functions |  |

---

##  Configuración y Deploy

### 1. Clonar el repositorio

```bash
git clone https://github.com/Staillim/make.git
cd make
npm install
```

### 2. Configurar Supabase

**a) Crear proyecto en Supabase:**
- Ve a [supabase.com](https://supabase.com)
- Crea un nuevo proyecto
- Anota tu `URL` y `ANON KEY`

**b) Ejecutar migraciones SQL:**

En el SQL Editor de Supabase, ejecuta en orden:

1. `supabase-schema.sql`  Schema principal (usuarios, negocios, productos, etc.)
2. `schema-notas-agente.sql`  Sistema de memoria de agentes
3. `sql/schema-perfiles-clientes.sql`  Sistema CRM (opcional)

**c) Configurar variables de entorno:**

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# AI  al menos uno requerido
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000)

### 4. Deploy en Netlify

**a) Conectar repositorio:**
- Ve a [netlify.com](https://netlify.com)
- New Site from Git  Selecciona tu repo

**b) Configurar build:**

Netlify detectará automáticamente `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 20.x

**c) Variables de entorno:**

Site settings  Environment variables  Agrega las mismas del `.env.local`

**d) Deploy:**

Push a `master`  Deploy automático 

---

##  Estructura del Proyecto

```
make/
 src/
    app/                              # Next.js App Router
       (auth)/                       # Grupo de rutas autenticación
          login/page.tsx           #  Página de login
          registro/page.tsx        #  Página de registro
       (dashboard)/                  # Grupo de rutas dashboard
          layout.tsx               # Layout con sidebar + header
          dashboard/
              page.tsx             #  Dashboard principal (/dashboard)
              negocio/
                  [id]/
                     constructor/
                        page.tsx #  Chat constructor (6 fases)
                     editar/
                         page.tsx #  Editar negocio
                  nuevo/
                      page.tsx     #  Crear nuevo negocio
       tienda/
          [id_negocio]/
              page.tsx             #  Tienda pública (ISR, BD real)
       api/                          # Backend API Routes
          auth/
             login/route.ts       #  POST /api/auth/login
             register/route.ts    #  POST /api/auth/register
          constructor/
             orquestador/
                route.ts         #  Agente constructor (6 fases)
             mensaje/
                 route.ts         #  Agente vendedor
          agentes/
             notas/
                 route.ts         #  CRUD notas agentes
          negocios/
              route.ts             #  GET list, POST create
              crear/route.ts       # Alternativo
              [id]/
                  route.ts         #  GET, PATCH, DELETE
                  activar/route.ts #  POST activar
       layout.tsx                    # Root layout
       page.tsx                      # Landing page
       globals.css                   # Estilos globales
   
    components/
       ui/                           # Componentes base reutilizables
          Button.tsx               #  Botón con variantes
          Card.tsx                 #  Card contenedor
          Input.tsx                #  Input con label/error
          Modal.tsx                #  Modal overlay
          index.ts                 # Barrel export
       landing/                      # Landing page components
          Hero.tsx                 #  Hero section
          Features.tsx             #  Features grid
          Pricing.tsx              #  Pricing cards
          Testimonials.tsx         #  Testimonials slider
          Footer.tsx               #  Footer
          Navbar.tsx               #  Navbar
          Agents.tsx               #  Agents showcase
          index.ts
       auth/                         # Auth components
          LoginForm.tsx            #  Form de login
          RegisterForm.tsx         #  Form de registro
          SupabaseLoginForm.tsx    # Alternativo
          SupabaseRegisterForm.tsx
          index.ts
       dashboard/                    # Dashboard components
          Header.tsx               #  Header con user menu
          Sidebar.tsx              #  Sidebar navegación
          BusinessCard.tsx         #  Card de negocio
          BusinessList.tsx         #  Lista de negocios
          WelcomeEmpty.tsx         #  Empty state
          index.ts
       constructor/                  # Constructor components
           ChatWindow.tsx           #  Ventana principal del chat
           ChatMessage.tsx          #  Mensaje individual
           ChatInput.tsx            #  Input con botón send
           ProgressSidebar.tsx      #  Sidebar de progreso
           index.ts
   
    lib/                              # Lógica de negocio
       ia/                           #  Cliente IA unificado
          cliente-ia.ts            # OpenAI + Gemini fallback
       templates/                    #  Prompts de agentes
          constructor.ts           #  Orquestador universal
          vendedor/                # 12 archivos
             index.ts             #  Exports + helpers
             _base.ts             #  Fallback genérico
             restaurante.ts       #  María (mesera)
             tienda_ropa.ts       #  Sofía (moda)
             tecnologia.ts        #  Alex (tech)
             gimnasio.ts          #  Coach Mike
             educacion.ts         #  Prof. Ana
             servicios.ts         #  Luna
             agente-universal.ts  #  Universal para cualquier industria
             README.md
          admin/                    # Agentes admin
              admin-universal.ts   #  Max universal
              README.md
       agentes/                      # Sistema de agentes
          notas-agente.ts          #  Memoria persistente (300 líneas)
       crm/                          #  Sistema CRM
          perfil-cliente.ts        #  Tipos + lógica
          extractor.ts             #  Extracción IA
          notificaciones.ts        #  Multi-canal
          perfil-helper.ts         # Helpers
          scoring-churn.ts         # Analytics
          tracking-eventos.ts      # Event tracking
          analytics-campanas.ts    # Campaign analytics
          index.ts                 # 93 exports
       utils/                        # Utilidades
          industria.ts             #  Detector de industria (12 tipos)
       store/                        # Zustand stores
          auth-store.ts            #  Estado de auth
          constructor-store.ts     #  Estado del constructor
          negocio-store.ts         #  Estado de negocios
          index.ts
       supabase.ts                   #  Cliente Supabase
       supabase-auth.ts              #  Helpers de auth
       database.types.ts             #  Tipos DB autogenerados
   
    types/                            # TypeScript types
       usuario.ts                   #  Tipos usuario
       negocio.ts                   #  Tipos negocio
       constructor.ts               #  Tipos constructor/chat
       index.ts
   
    middleware.ts                     #  Auth middleware

 public/                               # Assets estáticos

 sql/                                  # Scripts SQL adicionales
    schema-perfiles-clientes.sql     # CRM schema

 supabase-schema.sql                   #  Schema principal
 schema-notas-agente.sql               #  Schema notas agentes
 fix-rls-policies.sql                  # Fix RLS

 next.config.ts                        # Config Next.js
 tailwind.config.ts                    # Config Tailwind
 tsconfig.json                         # Config TypeScript
 netlify.toml                          # Config Netlify
 package.json                          # Dependencies

 README.md                             # Este archivo
```

---

##  Sistema de Agentes IA

Maket AI utiliza un sistema de agentes especializados que se adaptan automáticamente al tipo de negocio.

### 1. Agente Constructor (Orquestador)

**Función:** Guía al usuario en la creación de su negocio mediante conversación natural.

**Fases (6):**
1. **Descubrimiento**  Tipo de negocio, industria, modelo
2. **Productos**  Catálogo inicial, precios, categorías
3. **Identidad**  Nombre, slogan, estilo visual, colores
4. **Operaciones**  Pagos, envíos, horarios
5. **Agentes**  Personalización del agente vendedor
6. **Activación**  Resumen y confirmación final

**Protocolo de marcadores:**
- `[[AVANZAR_FASE]]`  Avanza a la siguiente fase
- `[[ACTIVAR_NEGOCIO]]`  Crea el negocio en BD (estado: activo)
- `[[OPCIONES:["a","b"]]]`  Opciones rápidas al frontend

**Archivo:** [src/lib/templates/constructor.ts](src/lib/templates/constructor.ts)

### 2. Agente Vendedor

**Función:** Atiende clientes en la tienda pública 24/7.

**Plantillas especializadas:**
-  **Restaurante**  María (toma pedidos, sugiere combos)
-  **Ropa**  Sofía (asesora tallas, outfits)
-  **Tecnología**  Alex (especificaciones, compatibilidad)
-  **Gimnasio**  Coach Mike (planes, membresías)
-  **Educación**  Prof. Ana (cursos, tutorías)
-  **Servicios**  Luna (consultoría, agendamiento)

**Plantilla Universal:** Si no hay especializada, usa [agente-universal.ts](src/lib/templates/vendedor/agente-universal.ts) que se adapta a CUALQUIER industria.

**Capacidades:**
- Usa catálogo real: `{{PRODUCTOS_CATALOGO}}` se reemplaza con productos de BD
- Personaliza según perfil: `{{PERFIL_CLIENTE}}` se inyecta si hay datos previos
- Memoria persistente: Guarda notas con `[[NOTA_AGENTE:{...}]]`

**Archivos:** [src/lib/templates/vendedor/](src/lib/templates/vendedor/)

### 3. Agente Administrador (Max)

**Estado:**  Plantillas listas |  Endpoints pendientes

**Función:** Gestiona operaciones del negocio de forma autónoma.

**Inspirado en "MAX" del proyecto 5palos:**
- Decisiones autónomas sobre inventario, precios, operaciones
- Alertas inteligentes (stock crítico, pedidos atrasados)
- Optimización de precios según demanda
- Reposición automática
- Análisis predictivo y reportes

**Archivo:** [src/lib/templates/admin/admin-universal.ts](src/lib/templates/admin/admin-universal.ts)

### 4. Sistema de Notas (Memoria de Agentes)

**Protocolo:**
1. Agente incluye en su respuesta: `[[NOTA_AGENTE:{"tipo":"preferencia","contenido":"Cliente prefiere café negro"}]]`
2. API extrae el marcador con regex
3. Guarda en tabla `notas_agente`
4. En próxima conversación, se inyectan notas relevantes en el prompt

**Tipos de notas:**
- `preferencia`  Gustos del cliente
- `contexto`  Situación relevante
- `recordatorio`  Para seguimiento
- `alerta`  Requiere atención

**Archivo:** [src/lib/agentes/notas-agente.ts](src/lib/agentes/notas-agente.ts)  
**API:** `POST /api/agentes/notas` (GET, POST, PATCH, DELETE)

---

##  Base de Datos

**Motor:** PostgreSQL 15 (Supabase)  
**Seguridad:** Row Level Security (RLS) activado en todas las tablas

### Tablas Principales

```
usuarios
   id_usuario (PK)
   nombre
   email (unique)
   password_hash
   plan (free | premium)

negocios
   id_negocio (PK)
   id_usuario (FK  usuarios)
   nombre
   tipo_negocio (restaurante, tienda_ropa, etc.)
   url_tienda
   estado (borrador | configurando | activo)
   fecha_creacion

marca
   id_marca (PK)
   id_negocio (FK  negocios) 1:1
   nombre_negocio
   slogan
   color_primario
   color_secundario
   estilo_visual

tema
   id_tema (PK)
   id_negocio (FK  negocios) 1:1
   tipografia
   espaciado
   config_colores (JSON)

categorias
   id_categoria (PK)
   id_negocio (FK  negocios)
   nombre
   descripcion
   emoji

productos
   id_producto (PK)
   id_negocio (FK  negocios)
   id_categoria (FK  categorias)
   nombre
   descripcion
   precio
   imagenes (TEXT[])
   activo

agentes
   id_agente (PK)
   id_negocio (FK  negocios)
   tipo (vendedor | administrador | marketing)
   config (JSON)  personalidad, tono, etc.
   activo

notas_agente
   id_nota (PK)
   id_negocio (FK  negocios)
   tipo_agente (vendedor | administrador)
   tipo_nota (preferencia | contexto | recordatorio)
   contenido (TEXT)
   contexto_adicional (JSON)
   archivada (BOOLEAN)
   fecha_creacion

construccion_progreso ( Diseñado, migration pendiente)
   id (PK)
   id_negocio (FK)
   fase_actual (descubrimiento...activacion)
   datos_parciales (JSON)
   historial_conversacion (JSON[])
```

### Relaciones

```
usuarios (1:N) negocios
negocios (1:1) marca
negocios (1:1) tema
negocios (1:N) categorias
negocios (1:N) productos
negocios (1:N) agentes
negocios (1:N) notas_agente
categorias (1:N) productos
```

**Migraciones:**
1. [supabase-schema.sql](supabase-schema.sql)  Schema principal
2. [schema-notas-agente.sql](schema-notas-agente.sql)  Sistema de notas

---

##  Arquitectura de Software

### Flujo de Creación de Negocio

```

   USUARIO   
  registrado 

       
        Click "Crear Negocio"

   ChatWindow.tsx                 
   - Estado: Zustand             
   - Conversación con IA         

       
        POST mensaje

 /api/constructor/orquestador     
 - Recibe mensaje + contexto     
 - Inyecta idioma detectado      

       
        Genera prompt

 generarPromptOrquestador()       
 - Fases: 6 (descubrimiento...)  
 - Instrucción de idioma         
 - Info acumulada                

       
        Llama IA

 ClienteIA (OpenAI / Gemini)      
 - GPT-4o-mini o Gemini 1.5-flash
 - Retorna respuesta + marcadores

       
        Parse marcadores

 Extracción de:                   
 - [[AVANZAR_FASE]]              
 - [[ACTIVAR_NEGOCIO]]           
 - [[OPCIONES:[...]]]            

       
        Si [[ACTIVAR_NEGOCIO]]

 Supabase INSERT:                 
 - negocios (estado: activo)     
 - marca (colores, logo...)      
 - tema (tipografía...)          
 - categorias [...] 
 - productos [...]               

       
        Negocio creado

 Tienda pública disponible:       
 /tienda/[id_negocio]            
 (ISR: revalidate 60s)           

```

### Flujo de Tienda Pública (Cliente Final)

```

   CLIENTE   
   visita    

       
        GET /tienda/[id_negocio]

 page.tsx (Server Component)      
 - ISR: revalidate 60s           
 - Promise.all() paralelo:       
   1. negocio                    
   2. marca                      
   3. tema                       
   4. categorias                 
   5. productos                  

       
        Si no existe  notFound()

 Supabase queries (RLS)           
 - Solo datos públicos           
 - Filtrado por id_negocio       

       
        Render

 UI Generada:                     
 - Hero con brand colors         
 - Grid de productos             
 - Chat widget (vendedor IA)     
 - Carrito (próximamente)        

       
        Cliente envía mensaje

 POST /api/constructor/mensaje    
 - id_negocio                    
 - mensaje                       
 - historial                     
 - idioma (auto-detectado)       

       
        Carga agente vendedor

 obtenerTemplateVendedor()        
 - Detective tipo_negocio        
 - Usa especializado o universal 
 - Inyecta catálogo real         
 - Inyecta perfil cliente (CRM)  

       
        Respuesta

 ClienteIA genera respuesta       
 - Contexto completo             
 - Notas persistentes cargadas   
 - [[NOTA_AGENTE]] si aprende algo

       
        Guarda notas

 procesarNotasDeRespuesta()       
 - Extrae [[NOTA_AGENTE:{...}]]  
 - INSERT en notas_agente        

       
        Retorna respuesta limpia

 Chat muestra mensaje             
 (sin marcadores visibles)        

```

---

##  API Reference

### Autenticación

#### `POST /api/auth/register`

**Body:**
```json
{
  "nombre": "string",
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "message": "Usuario registrado",
  "usuario": { "id_usuario": "uuid", "nombre": "...", "email": "..." }
}
```

#### `POST /api/auth/login`

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK` + HTTP-only cookie
```json
{
  "message": "Login exitoso",
  "usuario": { ... }
}
```

---

### Constructor

#### `POST /api/constructor/orquestador`

Interactúa con el Orquestador para crear/configurar un negocio.

**Body:**
```json
{
  "id_negocio": "uuid | null",
  "mensaje": "string",
  "historial_mensajes": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "negocio_parcial": { "nombre": "...", "tipo_negocio": "..." },
  "fase_actual": "descubrimiento | productos | identidad | operaciones | agentes | activacion",
  "es_inicio": false,
  "idioma": "es"
}
```

**Response:** `200 OK`
```json
{
  "respuesta": "string (sin marcadores)",
  "avanzar_fase": true | false,
  "negocio_activado": true | false,
  "opciones_rapidas": ["opción 1", "opción 2"],
  "informacion_extraida": { "nombre_negocio": "...", ... }
}
```

---

#### `POST /api/constructor/mensaje`

Agente vendedor para la tienda pública.

**Body:**
```json
{
  "id_negocio": "uuid",
  "fase": "vendedor",
  "mensaje": "string",
  "historial_mensajes": [],
  "email_cliente": "optional",
  "telefono_cliente": "optional",
  "idioma": "es"
}
```

**Response:** `200 OK`
```json
{
  "respuesta": "string",
  "datos_extraidos": { ... }
}
```

---

### Negocios

#### `GET /api/negocios`

Lista negocios del usuario autenticado.

**Response:** `200 OK`
```json
{
  "negocios": [
    {
      "id_negocio": "uuid",
      "nombre": "Mi Restaurante",
      "tipo_negocio": "restaurante",
      "estado": "activo",
      "url_tienda": "/tienda/uuid",
      "fecha_creacion": "2026-03-01"
    }
  ]
}
```

#### `POST /api/negocios`

Crea un negocio nuevo (estado: `borrador`).

**Body:**
```json
{
  "nombre": "string"
}
```

---

### Notas de Agentes

#### `GET /api/agentes/notas`

**Query params:**
- `id_negocio` (required)
- `tipo_agente` (vendedor | administrador)
- `limite` (default: 50)

**Response:**
```json
{
  "notas": [
    {
      "id_nota": "uuid",
      "tipo_nota": "preferencia",
      "contenido": "Cliente prefiere café negro",
      "fecha_creacion": "..."
    }
  ]
}
```

#### `POST /api/agentes/notas`

Crea una nota manualmente (normalmente se crean automáticamente vía marcador).

---

##  Autenticación y Seguridad

### JWT + HTTP-only Cookies

- **Token:** JWT firmado con `NEXTAUTH_SECRET`
- **Expiración:** 7 días
- **Cookie:** `httpOnly`, `secure` (prod), `sameSite: lax`
- **Middleware:** Protege rutas `/dashboard/*`

### Row Level Security (RLS)

Políticas activadas en Supabase:

```sql
-- Usuarios solo ven sus propios negocios
CREATE POLICY "usuarios_own_negocios"
  ON negocios FOR ALL
  USING (auth.uid() = id_usuario);

-- Productos visibles públicamente si negocio activo
CREATE POLICY "productos_public_read"
  ON productos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM negocios
    WHERE negocios.id_negocio = productos.id_negocio
    AND negocios.estado = 'activo'
  ));
```

 Ver: [RLS_FIX_INSTRUCTIONS.md](RLS_FIX_INSTRUCTIONS.md)

---

##  Estado del Proyecto

###  Completado (Funcional)

- **Auth:** Login / Registro con JWT + cookies
- **Dashboard:** Lista de negocios, crear nuevo, UI completa
- **Constructor:** Chat IA con 6 fases, conectado a BD real
- **Orquestador:** Parseo de marcadores, activación de negocio
- **Tienda pública:** Carga real desde Supabase (ISR 60s)
- **Agente Vendedor:** Plantillas por industria + universal
- **Sistema de Notas:** Memoria persistente de agentes (CRUD completo)
- **Multilanguage:** 13 idiomas automáticos (navigator.language)
- **Industry Detection:** 12 industrias + universal fallback

###  En Desarrollo

- **CRM:** Estructura completa, falta integración en flujo principal
- **Agente Administrador:** Plantillas listas, endpoints pendientes
- **Carrito:** Store preparado, UI pendiente

###  Planeado (Roadmap)

- **Checkout:** Stripe / MercadoPago
- **Agente Marketing:** Campañas automatizadas
- **Analytics Dashboard:** Métricas de ventas
- **Google OAuth:** Login social
- **Dominio personalizado:** Para planes premium

---

##  Roadmap (14 días)

| Día | Milestone | Estado |
|-----|-----------|--------|
| 1 | Migraciones DB ejecutadas |  |
| 2 | Auth end-to-end verificado |  |
| 3 | Orquestador crea negocio real |  |
| 4 | Tienda carga correctamente |  |
| 5 | Cart store + UI básica |  |
| 7 | Chat widget en tienda (vendedor) |  |
| 10 | Notas de agentes en producción |  |
| 12 | Google OAuth + UI polish |  |
| 14 | Deploy Netlify  demo live |  |

 Ver: [BLUEPRINT.md](BLUEPRINT.md) para desglose detallado.

---

##  Testing

```bash
# Type checking
npx tsc --noEmit

# Linter
npm run lint

# Tests (cuando estén configurados)
npm run test
```

**Coverage actual:** TypeScript strict mode, 0 errores.

---

##  Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

 Ver: [CONTRIBUTING.md](CONTRIBUTING.md) (próximamente)

---

##  Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

---

**Desarrollado con  por el equipo de Maket AI**

> Última actualización: Marzo 2026 | Commit: `25a2dea`
