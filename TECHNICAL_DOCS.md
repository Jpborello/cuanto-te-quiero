# Documentación Técnica

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico
- **Frontend**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: CSS Puro (sin frameworks)
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Storage**: Supabase Storage
- **Hosting**: Vercel

### Estructura de Directorios

```
src/
├── app/                    # Next.js App Router
│   ├── (shop)/            # Grupo de rutas del e-commerce
│   │   ├── page.tsx       # Home page
│   │   └── layout.tsx     # Layout con Header/Footer
│   ├── admin/             # Panel de administración
│   │   ├── (protected)/   # Rutas protegidas
│   │   ├── login/         # Login page
│   │   ├── layout.tsx     # Layout del admin
│   │   └── admin.css      # Estilos del admin
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Estilos globales
├── components/
│   ├── shop/              # Componentes del e-commerce
│   └── admin/             # Componentes del admin
└── lib/
    ├── supabase.ts        # Cliente de Supabase
    ├── supabase-admin.ts  # Cliente admin de Supabase
    └── isAdmin.ts         # Utilidad de verificación
```

---

## 🗄️ Esquema de Base de Datos

### Tabla: products
```sql
CREATE TABLE products (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id INT4 NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(uid),
  subcategory_id UUID REFERENCES subcategories(uid),
  price NUMERIC NOT NULL,
  stock INT4 NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Índices:**
```sql
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_product_id ON products(product_id);
```

### Tabla: product_images
```sql
CREATE TABLE product_images (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(uid) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order INT4 DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: categories
```sql
CREATE TABLE categories (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: subcategories
```sql
CREATE TABLE subcategories (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(uid) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: orders
```sql
CREATE TABLE orders (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(uid),
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: order_items
```sql
CREATE TABLE order_items (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(uid) ON DELETE CASCADE,
  product_id UUID REFERENCES products(uid),
  quantity INT4 NOT NULL,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: admins
```sql
CREATE TABLE admins (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Row Level Security (RLS)

### Estado Actual
RLS está **deshabilitado** para testing en:
- `products`
- `categories`
- `product_images`

### Políticas Recomendadas para Producción

#### Products
```sql
-- Lectura pública de productos activos
CREATE POLICY "Public can view active products"
ON products FOR SELECT
TO public
USING (active = true);

-- Solo admins pueden modificar
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

#### Orders
```sql
-- Usuarios ven solo sus pedidos
CREATE POLICY "Users can view their orders"
ON orders FOR SELECT
TO authenticated
USING (customer_id = auth.uid());

-- Admins ven todos los pedidos
CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = auth.jwt() ->> 'email'
  )
);
```

---

## 🔌 API y Servicios

### Supabase Client

**Cliente Público** (`src/lib/supabase.ts`):
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Cliente Admin** (`src/lib/supabase-admin.ts`):
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
```

### Operaciones Comunes

#### Fetch Products
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('active', true)
  .order('product_id', { ascending: true });
```

#### Create Product
```typescript
const { data, error } = await supabase
  .from('products')
  .insert({
    product_id: 1001,
    name: 'Producto',
    price: 5000,
    stock: 10,
    active: true
  })
  .select()
  .single();
```

#### Upload Image
```typescript
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(`${productId}/${file.name}`, file);

const { data: { publicUrl } } = supabase.storage
  .from('product-images')
  .getPublicUrl(data.path);
```

---

## 🎨 Sistema de Estilos

### CSS Puro (No Tailwind)

**Razón**: Mayor control y personalización sin dependencias

### Variables CSS
```css
:root {
  --brand-brown: #8d6e63;
  --pastel-blue: #dbeafe;
  --pastel-pink: #ffe4e6;
  --pastel-cream: #fff1f2;
  --rosa-default: #F9CBD3;
  --celeste-default: #BDE3F2;
}
```

### Media Queries
```css
/* Mobile */
@media (max-width: 768px) {
  .hero-container {
    height: 500px;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) {
  .collections-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .collections-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 🔄 Flujo de Datos

### Creación de Producto

```
Admin Panel
    ↓
ProductForm.tsx
    ↓
handleSubmit()
    ↓
Supabase Client
    ↓
INSERT INTO products
    ↓
Upload images to Storage
    ↓
INSERT INTO product_images
    ↓
Return success
    ↓
Redirect to products list
```

### Visualización en E-commerce

```
Home Page
    ↓
ProductGrid.tsx
    ↓
useEffect() → fetchProducts()
    ↓
Supabase Client
    ↓
SELECT * FROM products WHERE active = true
    ↓
Render product cards
```

---

## 🧪 Testing

### Testing Local
```bash
npm run dev
```

### Build de Producción
```bash
npm run build
npm start
```

### Verificar Errores
```bash
npm run lint
```

---

## 🚀 Performance

### Optimizaciones Implementadas

1. **Next.js Image Optimization**
   - Uso de componente `<Image>`
   - Lazy loading automático
   - Responsive images

2. **CSS Puro**
   - Sin overhead de Tailwind
   - Menor bundle size
   - Mejor performance

3. **Server Components**
   - Renderizado en servidor
   - Menor JavaScript en cliente

4. **Supabase Edge Functions**
   - Baja latencia
   - CDN global

### Métricas Objetivo

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: > 90

---

## 🐛 Debugging

### Logs de Supabase
```typescript
const { data, error } = await supabase.from('products').select('*');
if (error) {
  console.error('Supabase error:', error);
}
```

### Verificar Autenticación
```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);
```

### Network Tab
- Verificar requests a Supabase
- Verificar tiempos de respuesta
- Verificar errores 4xx/5xx

---

## 📝 Convenciones de Código

### Naming
- **Componentes**: PascalCase (`ProductForm.tsx`)
- **Funciones**: camelCase (`handleSubmit`)
- **Constantes**: UPPER_SNAKE_CASE (`SUPABASE_URL`)
- **CSS Classes**: kebab-case (`hero-container`)

### Estructura de Componentes
```typescript
'use client'; // Si usa hooks o eventos

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  // Props aquí
}

export default function Component({ prop }: Props) {
  // State
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {}, []);
  
  // Handlers
  const handleAction = () => {};
  
  // Render
  return <div>...</div>;
}
```

---

## 🔧 Troubleshooting Común

### Error: "supabaseUrl is required"
**Causa**: Variables de entorno no configuradas
**Solución**: Verificar `.env.local` o variables en Vercel

### Error: "Row violates RLS policy"
**Causa**: RLS bloqueando operación
**Solución**: Deshabilitar RLS o configurar políticas correctas

### Productos no aparecen en e-commerce
**Causa**: `active = false` o RLS bloqueando
**Solución**: Verificar campo `active` y políticas RLS

### Imágenes no se suben
**Causa**: Permisos de Storage o tamaño excedido
**Solución**: Verificar políticas de Storage y tamaño de archivo

---

## 📚 Referencias

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vercel Docs](https://vercel.com/docs)
