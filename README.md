# 🚀 Maket AI - Plataforma de Negocios Autónomos

Una plataforma completa para crear negocios autónomos gestionados por agentes de IA. Los usuarios pueden crear tiendas online a través de conversaciones con un agente constructor, que luego son manejadas automáticamente por agentes especializados.

## 🎯 Características Principales

- **🤖 Agente Constructor**: Chat IA para crear negocios paso a paso (11 fases)
- **🛒 Agente Vendedor**: Atiende clientes y gestiona ventas automáticamente  
- **📊 Agente Administrador**: Reportes, inventario y métricas en tiempo real
- **🎨 Plantillas Dinámicas**: Sistema de plantillas personalizables
- **🏪 Tiendas Públicas**: URLs públicas generadas automáticamente
- **💳 Gestión Comercial**: Pagos, envíos y políticas automatizadas

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT + HTTP-only cookies
- **State**: Zustand
- **Icons**: Lucide React
- **Deploy**: Netlify

## 🚀 Configuración y Deploy

### 1. **Clonar el repositorio**
```bash
git clone https://github.com/Staillim/make.git
cd make
npm install
```

### 2. **Configurar Supabase**

1. **Crear proyecto en Supabase**:
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Anota tu `URL` y `ANON KEY`

2. **Ejecutar el schema**:
   - Ve a tu dashboard de Supabase → SQL Editor
   - Ejecuta el schema completo desde `supabase-schema.sql`
   - Esto creará todas las tablas, índices y plantillas

3. **Configurar variables de entorno**:
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
DATABASE_URL=postgresql://postgres.tu-proyecto:tu-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
NEXTAUTH_SECRET=genera-una-clave-secreta-aleatoria
```

### 3. **Ejecutar en desarrollo**
```bash
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000)

### 4. **Deploy en Netlify**

1. **Conectar repositorio**:
   - Ve a [netlify.com](https://netlify.com)
   - Connect to Git → Selecciona tu repo

2. **Configurar variables de entorno**:
   - Site settings → Environment variables
   - Agrega las mismas variables del `.env.local`

3. **Deploy automático**:
   - Netlify detectará `netlify.toml` y usará Node.js 20
   - El plugin `@netlify/plugin-nextjs` manejará las API routes

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/                     # Registro y login
│   ├── (dashboard)/                # Panel del usuario
│   ├── tienda/[id_negocio]/       # Tiendas públicas
│   └── api/                       # Backend API routes
├── components/
│   ├── ui/                        # Componentes base
│   ├── landing/                   # Landing page
│   ├── auth/                      # Autenticación  
│   ├── dashboard/                 # Panel de control
│   └── constructor/               # Chat del agente
├── lib/
│   ├── supabase.ts               # Cliente de Supabase
│   ├── database.types.ts         # Tipos TypeScript
│   └── store/                    # Estados Zustand
└── types/                        # Definiciones de tipos
```

## 🗄️ Base de Datos

### Tablas Principales:
- **`usuarios`**: Información de usuarios registrados
- **`negocios`**: Negocios creados por usuarios
- **`plantillas`**: Catálogo de plantillas disponibles
- **`marca`**: Identidad visual de cada negocio
- **`productos`**: Catálogo de productos
- **`agentes`**: Configuración de agentes IA

### Relaciones:
```
usuarios (1:N) negocios (1:1) marca
negocios (1:N) productos (N:1) categorias
negocios (1:N) agentes
```

## 🤖 Agentes IA

### **Agente Constructor**
- **Conversacional**: Chat paso a paso para configurar negocio
- **11 Fases**: Desde tipo de negocio hasta activación final
- **Adaptativo**: Preguntas dinámicas según el tipo de negocio
- **Persistente**: Guarda progreso en cada paso

### **Agente Vendedor** (Futuro)  
- Atención al cliente 24/7
- Recomendaciones personalizadas
- Cierre de ventas automático

### **Agente Administrador** (Futuro)
- Reportes automáticos
- Alertas de inventario  
- Métricas de rendimiento

## 🎨 Sistema de Plantillas

- **Dinámico**: Plantillas renderizadas desde JSON
- **Personalizables**: Colores, tipografías, secciones
- **Responsive**: Optimizadas para móviles
- **Planes**: Free (3 plantillas) vs Premium (todas)

## 🔐 Autenticación

- **JWT Tokens**: Con expiración de 7 días
- **HTTP-only Cookies**: Seguridad contra XSS
- **Bcrypt**: Hash de contraseñas con salt rounds 12
- **Row Level Security**: Políticas de acceso en Supabase

## 📈 Planes y Límites

| Característica | Free | Premium |
|---|---|---|
| Negocios | 1 | Ilimitados |
| Plantillas | 3 básicas | Todas |
| Agentes IA | Limitados | Completos |
| Dominio personalizado | ❌ | ✅ |

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Linter
npm run lint  

# Type checking
npx tsc --noEmit
```

## 🚀 Deploy

### Netlify (Configurado)
- Push a `master` → Deploy automático
- Node.js 20 + Plugin Next.js
- API routes → Netlify Functions

### Vercel (Alternativo)
```bash
npm install -g vercel
vercel
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad` 
5. Abre un Pull Request

## 📝 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- **Issues**: Reporta bugs en GitHub Issues
- **Discussions**: Preguntas y sugerencias en GitHub Discussions
- **Email**: contacto@maketai.com

---

**Desarrollado con ❤️ por el equipo de Maket AI**
