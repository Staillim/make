# 🚀 Plan Completo del Proyecto — Plataforma de Negocios Autónomos con IA

> **Tecnologías:** Next.js (App Router) · React · TypeScript · Tailwind CSS  
> **Fecha de inicio:** 1 de marzo de 2026  
> **Estado:** En planificación

---

## 📋 Índice

1. [Landing Page](#1--landing-page)
2. [Registro de Usuario](#2--registro-de-usuario)
3. [Dashboard Inicial](#3--dashboard-inicial)
4. [Crear Nuevo Negocio](#4--crear-nuevo-negocio)
5. [Agente Constructor (Chat IA)](#5--agente-constructor-chat-ia)
6. [Fase 1: Definir Tipo de Negocio](#6--fase-1-definir-tipo-de-negocio)
7. [Fase 2: Selección de Plantilla](#7--fase-2-selección-de-plantilla)
8. [Fase 3: Identidad de Marca](#8--fase-3-identidad-de-marca)
9. [Fase 4: Personalización de Plantilla](#9--fase-4-personalización-de-plantilla)
10. [Fase 5: Configuración de Catálogo](#10--fase-5-configuración-de-catálogo)
11. [Fase 6: Reglas del Dominio](#11--fase-6-reglas-del-dominio)
12. [Fase 7: Configuración de Agentes IA](#12--fase-7-configuración-de-agentes-ia)
13. [Fase 8: Configuración Comercial](#13--fase-8-configuración-comercial)
14. [Fase 9: Automatizaciones](#14--fase-9-automatizaciones)
15. [Activación Final del Negocio](#15--activación-final-del-negocio)
16. [Modelo de Base de Datos](#16--modelo-de-base-de-datos)
17. [Estructura de Carpetas del Proyecto](#17--estructura-de-carpetas-del-proyecto)
18. [Roadmap de Desarrollo](#18--roadmap-de-desarrollo)

---

## 1. 🌍 Landing Page

**Ruta:** `/`  
**Objetivo:** Convertir visitante en usuario registrado.

### Secciones de la página

| Sección | Contenido |
|---|---|
| **Hero** | Título principal + subtítulo explicando la propuesta de valor: *"Crea tu negocio autónomo con Inteligencia Artificial"* + CTA `Crear mi negocio` |
| **¿Qué es?** | Explicación clara de qué hace la plataforma: permite crear negocios completos que se gestionan solos gracias a 3 agentes IA |
| **Los 3 Agentes** | Tarjetas presentando cada agente con icono, nombre y descripción |
| **Planes** | Comparativa Free vs Premium en tabla visual |
| **Testimonios** | Social proof (puede ser placeholder al inicio) |
| **Footer** | Links legales, contacto, redes sociales |

### Los 3 Agentes a presentar

| Agente | Rol | Descripción |
|---|---|---|
| 🏗️ **Constructor** | Crea el negocio | Guía paso a paso para configurar tienda, marca, productos y diseño |
| 🛒 **Vendedor** | Atiende clientes | Asesora compradores, recomienda productos, cierra ventas |
| 📊 **Administrador** | Gestiona el negocio | Reportes, inventario, métricas, alertas automáticas |

### Planes

| Característica | Free | Premium |
|---|---|---|
| Negocios | 1 | Ilimitados |
| Plantillas | Básicas | Todas |
| Agentes IA | Limitados | Completos |
| Soporte | Comunidad | Prioritario |
| Automatizaciones | Básicas | Avanzadas |
| Dominio personalizado | ❌ | ✅ |

### Componentes a crear

- `src/components/landing/Hero.tsx`
- `src/components/landing/Features.tsx`
- `src/components/landing/Agents.tsx`
- `src/components/landing/Pricing.tsx`
- `src/components/landing/Testimonials.tsx`
- `src/components/landing/Footer.tsx`

### Tareas de desarrollo

- [ ] Diseñar layout responsive de la landing
- [ ] Crear componente Hero con CTA principal
- [ ] Crear sección de los 3 agentes con animaciones
- [ ] Crear tabla comparativa de planes
- [ ] Implementar navegación con scroll suave entre secciones
- [ ] Optimizar SEO (metadata, Open Graph)

---

## 2. 📝 Registro de Usuario

**Ruta:** `/registro`  
**Ruta alternativa:** `/login`  
**Objetivo:** Crear cuenta de usuario en la plataforma.

### Campos del formulario de registro

| Campo | Tipo | Validación | Requerido |
|---|---|---|---|
| Nombre | `text` | Min 2 caracteres | ✅ |
| Email | `email` | Formato email válido, único en BD | ✅ |
| Contraseña | `password` | Min 8 caracteres, 1 mayúscula, 1 número | ✅ |
| Confirmar contraseña | `password` | Debe coincidir con contraseña | ✅ |
| Aceptar términos | `checkbox` | Debe estar marcado | ✅ |

### Autenticación social (opcional)

- [ ] Login con Google (OAuth 2.0)
- [ ] Login con GitHub (futuro)

### Flujo al registrarse

```
Usuario llena formulario
        ↓
Validación frontend (Zod / React Hook Form)
        ↓
POST /api/auth/register
        ↓
Validación backend
        ↓
Hash de contraseña (bcrypt)
        ↓
INSERT en tabla `usuarios`
        ↓
Crear sesión / JWT
        ↓
Redirect → /dashboard
```

### Registro en base de datos — Tabla `usuarios`

| Campo | Tipo | Valor por defecto |
|---|---|---|
| `id_usuario` | UUID | Auto-generado |
| `nombre` | VARCHAR(100) | — |
| `email` | VARCHAR(255) | — (único) |
| `password_hash` | VARCHAR(255) | — |
| `plan` | ENUM('free','premium') | `'free'` |
| `fecha_registro` | TIMESTAMP | `NOW()` |

### Componentes a crear

- `src/app/(auth)/registro/page.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/SocialLogin.tsx`

### Tareas de desarrollo

- [ ] Crear formulario de registro con validación
- [ ] Crear formulario de login
- [ ] Implementar API route `POST /api/auth/register`
- [ ] Implementar API route `POST /api/auth/login`
- [ ] Configurar hashing de contraseñas con bcrypt
- [ ] Implementar sistema de sesiones (JWT o NextAuth)
- [ ] Configurar middleware de autenticación
- [ ] Implementar login con Google (opcional)
- [ ] Crear página de términos y condiciones

---

## 3. 🏠 Dashboard Inicial

**Ruta:** `/dashboard`  
**Acceso:** Solo usuarios autenticados (protegido por middleware)

### Estados del Dashboard

#### Estado A: Sin negocios (primer ingreso)

```
┌─────────────────────────────────────────┐
│                                         │
│   👋 Bienvenido, {nombre}              │
│                                         │
│   Crea tu primer negocio autónomo       │
│                                         │
│   ┌─────────────────────────┐           │
│   │  + Crear nuevo negocio  │           │
│   └─────────────────────────┘           │
│                                         │
└─────────────────────────────────────────┘
```

#### Estado B: Con negocios existentes

```
┌─────────────────────────────────────────┐
│  Mis Negocios          [+ Crear nuevo]  │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │ 🏪 Mi Tienda de Ropa              │ │
│  │ Estado: ● Activo                   │ │
│  │ [Editar] [Ir a tienda] [Eliminar]  │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │ 🏪 Accesorios XYZ                 │ │
│  │ Estado: ○ En configuración         │ │
│  │ [Continuar] [Eliminar]             │ │
│  └────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Acciones por negocio

| Acción | Descripción | Redirige a |
|---|---|---|
| **Editar** | Reabrir agente constructor para modificar configuración | `/dashboard/negocio/[id]/editar` |
| **Ir a tienda** | Ver la tienda pública generada | `/tienda/[id_negocio]` |
| **Eliminar** | Eliminar negocio (con confirmación) | Acción in-place |
| **Continuar** | Continuar configuración incompleta | `/dashboard/negocio/[id]/constructor` |

### Componentes a crear

- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/components/dashboard/WelcomeEmpty.tsx`
- `src/components/dashboard/BusinessList.tsx`
- `src/components/dashboard/BusinessCard.tsx`
- `src/components/dashboard/Sidebar.tsx`
- `src/components/dashboard/Header.tsx`

### Tareas de desarrollo

- [ ] Crear layout del dashboard con sidebar y header
- [ ] Implementar estado vacío (sin negocios)
- [ ] Implementar listado de negocios del usuario
- [ ] Crear tarjeta de negocio con acciones
- [ ] Implementar API `GET /api/negocios?usuario={id}`
- [ ] Implementar API `DELETE /api/negocios/{id}`
- [ ] Agregar diálogo de confirmación para eliminar
- [ ] Proteger ruta con middleware de autenticación

---

## 4. 🏗️ Crear Nuevo Negocio

**Ruta:** `/dashboard/negocio/nuevo`  
**Trigger:** Botón "Crear nuevo negocio" en el Dashboard

### Flujo

```
Click en "Crear nuevo negocio"
        ↓
POST /api/negocios/crear
  → crearNegocioParaUsuario(id_usuario)
        ↓
Se crea registro en tabla `negocios`
  → id_negocio = UUID generado
  → estado = "en_configuracion"
        ↓
Redirect → /dashboard/negocio/[id_negocio]/constructor
        ↓
Se abre la interfaz del Chat del Agente Constructor
```

### Registro en BD — Tabla `negocios`

| Campo | Tipo | Valor inicial |
|---|---|---|
| `id_negocio` | UUID | Auto-generado |
| `id_usuario` | UUID | FK → usuarios |
| `nombre` | VARCHAR(200) | `NULL` (se define en constructor) |
| `estado` | ENUM | `'en_configuracion'` |
| `fecha_creacion` | TIMESTAMP | `NOW()` |
| `url_tienda` | VARCHAR(255) | `NULL` (se genera al activar) |

### API Endpoint

```
POST /api/negocios/crear
Body: { id_usuario }
Response: { id_negocio, redirect_url }
```

### Tareas de desarrollo

- [ ] Implementar API `POST /api/negocios/crear`
- [ ] Crear función `crearNegocioParaUsuario(id_usuario)`
- [ ] Validar límite de negocios según plan (free = 1, premium = ilimitados)
- [ ] Redirigir al chat del constructor tras crear

---

## 5. 🤖 Agente Constructor (Chat IA)

**Ruta:** `/dashboard/negocio/[id_negocio]/constructor`  
**Tipo de interfaz:** Chat conversacional con IA

### Arquitectura del Chat

```
┌──────────────────────────────────────────────┐
│  🤖 Agente Constructor — Mi Negocio          │
│──────────────────────────────────────────────│
│                                              │
│  🤖: Hola, soy tu asistente para crear tu   │
│      negocio autónomo. Vamos a construirlo   │
│      paso a paso.                            │
│                                              │
│  🤖: ¿Qué tipo de negocio quieres crear?    │
│                                              │
│  👤: Quiero una tienda de ropa              │
│                                              │
│  🤖: Perfecto. ¿Qué tipo de ropa?          │
│      □ Casual  □ Formal  □ Deportiva        │
│                                              │
│──────────────────────────────────────────────│
│  [Escribe tu mensaje...]          [Enviar]   │
└──────────────────────────────────────────────┘
```

### Barra lateral de progreso

```
Progreso de configuración:
██████████░░░░░░░░░░ 50%

✅ Tipo de negocio
✅ Plantilla
✅ Identidad de marca
🔄 Personalización    ← actual
⬜ Catálogo
⬜ Reglas de dominio
⬜ Agentes IA
⬜ Config. comercial
⬜ Automatizaciones
⬜ Activación
```

### Primera interacción

```
🤖: Hola, soy tu asistente para crear tu negocio autónomo.
    Vamos a construirlo paso a paso.
    
    Primero, cuéntame: ¿Qué tipo de negocio quieres crear?
```

### Fases del Constructor (resumen)

| # | Fase | Función principal | Tabla destino |
|---|---|---|---|
| 1 | Tipo de negocio | `detectarTipoNegocio()` | `tema` |
| 2 | Plantilla | `asignarPlantilla()` | `negocios` |
| 3 | Identidad de marca | `guardarMarca()` | `marca` |
| 4 | Personalización | `personalizarPlantilla()` | `configuracion_visual` |
| 5 | Catálogo | `generarEstructuraProductos()` | `productos`, `categorias` |
| 6 | Reglas de dominio | `crearReglasDominio()` | `reglas_negocio` |
| 7 | Agentes IA | `configurarAgentes()` | `agentes` |
| 8 | Config. comercial | `configurarComercial()` | `config_comercial` |
| 9 | Automatizaciones | `configurarAutomatizaciones()` | `automatizaciones` |
| 10 | Activación | `activarNegocio()` | `negocios` (estado) |

### Componentes a crear

- `src/app/(dashboard)/dashboard/negocio/[id]/constructor/page.tsx`
- `src/components/constructor/ChatWindow.tsx`
- `src/components/constructor/ChatMessage.tsx`
- `src/components/constructor/ChatInput.tsx`
- `src/components/constructor/ProgressSidebar.tsx`
- `src/components/constructor/QuickOptions.tsx` (botones de opciones rápidas)
- `src/lib/agents/constructor.ts` (lógica del agente)
- `src/lib/agents/prompts/constructor-system.ts` (prompt del sistema)

### Tareas de desarrollo

- [ ] Diseñar interfaz de chat responsive
- [ ] Implementar componente de mensajes (bot / usuario)
- [ ] Implementar input con envío por Enter y botón
- [ ] Crear barra de progreso lateral
- [ ] Implementar opciones rápidas (botones clickeables)
- [ ] Conectar con API de IA (OpenAI / similar)
- [ ] Crear lógica de máquina de estados para las fases
- [ ] Implementar persistencia del progreso de configuración
- [ ] Crear API `POST /api/constructor/mensaje`

---

## 6. 🧠 Fase 1: Definir Tipo de Negocio

### Preguntas del bot

1. *"¿Qué tipo de negocio quieres crear?"*
2. *"¿Qué productos venderás?"*
3. *"¿Son productos físicos o digitales?"*
4. *"¿Venderás a nivel local o internacional?"*

### Función

```typescript
detectarTipoNegocio(respuestas: RespuestasTipoNegocio): TipoNegocio
```

### Datos guardados — Tabla `tema`

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id_tema` | UUID | Auto |
| `id_negocio` | UUID | FK → negocios |
| `tipo_negocio` | VARCHAR | `"tienda_ropa"` |
| `categoria_principal` | VARCHAR | `"moda"` |
| `tipo_producto` | ENUM('fisico','digital','mixto') | `"fisico"` |
| `alcance` | ENUM('local','nacional','internacional') | `"nacional"` |
| `descripcion_ia` | TEXT | Resumen generado por IA |

### Tareas de desarrollo

- [ ] Definir catálogo de tipos de negocio soportados
- [ ] Implementar `detectarTipoNegocio()` con lógica de IA
- [ ] Crear API `POST /api/constructor/tipo-negocio`
- [ ] Crear migración para tabla `tema`
- [ ] Validar respuestas del usuario

---

## 7. 🎨 Fase 2: Selección de Plantilla

### Lógica de selección

```
listarPlantillasDisponibles(id_usuario)
        ↓
Si plan === "free"  → Solo plantillas free
Si plan === "premium" → Todas las plantillas
        ↓
Mostrar galería visual con preview
        ↓
Usuario selecciona una
        ↓
asignarPlantilla(id_negocio, id_plantilla)
```

### Interfaz en el chat

El bot muestra una **galería de plantillas** dentro del chat:

```
🤖: Estas son las plantillas disponibles para tu tipo de negocio:

┌─────────┐  ┌─────────┐  ┌─────────┐
│ Minimal │  │ Modern  │  │ Classic │
│  [img]  │  │  [img]  │  │  [img]  │
│  FREE   │  │  FREE   │  │ PREMIUM │
└─────────┘  └─────────┘  └─────────┘

¿Cuál te gusta más?
```

### Tabla `plantillas` (precargada)

| Campo | Tipo |
|---|---|
| `id_plantilla` | UUID |
| `nombre` | VARCHAR |
| `descripcion` | TEXT |
| `preview_url` | VARCHAR |
| `tipo_plan` | ENUM('free','premium') |
| `categorias_compatibles` | JSON |
| `configuracion_base` | JSON |

### Tareas de desarrollo

- [ ] Diseñar sistema de plantillas (estructura JSON de configuración)
- [ ] Crear al menos 3 plantillas free y 3 premium
- [ ] Implementar `listarPlantillasDisponibles(id_usuario)`
- [ ] Implementar `asignarPlantilla(id_negocio, id_plantilla)`
- [ ] Crear componente de galería de plantillas en el chat
- [ ] Filtrar plantillas según plan del usuario
- [ ] Crear migración para tabla `plantillas`

---

## 8. 🎭 Fase 3: Identidad de Marca

### Preguntas del bot

1. *"¿Cómo se llamará tu negocio?"*
2. *"¿Tienes un slogan o quieres que te sugiera uno?"*
3. *"¿Cuáles son tus colores principales?"* (con selector de color o paletas sugeridas)
4. *"¿Qué estilo visual prefieres?"* (minimalista, elegante, juvenil, profesional)
5. *"¿Quién es tu público objetivo?"* (edad, género, intereses)
6. *"¿Qué tono de comunicación prefieres?"* (formal, casual, divertido, profesional)

### Función

```typescript
guardarMarca(id_negocio: string, datosMarca: DatosMarca): void
```

### Datos guardados — Tabla `marca`

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id_marca` | UUID | Auto |
| `id_negocio` | UUID | FK → negocios |
| `nombre_negocio` | VARCHAR(200) | `"Urban Style"` |
| `slogan` | VARCHAR(300) | `"Tu estilo, tu regla"` |
| `color_primario` | VARCHAR(7) | `"#1a1a2e"` |
| `color_secundario` | VARCHAR(7) | `"#e94560"` |
| `color_acento` | VARCHAR(7) | `"#0f3460"` |
| `estilo_visual` | VARCHAR(50) | `"minimalista"` |
| `publico_objetivo` | JSON | `{"edad":"18-35","genero":"mixto"}` |
| `tono_comunicacion` | VARCHAR(50) | `"casual"` |
| `logo_url` | VARCHAR(500) | `NULL` (se sube después) |

### Tareas de desarrollo

- [ ] Implementar `guardarMarca()`
- [ ] Crear selector/sugeridor de paletas de colores
- [ ] Generar sugerencias de slogan con IA
- [ ] Crear migración para tabla `marca`
- [ ] Crear API `POST /api/constructor/marca`
- [ ] Validar que el nombre del negocio no esté duplicado

---

## 9. 🖌️ Fase 4: Personalización de Plantilla

### Opciones de personalización

| Opción | Tipo de control | Ejemplo |
|---|---|---|
| Colores | Color picker | Aplicar paleta de marca |
| Secciones | Toggle on/off | Activar/desactivar testimonios |
| Productos por fila | Selector numérico | 2, 3 o 4 columnas |
| Modo oscuro | Toggle | Activar/desactivar |
| Logo | Upload de imagen | Subir PNG/SVG |
| Tipografía | Selector | Inter, Poppins, Playfair |
| Textos principales | Input de texto | Hero title, subtítulo, CTAs |
| Diseño del header | Selector | Centrado, lateral, sticky |
| Diseño del footer | Selector | Simple, completo, minimalista |

### Función

```typescript
personalizarPlantilla(id_negocio: string, cambios: CambiosVisuales): void
```

### Datos guardados — Tabla `configuracion_visual`

| Campo | Tipo |
|---|---|
| `id_config` | UUID |
| `id_negocio` | UUID (FK) |
| `id_plantilla` | UUID (FK) |
| `configuracion` | JSON |
| `ultima_modificacion` | TIMESTAMP |

### Ejemplo de JSON de configuración

```json
{
  "colores": {
    "primario": "#1a1a2e",
    "secundario": "#e94560",
    "acento": "#0f3460",
    "fondo": "#ffffff",
    "texto": "#333333"
  },
  "tipografia": {
    "principal": "Inter",
    "secundaria": "Playfair Display"
  },
  "secciones": {
    "hero": true,
    "categorias": true,
    "productos_destacados": true,
    "testimonios": false,
    "newsletter": true,
    "banner_promo": false
  },
  "layout": {
    "productos_por_fila": 3,
    "modo_oscuro": false,
    "header_sticky": true,
    "header_estilo": "centrado"
  },
  "textos": {
    "hero_titulo": "Bienvenido a Urban Style",
    "hero_subtitulo": "Moda que define tu actitud",
    "cta_principal": "Ver colección"
  },
  "logo_url": "/uploads/negocios/{id}/logo.png"
}
```

### Tareas de desarrollo

- [ ] Implementar `personalizarPlantilla()`
- [ ] Crear sistema de preview en tiempo real
- [ ] Implementar upload de logo (con almacenamiento en CDN/S3)
- [ ] Crear selector de tipografías con Google Fonts
- [ ] Implementar toggles de secciones
- [ ] Crear API `PUT /api/constructor/personalizacion`
- [ ] Crear migración para tabla `configuracion_visual`

---

## 10. 🛍️ Fase 5: Configuración de Catálogo

### Lógica adaptativa por tipo de negocio

El bot adapta las preguntas según el tipo de negocio detectado en la Fase 1.

#### Ejemplo: Tienda de Ropa

| Pregunta | Respuesta ejemplo |
|---|---|
| ¿Qué categorías de ropa? | Camisetas, Pantalones, Zapatos |
| ¿Qué tallas manejas? | S, M, L, XL |
| ¿Qué colores? | Negro, Blanco, Azul, Rojo |
| ¿Manejas inventario propio o dropshipping? | Inventario propio |

### Función

```typescript
generarEstructuraProductos(id_negocio: string, config: ConfigCatalogo): void
```

### Tablas creadas

#### Tabla `categorias`

| Campo | Tipo |
|---|---|
| `id_categoria` | UUID |
| `id_negocio` | UUID (FK) |
| `nombre` | VARCHAR(100) |
| `orden` | INT |

#### Tabla `productos` (estructura base)

| Campo | Tipo |
|---|---|
| `id_producto` | UUID |
| `id_negocio` | UUID (FK) |
| `id_categoria` | UUID (FK) |
| `nombre` | VARCHAR(200) |
| `descripcion` | TEXT |
| `precio` | DECIMAL(10,2) |
| `imagenes` | JSON |
| `variantes` | JSON |
| `stock` | INT |
| `estado` | ENUM('activo','borrador','agotado') |

#### Tabla `variantes_config`

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id_negocio` | UUID (FK) | — |
| `tallas` | JSON | `["S","M","L","XL"]` |
| `colores` | JSON | `["Negro","Blanco","Azul"]` |
| `tipo_inventario` | ENUM | `"propio"` / `"dropshipping"` |

### Tareas de desarrollo

- [ ] Implementar `generarEstructuraProductos()`
- [ ] Crear sistema adaptativo según tipo de negocio
- [ ] Crear migraciones para tablas `categorias`, `productos`, `variantes_config`
- [ ] Crear API `POST /api/constructor/catalogo`
- [ ] Implementar preguntas dinámicas en el chat
- [ ] Generar categorías sugeridas por IA según tipo de negocio

---

## 11. 📏 Fase 6: Reglas del Dominio

### Propósito

Evitar que los agentes IA vendan productos fuera del dominio del negocio. Si el negocio es de moda, el agente vendedor **no debe** ofrecer pollo ni tecnología.

### Función

```typescript
crearReglasDominio(id_negocio: string): void
// Se genera automáticamente basado en el tipo de negocio
```

### Datos guardados — Tabla `reglas_negocio`

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id_regla` | UUID | Auto |
| `id_negocio` | UUID (FK) | — |
| `dominio_permitido` | VARCHAR(100) | `"moda"` |
| `dominios_bloqueados` | JSON | `["comida","tecnología","salud"]` |
| `palabras_clave` | JSON | `["ropa","vestido","pantalón","zapato"]` |
| `palabras_prohibidas` | JSON | `["pollo","laptop","medicamento"]` |
| `reglas_personalizadas` | JSON | `[]` |

### Tareas de desarrollo

- [ ] Implementar `crearReglasDominio()` con generación automática por IA
- [ ] Crear migración para tabla `reglas_negocio`
- [ ] Crear API `POST /api/constructor/reglas-dominio`
- [ ] Permitir al usuario revisar y ajustar reglas generadas
- [ ] Integrar reglas en el prompt del agente vendedor

---

## 12. 🤖 Fase 7: Configuración de Agentes IA

### Preguntas del bot

| Pregunta | Para |
|---|---|
| *"¿Cómo quieres que se llame tu asesora de ventas?"* | Agente Vendedor |
| *"¿Qué personalidad quieres que tenga?"* (amigable, profesional, divertida) | Agente Vendedor |
| *"¿Cómo quieres que se llame tu agente administrador?"* | Agente Administrador |
| *"¿Qué estilo debe tener?"* (directo, detallado, resumido) | Agente Administrador |

### Función

```typescript
configurarAgentes(id_negocio: string, config: ConfigAgentes): void
```

### Datos guardados — Tabla `agentes`

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id_agente` | UUID | Auto |
| `id_negocio` | UUID (FK) | — |
| `tipo` | ENUM('vendedor','administrador') | `"vendedor"` |
| `nombre` | VARCHAR(100) | `"Sofía"` |
| `personalidad` | VARCHAR(100) | `"amigable y entusiasta"` |
| `prompt_base` | TEXT | Prompt completo generado |
| `avatar_url` | VARCHAR(500) | URL del avatar |
| `estado` | ENUM('activo','inactivo') | `"activo"` |

### Generación del `prompt_base`

Se genera automáticamente combinando:

- Tipo de negocio (Fase 1)
- Identidad de marca (Fase 3)
- Reglas de dominio (Fase 6)
- Personalidad elegida
- Catálogo disponible (Fase 5)

### Tareas de desarrollo

- [ ] Implementar `configurarAgentes()`
- [ ] Generar `prompt_base` dinámico por agente
- [ ] Crear migración para tabla `agentes`
- [ ] Crear API `POST /api/constructor/agentes`
- [ ] Crear galería de avatares para agentes
- [ ] Implementar preview de cómo se comporta el agente

---

## 13. 💳 Fase 8: Configuración Comercial

### Preguntas del bot

1. *"¿Qué métodos de pago aceptarás?"* (Tarjeta, transferencia, contra entrega, PayPal)
2. *"¿Cuál es tu política de devoluciones?"* (con opciones predefinidas o personalizada)
3. *"¿Cuál es el tiempo estimado de entrega?"*
4. *"¿A qué zonas envías?"*

### Función

```typescript
configurarComercial(id_negocio: string, config: ConfigComercial): void
```

### Datos guardados — Tabla `config_comercial`

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id_config` | UUID | Auto |
| `id_negocio` | UUID (FK) | — |
| `metodos_pago` | JSON | `["tarjeta","transferencia","contra_entrega"]` |
| `politica_devoluciones` | TEXT | `"30 días para devolución..."` |
| `tiempo_entrega` | VARCHAR(100) | `"3-5 días hábiles"` |
| `zonas_envio` | JSON | `["Nacional","Bogotá","Medellín"]` |
| `costo_envio` | JSON | `{"nacional": 15000, "local": 8000}` |
| `moneda` | VARCHAR(3) | `"COP"` |

### Tareas de desarrollo

- [ ] Implementar `configurarComercial()`
- [ ] Crear opciones predefinidas de políticas de devolución
- [ ] Crear migración para tabla `config_comercial`
- [ ] Crear API `POST /api/constructor/comercial`
- [ ] Integrar métodos de pago con pasarelas (futuro)

---

## 14. ⚙️ Fase 9: Automatizaciones

### Opciones disponibles

| Automatización | Descripción | Plan |
|---|---|---|
| 📦 Alertas de stock | Notifica cuando un producto tiene stock bajo | Free |
| 🤝 Recomendaciones | Sugiere productos al cliente basado en historial | Premium |
| 🔄 Cross-selling | Muestra productos complementarios | Premium |
| 📊 Reporte diario | Resumen diario de ventas y métricas | Free |
| 📧 Email automático | Confirmación de compra y seguimiento | Free |
| 🔔 Notificaciones push | Alertas al dueño del negocio | Premium |

### Datos guardados — Tabla `automatizaciones`

| Campo | Tipo | Ejemplo |
|---|---|---|
| `id_automatizacion` | UUID | Auto |
| `id_negocio` | UUID (FK) | — |
| `tipo` | VARCHAR(50) | `"alerta_stock"` |
| `activo` | BOOLEAN | `true` |
| `configuracion` | JSON | `{"umbral_stock": 5}` |

### Tareas de desarrollo

- [ ] Implementar sistema de automatizaciones activables
- [ ] Crear migración para tabla `automatizaciones`
- [ ] Crear API `POST /api/constructor/automatizaciones`
- [ ] Filtrar opciones según plan del usuario
- [ ] Implementar lógica de cada automatización (backend workers)

---

## 15. 🚀 Activación Final del Negocio

### Flujo de activación

```
Bot: "Tu negocio está listo. ¿Deseas activarlo ahora?"
        ↓
Usuario: "Sí"
        ↓
activarNegocio(id_negocio)
        ↓
UPDATE negocios SET estado = 'activo'
        ↓
Generar URL de tienda:
  → tuplataforma.com/tienda/{id_negocio}
        ↓
Bot: "¡Felicidades! 🎉 Tu negocio está activo.
      Tu tienda está disponible en:
      tuplataforma.com/tienda/{id_negocio}"
        ↓
Redirect → Preview de la tienda
```

### Función

```typescript
activarNegocio(id_negocio: string): {
  url: string;
  estado: 'activo';
}
```

### Cambios en BD

```sql
UPDATE negocios 
SET estado = 'activo', 
    url_tienda = '/tienda/{id_negocio}',
    fecha_activacion = NOW()
WHERE id_negocio = '{id_negocio}';
```

### Tareas de desarrollo

- [ ] Implementar `activarNegocio()`
- [ ] Generar URL dinámica de la tienda
- [ ] Crear página pública de tienda `/tienda/[id_negocio]`
- [ ] Renderizar tienda con la plantilla + configuración guardada
- [ ] Crear API `POST /api/negocios/{id}/activar`
- [ ] Mostrar preview antes de activar

---

## 16. 🗄️ Modelo de Base de Datos

### Diagrama de relaciones

```
usuarios (1) ──── (N) negocios
                       │
                       ├── (1) tema
                       ├── (1) marca
                       ├── (1) configuracion_visual
                       ├── (N) categorias ──── (N) productos
                       ├── (1) variantes_config
                       ├── (1) reglas_negocio
                       ├── (N) agentes
                       ├── (1) config_comercial
                       └── (N) automatizaciones
                       
plantillas (precargada, referenciada por configuracion_visual)
```

### Resumen de tablas

| # | Tabla | Descripción |
|---|---|---|
| 1 | `usuarios` | Datos del usuario registrado |
| 2 | `negocios` | Negocio creado por el usuario |
| 3 | `tema` | Tipo y dominio del negocio |
| 4 | `plantillas` | Catálogo de plantillas disponibles (precargada) |
| 5 | `marca` | Identidad visual de la marca |
| 6 | `configuracion_visual` | Personalización de la plantilla (JSON) |
| 7 | `categorias` | Categorías de productos |
| 8 | `productos` | Productos del catálogo |
| 9 | `variantes_config` | Configuración de tallas, colores, etc. |
| 10 | `reglas_negocio` | Reglas de dominio para agentes IA |
| 11 | `agentes` | Agentes IA configurados (vendedor, admin) |
| 12 | `config_comercial` | Pagos, envíos, devoluciones |
| 13 | `automatizaciones` | Automatizaciones activas |

---

## 17. 📁 Estructura de Carpetas del Proyecto

```
src/
├── app/
│   ├── page.tsx                              # Landing Page
│   ├── layout.tsx                            # Layout raíz
│   ├── globals.css                           # Estilos globales
│   │
│   ├── (auth)/
│   │   ├── registro/page.tsx                 # Registro
│   │   └── login/page.tsx                    # Login
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                        # Layout del dashboard
│   │   └── dashboard/
│   │       ├── page.tsx                      # Dashboard principal
│   │       └── negocio/
│   │           ├── nuevo/page.tsx            # Crear negocio
│   │           └── [id]/
│   │               ├── constructor/page.tsx  # Chat del constructor
│   │               └── editar/page.tsx       # Editar negocio
│   │
│   ├── tienda/
│   │   └── [id_negocio]/
│   │       ├── page.tsx                      # Tienda pública
│   │       └── producto/[id]/page.tsx        # Producto individual
│   │
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts
│       │   └── login/route.ts
│       ├── negocios/
│       │   ├── crear/route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       └── activar/route.ts
│       └── constructor/
│           ├── mensaje/route.ts
│           ├── tipo-negocio/route.ts
│           ├── plantilla/route.ts
│           ├── marca/route.ts
│           ├── personalizacion/route.ts
│           ├── catalogo/route.ts
│           ├── reglas-dominio/route.ts
│           ├── agentes/route.ts
│           ├── comercial/route.ts
│           └── automatizaciones/route.ts
│
├── components/
│   ├── ui/                    # Componentes base reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Toggle.tsx
│   │   └── ColorPicker.tsx
│   │
│   ├── landing/               # Componentes de la landing
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Agents.tsx
│   │   ├── Pricing.tsx
│   │   ├── Testimonials.tsx
│   │   └── Footer.tsx
│   │
│   ├── auth/                  # Componentes de autenticación
│   │   ├── RegisterForm.tsx
│   │   ├── LoginForm.tsx
│   │   └── SocialLogin.tsx
│   │
│   ├── dashboard/             # Componentes del dashboard
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── WelcomeEmpty.tsx
│   │   ├── BusinessList.tsx
│   │   └── BusinessCard.tsx
│   │
│   ├── constructor/           # Componentes del chat constructor
│   │   ├── ChatWindow.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ProgressSidebar.tsx
│   │   ├── QuickOptions.tsx
│   │   ├── TemplateGallery.tsx
│   │   └── ColorPalette.tsx
│   │
│   └── tienda/                # Componentes de la tienda pública
│       ├── StoreHeader.tsx
│       ├── ProductGrid.tsx
│       ├── ProductCard.tsx
│       └── StoreFooter.tsx
│
├── lib/
│   ├── db/                    # Base de datos
│   │   ├── schema.ts          # Esquema (Prisma/Drizzle)
│   │   ├── migrations/        # Migraciones
│   │   └── seed.ts            # Datos iniciales (plantillas)
│   │
│   ├── agents/                # Lógica de agentes IA
│   │   ├── constructor.ts
│   │   ├── vendedor.ts
│   │   ├── administrador.ts
│   │   └── prompts/
│   │       ├── constructor-system.ts
│   │       ├── vendedor-system.ts
│   │       └── administrador-system.ts
│   │
│   ├── auth/                  # Utilidades de autenticación
│   │   ├── session.ts
│   │   └── middleware.ts
│   │
│   └── utils/                 # Utilidades generales
│       ├── validators.ts
│       └── helpers.ts
│
├── hooks/                     # Custom hooks
│   ├── useAuth.ts
│   ├── useChat.ts
│   └── useNegocio.ts
│
├── types/                     # Tipos TypeScript
│   ├── usuario.ts
│   ├── negocio.ts
│   ├── agente.ts
│   └── constructor.ts
│
└── middleware.ts               # Middleware de Next.js (protección de rutas)
```

---

## 18. 🗓️ Roadmap de Desarrollo

### Sprint 1 — Fundamentos (Semana 1-2)

| # | Tarea | Prioridad |
|---|---|---|
| 1.1 | Configurar proyecto Next.js + Tailwind + TypeScript | 🔴 Alta |
| 1.2 | Configurar base de datos (PostgreSQL + Prisma/Drizzle) | 🔴 Alta |
| 1.3 | Crear esquema completo de BD y migraciones | 🔴 Alta |
| 1.4 | Implementar sistema de autenticación (registro/login) | 🔴 Alta |
| 1.5 | Crear middleware de protección de rutas | 🔴 Alta |
| 1.6 | Crear componentes UI base (Button, Input, Card, Modal) | 🟡 Media |

### Sprint 2 — Landing + Dashboard (Semana 3-4)

| # | Tarea | Prioridad |
|---|---|---|
| 2.1 | Diseñar e implementar Landing Page completa | 🔴 Alta |
| 2.2 | Implementar Dashboard con layout (sidebar + header) | 🔴 Alta |
| 2.3 | Implementar CRUD de negocios (crear, listar, eliminar) | 🔴 Alta |
| 2.4 | Crear estado vacío y listado de negocios | 🟡 Media |

### Sprint 3 — Agente Constructor: Chat Base (Semana 5-6)

| # | Tarea | Prioridad |
|---|---|---|
| 3.1 | Diseñar interfaz de chat conversacional | 🔴 Alta |
| 3.2 | Implementar máquina de estados del constructor | 🔴 Alta |
| 3.3 | Conectar con API de IA (OpenAI) | 🔴 Alta |
| 3.4 | Implementar barra de progreso lateral | 🟡 Media |
| 3.5 | Implementar opciones rápidas (botones en chat) | 🟡 Media |

### Sprint 4 — Fases 1-4 del Constructor (Semana 7-8)

| # | Tarea | Prioridad |
|---|---|---|
| 4.1 | Fase 1: Detectar tipo de negocio | 🔴 Alta |
| 4.2 | Fase 2: Selección de plantilla | 🔴 Alta |
| 4.3 | Fase 3: Identidad de marca | 🔴 Alta |
| 4.4 | Fase 4: Personalización de plantilla | 🔴 Alta |
| 4.5 | Crear sistema de plantillas con renderizado dinámico | 🔴 Alta |
| 4.6 | Implementar preview en tiempo real | 🟡 Media |

### Sprint 5 — Fases 5-9 del Constructor (Semana 9-10)

| # | Tarea | Prioridad |
|---|---|---|
| 5.1 | Fase 5: Configuración de catálogo | 🔴 Alta |
| 5.2 | Fase 6: Reglas de dominio (automáticas) | 🔴 Alta |
| 5.3 | Fase 7: Configuración de agentes IA | 🔴 Alta |
| 5.4 | Fase 8: Configuración comercial | 🟡 Media |
| 5.5 | Fase 9: Automatizaciones | 🟡 Media |
| 5.6 | Activación final del negocio | 🔴 Alta |

### Sprint 6 — Tienda Pública (Semana 11-12)

| # | Tarea | Prioridad |
|---|---|---|
| 6.1 | Renderizar tienda pública desde configuración guardada | 🔴 Alta |
| 6.2 | Implementar sistema de plantillas renderizables | 🔴 Alta |
| 6.3 | Crear páginas de producto individual | 🟡 Media |
| 6.4 | Integrar agente vendedor en la tienda | 🔴 Alta |
| 6.5 | SEO y optimización de rendimiento | 🟢 Baja |

### Sprint 7 — Pulido y Deploy (Semana 13-14)

| # | Tarea | Prioridad |
|---|---|---|
| 7.1 | Testing integral de todos los flujos | 🔴 Alta |
| 7.2 | Responsive design en todos los componentes | 🔴 Alta |
| 7.3 | Manejo de errores y estados de carga | 🟡 Media |
| 7.4 | Deploy en Vercel / servidor | 🔴 Alta |
| 7.5 | Configurar dominio y SSL | 🟡 Media |
| 7.6 | Seed de plantillas y datos iniciales | 🟡 Media |

---

## 🧩 Resumen: Capacidades del Agente Constructor

| # | Capacidad | Estado |
|---|---|---|
| 1 | Crear negocio | Por implementar |
| 2 | Detectar tipo de negocio | Por implementar |
| 3 | Clasificar dominio | Por implementar |
| 4 | Asignar plantilla | Por implementar |
| 5 | Validar plan del usuario | Por implementar |
| 6 | Personalizar diseño | Por implementar |
| 7 | Editar diseño en tiempo real | Por implementar |
| 8 | Guardar configuración dinámica (JSON) | Por implementar |
| 9 | Crear estructura de productos | Por implementar |
| 10 | Crear reglas de negocio | Por implementar |
| 11 | Configurar agentes IA | Por implementar |
| 12 | Configurar parte comercial | Por implementar |
| 13 | Activar automatizaciones | Por implementar |
| 14 | Generar preview | Por implementar |
| 15 | Permitir edición futura | Por implementar |
| 16 | Activar negocio | Por implementar |

> **Todo ligado a `id_usuario` + `id_negocio`. Nunca se mezclan.**

---

## 🧠 Resultado Final Esperado

Al completar la conversación con el Agente Constructor, el sistema tendrá:

- ✅ Usuario registrado
- ✅ Negocio creado con configuración completa
- ✅ Plantilla asignada y personalizada
- ✅ Identidad visual definida
- ✅ Reglas de dominio establecidas
- ✅ Agente vendedor personalizado y listo
- ✅ Agente administrador personalizado y listo
- ✅ Tienda pública disponible y lista para recibir clientes

**Y todo nació solo con una charla.** 💬✨
