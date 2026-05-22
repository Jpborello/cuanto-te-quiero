# 🍼 Cuanto Te Quiero — Documentación del Proyecto

**Estado del Proyecto: ✅ FINALIZADO**

---

## ¿Qué es Cuanto Te Quiero?

**Cuanto Te Quiero** es una tienda online (e-commerce) especializada en productos para bebés, niños y mamás embarazadas, con sede en Mendoza 6378, Santa Fe, Rosario. El sistema está compuesto por dos partes principales: una **tienda pública** donde los clientes pueden explorar y consultar el catálogo de productos, y un **panel de administración** exclusivo para el equipo de la tienda.

---

## 🌐 URL del Sitio

- **Producción:** [cuantotequiero.com.ar](https://cuantotequiero.com.ar)
- **Repositorio:** [github.com/Jpborello/cuanto-te-quiero](https://github.com/Jpborello/cuanto-te-quiero)

---

## 🛍️ Tienda Pública — Funcionalidades

### Página de Inicio
- **Hero animado** con imagen de marca y llamada a la acción
- **Carrusel de productos destacados** con rotación automática
- **Burbujas de categorías** para navegación rápida
- **Grilla de novedades** con los últimos productos incorporados
- **Sección de testimonios** de clientes
- **Footer completo** con información de contacto, redes sociales, métodos de pago y links útiles

### Navegación y Búsqueda
- **Header sticky** (siempre visible al hacer scroll)
- **Categorías en el menú superior** (desktop) y menú hamburguesa lateral (mobile)
- **Barra de búsqueda funcional**: al escribir y presionar Enter, redirige a `/buscar?q=...` con resultados en tiempo real desde la base de datos
- Botón para **limpiar la búsqueda** (✕)

### Página de Resultados de Búsqueda (`/buscar`)
- Busca en todos los productos activos del catálogo
- Muestra hasta 60 resultados ordenados por nombre
- Skeleton de carga animado mientras se obtienen los resultados
- Estado vacío con mensaje amigable si no hay coincidencias
- Cada resultado muestra imagen (con rotación automática), código, nombre y precio

### Páginas de Categoría
- Grilla de subcategorías con **carousel de imágenes** de los productos de cada una
- Contador de subcategorías disponibles
- Ordenamiento personalizado para categorías clave (ej: Muebles Infantiles)

### Páginas de Subcategoría
- Grilla de todos los productos de la subcategoría
- **Filtro local por nombre**: permite buscar dentro de la subcategoría sin recargar la página (aparece si hay más de 4 productos)
- Imágenes con **rotación automática entre variantes** del mismo producto
- **Marca de agua** "Cuanto te Quiero" superpuesta en las fotos
- Botón "Agregar al carrito" (activo visualmente, checkout en desarrollo)
- Indicador de stock disponible

### Página de Producto Individual (`/producto/[id]`)
- Galería de imágenes completa
- Nombre, código, precio y stock
- Descripción del producto

---

## 🎛️ Panel de Administración (`/admin`)

### Acceso
- Login con email y contraseña (Supabase Auth)
- Verificación de permisos contra la tabla `admins`
- Sesión persistente

### Dashboard
- Estadísticas en tiempo real: total de productos, pedidos pendientes, ingresos del mes, productos con bajo stock
- Acciones rápidas: Nuevo Producto, Ver Pedidos, Gestionar Categorías, Gift Cards

### Gestión de Productos
- Listado agrupado por subcategoría con:
  - Nombre, código, precio y stock de cada producto
  - Badge **"📷 Sin foto"** en rojo para productos sin imagen cargada (facilita saber a cuáles agregarles fotos)
  - Badge de "Activo / Inactivo"
  - Badge de "Destacado" (⭐)
- **Nuevo producto**: formulario completo con campos de nombre, descripción, categoría, subcategoría, precio, stock, estado y hasta 3 imágenes + 1 GIF animado
- **Editar producto**: mismo formulario con datos precargados
- **Eliminar producto**: con confirmación

### Sistema de Imágenes
- Upload directo a **Supabase Storage**
- Soporte para JPG, PNG y GIF animado
- Preview de imágenes antes de guardar
- Botón de eliminación individual por imagen

### Gestión de Categorías y Subcategorías
- Crear, editar y eliminar categorías y subcategorías
- Asignación de imagen de portada opcional

### Gestión de Pedidos
- Listado de pedidos con ID, cliente, total, estado y fecha
- Cambio de estado: Pendiente → Procesando → Enviado → Entregado
- Vista detallada con productos, subtotal, envío y total

### Gift Cards
- Crear gift cards con montos fijos ($5.000 / $10.000 / $15.000 / $20.000) o monto personalizado
- Código auto-generado
- Estados: Activa / Usada / Expirada
- Balance disponible

---

## 🗄️ Base de Datos (Supabase)

### Tablas principales

| Tabla | Descripción |
|---|---|
| `products` | Catálogo completo de productos |
| `product_images` | Imágenes adicionales por producto |
| `categories` | Categorías principales |
| `subcategories` | Subcategorías asociadas a cada categoría |
| `orders` | Pedidos realizados |
| `order_items` | Ítems de cada pedido |
| `customers` | Clientes registrados |
| `admins` | Usuarios con acceso al panel de administración |
| `gift_cards` | Gift cards emitidas |

### Categorías del catálogo

| Categoría | Subcategorías incluidas |
|---|---|
| **Muebles Infantiles y Juveniles** | Cunas, Cunas Colecho, Cajoneras, Roperos y Placares, Montessori, Camas de 1 Plaza y Nido, Cuchetas, Escritorios, y más |
| **Blanquería y Colchones** | Sábanas, Mantas y Frazadas, Toallones con Capucha, Baberos y Babitas, y más |
| **Accesorios para Bebés** | Para el Baño, Butacas y Booster, Gimnasios, Alfombras Antigolpes, Mecedoras, Móviles Musicales, Pelelas, Mochilas Portabebé, Practicunas, Sillas de Comer, Higiene y Seguridad, Alimentación, Para el Coche |
| **Coches y Rodados** | Monopatines, Coches de Muñecas |
| **Indumentaria** | Bebés, Niños, Calzado |
| **Futura Mamá** | Camisones Maternales, Bolsos y Mochilas Maternales |

---

## 🎨 Diseño y Estética

- **Paleta de colores**: Rosa pastel (`#ffc0cb`) como color principal, complementado con tonos crema, blanco y marrón suave
- **Tipografías**: Inter (cuerpo de texto) + Fredoka / Bubblegum (elementos de marca)
- **Estilo**: Moderno, femenino, cálido — alineado con el público objetivo (mamás y familias)
- **Animaciones**: Hover effects en cards, transiciones suaves, carrusel animado, imágenes con cross-fade
- **Marca de agua**: Superpuesta en todas las imágenes de productos para protección de contenido
- **Responsive**: Mobile First — funciona en celulares, tablets y desktop

---

## ⚙️ Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| **Next.js 16** (App Router) | Framework principal — SSR, routing, API |
| **React 19** | Librería de UI |
| **TypeScript** | Tipado estático en todo el proyecto |
| **Supabase** | Base de datos (PostgreSQL), autenticación y storage de imágenes |
| **Vercel** | Deploy y hosting en producción |
| **Lucide React** | Iconografía |
| **CSS Vanilla** | Estilos personalizados sin frameworks externos |
| **Google Fonts** | Tipografías (Inter, Fredoka, Bubblegum) |

---

## 📱 Información de Contacto del Negocio

| | |
|---|---|
| **WhatsApp** | 3416029814 |
| **Instagram** | [@cuanto_tequiero](https://www.instagram.com/cuanto_tequiero/) |
| **Facebook** | [facebook.com/cuantotequieroCTQ](https://www.facebook.com/cuantotequieroCTQ) |
| **Dirección** | Mendoza 6378 — Santa Fe, Rosario |

---

## 🔐 Credenciales y Configuración

Las variables de entorno necesarias para el funcionamiento del sistema están configuradas en el archivo `.env.local` (no incluido en el repositorio por seguridad):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 🚀 Cómo Ejecutar en Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Jpborello/cuanto-te-quiero

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear el archivo .env.local con las claves de Supabase

# 4. Iniciar el servidor de desarrollo
npm run dev

# El sitio estará disponible en http://localhost:3000
```

---

## 📋 Estado del Proyecto

| Módulo | Estado |
|---|---|
| Tienda pública (catálogo) | ✅ Completo |
| Búsqueda de productos | ✅ Completo |
| Filtros por subcategoría | ✅ Completo |
| Panel de administración | ✅ Completo |
| Gestión de productos | ✅ Completo |
| Gestión de categorías | ✅ Completo |
| Gestión de pedidos | ✅ Completo |
| Gift Cards | ✅ Completo |
| Deploy en producción | ✅ Completo |
| Dominio propio | ✅ cuantotequiero.com.ar |

---

*Documento generado al cierre del proyecto — Mayo 2025*
*Desarrollado por **Neo Core Sys** — [neo-core-sys.com](https://www.neo-core-sys.com/es)*
