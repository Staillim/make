# 🚀 Maket AI - Plataforma SaaS Multi-Negocio con IA

**La plataforma que permite a cualquier emprendedor crear y gestionar negocios autónomos con agentes de IA especializados.**

## 💡 La Visión

Maket AI no está limitada a un solo tipo de negocio. Es una **plataforma modular y escalable** que se adapta automáticamente a diferentes industrias:

- 🍔 **Restaurantes** → Agente vendedor estilo "María" (toma pedidos, sugiere combos)
- 👗 **Tiendas de ropa** → Agente vendedor estilo "Sofía" (asesora moda, crea outfits)
- 💻 **Tecnología** → Agente vendedor técnico "Alex" (especificaciones, compatibilidad)
- 🏠 **Servicios** → Agentes especializados por tipo de servicio
- ...y cualquier otro tipo de negocio

Cada negocio obtiene **agentes de IA que aprenden y se especializan** según su contexto, productos y clientes.

## 🎯 Características Principales

- **🤖 Agente Constructor**: Chat IA que crea negocios paso a paso (11 fases)
- **🛒 Agente Vendedor**: Especializado por industria, atiende clientes 24/7
- **📊 Agente Administrador**: Toma decisiones autónomas sobre inventario, precios y operaciones
- **📢 Agente Marketing**: Analiza clientes, crea campañas y optimiza conversiones
- **🎨 Plantillas Dinámicas**: Sistema de plantillas personalizables por tipo de negocio
- **🏪 Tiendas Públicas**: URLs públicas generadas automáticamente
- **👤 Perfiles Inteligentes**: Sistema que aprende las preferencias de cada cliente
- **⚙️ Configuración Dinámica**: Todo configurable desde BD, sin hardcode

## 🏛️ Arquitectura Multi-Tenant

Maket AI está diseñada como una **plataforma SaaS multi-tenant** que soporta múltiples usuarios, cada uno con múltiples negocios:

```
Usuario 1
  ├── Negocio 1.1 (Restaurante) → 3 agentes IA especializados
  ├── Negocio 1.2 (Tienda ropa) → 3 agentes IA especializados
  └── Negocio 1.3 (Tecnología) → 3 agentes IA especializados

Usuario 2
  ├── Negocio 2.1 (Servicios) → 3 agentes IA especializados
  └── Negocio 2.2 (Restaurante) → 3 agentes IA especializados

...y así sucesivamente
```

Cada negocio está completamente aislado con:
- ✅ **RLS (Row Level Security)** en Supabase
- ✅ **Agentes IA personalizados** según tipo de industria
- ✅ **Configuración independiente** almacenada en BD
- ✅ **Base de datos dedicada** por negocio (lógicamente)

📖 **Más información:** Ver [ARQUITECTURA_MULTI_NEGOCIO.md](ARQUITECTURA_MULTI_NEGOCIO.md)

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [README.md](README.md) | Este archivo - Guía de inicio rápido |
| [PLAN.md](PLAN.md) | Plan completo del proyecto (18 secciones, 1100+ líneas) |
| [PROGRESO_DESARROLLO.md](PROGRESO_DESARROLLO.md) | Progreso completo del desarrollo (97% Sprint 1) |
| [ARQUITECTURA_MULTI_NEGOCIO.md](ARQUITECTURA_MULTI_NEGOCIO.md) | Arquitectura modular multi-tenant detallada |
| [ANALISIS_5PALOS_Y_VISION.md](ANALISIS_5PALOS_Y_VISION.md) | Análisis del proyecto 5palos y aplicación a Maket AI |
| [CRM.md](CRM.md) | Sistema CRM completo con perfiles inteligentes (600+ líneas) |
| [CRM_ANALYTICS.md](CRM_ANALYTICS.md) | Sistema analítico: churn, RFM, eventos, campañas (1,500+ líneas) |
| [MIS_NEGOCIOS_COMPLETADO.md](MIS_NEGOCIOS_COMPLETADO.md) | Funcionalidades completadas del módulo "Mis Negocios" |
| [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) | Configuración de Google OAuth |
| [RLS_FIX_INSTRUCTIONS.md](RLS_FIX_INSTRUCTIONS.md) | Instrucciones para corregir RLS policies |

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT + HTTP-only cookies
- **State**: Zustand
- **Icons**: Lucide React
- **Deploy**: Netlify

