# 📡 API REFERENCE — Maket AI

> Documentación completa de todos los endpoints API.

---

## Índice

- [🔐 Autenticación](#-autenticación)
- [🏗️ Constructor](#️-constructor)
- [🏪 Negocios](#-negocios)
- [📝 Notas de Agentes](#-notas-de-agentes)
- [❌ Códigos de Error](#-códigos-de-error)

---

## 🔐 Autenticación

Base URL: `/api/auth`

### POST `/api/auth/register`

Registra un nuevo usuario.

**Request:**

```json
{
  "nombre": "string",
  "email": "string",
  "password": "string" (min 6 caracteres)
}
```

**Response:** `201 Created`

```json
{
  "message": "Usuario registrado exitosamente",
  "usuario": {
    "id_usuario": "uuid",
    "nombre": "José Pérez",
    "email": "jose@example.com",
    "plan": "free",
    "fecha_registro": "2026-03-01T12:00:00Z"
  }
}
```

**Errors:**
- `400`: Email ya registrado
- `400`: Password muy corto
- `500`: Error del servidor

---

### POST `/api/auth/login`

Inicia sesión y establece cookie de autenticación.

**Request:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `200 OK` + `Set-Cookie: auth_token`

```json
{
  "message": "Login exitoso",
  "usuario": {
    "id_usuario": "uuid",
    "nombre": "José Pérez",
    "email": "jose@example.com",
    "plan": "free"
  }
}
```

**Errors:**
- `401`: Credenciales inválidas
- `404`: Usuario no encontrado

---

### POST `/api/auth/logout`

Cierra sesión (elimina cookie).

**Request:** No requiere body.

**Response:** `200 OK`

```json
{
  "message": "Logout exitoso"
}
```

---

## 🏗️ Constructor

Base URL: `/api/constructor`

### POST `/api/constructor/orquestador`

Interactúa con el Agente Orquestador para crear/configurar un negocio.

**Request:**

```json
{
  "id_negocio": "uuid | null" (null = crear nuevo),
  "mensaje": "string",
  "historial_mensajes": [
    {
      "role": "user | assistant",
      "content": "string"
    }
  ],
  "negocio_parcial": {
    "nombre_negocio": "string",
    "tipo_negocio": "string",
    "productos": [...],
    // ...información acumulada
  },
  "fase_actual": "descubrimiento | productos | identidad | operaciones | agentes | activacion",
  "es_inicio": false,
  "idioma": "es | en | pt | fr | de | it ..." (BCP-47)
}
```

**Response:** `200 OK`

```json
{
  "respuesta": "string (sin marcadores)",
  "avanzar_fase": true | false,
  "negocio_activado": true | false,
  "opciones_rapidas": ["Opción 1", "Opción 2"],
  "informacion_extraida": {
    "nombre_negocio": "Café Delicioso",
    "tipo_negocio": "restaurante",
    "productos": [...]
  }
}
```

**Marcadores procesados (internos, no devueltos al cliente):**
- `[[AVANZAR_FASE]]` → `avanzar_fase: true`
- `[[ACTIVAR_NEGOCIO]]` → `negocio_activado: true` + crea negocio en BD
- `[[OPCIONES:["a","b"]]]` → `opciones_rapidas: ["a","b"]`

**Errors:**
- `400`: Mensaje vacío
- `401`: No autenticado
- `500`: Error de IA o BD

---

### POST `/api/constructor/mensaje`

Agente Vendedor para la tienda pública (chat de cliente final).

**Request:**

```json
{
  "id_negocio": "uuid",
  "fase": "vendedor",
  "mensaje": "string",
  "historial_mensajes": [
    {
      "rol": "user | assistant",
      "contenido": "string"
    }
  ],
  "email_cliente": "string (opcional)",
  "telefono_cliente": "string (opcional)",
  "idioma": "es | en | ..." (auto-detectado)
}
```

**Response:** `200 OK`

```json
{
  "respuesta": "string",
  "datos_extraidos": {
    "preferencias": [...],
    "intencion_compra": "alta | media | baja"
  }
}
```

**Notas:**
- Si agente incluye `[[NOTA_AGENTE:{...}]]`, se guarda automáticamente en `notas_agente`
- Respuesta retornada está limpia (sin marcadores)

**Errors:**
- `400`: Faltan campos requeridos
- `404`: Negocio no encontrado
- `500`: Error de IA

---

## 🏪 Negocios

Base URL: `/api/negocios`

### GET `/api/negocios`

Lista todos los negocios del usuario autenticado.

**Query params:** Ninguno

**Response:** `200 OK`

```json
{
  "negocios": [
    {
      "id_negocio": "uuid",
      "nombre": "Café Delicioso",
      "tipo_negocio": "restaurante",
      "url_tienda": "/tienda/uuid",
      "estado": "activo | configurando | borrador",
      "fecha_creacion": "2026-03-01T12:00:00Z"
    }
  ]
}
```

**Errors:**
- `401`: No autenticado

---

### POST `/api/negocios`

Crea un nuevo negocio (estado inicial: `borrador`).

**Request:**

```json
{
  "nombre": "string"
}
```

**Response:** `201 Created`

```json
{
  "negocio": {
    "id_negocio": "uuid",
    "nombre": "Mi Nuevo Negocio",
    "estado": "borrador",
    "fecha_creacion": "2026-03-01T12:00:00Z"
  }
}
```

---

### GET `/api/negocios/[id]`

Obtiene detalles de un negocio específico.

**Response:** `200 OK`

```json
{
  "negocio": {
    "id_negocio": "uuid",
    "nombre": "Café Delicioso",
    "tipo_negocio": "restaurante",
    "url_tienda": "/tienda/uuid",
    "estado": "activo",
    "productos": [...],
    "marca": {...},
    "tema": {...}
  }
}
```

**Errors:**
- `404`: Negocio no encontrado
- `403`: No autorizado (no es dueño)

---

### PATCH `/api/negocios/[id]`

Actualiza un negocio existente.

**Request:**

```json
{
  "nombre": "string (opcional)",
  "tipo_negocio": "string (opcional)",
  "estado": "activo | pausado (opcional)"
}
```

**Response:** `200 OK`

```json
{
  "negocio": {
    "id_negocio": "uuid",
    "nombre": "Café Delicioso (actualizado)",
    // ...campos actualizados
  }
}
```

---

### DELETE `/api/negocios/[id]`

Elimina un negocio (soft delete: estado → `eliminado`).

**Response:** `200 OK`

```json
{
  "message": "Negocio eliminado"
}
```

---

### POST `/api/negocios/[id]/activar`

Activa un negocio (cambia estado a `activo`).

**Response:** `200 OK`

```json
{
  "message": "Negocio activado",
  "url_tienda": "/tienda/uuid"
}
```

**Errors:**
- `400`: Negocio no tiene información suficiente (falta marca, productos, etc.)

---

## 📝 Notas de Agentes

Base URL: `/api/agentes/notas`

### GET `/api/agentes/notas`

Obtiene notas de agentes para un negocio.

**Query params:**
- `id_negocio` (requerido): UUID del negocio
- `tipo_agente` (opcional): `vendedor` | `administrador` | `marketing`
- `tipo_nota` (opcional): `preferencia` | `contexto` | `recordatorio` | `alerta`
- `limite` (opcional): Número máximo de notas (default: 50)
- `archivada` (opcional): `true` | `false` (default: false)

**Response:** `200 OK`

```json
{
  "notas": [
    {
      "id_nota": "uuid",
      "id_negocio": "uuid",
      "tipo_agente": "vendedor",
      "tipo_nota": "preferencia",
      "contenido": "Cliente prefiere café negro sin azúcar",
      "contexto_adicional": {
        "email_cliente": "jose@example.com",
        "frecuencia": "alta",
        "ultima_interaccion": "2026-03-01"
      },
      "archivada": false,
      "fecha_creacion": "2026-03-01T12:00:00Z"
    }
  ],
  "total": 1
}
```

**Errors:**
- `400`: Falta `id_negocio`
- `403`: No autorizado

---

### POST `/api/agentes/notas`

Crea una nota manualmente (normalmente se crean vía marcador `[[NOTA_AGENTE]]`).

**Request:**

```json
{
  "id_negocio": "uuid",
  "tipo_agente": "vendedor | administrador | marketing",
  "tipo_nota": "preferencia | contexto | recordatorio | alerta",
  "contenido": "string",
  "contexto_adicional": {
    // Cualquier objeto JSON
    "email_cliente": "jose@example.com",
    "producto_favorito": "Café Americano"
  }
}
```

**Response:** `201 Created`

```json
{
  "nota": {
    "id_nota": "uuid",
    "id_negocio": "uuid",
    "tipo_agente": "vendedor",
    "tipo_nota": "preferencia",
    "contenido": "Cliente prefiere café negro",
    "fecha_creacion": "2026-03-01T12:00:00Z"
  }
}
```

---

### PATCH `/api/agentes/notas/[id]`

Actualiza una nota existente.

**Request:**

```json
{
  "contenido": "string (opcional)",
  "archivada": true | false (opcional)
}
```

**Response:** `200 OK`

```json
{
  "nota": {
    "id_nota": "uuid",
    "contenido": "Cliente prefiere café negro (actualizado)",
    "archivada": true
  }
}
```

---

### DELETE `/api/agentes/notas/[id]`

Elimina una nota permanentemente.

**Response:** `200 OK`

```json
{
  "message": "Nota eliminada"
}
```

---

## ❌ Códigos de Error

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| `400` | Bad Request | Falta campo requerido |
| `401` | Unauthorized | Token JWT inválido o expirado |
| `403` | Forbidden | No tienes permiso para este recurso |
| `404` | Not Found | Negocio/usuario no existe |
| `409` | Conflict | Email ya registrado |
| `429` | Too Many Requests | Rate limit excedido |
| `500` | Internal Server Error | Error inesperado del servidor |
| `503` | Service Unavailable | Supabase o OpenAI caídos |

**Formato de error:**

```json
{
  "error": "Mensaje descriptivo del error",
  "code": "ERROR_CODE" (opcional),
  "details": {} (opcional)
}
```

---

## 🔒 Autenticación de Requests

Todos los endpoints (excepto `/api/auth/**`) requieren autenticación.

**Métodos soportados:**
1. **Cookie HTTP-only** (recomendado para navegador):
   ```
   Cookie: auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Header Authorization** (para API externa):
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## 📊 Rate Limits

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| `/api/auth/*` | 10 requests | 1 minuto |
| `/api/constructor/*` | 60 requests | 1 minuto |
| `/api/negocios/*` | 120 requests | 1 minuto |
| `/api/agentes/*` | 120 requests | 1 minuto |

**Headers de respuesta:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1646150400
```

---

## 🧪 Entornos

| Entorno | Base URL | Estado |
|---------|----------|--------|
| **Desarrollo** | `http://localhost:3000` | ✅ |
| **Staging** | `https://staging.maketai.com` | 🚧 |
| **Producción** | `https://maketai.com` | 📋 |

---

## 📞 Soporte

- **Reportar bugs de API:** [GitHub Issues](https://github.com/Staillim/make/issues)
- **Preguntas:** [GitHub Discussions](https://github.com/Staillim/make/discussions)
- **Email:** api@maketai.com

---

**Última actualización:** Marzo 2026  
**Versión:** v1.0.0
