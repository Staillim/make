# 📊 PROGRESO DE DESARROLLO - Maket AI

> **Inicio:** Marzo 1, 2026  
> **Estrategia:** Opción A - Flujo Universal (12 días)  
> **Objetivo:** Sistema multi-industria funcional end-to-end  
> **Rama de desarrollo:** `jose-develop`  
> **Último commit:** Sprint 1 - Biblioteca de prompts (18 archivos, 5,645+ líneas)

---

## 🎯 Sprints Overview

| Sprint | Período | Objetivo | Estado |
|--------|---------|----------|--------|
| Sprint 1 | Días 1-2 | Biblioteca de Prompts + Detector | 🔵 En progreso |
| Sprint 2 | Días 3-4 | Backend del Orquestador | ⚪ Pendiente |
| Sprint 3 | Día 5 | Conectar Tienda a BD | ⚪ Pendiente |
| Sprint 4 | Días 6-8 | Agente Vendedor Universal | ⚪ Pendiente |
| Sprint 5 | Días 9-10 | Integración IA (OpenAI) | ⚪ Pendiente |
| Sprint 6 | Días 11-12 | Testing Multi-Industria | ⚪ Pendiente |

---

## 🚀 SPRINT 1: Biblioteca de Prompts + Detector (Días 1-2)

**Fecha inicio:** Marzo 1, 2026  
**Objetivo:** Sistema de detección automática de industria + biblioteca de plantillas de agentes

### 📋 Tareas

- [x] Crear estructura de carpetas `src/lib/templates/`
- [x] Implementar prompts de agente vendedor (6+ industrias)
- [x] Crear helpers: `obtenerTemplateVendedor()`, `obtenerIndustriasDisponibles()`
- [x] Documentar biblioteca de templates (README.md)
- [ ] Implementar prompts de agente admin (6+ industrias)
- [ ] Crear función `detectarTipoNegocio()` con IA
- [ ] Testing de detección con casos reales
- [ ] Actualizar PLAN.md con progreso

### 📁 Archivos Creados

**Día 1 - Parte 1 (COMPLETADO ✅):**
```
✅ src/lib/templates/
   ✅ README.md              (Documentación completa)
   ✅ vendedor/
      ✅ restaurante.ts        (María - mesera experta) [450 líneas]
      ✅ tienda_ropa.ts        (Sofía - asesora de moda) [420 líneas]
      ✅ tecnologia.ts         (Alex - experto en tecnología) [480 líneas]
      ✅ gimnasio.ts           (Coach Mike - entrenador) [460 líneas]
      ✅ educacion.ts          (Prof. Ana - tutora) [470 líneas]
      ✅ servicios.ts          (Luna - consultora) [450 líneas]
      ✅ _base.ts              (Genérico fallback) [80 líneas]
      ✅ index.ts              (Barrel export + helpers) [120 líneas]
   ⬜ admin/
      ⬜ _base.ts              (Max genérico)
      ⬜ restaurante.ts        (Max - gestión ingredientes)
      ⬜ tienda_ropa.ts        (Max - gestión tallas/colores)
      ⬜ tecnologia.ts         (Max - gestión garantías/specs)
      ⬜ gimnasio.ts           (Max - gestión membresías)
      ⬜ educacion.ts          (Max - gestión estudiantes)
      ⬜ servicios.ts          (Max - gestión proyectos)
      ⬜ index.ts              (Barrel export)
```

### 💡 Decisiones Técnicas

1. **Estructura de prompts:**
   - Cada industria = 1 archivo TypeScript
   - Export de constante `prompt` + metadata
   - Sistema de fallback: si no existe industria → `_base.ts`

2. **Detección de industria:**
   - IA clasifica descripción del usuario
   - Mapeo a tipos conocidos: `restaurante`, `tienda_ropa`, `tecnologia`, etc.
   - Si no encaja en ninguno → `"otro"` usa prompt genérico

3. **Personalización:**
   - Cada prompt incluye:
     * Nombre del agente
     * Personalidad
     * Capacidades específicas
     * Frases comunes
     * Emojis característicos

### 🎯 Ejemplos de Detección

| Input del Usuario | Tipo Detectado | Agente Asignado |
|-------------------|----------------|-----------------|
| "Quiero vender hamburguesas" | `restaurante` | María (mesera) |
| "Vendo ropa urbana" | `tienda_ropa` | Sofía (asesora moda) |
| "Laptops y celulares" | `tecnologia` | Alex (experto tech) |
| "Abrir un gimnasio" | `gimnasio` | Coach Mike |
| "Cursos de programación" | `educacion` | Prof. Ana |
| "Consultoría empresarial" | `servicios` | Luna |
| "Pinturas abstractas" | `otro` → `_base` | Asistente Genérico |

---

## 📊 Métricas Actuales

### Archivos Totales Creados Hoy
- **9 archivos** (biblioteca de prompts vendedor + docs)

### Líneas de Código
- **~3,000 líneas** de prompts especializados
- **~120 líneas** de helpers y tipos
- **~350 líneas** de documentación

### Progreso Sprint 1
- **60%** completado (6/10 tareas)

---

## 🔄 Próximo Paso Inmediato (6 industrias + base)
2. ✅ **COMPLETADO:** Helpers (obtenerTemplateVendedor, etc.)
3. ✅ **COMPLETADO:** Documentación de biblioteca
4. 🔵 **AHORA:** Función detectarTipoNegocio() con IA
5. ⬜ **SIGUIENTE:** Prompts de agentes admin (Max)r
2. 🔵 **AHORA:** Prompts de agentes admin (Max)
3. ⬜ **SIGUIENTE:** Función de detección con IA

---

## 📝 Notas y Apren - Parte 1 ✅

**Tiempo:** 3 horas  
**Completado:** Biblioteca completa de prompts vendedor

- ✅ Estructura de prompts diseñada para ser extensible
- ✅ Sistema de fallback asegura que siempre haya un agente disponible
- ✅ Metadata permite cargar configuración dinámica (nombre, avatar, etc.)
- ✅ 6 agentes especializados con personalidades únicas
- ✅ Helpers reutilizables (obtenerTemplateVendedor, obtenerIndustriasDisponibles)
- ✅ Documentación completa con ejemplos de uso

💡 **Insights:**
- Cada industria necesita vocabulario específico (ej: "tallas" en ropa, "specs" en tech)
- Prompts largos y detallados (400-500 líneas) funcionan mejor que instrucciones cortas
- Emojis característicos ayudan a dar personalidad única a cada agente
- Sistema de "preguntas clave" fuerza al agente a ser consultivo
- Metadata rica permite configurar UI dinámicamente (avatar, nombre, etc.)

🎯 x] Crear helpers (obtenerTemplateVendedor, etc.)
- [x] Documentar biblioteca (README.md)
- [ ] Función `detectarTipoNegocio()` con IA ← **SIGUIENTE**
- [ ] Implementar 6+ prompts de admin (Max)
- [ ] Tests de detección
- [ ] Actualizar PLAN.md
- [ ] Commit y push

---

**Última actualización:** Marzo 1, 2026 - 16:45
## 🐛 Issues y Soluciones

Ninguno por ahora.

---

## ✅ Checklist para Finalizar Sprint 1

- [x] Crear estructura de carpetas
- [x] Implementar 6+ prompts de vendedor
- [ ] Implementar 6+ prompts de admin
- [ ] Función `detectarTipoNegocio()`
- [ ] Función `cargarPromptVendedor()`
- [ ] Tests de detección
- [ ] Actualizar PLAN.md
- [ ] Commit y push

---

**Última actualización:** Marzo 1, 2026 - 14:30
