# 📊 ESTADO ACTUAL DEL PROYECTO - Maket AI

**Fecha:** Marzo 1, 2026  
**Rama:** master  
**Estado general:** **70% Infraestructura | 20% Orquestador | 0% Agentes Vendedor/Admin**

---

## ✅ LO QUE YA ESTÁ HECHO

### 🗄️ **Base de Datos (100% Completa)**
- ✅ **13 tablas** creadas y funcionando:
  1. `usuarios` - Autenticación multi-tenant
  2. `negocios` - Múltiples negocios por usuario
  3. `tema` - Tipo de negocio e industria
  4. `plantillas` - 6 plantillas precargadas
  5. `marca` - Identidad visual (colores, logo, tono)
  6. `configuracion_visual` - Personalización de plantilla
  7. `categorias` - Categorías de productos por negocio
  8. `productos` - Catálogo completo con variantes
  9. `variantes_config` - Tallas, colores, inventario
  10. `reglas_negocio` - Dominios permitidos/prohibidos
  11. **`agentes`** - IA vendedor + administrador ⭐
  12. `config_comercial` - Pagos, envíos, moneda
  13. `automatizaciones` - Triggers y automatizaciones

- ✅ **RLS (Row Level Security)** configurado
- ✅ **Índices** optimizados
- ✅ **Triggers** para `updated_at`
- ✅ **Plantillas** precargadas (Minimal, Modern, Classic, etc.)

**Archivo:** [supabase-schema.sql](supabase-schema.sql)

---

### 🎨 **Frontend - Dashboard (80% Completo)**

#### ✅ Componentes Existentes:
- **Dashboard:**
  - [Header](src/components/dashboard/Header.tsx) - Navegación y usuario
  - [Sidebar](src/components/dashboard/Sidebar.tsx) - Menú lateral
  - [BusinessList](src/components/dashboard/BusinessList.tsx) - Lista de negocios
  - [BusinessCard](src/components/dashboard/BusinessCard.tsx) - Card individual
  - [WelcomeEmpty](src/components/dashboard/WelcomeEmpty.tsx) - Estado vacío

- **Constructor (Orquestador):**
  - [ChatWindow](src/components/constructor/ChatWindow.tsx) - **382 líneas** ⭐
  - [ChatMessage](src/components/constructor/ChatMessage.tsx) - Mensajes bot/usuario
  - [ChatInput](src/components/constructor/ChatInput.tsx) - Input con opciones rápidas
  - [ProgressSidebar](src/components/constructor/ProgressSidebar.tsx) - Progreso 11 fases

- **Autenticación:**
  - [LoginForm](src/components/auth/LoginForm.tsx)
  - [RegisterForm](src/components/auth/RegisterForm.tsx)
  - Forms con Supabase

**Estado:** UI completa, falta lógica backend

---

### 🧠 **Lógica del Constructor (40% Completo)**

#### ✅ Lo que funciona:
- **11 fases definidas** en [constructor.ts](src/types/constructor.ts):
  ```typescript
  "inicio" → "tipo_negocio" → "plantilla" → "marca" → 
  "personalizacion" → "catalogo" → "reglas_dominio" → 
  "agentes" → "comercial" → "automatizaciones" → "activacion"
  ```

- **Store Zustand** funcional en [constructor-store.ts](src/lib/store/constructor-store.ts):
  - ✅ Manejo de mensajes
  - ✅ Progreso por fase
  - ✅ Porcentaje de completitud

- **Respuestas hardcodeadas** por fase en ChatWindow:
  - ✅ Mensajes bot predefinidos
  - ✅ Opciones rápidas por fase
  - ✅ Avance de fase automático

#### ❌ Lo que falta:
- ❌ **Integración con IA** (OpenAI/Claude)
- ❌ **Guardar conversación en DB**
- ❌ **Ejecutar acciones por fase** (crear registros en tablas)
- ❌ **Detección automática de tipo de negocio**

**API Route:** [route.ts](src/app/api/constructor/mensaje/route.ts) - Solo estructura, 3 TODOs

