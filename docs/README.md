# 📚 Documentación - Maket AI

> Toda la documentación del proyecto organizada por categorías temáticas.

---

## 📁 Estructura de Carpetas

```
docs/
├── CORE/               # Documentos esenciales del proyecto
│   ├── STATUS.md       # 🔥 Análisis crítico completo (LEER PRIMERO)
│   ├── BLUEPRINT.md    # Single source of truth técnico
│   └── CONTRIBUTING.md # Guía de contribución
│
├── ARCHITECTURE/       # Arquitectura técnica detallada
│   ├── ARCHITECTURE.md              # Arquitectura de software (800+ líneas)
│   ├── ARQUITECTURA_MULTI_NEGOCIO.md # Sistema multi-tenant
│   └── API_REFERENCE.md             # Referencia APIs (600+ líneas)
│
├── FEATURES/           # Funcionalidades específicas
│   ├── AGENTES_UNIVERSALES.md      # Sistema de agentes IA
│   ├── CRM.md                       # Sistema CRM (diseño)
│   ├── CRM_ANALYTICS.md             # Analytics avanzado (diseño)
│   └── MIS_NEGOCIOS_COMPLETADO.md   # Funcionalidad "Mis Negocios"
│
└── GUIDES/             # Guías prácticas y referencias
    ├── GOOGLE_OAUTH_SETUP.md        # Setup Google OAuth
    ├── RLS_FIX_INSTRUCTIONS.md      # Fix RLS policies
    └── PLAN.md                      # Roadmap histórico (referencia)
```

---

## 🔥 Empieza Aquí

### 1️⃣ **[STATUS.md](CORE/STATUS.md)** - Análisis Crítico Completo

**¿Por qué leer esto primero?**
- 📊 Métricas reales verificadas (3,770 LoC)
- 🎯 Scoring honesto: 8.0/10
- ✅ Fortalezas del proyecto (arquitectura 9/10)
- ⚠️ Debilidades críticas (5 TODOs bloqueantes)
- 🚀 Roadmap realista a MVP (4 semanas)
- 💰 Modelo de negocio sugerido (Free/$29/$99)
- 🐛 Bugs conocidos con soluciones

**Contiene:**
- Estado real por componente (Auth 100%, Constructor 95%, CRM 30%, Carrito 0%)
- Análisis de viabilidad comercial (89.6% margen bruto)
- Gap analysis: Diseño vs Implementación
- Plan de acción inmediato (próximos 30 días)

---

### 2️⃣ **[BLUEPRINT.md](CORE/BLUEPRINT.md)** - Single Source of Truth

**Qué encontrarás:**
- Visión global del proyecto
- Decisiones técnicas clave
- Estado de implementación actualizado
- Próximos pasos priorizados

---

### 3️⃣ **[ARCHITECTURE.md](ARCHITECTURE/ARCHITECTURE.md)** - Arquitectura Técnica

**Profundiza en:**
- Arquitectura de capas (Presentación → Lógica → Datos → IA)
- Data flows completos (7 pasos detallados)
- Sistema de agentes internals
- Base de datos con RLS (Row Level Security)
- Escalabilidad y decisiones arquitectónicas

---

## 📖 Guías por Rol

### 👨‍💻 **Para Desarrolladores**

**Setup inicial:**
1. [README.md](../README.md) - Instalación y configuración
2. [CONTRIBUTING.md](CORE/CONTRIBUTING.md) - Git workflow, standards, PR checklist

**Arquitectura:**
1. [ARCHITECTURE.md](ARCHITECTURE/ARCHITECTURE.md) - Capas y flujos
2. [ARQUITECTURA_MULTI_NEGOCIO.md](ARCHITECTURE/ARQUITECTURA_MULTI_NEGOCIO.md) - Multi-tenant
3. [API_REFERENCE.md](ARCHITECTURE/API_REFERENCE.md) - Endpoints documentados

**Features:**
1. [AGENTES_UNIVERSALES.md](FEATURES/AGENTES_UNIVERSALES.md) - Sistema de agentes IA
2. [CRM.md](FEATURES/CRM.md) - Sistema CRM (30% implementado)

**Troubleshooting:**
1. [RLS_FIX_INSTRUCTIONS.md](GUIDES/RLS_FIX_INSTRUCTIONS.md) - Fix RLS policies
2. [GOOGLE_OAUTH_SETUP.md](GUIDES/GOOGLE_OAUTH_SETUP.md) - Setup OAuth

---

### 📊 **Para Product Managers / Stakeholders**

**Entender el estado:**
1. [STATUS.md](CORE/STATUS.md) - ⭐ **EMPIEZA AQUÍ** (análisis crítico completo)
2. [BLUEPRINT.md](CORE/BLUEPRINT.md) - Visión y decisiones

