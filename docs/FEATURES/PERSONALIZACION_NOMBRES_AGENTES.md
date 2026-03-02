# 🎭 Personalización de Nombres de Agentes IA

> **Feature:** Permite al dueño del negocio elegir un nombre personalizado para su agente IA vendedor.

## 📌 Resumen

Anteriormente, los agentes tenían nombres hardcoded (María para restaurantes, Sofía para tiendas de ropa, etc.). Ahora el dueño del negocio puede:

✅ **Elegir un nombre personalizado** para su agente durante la configuración  
✅ **Mantener el nombre default** si no especifica uno  
✅ **Cambiar el nombre** en cualquier momento (futuro)

---

## 🏗️ Arquitectura de la Feature

### 1. Schema SQL

**Tabla modificada:** `marca`  
**Campo añadido:** `nombre_agente_vendedor VARCHAR(100) NULL`

```sql
-- Migración: sql/add-nombre-agente-vendedor.sql
ALTER TABLE marca 
ADD COLUMN nombre_agente_vendedor VARCHAR(100);
```

**Valores default por industria:**
- `restaurante` → "María"
- `tienda_ropa` → "Sofía"
- `tecnologia` → "Alex"
- `gimnasio` → "Coach Mike"
- `educacion` → "Prof. Ana"
- `servicios` → "Luna"
- `otro` → "Asistente"

### 2. Templates Actualizados

**Todos los templates ahora usan el placeholder:** `{{NOMBRE_AGENTE}}`

**Archivos modificados:**
- `src/lib/templates/vendedor/restaurante.ts`
- `src/lib/templates/vendedor/tienda_ropa.ts`
- `src/lib/templates/vendedor/tecnologia.ts`
- `src/lib/templates/vendedor/gimnasio.ts`
- `src/lib/templates/vendedor/educacion.ts`
- `src/lib/templates/vendedor/servicios.ts`
- `src/lib/templates/vendedor/_base.ts`

**Ejemplo de cambio:**

```typescript
// ❌ ANTES (hardcoded):
export const prompt = `Eres María, una mesera experimentada...`;

// ✅ DESPUÉS (placeholder):
export const prompt = `Eres {{NOMBRE_AGENTE}}, una mesera experimentada...`;
```

### 3. Función Helper

**Nueva función en `src/lib/templates/vendedor/index.ts`:**

```typescript
export function inyectarNombreAgente(
  prompt: string,
  nombrePersonalizado: string | null | undefined,
  industria: string
): string {
  // Si hay nombre personalizado, úsalo
  if (nombrePersonalizado && nombrePersonalizado.trim()) {
    return prompt.replace(/\{\{NOMBRE_AGENTE\}\}/g, nombrePersonalizado.trim());
  }
  
  // Si no, usa el nombre default según industria
  const nombresDefault: Record<string, string> = {
    restaurante: "María",
    tienda_ropa: "Sofía",
    tecnologia: "Alex",
    gimnasio: "Coach Mike",
    educacion: "Prof. Ana",
    servicios: "Luna",
    otro: "Asistente"
  };
  
  const industriaNormalizada = industria.toLowerCase().replace(/\s+/g, "_");
  const nombreDefault = nombresDefault[industriaNormalizada] || nombresDefault.otro;
  
  return prompt.replace(/\{\{NOMBRE_AGENTE\}\}/g, nombreDefault);
}
```

### 4. Orquestador (Constructor)

**Fase de Agentes:** El orquestador pregunta por el nombre del agente en la fase 5 (agentes).

**Extracción automática:** La función `extraerInformacionNegocio()` ya detecta el campo `nombre_agente_vendedor` del intercambio.

**Guardado en BD:**

```typescript
// src/app/api/constructor/orquestador/route.ts (línea ~135)
await supabase.from("marca").upsert({
  id_negocio,
  nombre_negocio: info.nombre_negocio ?? "Mi Negocio",
  slogan: info.slogan ?? null,
  color_primario: info.color_primario ?? "#4f46e5",
  estilo_visual: info.estilo_visual ?? "moderno",
  tono_comunicacion: info.tono_comunicacion ?? "amigable",
  nombre_agente_vendedor: info.nombre_agente_vendedor ?? null, // ✅ NUEVO
});
```

### 5. API Vendedor (Mensajes)

**Carga del nombre:**

```typescript
// src/app/api/constructor/mensaje/route.ts (línea ~41)
const { data: negocio, error: errorNegocio } = await supabase
  .from("negocios")
  .select("*, productos(*), marca(*), tema(*)")  // ✅ Incluye marca
  .eq("id_negocio", id_negocio)
  .single();

// Acceso al nombre: negocio.marca?.nombre_agente_vendedor
```

**Inyección del nombre:**

```typescript
// src/app/api/constructor/mensaje/route.ts (línea ~83)
const { inyectarNombreAgente } = await import("@/lib/templates/vendedor");
const template = obtenerTemplateVendedor(negocio.tipo_negocio || "otro");

// Inyectar nombre personalizado del agente (o usar default)
let prompt_con_nombre = inyectarNombreAgente(
  template.prompt,
  negocio.marca?.nombre_agente_vendedor,  // ✅ Nombre personalizado o null
  negocio.tipo_negocio || "otro"
);

// Luego inyecta catálogo, perfil, notas, etc.
```

---

## 🎬 Flujo de Usuario

### Escenario 1: Usuario personaliza el nombre