---

### 🏪 **Tienda Pública (20% Completo)**

#### ✅ Lo que existe:
- [page.tsx](src/app/tienda/[id_negocio]/page.tsx) - **287 líneas**
- UI completa: navbar, productos, footer, chatbot placeholder
- Datos de ejemplo hardcodeados (Urban Style demo)

#### ❌ Lo que falta:
- ❌ Cargar configuración real desde DB
- ❌ **Agente vendedor funcionando** (María/Sofía/Alex/etc.)
- ❌ Sistema de perfiles de cliente
- ❌ Carrito y checkout real

---

### 📁 **Estructura de Archivos**
```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/              ✅ Dashboard completo
│   │   │   └── negocio/[id]/
│   │   │       └── constructor/    ✅ UI del Orquestador
│   ├── tienda/[id_negocio]/        🟡 Layout, sin backend
│   └── api/
│       ├── auth/                   ✅ Login/Register
│       ├── negocios/               ✅ CRUD básico
│       └── constructor/mensaje/    ❌ Solo TODOs
│
├── components/                     ✅ UI completa
├── lib/
│   ├── database.types.ts          ✅ 283 líneas
│   ├── supabase.ts                ✅ Cliente configurado
│   └── store/
│       ├── constructor-store.ts   ✅ Estado del chat
│       ├── negocio-store.ts       ✅ Lista de negocios
│       └── auth-store.ts          ✅ Usuario actual
│
└── types/
    ├── constructor.ts             ✅ 11 fases + tipos
    ├── negocio.ts                 ✅ Interfaces
    └── usuario.ts                 ✅ User types
```

---

## ❌ LO QUE FALTA IMPLEMENTAR

### 🚨 **CRÍTICO (Para que funcione end-to-end)**

#### 1. **Orquestador - Backend Real** ⚡
**Ubicación:** `src/app/api/constructor/mensaje/route.ts`

**Pendiente:**
```typescript
// ❌ TODO: Process with AI (OpenAI API)
// ❌ TODO: Save conversation to database
// ❌ TODO: Execute phase-specific functions
```

**Acciones por fase:**
- `tipo_negocio` → Crear registro en `tema`
- `plantilla` → Crear registro en `configuracion_visual`
- `marca` → Crear registro en `marca`
- `catalogo` → Crear categorías y productos (bulk)
- `reglas_dominio` → Crear registro en `reglas_negocio`
- `agentes` → **Crear 2 registros en tabla `agentes`** (vendedor + admin)
- `comercial` → Crear registro en `config_comercial`
- `automatizaciones` → Crear registros en `automatizaciones`
- `activacion` → UPDATE `negocios.estado = 'activo'`

**Tiempo estimado:** 3-4 días

---

#### 2. **Agente Vendedor - Implementación** 🤖
**Ubicación:** Nueva API route `src/app/api/tienda/[id_negocio]/chat/route.ts`

**Pendiente:**
- ❌ Cargar agente específico desde `agentes` table
- ❌ Sistema de prompts por industria (clothing, tech, food, etc.)
- ❌ Integración con IA (OpenAI/Claude)
- ❌ Cargar catálogo del negocio
- ❌ Sistema de perfiles de cliente

**Nuevas tablas necesarias:**
```sql
-- ❌ FALTA: customer_profiles (aprendizaje)
CREATE TABLE customer_profiles (
    id_profile UUID PRIMARY KEY,
    id_negocio UUID REFERENCES negocios,
    identificador_cliente VARCHAR(255), -- email, phone, o anónimo
    preferencias JSONB,
    historial_conversaciones JSONB,
    ultima_interaccion TIMESTAMP
);

-- ❌ FALTA: conversaciones (guardar chats)
CREATE TABLE conversaciones (
    id_conversacion UUID PRIMARY KEY,
    id_negocio UUID REFERENCES negocios,
    id_profile UUID REFERENCES customer_profiles,
    mensajes JSONB,
    created_at TIMESTAMP
);
```