## 🚀 Configuración y Deploy

### 1. **Clonar el repositorio**
```bash
git clone https://github.com/Staillim/make.git
cd make
npm install
```

### 2. **Configurar Supabase**

1. **Crear proyecto en Supabase**:
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Anota tu `URL` y `ANON KEY`

2. **Ejecutar el schema**:
   - Ve a tu dashboard de Supabase → SQL Editor
   - Ejecuta el schema completo desde `supabase-schema.sql`
   - Esto creará todas las tablas, índices y plantillas

3. **Configurar variables de entorno**:
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
DATABASE_URL=postgresql://postgres.tu-proyecto:tu-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
NEXTAUTH_SECRET=genera-una-clave-secreta-aleatoria
```

### 3. **Ejecutar en desarrollo**
```bash
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000)

### 4. **Deploy en Netlify**

1. **Conectar repositorio**:
   - Ve a [netlify.com](https://netlify.com)
   - Connect to Git → Selecciona tu repo

2. **Configurar variables de entorno**:
   - Site settings → Environment variables
   - Agrega las mismas variables del `.env.local`

3. **Deploy automático**:
   - Netlify detectará `netlify.toml` y usará Node.js 20
   - El plugin `@netlify/plugin-nextjs` manejará las API routes

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/                     # Registro y login
│   │   ├── login/page.tsx
│   │   └── registro/page.tsx
│   ├── (dashboard)/                # Panel del usuario
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │       ├── page.tsx           # Dashboard principal
│   │       └── negocio/
│   │           ├── [id]/
│   │           │   ├── constructor/page.tsx  # Chat constructor
│   │           │   └── editar/page.tsx
│   │           └── nuevo/page.tsx
│   ├── tienda/[id_negocio]/       # Tiendas públicas
│   │   └── page.tsx
│   └── api/                       # Backend API routes
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── register/route.ts
│       ├── constructor/
│       │   └── mensaje/route.ts   # 🔥 Endpoint principal constructor
│       └── negocios/
│           ├── route.ts
│           ├── [id]/route.ts
│           └── crear/route.ts
├── components/
│   ├── ui/                        # Componentes base (Button, Card, Input)
│   ├── landing/                   # Landing page (Hero, Features, Pricing)
│   ├── auth/                      # Autenticación (LoginForm, RegisterForm)
│   ├── dashboard/                 # Panel de control (Header, Sidebar, BusinessList)
│   └── constructor/               # Chat del agente (ChatWindow, ChatMessage)
├── lib/
│   ├── supabase.ts               # Cliente de Supabase
│   ├── database.types.ts         # Tipos TypeScript generados
│   ├── templates/                # 🤖 BIBLIOTECA DE AGENTES IA
│   │   ├── vendedor/             # Agentes vendedores (12 archivos)
│   │   │   ├── restaurante.ts   # María (mesera experta)
│   │   │   ├── tienda_ropa.ts   # Sofía (asesora de moda)
│   │   │   ├── tecnologia.ts    # Alex (experto tech)
│   │   │   ├── gimnasio.ts      # Coach Mike
│   │   │   ├── educacion.ts     # Prof. Ana
│   │   │   ├── servicios.ts     # Luna
│   │   │   ├── agente-universal.ts  # Agente adaptable a cualquier industria
│   │   │   ├── _base.ts         # Fallback genérico
│   │   │   └── index.ts         # Helpers y exports
│   │   ├── admin/                # Agentes administradores (9 archivos)
│   │   │   ├── restaurante.ts   # Max - gestión gastronómica
│   │   │   ├── tienda_ropa.ts   # Max - retail moda
│   │   │   ├── tecnologia.ts    # Max - tech retail
│   │   │   └── index.ts
│   │   └── README.md            # Documentación de templates
│   ├── constructor/              # 🧠 SISTEMA DE DETECCIÓN
│   │   ├── detector.ts          # Detecta tipo de negocio automáticamente
│   │   ├── detector.test.ts     # 13 test cases
│   │   └── prompts/
│   │       └── detector-system.ts
│   ├── crm/                      # 🎯 SISTEMA CRM + ANALYTICS
│   │   ├── perfil-cliente.ts    # Perfiles con 80+ campos
│   │   ├── extractor.ts         # Extracción IA de preferencias
│   │   ├── notificaciones.ts    # Multi-canal (email/WhatsApp/SMS)
│   │   ├── perfil-helper.ts     # Funciones de alto nivel
│   │   ├── scoring-churn.ts     # 🆕 Churn prediction + RFM scoring
│   │   ├── tracking-eventos.ts  # 🆕 Event tracking (30+ tipos)
│   │   ├── analytics-campanas.ts # 🆕 A/B testing + Lift analysis
│   │   ├── ejemplo-integracion.ts
│   │   └── index.ts             # 93 exports
│   └── store/                    # Estados Zustand
│       ├── auth-store.ts
│       ├── constructor-store.ts
│       └── negocio-store.ts
├── types/                        # Definiciones de tipos
│   ├── usuario.ts
│   ├── negocio.ts
│   └── constructor.ts
└── sql/
    ├── supabase-schema.sql      # Schema principal
    └── schema-perfiles-clientes.sql  # Schema CRM con triggers
```

## 🗄️ Base de Datos

### Tablas Principales:
- **`usuarios`**: Información de usuarios registrados
- **`negocios`**: Negocios creados por usuarios
- **`plantillas`**: Catálogo de plantillas disponibles
- **`marca`**: Identidad visual de cada negocio
- **`productos`**: Catálogo de productos
- **`agentes`**: Configuración de agentes IA

### Relaciones:
```
usuarios (1:N) negocios (1:1) marca
negocios (1:N) productos (N:1) categorias
negocios (1:N) agentes
```

## 🤖 Agentes IA Especializados

Cada negocio creado en Maket AI obtiene **3 agentes de IA especializados** que se adaptan automáticamente al tipo de industria:

### **1. Agente Constructor** (Crea el negocio)
- **Conversacional**: Chat paso a paso para configurar negocio completo
- **11 Fases**: Desde tipo de negocio hasta activación final
- **Adaptativo**: Preguntas dinámicas según la industria detectada
- **Persistente**: Guarda progreso en cada paso
- **Inteligente**: Detecta tipo de negocio y selecciona plantillas de agentes apropiadas

### **2. Agente Vendedor** (Atiende clientes)
Plantillas especializadas por industria:
- **🍔 Restaurante → "María"**: Toma pedidos en lenguaje natural, sugiere combos, aplica promociones
- **👗 Tienda de ropa → "Sofía"**: Asesora tallas, crea outfits, sugiere accesorios
- **💻 Tecnología → "Alex"**: Explica especificaciones, compatibilidad, soporte técnico
- **🏠 Servicios → "Luna"**: Agenda citas, explica procesos, cotiza servicios

**Capacidades comunes:**
- Entiende lenguaje natural y contexto
- Usa perfil del cliente (preferencias aprendidas)
- Upselling y cross-selling inteligente
- Personaliza según historial de compras
- Aplica promociones automáticamente

### **3. Agente Administrador** (Gestiona el negocio)
Inspirado en "MAX" del proyecto 5palos:
- **Decisiones autónomas**: Gestiona inventario, precios y operaciones
- **Alertas inteligentes**: Stock crítico, pedidos atrasados, oportunidades
- **Optimización de precios**: Ajusta según demanda, hora del día, stock
- **Reposición automática**: Genera órdenes de compra cuando detecta necesidad
- **Análisis predictivo**: Proyecta ventas, identifica tendencias
- **Reportes automáticos**: Métricas diarias, semanales, mensuales

### **4. Sistema CRM + Analytics** (✅ Implementado)
**Perfiles Inteligentes de Clientes:**
- **Aprende automáticamente**: Gustos, preferencias, comportamiento
- **Segmentación dinámica**: 5 segmentos base + 11 segmentos RFM
- **Scoring predictivo**: Engagement (0-100), Probabilidad de compra (0-100), Churn risk (0-100)
- **Notificaciones personalizadas**: Email, WhatsApp, SMS con 9 templates
- **Extracción IA**: GPT-4 detecta preferencias de conversaciones

**Analytics Avanzado:**
- **Churn prediction**: Score 0-100 con 4 factores (Recency, Frequency, Monetary, Engagement)
- **RFM Segmentation**: 11 segmentos estándar (Champions → Lost)
- **Event tracking**: 30+ tipos de eventos granulares
- **Campaign analytics**: Funnel completo + ROI + A/B testing
- **Lift analysis**: Treatment vs control con Chi-cuadrado
- **Dashboard ejecutivo**: Top performers, alertas automáticas

📖 **Ver documentación completa:** [CRM.md](CRM.md) y [CRM_ANALYTICS.md](CRM_ANALYTICS.md)

**Rutas de implementación:**
- `src/lib/crm/perfil-cliente.ts` - Tipos y lógica de perfiles
- `src/lib/crm/scoring-churn.ts` - Churn prediction y RFM
- `src/lib/crm/tracking-eventos.ts` - Event tracking system
- `src/lib/crm/analytics-campanas.ts` - Campaign analytics
- `sql/schema-perfiles-clientes.sql` - Database schema con triggers

## 🎨 Sistema de Plantillas

- **Dinámico**: Plantillas renderizadas desde JSON
- **Personalizables**: Colores, tipografías, secciones
- **Responsive**: Optimizadas para móviles
- **Planes**: Free (3 plantillas) vs Premium (todas)

## 🏗️ Blueprint Arquitectónico

### Sistema de Agentes IA

```
┌─────────────────────────────────────────────────────────────────┐
│                    BIBLIOTECA DE AGENTES                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📚 VENDEDORES (src/lib/templates/vendedor/)                   │
│  ├── Especializados (6): restaurante, ropa, tech, gym, edu... │
│  ├── Universal: Adaptable a CUALQUIER industria               │
│  └── Estrategia: Automática (usa especializado si existe)     │
│                                                                 │
│  👔 ADMINISTRADORES (src/lib/templates/admin/)                 │
│  ├── Max - 6 especializaciones por industria                   │
│  ├── KPIs + Alertas + Decisiones autónomas                    │
│  └── Reportes automáticos (diario/semanal/mensual)            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────────┐
│              SISTEMA DE DETECCIÓN AUTOMÁTICA                    │
│              (src/lib/constructor/detector.ts)                  │
│                                                                 │
│  Input: "Quiero vender hamburguesas"                           │
│  ↓                                                              │
│  IA + Keywords → tipo_negocio: "restaurante"                   │
│  ↓                                                              │
│  Asigna: María (agente vendedor) + Max (admin)                │
└─────────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   SISTEMA DE CATÁLOGO                           │
│                                                                 │
│  Productos desde BD → inyectarCatalogo()                       │
│  ↓                                                              │
│  Placeholder {{PRODUCTOS_CATALOGO}} reemplazado en prompt      │
│  ↓                                                              │
│  Agente CONOCE exactamente qué vende                           │
└─────────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      SISTEMA CRM                                │
│                (src/lib/crm/)                                   │
│                                                                 │
│  CAPTURA                                                        │
│  ├── Conversación → extractor.ts (IA detecta preferencias)    │
│  ├── Eventos → tracking-eventos.ts (30+ tipos)                │
│  └── Compras → perfil-cliente.ts (actualiza métricas)         │
│                                                                 │
│  ANÁLISIS                                                       │
│  ├── Scoring → scoring-churn.ts (churn + RFM + engagement)    │
│  ├── Segmentación → 5 base + 11 RFM (automática)             │
│  └── Predicción → probabilidad_compra (0-100)                 │
│                                                                 │
│  ACCIÓN                                                         │
│  ├── Personalización → {{PERFIL_CLIENTE}} en prompt           │
│  ├── Notificaciones → notificaciones.ts (multi-canal)         │
│  └── Campañas → analytics-campanas.ts (A/B testing + lift)    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   API ENDPOINT PRINCIPAL                        │
│             /api/constructor/mensaje (route.ts)                 │
│                                                                 │
│  1. Identificar cliente (email/teléfono)                       │
│  2. Cargar perfil → obtenerOCrearPerfil()                      │
│  3. Generar resumen → obtenerResumenParaAgente()               │
│  4. Inyectar en prompt → {{PERFIL_CLIENTE}}               │
│  5. Llamar OpenAI con contexto completo                        │
│  6. Registrar conversación → extraer info + actualizar perfil  │
│  7. Disparar notificaciones si aplica                          │
└─────────────────────────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BASE DE DATOS                                │
│                   (Supabase PostgreSQL)                         │
│                                                                 │
│  Tablas principales:                                            │
│  ├── negocios                                                   │
│  ├── productos                                                  │
│  ├── perfiles_clientes (CRM)                                   │
│  ├── conversaciones_clientes                                    │
│  ├── eventos_clientes (event tracking)                         │
│  ├── notificaciones_programadas                                 │
│  └── campanas_automatizadas                                     │
│                                                                 │
│  Triggers:                                                      │
│  └── after_update_perfil → recalcular_segmento_cliente()      │
│                                                                 │
│  Views:                                                         │
│  ├── clientes_vip                                              │
│  ├── clientes_en_riesgo                                        │
│  └── performance_campanas                                       │
└─────────────────────────────────────────────────────────────────┘
```

### Ciclo de Aprendizaje Continuo

```
   ┌──────────────┐
   │   CLIENTE    │
   │  interactúa  │
   └──────┬───────┘
          ↓
   ┌──────────────┐
   │   EVENTOS    │ ← registrarEvento()
   │  capturados  │
   └──────┬───────┘
          ↓
   ┌──────────────┐
   │   PERFIL     │ ← obtenerMetricasUsuario()
   │ actualizado  │
   └──────┬───────┘
          ↓
   ┌──────────────┐
   │   SCORING    │ ← calcularChurnScore(), calcularRFMScore()
   │  recalculado │
   └──────┬───────┘
          ↓
   ┌──────────────┐
   │ SEGMENTACIÓN │ ← determinarSegmento(), trigger SQL
   │  automática  │
   └──────┬───────┘
          ↓
   ┌──────────────┐
   │  CAMPAÑA     │ ← determinarNotificacionOptima()
   │  activada    │
   └──────┬───────┘
          ↓
   ┌──────────────┐
   │  ANALYTICS   │ ← obtenerMetricasCampana(), calcularLift()
   │  medición    │
   └──────┬───────┘
          ↓
   ┌──────────────┐
   │ OPTIMIZACIÓN │ ← compararCampanas(), A/B winner
   │  continua    │
   └──────────────┘
```

## 🔐 Autenticación

- **JWT Tokens**: Con expiración de 7 días
- **HTTP-only Cookies**: Seguridad contra XSS
- **Bcrypt**: Hash de contraseñas con salt rounds 12
- **Row Level Security**: Políticas de acceso en Supabase

## 📈 Planes y Límites

| Característica | Free | Premium |
|---|---|---|
| Negocios | 1 | Ilimitados |
| Plantillas | 3 básicas | Todas |
| Agentes IA | Limitados | Completos |
| Dominio personalizado | ❌ | ✅ |

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Linter
npm run lint  

# Type checking
npx tsc --noEmit
```

## 🚀 Deploy

### Netlify (Configurado)
- Push a `master` → Deploy automático
- Node.js 20 + Plugin Next.js
- API routes → Netlify Functions

### Vercel (Alternativo)
```bash
npm install -g vercel
vercel
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad` 
5. Abre un Pull Request

## 📝 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- **Issues**: Reporta bugs en GitHub Issues
- **Discussions**: Preguntas y sugerencias en GitHub Discussions
- **Email**: contacto@maketai.com

---

**Desarrollado con ❤️ por el equipo de Maket AI**
