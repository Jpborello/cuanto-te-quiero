# Cuanto Te Quiero - E-commerce

E-commerce completo para productos de bebés y maternidad con panel de administración integrado.

## 🚀 Características Principales

- ✅ **E-commerce Frontend** - Tienda online con diseño responsive
- ✅ **Panel de Administración** - Gestión completa de productos, categorías y pedidos
- ✅ **Base de Datos Supabase** - Backend serverless con autenticación
- ✅ **Diseño Responsive** - Optimizado para móvil, tablet y desktop
- ✅ **Sistema de Imágenes** - Múltiples imágenes por producto + GIF animado

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- Cuenta de Vercel (para deployment)

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone [tu-repo-url]
cd cuanto-te-quiero

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Iniciar servidor de desarrollo
npm run dev
```

## 🔑 Variables de Entorno

Crear archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

## 📁 Estructura del Proyecto

```
cuanto-te-quiero/
├── src/
│   ├── app/
│   │   ├── (shop)/          # E-commerce frontend
│   │   │   ├── page.tsx     # Home page
│   │   │   └── layout.tsx   # Layout del shop
│   │   ├── admin/           # Panel de administración
│   │   │   ├── (protected)/ # Rutas protegidas
│   │   │   │   ├── dashboard/
│   │   │   │   ├── products/
│   │   │   │   ├── categories/
│   │   │   │   ├── orders/
│   │   │   │   └── gift-cards/
│   │   │   └── login/       # Login de admin
│   │   └── globals.css      # Estilos globales
│   ├── components/
│   │   ├── shop/            # Componentes del e-commerce
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ProductGrid.tsx
│   │   └── admin/           # Componentes del admin
│   │       ├── ProductForm.tsx
│   │       ├── CategoryManager.tsx
│   │       └── GiftCardManager.tsx
│   └── lib/
│       ├── supabase.ts      # Cliente de Supabase
│       └── isAdmin.ts       # Verificación de admin
├── public/
│   └── images/              # Imágenes estáticas
└── package.json
```

## 🎨 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: CSS Puro (sin Tailwind)
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel
- **Iconos**: Lucide React

## 🔐 Acceso al Admin

1. Ir a `/admin/login`
2. Ingresar credenciales de admin (configuradas en Supabase)
3. Acceder al dashboard

## 📚 Documentación Adicional

- [FEATURES.md](./FEATURES.md) - Lista completa de funcionalidades
- [USER_GUIDE.md](./USER_GUIDE.md) - Guía para usuarios del admin
- [TECHNICAL_DOCS.md](./TECHNICAL_DOCS.md) - Documentación técnica
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía de deployment

## 🚀 Deployment en Vercel

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push a `main`

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas.

## 🐛 Troubleshooting

### Error: "supabaseUrl is required"
- Verificar que las variables de entorno estén configuradas
- En Vercel: Settings → Environment Variables

### Productos no se muestran
- Verificar RLS policies en Supabase
- Verificar que los productos estén activos (`active = true`)

### Error de autenticación
- Verificar credenciales en tabla `admins`
- Verificar que el email esté registrado

## 📝 Licencia

Proyecto privado - Todos los derechos reservados

## 👥 Contacto

Para soporte o consultas, contactar a [tu-email]