**Tiempo estimado:** 1 semana

---

#### 3. **Agente Administrador (Max) - Implementación** 📊
**Ubicación:** Nueva API route `src/app/api/agentes/admin/route.ts`

**Pendiente:**
- ❌ 15 funciones autónomas:
  1. Detectar stock bajo → Alerta
  2. Optimizar precios (competencia)
  3. Promociones automáticas (baja demanda)
  4. Reporte diario/semanal/mensual
  5. Análisis de ventas (productos top)
  6. Sugerencias de reposición
  7. Detección de fraude
  8. Análisis de feedback
  9. Optimización de catálogo (quitar no vendidos)
  10. Proyección de inventario
  11. Alertas de métricas críticas
  12. Segmentación de clientes
  13. A/B testing automático
  14. Gestión de costos
  15. Backup y recuperación

**Nueva tabla necesaria:**
```sql
-- ❌ FALTA: autonomous_actions (log de decisiones)
CREATE TABLE autonomous_actions (
    id_action UUID PRIMARY KEY,
    id_negocio UUID REFERENCES negocios,
    id_agente UUID REFERENCES agentes,
    tipo_accion VARCHAR(50),
    descripcion TEXT,
    datos JSONB,
    resultado VARCHAR(20), -- 'success', 'failed'
    created_at TIMESTAMP
);
```

**Tiempo estimado:** 2 semanas

---

#### 4. **Sistema de Plantillas por Industria** 📚
**Ubicación:** `src/lib/templates/` (nuevo directorio)

**Pendiente:**
- ❌ Crear biblioteca de prompts:
  ```
  templates/
  ├── vendedor/
  │   ├── restaurante.ts         (María - toma pedidos)
  │   ├── tienda_ropa.ts         (Sofía - asesora tallas)
  │   ├── tecnologia.ts          (Alex - compara specs)
  │   ├── gimnasio.ts            (Coach Mike - planes)
  │   ├── educacion.ts           (Prof. Ana - cursos)
  │   └── _base.ts               (fallback genérico)
  │
  └── admin/
      ├── restaurante.ts         (gestión ingredientes)
      ├── tienda_ropa.ts         (gestión tallas/colores)
      └── _base.ts               (funciones genéricas)
  ```

- ❌ Sistema de detección:
  ```typescript
  function detectarTipoNegocio(descripcion: string): string {
    // IA clasifica: 'restaurante', 'tienda_ropa', 'tecnologia', etc.
  }
  
  function cargarPlantillaVendedor(tipo: string) {
    // Carga prompt específico o _base.ts
  }
  ```

**Tiempo estimado:** 3-4 días

---

#### 5. **Cargar Tienda Real desde DB** 🔌
**Ubicación:** `src/app/tienda/[id_negocio]/page.tsx`

**Pendiente:**
```typescript
// ❌ REEMPLAZAR datos hardcodeados con:
async function getStoreConfig(id_negocio: string) {
  const { data: negocio } = await supabase
    .from('negocios')
    .select(`
      *,
      marca (*),
      productos (*),
      categorias (*),
      agentes (*)
    `)
    .eq('id_negocio', id_negocio)
    .single();
  
  return negocio;
}
```

**Tiempo estimado:** 1 día

---

## 🎯 PLAN DE ACCIÓN - 3 OPCIONES

### **Opción A: Flujo Universal Mínimo (Recomendado)** ⭐
**Objetivo:** Sistema completo que funcione para CUALQUIER industria

**Orden:**
1. **Día 1-2:** Sistema de detección automática de industria + biblioteca de plantillas
2. **Día 3-4:** Implementar Orquestador backend universal (guarda en BD según tipo detectado)
3. **Día 5:** Conectar tienda a BD real
4. **Día 6-8:** Agente Vendedor ADAPTABLE (carga prompt según industria)
5. **Día 9:** Crear tablas faltantes (customer_profiles, conversaciones)
6. **Día 10-12:** Integrar IA real (OpenAI con detección + prompts dinámicos)