```
Orquestador (Fase 5 - Agentes): 
"Perfecto, ahora personalicemos tu agente vendedor. ¿Qué nombre te gustaría que tenga? 
Puede ser algo como 'Carla', 'Roberto', lo que prefieras 😊"

Usuario: "Quiero que se llame Isabella"

Orquestador: "¡Isabella es un nombre genial! Tiene mucha personalidad. 
Tu agente se llamará Isabella y usará un tono [amigable/profesional/etc.]."
```

**Resultado:**
- BD guarda: `marca.nombre_agente_vendedor = "Isabella"`
- Template inyectado: `"Eres Isabella, una mesera experimentada..."`

### Escenario 2: Usuario NO personaliza (usa default)

```
Orquestador (Fase 5): 
"¿Quieres darle un nombre personalizado a tu agente vendedor, o prefieres que use el nombre sugerido?"

Usuario: "El sugerido está bien"

Orquestador: "Perfecto, tu agente usará el nombre por defecto según tu industria."
```

**Resultado:**
- BD guarda: `marca.nombre_agente_vendedor = NULL`
- Template inyectado: `"Eres María, una mesera experimentada..."` (usa default de restaurante)

---

## 🔍 Testing Manual

### Test 1: Crear negocio con nombre personalizado

1. Ir a `/dashboard/negocio/nuevo/constructor`
2. Configurar negocio (tipo: restaurante)
3. En fase de agentes, cuando pregunte por nombre: **"Juanita"**
4. Activar negocio
5. Ir a tienda pública
6. Abrir chat (cuando esté implementado)
7. **Verificar:** El agente se presenta como "Juanita" ✅

### Test 2: Crear negocio sin personalizar nombre

1. Crear negocio (tipo: tecnología)
2. En fase de agentes, no especificar nombre o decir "el default"
3. Activar negocio
4. **Verificar:** El agente usa "Alex" (default de tecnología) ✅

### Test 3: Verificar en BD

```sql
-- Ver nombres personalizados guardados
SELECT 
  n.nombre AS negocio,
  t.tipo_negocio,
  m.nombre_agente_vendedor,
  m.tono_comunicacion
FROM negocios n
JOIN marca m ON m.id_negocio = n.id_negocio
JOIN tema t ON t.id_negocio = n.id_negocio
WHERE n.estado = 'activo';
```

---

## 🚀 Próximas Mejoras (Futuro)

### Feature 1: Sugerencias inteligentes de nombres

```typescript
// Sugerir 3 nombres según industria + tono
function sugerirNombres(industria: string, tono: string): string[] {
  const sugerencias = {
    restaurante_amigable: ["María", "Carmen", "Antonio"],
    restaurante_elegante: ["Valentina", "Sebastián", "Isabella"],
    tecnologia_juvenil: ["Alex", "Max", "Luna"],
    tecnologia_profesional: ["David", "Ana", "Carlos"],
    // ...
  };
  return sugerencias[`${industria}_${tono}`] || ["Asistente", "Sam", "Pat"];
}
```

### Feature 2: UI en dashboard para cambiar nombre

```
Dashboard → Mi Negocio → Configuración → Agentes
┌────────────────────────────────────────┐
│ Agente Vendedor                        │
│                                        │
│ Nombre actual: María                   │
│ [Cambiar nombre]                       │
│                                        │
│ Tono de comunicación: Amigable         │
│ [Cambiar tono]                         │
└────────────────────────────────────────┘
```

### Feature 3: Pronouns y género

```typescript
interface ConfiguracionAgente {
  nombre: string;
  genero: 'masculino' | 'femenino' | 'neutro';
  pronouns: { sujeto: string; objeto: string; posesivo: string };
}

// Adaptar templates según género:
// "Eres {{NOMBRE_AGENTE}}, {{ARTICULO}} {{PROFESION}} experimentad{{GENERO_SUFIJO}}..."
// Masculino: "Eres Roberto, un mesero experimentado..."
// Femenino: "Eres María, una mesera experimentada..."
// Neutro: "Eres Sam, une asistente experimentade..." (lenguaje inclusivo)
```

### Feature 4: Personalidad del agente

```typescript
interface PersonalidadAgente {
  emojis_frecuencia: 'ninguno' | 'ocasional' | 'frecuente';
  estilo_escritura: 'formal' | 'casual' | 'juvenil' | 'elegante';
  longitud_respuestas: 'conciso' | 'normal' | 'detallado';
  nivel_proactividad: 'reactivo' | 'normal' | 'muy_proactivo';
}
```

---

## 📚 Referencias

**Archivos modificados:**
- ✅ `sql/add-nombre-agente-vendedor.sql` (migración)
- ✅ `src/lib/templates/vendedor/index.ts` (función helper)
- ✅ `src/lib/templates/vendedor/*.ts` (7 templates actualizados)
- ✅ `src/app/api/constructor/orquestador/route.ts` (guardar en BD)
- ✅ `src/app/api/constructor/mensaje/route.ts` (usar nombre)

**Documentación relacionada:**
- [CHANGELOG.md](../docs/CORE/CHANGELOG.md) - Historia completa del proyecto
- [ARCHITECTURE.md](../docs/ARCHITECTURE/ARCHITECTURE.md) - Sistema de plantillas

---

**Implementado:** Marzo 1, 2026  
**Por:** Jose Dev  
**Feature status:** ✅ Funcional (pending SQL migration ejecutada por usuario)