**Roadmap:**
1. [STATUS.md - Roadmap 4 semanas](CORE/STATUS.md#-roadmap-a-mvp)
2. [PLAN.md](GUIDES/PLAN.md) - Roadmap histórico (referencia)

**Features diseñadas:**
1. [CRM.md](FEATURES/CRM.md) - Sistema CRM (600+ líneas diseñadas)
2. [CRM_ANALYTICS.md](FEATURES/CRM_ANALYTICS.md) - Analytics (1,500+ líneas diseñadas)

---

### 🚀 **Para Contributors**

**Primeros pasos:**
1. [README.md](../README.md) - Clone + Install
2. [CONTRIBUTING.md](CORE/CONTRIBUTING.md) - Git workflow
3. [STATUS.md - Bugs Conocidos](CORE/STATUS.md#-bugs-conocidos) - Issues abiertos

**Arquitectura:**
1. [ARCHITECTURE.md](ARCHITECTURE/ARCHITECTURE.md) - Entender el sistema
2. [API_REFERENCE.md](ARCHITECTURE/API_REFERENCE.md) - Endpoints disponibles

**Guías:**
1. [GOOGLE_OAUTH_SETUP.md](GUIDES/GOOGLE_OAUTH_SETUP.md) - Setup OAuth
2. [RLS_FIX_INSTRUCTIONS.md](GUIDES/RLS_FIX_INSTRUCTIONS.md) - Troubleshoot RLS

---

## 🎯 Documentos por Prioridad

### 🔥 **Críticos (LEER AHORA)**
1. [**STATUS.md**](CORE/STATUS.md) - Análisis completo del proyecto
2. [BLUEPRINT.md](CORE/BLUEPRINT.md) - Single source of truth

### ✅ **Actualizados (Alta Prioridad)**
1. [ARCHITECTURE.md](ARCHITECTURE/ARCHITECTURE.md) - Arquitectura detallada
2. [API_REFERENCE.md](ARCHITECTURE/API_REFERENCE.md) - APIs documentadas
3. [CONTRIBUTING.md](CORE/CONTRIBUTING.md) - Guía de contribución

### 🎨 **Diseño (Implementación Parcial)**
1. [CRM.md](FEATURES/CRM.md) - 30% implementado
2. [CRM_ANALYTICS.md](FEATURES/CRM_ANALYTICS.md) - 10% implementado

### 📖 **Guías de Referencia**
1. [GOOGLE_OAUTH_SETUP.md](GUIDES/GOOGLE_OAUTH_SETUP.md)
2. [RLS_FIX_INSTRUCTIONS.md](GUIDES/RLS_FIX_INSTRUCTIONS.md)
3. [PLAN.md](GUIDES/PLAN.md) - Histórico

---

## 📊 Estado de la Documentación

| Categoría | Total Docs | Actualizados | En Progreso | Diseño |
|-----------|------------|--------------|-------------|--------|
| **CORE** | 3 | 3 ✅ | 0 | 0 |
| **ARCHITECTURE** | 3 | 3 ✅ | 0 | 0 |
| **FEATURES** | 4 | 2 ✅ | 0 | 2 🎨 |
| **GUIDES** | 3 | 2 ✅ | 0 | 1 📚 |
| **TOTAL** | **13** | **10** | **0** | **3** |

**Cobertura:** 76.9% actualizada

---

## 🔄 Última Actualización

- **Fecha:** 1 de Marzo, 2026
- **Commit:** `d0682c4`
- **Branch:** `master`
- **Estado:** ✅ Documentación organizada en estructura temática

---

## 📝 Notas

### Cambios Recientes
- ✅ Eliminados 7 archivos .md desactualizados/redundantes:
  - `ESTADO_ACTUAL.md` → Reemplazado por `STATUS.md`
  - `PROGRESO_DESARROLLO.md` → Reemplazado por `STATUS.md`
  - `RESUMEN_EJECUTIVO.md` → Redundante
  - `VISION_ESTRATEGICA.md` → Redundante
  - `ANALISIS_5PALOS_Y_VISION.md` → Referencia obsoleta
  - `RESUMEN_ACTUALIZACION_DOCS.md` → Obsoleto
  - `STATUS_OLD_BACKUP.md` → Backup temporal

### Documentación Técnica Adicional
Además de `docs/`, hay documentación técnica específica en:
- `src/lib/templates/README.md` - Biblioteca de prompts de agentes
- `src/lib/templates/vendedor/CATALOGO.md` - Sistema de catálogo
- `src/lib/templates/admin/README.md` - Agentes admin

---

## 💬 ¿Dudas?

- **Issues:** [GitHub Issues](https://github.com/Staillim/make/issues)
- **Contribuir:** [CONTRIBUTING.md](CORE/CONTRIBUTING.md)
- **Estado del proyecto:** [STATUS.md](CORE/STATUS.md)

---

**Última actualización:** 1 de Marzo, 2026  
**Mantenedor:** @Staillim