**Resultado:** Usuario crea CUALQUIER negocio (ropa, tech, restaurante, gym, etc.) → Agente especializado atiende clientes

**Ventajas:**
- ✅ Universal desde día 1 (no limitado a 1 industria)
- ✅ Demo funcional multi-industria en 12 días
- ✅ Validación con diferentes tipos de negocio
- ✅ Escalable sin refactoring

---

### **Opción B: Infraestructura Primero**
**Objetivo:** Completar todas las tablas y estructura antes de features

**Orden:**
1. **Día 1-3:** Crear tablas faltantes (customer_profiles, conversaciones, autonomous_actions)
2. **Día 4-5:** Configurar triggers y RLS
3. **Día 6-10:** Biblioteca de plantillas (6+ industrias)
4. **Día 11-15:** Orquestador completo con IA
5. **Día 16-20:** Agentes vendedor + admin

**Resultado:** Infraestructura sólida, pero sin demo funcional hasta semana 3

**Ventajas:**
- ✅ Base muy sólida
- ✅ Menos refactoring después
- ❌ Sin demo rápido

---

### **Opción C: Agentes Primero (Riesgoso)**
**Objetivo:** Implementar agentes inteligentes sin preocuparse de multi-tenant

**Orden:**
1. **Día 1-3:** Agente vendedor standalone (sin DB)
2. **Día 4-6:** Agente admin standalone
3. **Día 7-10:** Conectar a proyecto existente
4. **Día 11-15:** Integrar tablas faltantes

**Resultado:** Agentes muy buenos, pero desconectados del sistema

**Ventajas:**
- ✅ Pruebas rápidas de IA
- ❌ Mucho refactor después
- ❌ No es escalable

---

## 🚀 MI RECOMENDACIÓN

### **OPCIÓN A - Flujo Universal** (12 días)

**Sprint 1 (Días 1-2):** Sistema de Detección + Plantillas
- Crear `src/lib/templates/` con biblioteca de prompts
- Implementar `detectarTipoNegocio(descripcion)` con IA
- Mapeo: tipo_negocio → prompt_template
- **Industrias iniciales:** restaurante, tienda_ropa, tecnologia, gimnasio, educacion, servicios

**Sprint 2 (Días 3-4):** Orquestador Universal
- Implementar `POST /api/constructor/mensaje`
- Fase "tipo_negocio": detecta industria automáticamente
- Fase "agentes": crea vendedor CON prompt adaptado
- Guardar todo en BD según tipo detectado

**Sprint 3 (Día 5):** Conectar Tienda
- Cargar configuración real desde BD
- Mostrar productos dinámicos
- Cargar agente vendedor específico

**Sprint 4 (Días 6-8):** Agente Vendedor Universal
- Crear tablas `customer_profiles`, `conversaciones`
- Implementar `POST /api/tienda/[id]/chat`
- Cargar prompt según `agentes.tipo` y `tema.tipo_negocio`
- Sistema de fallback: si no hay plantilla → usa genérica

**Sprint 5 (Días 9-10):** Integración IA
- OpenAI en detección de industria
- OpenAI en orquestador (conversacional)
- OpenAI en vendedor (con prompt dinámico)

**Sprint 6 (Días 11-12):** Testing Multi-Industria
- Crear 1 negocio de cada tipo
- Validar que cada agente se comporta diferente
- Refinamiento de prompts

**✅ Entregable:** Sistema universal que funciona para 6+ industrias diferentes

---

## 📝 PRÓXIMOS PASOS INMEDIATOS

### **Si eliges Opción A, empezar con:**

1. **Crear biblioteca de plantillas:** `src/lib/templates/vendedor/`
   ```typescript
   // restaurante.ts
   export const promptRestaurante = `Eres María, mesera experta...`;
   
   // tienda_ropa.ts
   export const promptTiendaRopa = `Eres Sofía, asesora de moda...`;
   
   // tecnologia.ts
   export const promptTecnologia = `Eres Alex, experto en tecnología...`;
   
   // _base.ts (fallback)
   export const promptGenerico = `Eres un asistente de ventas...`;
   ```

