# Corrección de RLS Policies en Supabase

## 🚨 Error Identificado

El error en la consola indica que las políticas de Row Level Security (RLS) en Supabase no permiten que los usuarios se registren correctamente en la tabla `usuarios`.

## ✅ Solución

He creado el archivo `fix-rls-policies.sql` con las correcciones necesarias.

### Pasos para aplicar la corrección:

1. **Abrir Supabase Dashboard:**
   - Ve a [supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecciona tu proyecto (**dduzbdvwnkuuwcjqyrfs**)

2. **Ir al SQL Editor:**
   - En el sidebar izquierdo, haz clic en **"SQL Editor"**
   - Haz clic en **"New query"**

3. **Ejecutar el script de corrección:**
   - Abre el archivo `fix-rls-policies.sql` 
   - Copia todo el contenido
   - Pégalo en el SQL Editor de Supabase
   - Haz clic en **"Run"** (o presiona Ctrl+Enter)

### ¿Qué hace este script?

- ✅ **Agrega política INSERT** para que nuevos usuarios puedan registrarse
- ✅ **Corrige políticas SELECT/UPDATE** para usuarios existentes  
- ✅ **Extiende RLS** a todas las tablas relacionadas con negocios
- ✅ **Asegura permisos correctos** para operaciones CRUD completas

### Mejoras en el código:

También actualicé `AuthContext.tsx` para:

- ✅ **Mejor manejo de errores** con logs más detallados
- ✅ **Validación robusta** de datos de usuario
- ✅ **Soporte mejorado** para usuarios de Google OAuth
- ✅ **Detección de usuarios existentes** más confiable

## 🧪 Probar después de aplicar el script:

1. Ejecuta el script SQL en Supabase Dashboard
2. Recarga la página de registro: `http://localhost:3000/registro`
3. Intenta registrar un usuario de prueba
4. Verifica que no aparezcan errores en la consola

## 📝 Confirmación esperada:

Después de aplicar el script, deberías ver en la consola del navegador:
```
Creating new user record for: test@example.com
User record created successfully
```

En lugar del error actual.

¿Quieres que te guíe paso a paso en la aplicación del script SQL?