# Guía de Deployment

## 🚀 Deployment en Vercel

### Requisitos Previos
- Cuenta de Vercel
- Repositorio en GitHub/GitLab/Bitbucket
- Proyecto de Supabase configurado

---

## 📋 Paso a Paso

### 1. Preparar el Repositorio

```bash
# Asegurarse de que todo esté commiteado
git status

# Commit de cambios pendientes
git add .
git commit -m "Ready for deployment"

# Push a la rama main
git push origin main
```

### 2. Conectar Vercel

1. Ir a [vercel.com](https://vercel.com)
2. Click en "Add New Project"
3. Importar repositorio Git
4. Seleccionar el repositorio `cuanto-te-quiero`

### 3. Configurar el Proyecto

**Framework Preset**: Next.js (detectado automáticamente)

**Build Command**: `npm run build` (default)

**Output Directory**: `.next` (default)

**Install Command**: `npm install` (default)

### 4. Configurar Variables de Entorno

En Vercel, ir a **Settings** → **Environment Variables**

Agregar las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jrwwfvzgchjzjnapfrar.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**Obtener las keys de Supabase:**
1. Ir a [supabase.com/dashboard](https://supabase.com/dashboard)
2. Seleccionar tu proyecto
3. Ir a **Settings** → **API**
4. Copiar:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Environments**: Seleccionar `Production`, `Preview`, y `Development`

### 5. Deploy

1. Click en "Deploy"
2. Esperar a que el build termine (2-3 minutos)
3. Vercel te dará una URL de producción

---

## 🔄 Deployments Automáticos

### Configuración

Vercel automáticamente:
- **Deploy en cada push a `main`** → Producción
- **Deploy en cada PR** → Preview
- **Deploy en cada branch** → Preview

### Verificar Deploy

1. Ir a **Deployments** en Vercel
2. Ver el estado del último deploy
3. Click en el deploy para ver logs

---

## 🌐 Configurar Dominio Personalizado

### Agregar Dominio

1. En Vercel, ir a **Settings** → **Domains**
2. Click en "Add Domain"
3. Ingresar tu dominio (ej: `cuantotequiero.com`)
4. Seguir instrucciones para configurar DNS

### Configuración DNS

**Si usas Vercel DNS:**
- Vercel configurará automáticamente

**Si usas otro proveedor:**
Agregar estos registros:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### SSL/HTTPS

- Vercel provee SSL automáticamente
- Certificado Let's Encrypt
- Renovación automática

---

## 🗄️ Configurar Supabase para Producción

### 1. Verificar RLS Policies

**Actualmente RLS está deshabilitado para testing**

Para producción, ejecutar en Supabase SQL Editor:

```sql
-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública
CREATE POLICY "Public can view active products"
ON products FOR SELECT
TO public
USING (active = true);

-- Política para admins
CREATE POLICY "Admins can manage products"
ON products FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);
```

### 2. Configurar Storage

1. Ir a **Storage** en Supabase
2. Crear bucket `product-images`
3. Configurar políticas:

```sql
-- Lectura pública
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Admins pueden subir
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);
```

### 3. Configurar CORS

En Supabase, ir a **Settings** → **API** → **CORS**

Agregar tu dominio de Vercel:
```
https://tu-proyecto.vercel.app
https://cuantotequiero.com
```

---

## 🔒 Seguridad en Producción

### Variables de Entorno

✅ **Nunca commitear** `.env.local` al repositorio
✅ Usar variables de entorno en Vercel
✅ Rotar keys periódicamente

### Supabase

✅ Habilitar RLS en todas las tablas
✅ Configurar políticas restrictivas
✅ Usar `anon` key para cliente público
✅ Nunca exponer `service_role` key

### Next.js

✅ Usar `NEXT_PUBLIC_` solo para variables públicas
✅ Variables sensibles solo en server-side
✅ Habilitar HTTPS (automático en Vercel)

---

## 📊 Monitoreo

### Vercel Analytics

1. Ir a **Analytics** en Vercel
2. Ver métricas de:
   - Page views
   - Unique visitors
   - Top pages
   - Performance

### Supabase Logs

1. Ir a **Logs** en Supabase
2. Monitorear:
   - API requests
   - Errores
   - Slow queries

### Alertas

Configurar alertas para:
- Errores de build
- Downtime
- Uso excesivo de recursos

---

## 🔄 Rollback

### Si algo sale mal

1. Ir a **Deployments** en Vercel
2. Encontrar el último deploy funcional
3. Click en "..." → "Promote to Production"
4. Confirmar

### Revertir Cambios

```bash
# Ver commits
git log

# Revertir a commit anterior
git revert <commit-hash>

# Push
git push origin main
```

---

## 🧪 Testing Pre-Deploy

### Build Local

```bash
# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Verificar en http://localhost:3000
```

### Checklist Pre-Deploy

- [ ] Build exitoso localmente
- [ ] No hay errores de TypeScript
- [ ] No hay errores de lint
- [ ] Variables de entorno configuradas
- [ ] Imágenes optimizadas
- [ ] RLS configurado (si es producción)
- [ ] Dominio configurado
- [ ] SSL activo

---

## 📝 Post-Deploy

### Verificaciones

1. **Home Page**: Verificar que carga correctamente
2. **Admin Login**: Probar login
3. **Crear Producto**: Probar creación
4. **Subir Imagen**: Verificar upload
5. **E-commerce**: Verificar productos visibles

### Performance

1. Ir a [PageSpeed Insights](https://pagespeed.web.dev/)
2. Ingresar tu URL
3. Verificar scores:
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

---

## 🆘 Troubleshooting

### Build Failed

**Error**: `Module not found`
**Solución**: Verificar imports y paths

**Error**: `Type error`
**Solución**: Corregir errores de TypeScript

### Runtime Errors

**Error**: `supabaseUrl is required`
**Solución**: Configurar variables de entorno en Vercel

**Error**: `Failed to fetch`
**Solución**: Verificar CORS en Supabase

### Performance Issues

**Problema**: Carga lenta
**Solución**: 
- Optimizar imágenes
- Habilitar caching
- Usar CDN de Vercel

---

## 📞 Soporte

### Vercel
- [Documentación](https://vercel.com/docs)
- [Discord](https://vercel.com/discord)
- [Support](https://vercel.com/support)

### Supabase
- [Documentación](https://supabase.com/docs)
- [Discord](https://discord.supabase.com)
- [Support](https://supabase.com/support)

---

## ✅ Checklist Final

### Pre-Deploy
- [ ] Código en repositorio Git
- [ ] Build local exitoso
- [ ] Variables de entorno preparadas
- [ ] Supabase configurado

### Deploy
- [ ] Proyecto conectado a Vercel
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] URL de producción funcional

### Post-Deploy
- [ ] Dominio personalizado configurado
- [ ] SSL activo
- [ ] RLS habilitado
- [ ] Performance verificado
- [ ] Funcionalidades testeadas

---

## 🎉 ¡Listo!

Tu aplicación está ahora en producción y accesible públicamente.

**URL de Producción**: `https://tu-proyecto.vercel.app`

**Panel de Admin**: `https://tu-proyecto.vercel.app/admin/login`
