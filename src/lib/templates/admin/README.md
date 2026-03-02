# Biblioteca de Prompts - Agentes Administradores (Max) 🎯

**Sistema de agentes administradores especializados por industria**

Esta carpeta contiene los prompts para **Max**, el agente administrador que gestiona operaciones, analiza métricas, optimiza rentabilidad y mantiene el negocio saludable.

---

## 📋 Índice

1. [Agentes Disponibles](#agentes-disponibles)
2. [Estructura de Prompts](#estructura-de-prompts)
3. [Guía de Uso](#guía-de-uso)
4. [Métricas y KPIs](#métricas-y-kpis)
5. [Funciones Automáticas](#funciones-automáticas)
6. [Cómo Agregar Nueva Industria](#cómo-agregar-nueva-industria)

---

## 🎯 Agentes Disponibles

### 1. **Max - Gerente Operativo (Restaurante)** 🍽️
- **Archivo**: `restaurante.ts`
- **Especialidad**: Gestión gastronómica
- **KPIs Clave**:
  - Food cost % (ideal: 28-35%)
  - Labor cost % (ideal: 25-35%)
  - Rotación de mesas/hora
  - Ticket promedio
  - Tasa de desperdicio
- **Capacidades**:
  - Gestión de inventario de ingredientes (FIFO)
  - Análisis de menú (Menu Engineering: Estrellas, Caballos, Rompecabezas, Perros)
  - Control de mermas y desperdicios
  - Optimización de precios por plato
  - Análisis de horarios pico
  - Gestión de turnos de cocina
- **Alertas**:
  - 🔴 Stock crítico de ingredientes
  - ⚠️ Merma alta detectada
  - 💡 Platos sin ventas
  - 📊 Food cost fuera de rango

---

### 2. **Max - Gerente de Operaciones (Tienda de Ropa)** 👕
- **Archivo**: `tienda_ropa.ts`
- **Especialidad**: Retail de moda
- **KPIs Clave**:
  - Inventory turnover (ideal: 4-6x/año)
  - Sell-through rate (>80% en 90 días)
  - Markup promedio (50-100%)
  - Margin después de descuentos (40-60%)
  - Shrinkage (<2%)
  - Días de inventario (60-90 ideal)
- **Capacidades**:
  - Gestión de inventario multi-variante (talla/color/SKU)
  - Análisis de sell-through rate
  - Curva ABC de productos
  - Estrategias de liquidación por temporada
  - Detección de quiebre de tallas
  - Análisis de colores y tendencias
  - Gestión de colecciones (lanzamiento → liquidación)
- **Alertas**:
  - 🔴 Quiebre de tallas en bestsellers
  - ⚠️ Inventario muerto (>60 días sin venta)
  - 💡 Temporada próxima a finalizar
  - 📊 Sell-through bajo

---

### 3. **Max - Gerente de Operaciones Tech (Tecnología)** 💻
- **Archivo**: `tecnologia.ts`
- **Especialidad**: Retail tecnológico
- **KPIs Clave**:
  - Inventory turnover (6-8x/año)
  - Obsolescence rate (<5%)
  - Attach rate (1.5-2.5 accesorios/dispositivo)
  - Margin por categoría (8-60% según tipo)
  - RMA rate (<3%)
  - Price competitiveness (±5% mercado)
- **Capacidades**:
  - Gestión de inventario multi-variante Tech
  - Monitoreo de obsolescencia y EOL
  - Análisis de ciclo de vida de productos
  - Competitividad de precios vs mercado
  - Optimización de attach rate (accesorios)
  - Gestión de generaciones y versiones
  - Warranty y RMA tracking
  - Análisis precio/performance
- **Alertas**:
  - 🔴 Obsolescencia inminente (nueva gen anunciada)
  - ⚠️ Precio no competitivo vs mercado
  - 💡 Attach rate bajo (oportunidad perdida)
  - 📊 EOL confirmado por fabricante

---

### 4. **Max - Gerente Operativo (Gimnasio)** 🏋️
- **Archivo**: `gimnasio.ts`
- **Especialidad**: Fitness operations
- **KPIs Clave**:
  - Retention rate (>70% mensual)
  - Churn rate (<30% mensual)
  - LTV/CAC ratio (>3:1)
  - Average visits/member (8-10/mes)
  - Class occupancy (70-85% óptimo)
  - Win-back rate (15-25%)
- **Capacidades**:
  - Gestión de membresías y suscripciones
  - Análisis de churn y retención
  - Tracking de asistencia por miembro
  - Optimización de horarios de clases
  - Detección de miembros inactivos/fantasma
  - Campañas de re-engagement
  - Cohort analysis
  - Estrategias de pricing estacional
- **Alertas**:
  - 🔴 Churn rate alto detectado
  - ⚠️ Miembros inactivos (15+ días sin visitar)
  - 💡 Clase sobre-capacidad (riesgo)
  - 📊 Renovaciones próximas

---

### 5. **Max - Coordinador Académico (Educación)** 📚
- **Archivo**: `educacion.ts`
- **Especialidad**: Learning analytics
- **KPIs Clave**:
  - Completion rate (>60% bueno, >75% excelente)
  - Student retention (>70% mensual)
  - DAU/MAU ratio (>30% alto engagement)
  - NPS (>50 excelente)
  - Certificate issuance rate (>60%)
  - Churn rate (<20% suscripciones)
- **Capacidades**:
  - Gestión de inscripciones y estudiantes
  - Análisis de completion rates
  - Detección de drop-off points
  - Tracking de engagement estudiantil
  - Identificación de estudiantes at-risk
  - Cohort analysis educativo
  - Cálculo de Student LTV
  - Optimización de contenido
  - Estrategias de upsell/cross-sell (Learning Paths)
- **Alertas**:
  - 🔴 Abandono masivo en curso
  - ⚠️ Estudiantes inactivos (7+ días sin login)
  - 💡 Drop-off point crítico en módulo
  - 📊 Completion rate bajo

---

### 6. **Max - Gerente de Operaciones (Servicios)** 🚀
- **Archivo**: `servicios.ts`
- **Especialidad**: Service business operations
- **KPIs Clave**:
  - Utilization rate (70-80% ideal)
  - Gross margin (40-60% típico)
  - Win rate (20-40%)
  - DSO - Days Sales Outstanding (<45 días)
  - On-time delivery (>85%)
  - Client NPS (>50)
  - Repeat business rate (>40%)
- **Capacidades**:
  - Gestión de pipeline y forecasting
  - Análisis de project profitability
  - Team utilization tracking
  - Capacity planning
  - Accounts Receivable management
  - DSO optimization
  - Scope creep detection
  - Win rate analysis
  - Client LTV calculation
  - Cash flow management
- **Alertas**:
  - 🔴 Cash flow problem (cobros overdue >60 días)
  - ⚠️ Project over-budget (scope creep)
  - 💡 Utilization crítica baja (bench time)
  - 📊 Pipeline bajo

---

### 7. **Max - Administrador Genérico (_base)** 🎯
- **Archivo**: `_base.ts`
- **Uso**: Fallback para industrias sin template específico
- **Funcionalidad**: Gestión operativa básica adaptable

---

## 🏗️ Estructura de Prompts

Cada prompt de administrador sigue esta estructura estandarizada:

```typescript
export const prompt = `
## Tu Rol
[Descripción del rol específico para la industria]

## Personalidad
[Características de Max en este contexto]

## Conocimientos Especializados
- [Área 1 de expertise]
- [Área 2 de expertise]
- [Área 3 de expertise]

## Métricas Clave (KPIs)
- **Métrica 1**: [Valor ideal]
- **Métrica 2**: [Valor ideal]
...

## Funciones Automáticas
### Alertas Críticas 🔴
[Situaciones urgentes que requieren acción inmediata]

### Alertas Importantes ⚠️
[Situaciones que requieren atención pronto]

### Reportes Automáticos 📊
[Reportes diarios, semanales, mensuales]

## Recomendaciones Inteligentes
[Estrategias basadas en datos]

## Reglas Operativas
[Umbrales, benchmarks, políticas]

## Interacción con el Dueño
[Ejemplos de conversaciones típicas]

## Tono y Estilo
[Características del lenguaje]

## Limitaciones
[Qué puede y no puede hacer automáticamente]
`;

export const metadata = {
  nombre: "Max",
  apellido: "[Apellido]",
  rol: "[Rol Específico]",
  personalidad: "[Traits]",
  industria: "[industria]",
  especialidad: "[especialidad]",
  emojis: ["📊", "💰", ...],
  tonoVoz: "[descripción]",
  avatar: "[avatar_id]",
  capacidades: [...],
  kpis: [...],
  experticia: [...],
  integraciones: [...],
};
```

---

## 🚀 Guía de Uso

### Importar y Usar Template

```typescript
import { obtenerTemplateAdmin } from '@/lib/templates/admin';

// Obtener template para industria específica
const templateAdmin = obtenerTemplateAdmin('restaurante');

console.log(templateAdmin.prompt); // Prompt completo
console.log(templateAdmin.metadata.kpis); // KPIs específicos
console.log(templateAdmin.metadata.capacidades); // Capacidades disponibles
```

### Verificar Disponibilidad

```typescript
import { tieneTemplateAdminEspecifico, obtenerIndustriasAdminDisponibles } from '@/lib/templates/admin';

// Verificar si existe template específico
const tieneEspecifico = tieneTemplateAdminEspecifico('gimnasio'); // true
const noTieneEspecifico = tieneTemplateAdminEspecifico('ferreteria'); // false (usará genérico)

// Listar todas las industrias disponibles
const industrias = obtenerIndustriasAdminDisponibles();
console.log(industrias); // ['restaurante', 'tienda_ropa', 'tecnologia', 'gimnasio', 'educacion', 'servicios']
```

### Obtener Todos los KPIs

```typescript
import { obtenerTodosLosKPIsAdmin } from '@/lib/templates/admin';

const todosLosKPIs = obtenerTodosLosKPIsAdmin();
console.log(todosLosKPIs);
// ['Food cost %', 'Inventory turnover', 'Completion rate', 'Utilization rate', ...]
```

---

## 📊 Métricas y KPIs por Industria

### Restaurante
- **Food cost %**: 28-35% ideal
- **Labor cost %**: 25-35% ideal
- **Ticket promedio**: Varía por mercado
- **Rotación de mesas**: Mesas/hora
- **Tasa de desperdicio**: Minimizar

### Tienda de Ropa
- **Inventory turnover**: 4-6x/año
- **Sell-through rate**: >80% en 90 días
- **Margin**: 40-60% después de descuentos
- **Días de inventario**: 60-90 días ideal

### Tecnología
- **Inventory turnover**: 6-8x/año (ciclo rápido)
- **Obsolescence rate**: <5%
- **Attach rate**: 1.5-2.5 accesorios/dispositivo
- **RMA rate**: <3%

### Gimnasio
- **Retention rate**: >70% mensual
- **Churn rate**: <30% mensual
- **LTV/CAC ratio**: >3:1
- **Average visits/member**: 8-10/mes

### Educación
- **Completion rate**: >75% excelente
- **DAU/MAU ratio**: >30% engagement alto
- **NPS**: >50
- **Churn rate**: <20%

### Servicios
- **Utilization rate**: 70-80% óptimo
- **Gross margin**: 40-60%
- **DSO**: <45 días
- **Win rate**: 20-40%

---

## ⚙️ Funciones Automáticas

### Sistema de Alertas (3 Niveles)

#### 🔴 **Críticas** (Acción inmediata)
- Stock agotado de producto clave
- Cash flow negativo
- Proyecto perdiendo dinero
- Churn rate disparado

#### ⚠️ **Importantes** (Atención pronto)
- Stock bajo
- Pipeline débil
- Miembros/estudiantes inactivos
- Renovaciones próximas

#### 🟡 **Atención** (Optimizaciones)
- Oportunidades de precio
- Mejoras operativas
- Tendencias detectadas
- Sugerencias de promociones

### Reportes Automáticos

#### 📊 **Diario** (Generado 11pm)
- Revenue del día
- Actividad operativa
- Top productos/servicios
- Alertas pendientes

#### 📈 **Semanal** (Generado domingos)
- Performance vs semana anterior
- Análisis de tendencias
- Underperformers identificados
- Recomendaciones accionables

#### 📋 **Mensual** (Generado fin de mes)
- Análisis profundo de rentabilidad
- Cohort analysis
- Proyecciones próximo mes
- Strategic recommendations

---

## 🎯 Ejemplo de Uso Completo

```typescript
import { obtenerTemplateAdmin } from '@/lib/templates/admin';

// Cliente crea negocio tipo "restaurante"
const industria = 'restaurante';
const templateAdmin = obtenerTemplateAdmin(industria);

// Configurar agente Max en base de datos
const agenteAdmin = {
  id_negocio: '123',
  tipo: 'administrador',
  nombre: templateAdmin.metadata.nombre,
  apellido: templateAdmin.metadata.apellido,
  prompt_sistema: templateAdmin.prompt,
  personalidad: templateAdmin.metadata.personalidad,
  avatar: templateAdmin.metadata.avatar,
  capacidades: templateAdmin.metadata.capacidades,
  kpis_monitoreados: templateAdmin.metadata.kpis,
  activo: true,
};

// Max ahora puede:
// 1. Generar reportes automáticos
// 2. Enviar alertas basadas en datos reales
// 3. Hacer recomendaciones inteligentes
// 4. Monitorear KPIs específicos de restaurante
```

---

## ➕ Cómo Agregar Nueva Industria

### Paso 1: Crear Archivo de Template

Crear `[industria].ts` en `src/lib/templates/admin/`:

```typescript
export const prompt = `Eres Max, el gerente operativo de [INDUSTRIA]...

## Tu Rol
[Específico para la industria]

## Conocimientos Especializados
### [Área 1]
- [Bullet points]

### [Área 2]
- [Bullet points]

## Métricas Clave (KPIs [INDUSTRIA])
- **KPI 1**: [Valor ideal]
- **KPI 2**: [Valor ideal]

## Funciones Automáticas
### Alertas Críticas 🔴
1. **[Situación]**: "[Mensaje de alerta]"

### Alertas Importantes ⚠️
1. **[Situación]**: "[Mensaje de alerta]"

### Reportes Automáticos 📊
#### Reporte Diario
\`\`\`
[Template del reporte]
\`\`\`

## Recomendaciones Inteligentes
[Estrategias basadas en datos]

## Reglas Operativas
[Umbrales y benchmarks]

## Interacción con el Dueño
### Ejemplos de Conversaciones
[Diálogos típicos]

## Tono y Estilo
[Características]

## Limitaciones
[Qué puede y no puede hacer]
`;

export const metadata = {
  nombre: "Max",
  apellido: "[Apellido]",
  rol: "[Rol]",
  personalidad: "[Traits]",
  industria: "[industria_key]",
  especialidad: "[especialidad]",
  emojis: ["📊", "💰", ...],
  tonoVoz: "[descripción]",
  avatar: "[avatar]",
  capacidades: ["Cap 1", "Cap 2", ...],
  kpis: ["KPI 1", "KPI 2", ...],
  experticia: ["Exp 1", "Exp 2", ...],
  integraciones: ["Int 1", "Int 2", ...],
};

export default { prompt, metadata };
```

### Paso 2: Actualizar index.ts

Agregar import y exportación:

```typescript
import nuevaIndustriaAdmin from './nueva_industria';

export const adminTemplates: Record<string, AdminTemplate> = {
  // ... existentes
  nueva_industria: nuevaIndustriaAdmin,
};
```

### Paso 3: Documentar en README

Agregar sección en "Agentes Disponibles" con detalles de la nueva industria.

---

## 📏 Lineamientos de Diseño

### Longitud de Prompts
- **Mínimo**: 3,000 tokens (~400 líneas)
- **Óptimo**: 4,000-5,000 tokens (~500-600 líneas)
- **Incluir**:
  - 5-10 KPIs específicos
  - 8+ capacidades
  - 4+ alertas críticas
  - 3+ reportes automáticos
  - 3+ recomendaciones inteligentes
  - 5+ ejemplos de conversación

### Tono de Max
- **Analítico**: Basado en datos, no opiniones
- **Directo**: Sin rodeos, va al punto
- **Proactivo**: Anticipa problemas
- **Profesional**: Formal pero claro
- **Urgente cuando necesario**: Con alertas rojas

### Sistema de Emojis
- 🔴 Crítico/Urgente
- ⚠️ Importante/Atención
- 🟡 Monitorear
- 🟢 Saludable/OK
- 📊 Datos/Métricas
- 💰 Financiero/Revenue
- 💡 Oportunidad/Recomendación
- 🎯 Acción/Target

---

## 📈 Métricas de la Biblioteca

| Industria | Archivo | Líneas | KPIs | Capacidades | Emojis | Estado |
|-----------|---------|--------|------|-------------|--------|--------|
| Restaurante | `restaurante.ts` | ~550 | 7 | 10 | 17 | ✅ |
| Tienda Ropa | `tienda_ropa.ts` | ~580 | 7 | 10 | 14 | ✅ |
| Tecnología | `tecnologia.ts` | ~600 | 7 | 10 | 15 | ✅ |
| Gimnasio | `gimnasio.ts` | ~620 | 7 | 10 | 12 | ✅ |
| Educación | `educacion.ts` | ~590 | 7 | 10 | 11 | ✅ |
| Servicios | `servicios.ts` | ~640 | 7 | 10 | 11 | ✅ |
| Genérico | `_base.ts` | ~180 | 6 | 6 | 8 | ✅ |
| **TOTAL** | **7 archivos** | **~3,760** | **48** | **66** | **88** | **100%** |

---

## 🔗 Integración con Sistema

### Base de Datos
Templates se utilizan al crear agente Admin en tabla `agentes`:

```sql
INSERT INTO agentes (
  id_negocio,
  tipo,
  nombre,
  apellido,
  rol,
  prompt_sistema,
  personalidad,
  capacidades,
  activo
) VALUES (
  '[id_negocio]',
  'administrador',
  'Max',
  '[apellido_de_metadata]',
  '[rol_de_metadata]',
  '[prompt_completo]',
  '[personalidad_de_metadata]',
  '[capacidades_de_metadata]',
  true
);
```

### API Constructor
Sistema de detección automática elige template correcto:

```typescript
// En POST /api/constructor/mensaje
const tipoNegocio = await detectarTipoNegocio(descripcion);
const templateAdmin = obtenerTemplateAdmin(tipoNegocio);

// Crear agente en base de datos con template
await crearAgenteAdmin(idNegocio, templateAdmin);
```

---

## 🎓 Próximos Pasos

1. **Integrar con OpenAI**: Conectar templates con API
2. **Generación de Reportes**: Automatizar reportes según datos reales
3. **Sistema de Alertas**: Implementar webhooks/emails
4. **Dashboard de KPIs**: Visualizar métricas en tiempo real
5. **Machine Learning**: Predecir churns, optimizar pricing

---

## 📚 Referencias

- [Templates Vendedor](../vendedor/README.md)
- [Sistema de Detección](../../constructor/detector.ts)
- [Arquitectura Multi-Negocio](../../../../ARQUITECTURA_MULTI_NEGOCIO.md)
- [State Management](../../store/README.md)

---

**Última actualización**: Sprint 1 - Biblioteca completada
**Autor**: Sistema Make Multi-Negocio
**Versión**: 1.0.0