2. **Crear detector de industria:** `src/lib/constructor/detector.ts`
   ```typescript
   export async function detectarTipoNegocio(descripcion: string) {
     const prompt = `Clasifica este negocio: "${descripcion}"
     Opciones: restaurante, tienda_ropa, tecnologia, gimnasio, educacion, servicios, otro`;
     
     const respuesta = await openai.chat.completions.create({...});
     return respuesta.choices[0].message.content;
   }
   
   export function cargarPromptVendedor(tipo: string) {
     const templates = {
       'restaurante': promptRestaurante,
       'tienda_ropa': promptTiendaRopa,
       'tecnologia': promptTecnologia,
       // ... etc
     };
     return templates[tipo] || promptGenerico; // fallback
   }
   ```

3. **Actualizar Orquestador:** `src/app/api/constructor/mensaje/route.ts`
   ```typescript
   switch(fase) {
     case 'tipo_negocio': 
       const tipo = await detectarTipoNegocio(mensaje); // ⭐ IA detecta
       await crearTema(id_negocio, tipo);
       break;
       
     case 'agentes':
       const prompt = cargarPromptVendedor(tipo); // ⭐ Carga plantilla
       await crearAgentes(id_negocio, tipo, prompt);
       break;
   }
   ```

4. **Testing Multi-Industria:**
   - Usuario 1: "Quiero vender hamburguesas" → María (restaurante)
   - Usuario 2: "Vendo ropa urbana" → Sofía (tienda_ropa)
   - Usuario 3: "Laptops y celulares" → Alex (tecnología)
   - Verificar que cada agente se comporta diferente

---

## 📊 MÉTRICAS ACTUALES

| Componente | Completitud | LOC | Estado |
|-----------|-------------|-----|--------|
| Base de datos | 100% | 217 líneas | ✅ Producción |
| Tipos TypeScript | 100% | 283 líneas | ✅ Completo |
| UI Dashboard | 80% | ~800 líneas | 🟡 Falta backend |
| UI Constructor | 90% | 382 líneas | 🟡 Hardcodeado |
| UI Tienda Pública | 20% | 287 líneas | 🟡 Sin BD |
| API Constructor | 10% | 32 líneas | ❌ Solo TODOs |
| API Vendedor | 0% | 0 líneas | ❌ No existe |
| API Admin | 0% | 0 líneas | ❌ No existe |
| Sistema Plantillas | 0% | 0 líneas | ❌ No existe |
| **TOTAL PROYECTO** | **45%** | ~2000 líneas | 🔨 En desarrollo |

---

## 🎯 DECISIÓN

**¿Qué opción prefieres?**

A) **Flujo Mínimo** (10 días, demo rápido) ⭐ RECOMENDADO  
B) **Infraestructura** (20 días, base sólida)  
C) **Agentes** (15 días, riesgoso)

**Responde con A, B o C y empezamos inmediatamente.**

### 💡 **Mi Recomendación: Opción A - Universal**

**12 días para tener:**
- Usuario crea **CUALQUIER tipo de negocio** con Orquestador
- Sistema **detecta automáticamente** la industria
- Agente vendedor **se adapta** (María para restaurante, Sofía para ropa, Alex para tech)
- **6+ industrias** funcionando desde el inicio
- Todo conectado end-to-end

**Diferencias clave vs enfoque "solo restaurante":**
| Aspecto | ❌ Solo Restaurante | ✅ Universal (Opción A) |
|---------|---------------------|-------------------------|
| Detección | Hardcoded | IA detecta automáticamente |
| Prompts | 1 fijo | Biblioteca con 6+ plantillas |
| Agentes | Solo María | María, Sofía, Alex, Coach Mike, etc. |
| Escalabilidad | Refactor después | Agregar industrias = 1 archivo nuevo |
| Tiempo | 10 días | 12 días (+2 días por universalidad) |

---

**¿Qué opción prefieres?**

A) **Flujo Universal** (12 días, multi-industria