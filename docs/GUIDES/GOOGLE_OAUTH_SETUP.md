# Configuración de Google OAuth

Para configurar la autenticación con Google, sigue estos pasos:

## 1. Configurar Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la Google+ API:
   - Ve a **APIs & Services** > **Library**
   - Busca "Google+ API" y habilítala
4. Configura OAuth consent screen:
   - Ve a **APIs & Services** > **OAuth consent screen**
   - Selecciona "External" para usuarios de cualquier cuenta de Google
   - Completa la información requerida del proyecto
5. Crea credenciales OAuth:
   - Ve a **APIs & Services** > **Credentials**
   - Haz clic en **Create Credentials** > **OAuth client ID**
   - Selecciona "Web application"
   - Agrega estos URIs autorizados:
     - **Authorized JavaScript origins**: `http://localhost:3000` (desarrollo), `https://tu-dominio.com` (producción)
     - **Authorized redirect URIs**: 
       - `https://dduzbdvwnkuuwcjqyrfs.supabase.co/auth/v1/callback` (usar tu URL de Supabase)
6. Copia el **Client ID** y **Client Secret**

## 2. Configurar Supabase

1. Ve a tu [Dashboard de Supabase](https://supabase.com/dashboard/)
2. Ve a **Authentication** > **Providers**
3. Encuentra **Google** y haz clic en el interruptor para habilitarlo
4. Ingresa el **Client ID** y **Client Secret** de Google Cloud Console
5. Copia la URL de redirección que muestra Supabase (debería ser similar a la que agregaste en Google)

## 3. Variables de entorno (ya configuradas)

Las siguientes variables ya están configuradas en tu proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://dduzbdvwnkuuwcjqyrfs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Verificar configuración

Una vez completados los pasos anteriores:

1. Inicia la aplicación: `npm run dev`
2. Ve a `http://localhost:3000/registro` o `http://localhost:3000/login`
3. Haz clic en "Continuar con Google"
4. Deberías ser redirigido a la pantalla de autenticación de Google

## Estado actual

✅ **Completado:**
- Componentes de autenticación con Supabase Auth
- Integración de Google OAuth en el frontend
- Contexto de autenticación configurado
- Formularios de registro e inicio de sesión actualizados

⚠️ **Pendiente:**
- Configuración de credenciales en Google Cloud Console
- Habilitación del proveedor Google en Supabase Dashboard

## Notas

- Los usuarios registrados con Google tendrán su información automáticamente sincronizada con la base de datos
- El sistema mantendrá compatibilidad con registro/login por email y contraseña
- Supabase manejará automáticamente la sesión del usuario după la autenticación con Google