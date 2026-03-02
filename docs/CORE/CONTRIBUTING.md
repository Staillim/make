# 🤝 CONTRIBUTING — Maket AI

> Guía para contribuir al proyecto Maket AI.

---

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Setup de Desarrollo](#setup-de-desarrollo)
- [Flujo de Trabajo Git](#flujo-de-trabajo-git)
- [Estándares de Código](#estándares-de-código)
- [Testing](#testing)
- [Pull Requests](#pull-requests)
- [Reporte de Bugs](#reporte-de-bugs)

---

## Código de Conducta

Este proyecto adopta el [Contributor Covenant](https://www.contributor-covenant.org/).  
Se espera que todos los participantes actúen con respeto y profesionalismo.

---

## Cómo Contribuir

Bienvenidas son contribuciones de:
- 🐛 **Reporte de bugs**
- ✨ **Nuevas características**
- 📝 **Mejoras de documentación**
- 🎨 **Mejoras de UI/UX**
- ⚡ **Optimizaciones de performance**

**Antes de empezar:**
1. Revisa los [Issues abiertos](https://github.com/Staillim/make/issues)
2. Si tu idea no existe, abre un nuevo Issue para discutirla
3. Espera feedback del equipo antes de invertir tiempo

---

## Setup de Desarrollo

### Prerrequisitos

- **Node.js:** v20.x o superior
- **npm:** v10.x o superior
- **Git:** Última versión
- **Cuenta Supabase:** Para desarrollo local

### Instalación

```bash
# 1. Fork el repositorio en GitHub
# 2. Clona tu fork
git clone https://github.com/TU-USUARIO/make.git
cd make

# 3. Instala dependencias
npm install

# 4. Configura variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales

# 5. Ejecuta migraciones en Supabase
# Ve al SQL Editor y ejecuta:
# - supabase-schema.sql
# - schema-notas-agente.sql

# 6. Inicia servidor de desarrollo
npm run dev
```

Visita: [http://localhost:3000](http://localhost:3000)

---

## Flujo de Trabajo Git

### Branches

```
master        → Producción (protegida)
  ├── develop   → Desarrollo activo (default)
  └── feature/* → Features individuales
```

**Convenciones de nombres:**
- `feature/nombre-feature` → Nueva funcionalidad
- `fix/nombre-bug` → Bugfix
- `docs/nombre-doc` → Documentación
- `refactor/nombre` → Refactorización
- `perf/nombre` → Optimización

### Workflow

```bash
# 1. Asegúrate de estar en develop
git checkout develop
git pull origin develop

# 2. Crea tu branch
git checkout -b feature/mi-nueva-feature

# 3. Haz commits frecuentes
git add .
git commit -m "feat: agregar nueva funcionalidad"

# 4. Push a tu fork
git push origin feature/mi-nueva-feature

# 5. Abre Pull Request en GitHub
```

---

## Estándares de Código

### Conventional Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar nueva funcionalidad
fix: corregir bug en X
docs: actualizar README
style: formato de código
refactor: refactorizar componente Y
perf: optimizar consulta Z
test: agregar test para A
chore: actualizar dependencias
```

**Ejemplos:**

```bash
git commit -m "feat: agregar agente vendedor para gimnasios"
git commit -m "fix: corregir validación de email en registro"
git commit -m "docs: expandir guía de arquitectura"
```

### TypeScript

- ✅ **Usa tipos explícitos** (no `any`)
- ✅ **Interfaces para objetos complejos**
- ✅ **Type guards** cuando sea necesario
- ❌ **No uses `@ts-ignore`** sin comentario justificativo

```typescript
// ✅ Bien
interface Usuario {
  id_usuario: string;
  nombre: string;
  email: string;
}

function obtenerUsuario(id: string): Promise<Usuario> {
  // ...
}

// ❌ Mal
function obtenerUsuario(id: any): any {
  // ...
}
```

### React

- ✅ **Componentes funcionales** (no class components)
- ✅ **Hooks** para lógica
- ✅ **Server Components por defecto** (Next.js App Router)
- ✅ **"use client"** solo cuando necesario (interactividad)

```tsx
// ✅ Server Component (por defecto)
export default async function Page() {
  const data = await fetch(...);
  return <div>{data}</div>;
}

// ✅ Client Component (solo cuando necesario)
"use client";
import { useState } from "react";

export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Nombres de Archivos

```
kebab-case.tsx   → Componentes React
camelCase.ts     → Utilidades, helpers
PascalCase.tsx   → Componentes UI exportables
```

**Ejemplos:**
- `chat-window.tsx` → Componente interno
- `ChatWindow.tsx` → Componente exportable
- `useNegocios.ts` → Custom hook
- `industria.ts` → Utility

### Estructura de Imports

```typescript
// 1. External libraries
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 2. Alias imports (@/...)
import { Button } from "@/components/ui";
import { useAuthStore } from "@/lib/store";

// 3. Relative imports
import { helper } from "./utils";

// 4. Types
import type { Usuario } from "@/types";
```

---

## Testing

### Type Checking

```bash
# Verificar errores de TypeScript
npx tsc --noEmit
```

**Requerido:** 0 errores antes de hacer PR.

### Linting

```bash
# Ejecutar linter
npm run lint

# Auto-fix
npm run lint -- --fix
```

### Unit Tests (próximamente)

```bash
npm run test
npm run test:watch
npm run test:coverage
```

---

## Pull Requests

### Checklist antes de abrir PR

- [ ] El código compila sin errores TypeScript
- [ ] Pasa el linter (`npm run lint`)
- [ ] La funcionalidad fue probada localmente
- [ ] Se agregó documentación si es necesario
- [ ] Los commits siguen Conventional Commits
- [ ] El PR tiene descripción clara

### Template de PR

```markdown
## Descripción
[Explica qué hace este PR]

## Tipo de cambio
- [ ] Bugfix
- [ ] Nueva feature
- [ ] Refactorización
- [ ] Documentación

## Testing
[Describe cómo probaste los cambios]

## Screenshots (si aplica)
[Capturas de pantalla]

## Checklist
- [ ] TypeScript compila sin errores
- [ ] Linter pasa
- [ ] Documentación actualizada
- [ ] Tests agregados/actualizados
```

### Review Process

1. **Automated checks:** TypeScript, Linter
2. **Code review:** Al menos 1 aprobación requerida
3. **Testing:** Manualmente probado por reviewer
4. **Merge:** Squash and merge a `develop`

---

## Reporte de Bugs

### Template de Issue

```markdown
## Descripción del bug
[Descripción clara del problema]

## Pasos para reproducir
1. Ve a '...'
2. Click en '...'
3. Ver error

## Comportamiento esperado
[Qué debería pasar]

## Comportamiento actual
[Qué está pasando]

## Screenshots
[Si aplica]

## Entorno
- OS: [Windows / Mac / Linux]
- Browser: [Chrome 120 / Firefox 122]
- Node.js: [20.10.0]

## Información adicional
[Contexto relevante]
```

---

## Preguntas Frecuentes

### ¿Puedo contribuir sin saber TypeScript?

Sí, puedes contribuir con:
- Documentación
- Reporte de bugs
- Traducciones
- Diseño UI/UX

### ¿Cuánto tarda la revisión de un PR?

Typically 1-3 días hábiles. PRs grandes pueden tomar más.

### ¿Puedo trabajar en un Issue que ya tiene asignado?

No sin coordinarte primero. Pregunta en el Issue si puedes ayudar.

### ¿Dónde pregunto si tengo dudas?

- **Dudas técnicas:** [GitHub Discussions](https://github.com/Staillim/make/discussions)
- **Dudas de contribución:** Comenta en el Issue relevante
- **Otros:** Email a `dev@maketai.com`

---

## Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## Agradecimientos

Gracias por contribuir a Maket AI. Tu tiempo y esfuerzo son muy apreciados. 🙏

---

**Última actualización:** Marzo 2026  
**Mantenedor:** [@Staillim](https://github.com/Staillim)
