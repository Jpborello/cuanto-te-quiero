# Funcionalidades del Sistema

## 🛍️ E-commerce Frontend

### Home Page
- **Hero Section**
  - Logo animado "Cuanto Te Quiero" con texto curvo
  - Imagen de fondo responsive
  - Diseño adaptado para móvil y desktop
  
- **Header Sticky**
  - Logo clickeable
  - Navegación: Mundo Bebé, Dulce Espera, Regalería, Ofertas
  - Barra de búsqueda
  - Icono de usuario
  - Carrito de compras con contador
  - Menú hamburguesa en móvil

- **Sección Hero con CTA**
  - Título principal: "Todo para tu bebé, con amor"
  - Subtítulo descriptivo
  - Botón "Ver Productos" con hover effects

- **Tarjetas de Colección**
  - 3 categorías principales con gradientes:
    - Mundo Bebé (azul pastel)
    - Dulce Espera (rosa pastel)
    - Regalería (amarillo crema)
  - Iconos representativos
  - Efectos hover (lift + shadow)
  - Links a páginas de categoría

- **Grid de Productos**
  - Productos dinámicos desde Supabase
  - Tarjetas con:
    - Imagen del producto
    - Nombre y descripción
    - Precio destacado
    - Stock disponible
    - Botón "Agregar al carrito"
  - Responsive: 4 columnas desktop, 2 tablet, 1 móvil

- **Footer Completo**
  - 4 columnas de información:
    - Sobre Nosotros + Redes sociales
    - Categorías
    - Información y enlaces
    - Contacto
  - Métodos de pago
  - Copyright

### Responsive Design
- **Mobile First**
  - Hero optimizado para móvil (500px altura)
  - Texto escalado apropiadamente
  - Sin scroll horizontal
  - Menú hamburguesa
  
- **Tablet**
  - Grid de 2 columnas
  - Header completo
  
- **Desktop**
  - Grid de 4 columnas
  - Navegación completa
  - Hover effects

---

## 🎛️ Panel de Administración

### Dashboard
- **Estadísticas en Tiempo Real**
  - Total de productos
  - Pedidos pendientes
  - Ingresos del mes
  - Productos con bajo stock
  
- **Tarjetas con Gradientes**
  - Iconos representativos
  - Colores distintivos por métrica
  - Hover effects
  
- **Acciones Rápidas**
  - Nuevo Producto
  - Ver Pedidos
  - Gestionar Categorías
  - Gift Cards

### Gestión de Productos

#### Listado de Productos
- Tabla con columnas:
  - ID interno (4 dígitos)
  - Nombre
  - Categoría
  - Precio
  - Stock
  - Estado (Activo/Inactivo)
  - Acciones (Editar/Eliminar)
- Botón "Nuevo Producto"
- Búsqueda y filtros

#### Formulario de Producto
- **Información Básica**
  - ID personalizado (4 dígitos)
  - Nombre del producto
  - Descripción
  
- **Categorización**
  - Categoría principal
  - Subcategoría (opcional)
  
- **Precio e Inventario**
  - Precio
  - Stock
  - Estado (Activo/Inactivo)
  
- **Sistema de Imágenes**
  - 3 slots para imágenes de producto (JPG/PNG)
  - 1 slot para GIF animado (opcional)
  - Preview de imágenes
  - Botón eliminar por imagen
  - Upload a Supabase Storage
  
- **Validaciones**
  - ID de 4 dígitos obligatorio
  - Campos requeridos marcados
  - Formato de precio y stock

### Gestión de Categorías
- **Lista de Categorías**
  - Nombre
  - Imagen (opcional)
  - Acciones inline
  
- **Crear/Editar Categoría**
  - Nombre
  - URL de imagen
  - Guardar/Cancelar inline

### Gestión de Subcategorías
- Similar a categorías
- Asociadas a categoría padre

### Gestión de Pedidos
- **Lista de Pedidos**
  - ID de pedido
  - Cliente
  - Total
  - Estado (Pendiente, Procesando, Enviado, Entregado)
  - Fecha
  - Acciones
  
- **Detalle de Pedido**
  - Información del cliente
  - Productos del pedido
  - Subtotal, envío, total
  - Cambiar estado
  - Historial de cambios

### Gift Cards
- **Gestión de Gift Cards**
  - Crear gift card
  - Monto fijo o personalizado
  - Código auto-generado
  - Estado (Activa/Usada/Expirada)
  - Balance disponible
  
- **Montos Predefinidos**
  - $5.000
  - $10.000
  - $15.000
  - $20.000
  - Monto personalizado

---

## 🗄️ Base de Datos

### Tablas Principales

#### products
- `uid` (uuid) - Primary key auto-generado
- `product_id` (int4) - ID interno de 4 dígitos
- `name` (text) - Nombre del producto
- `description` (text) - Descripción
- `category_id` (uuid) - FK a categories
- `subcategory_id` (uuid) - FK a subcategories (opcional)
- `price` (numeric) - Precio
- `stock` (int4) - Stock disponible
- `active` (boolean) - Estado activo/inactivo
- `image_url` (text) - URL de imagen principal

#### product_images
- `uid` (uuid) - Primary key
- `product_id` (uuid) - FK a products
- `image_url` (text) - URL de la imagen
- `order` (int4) - Orden de visualización

#### categories
- `uid` (uuid) - Primary key
- `name` (text) - Nombre de categoría
- `image_url` (text) - Imagen opcional

#### subcategories
- `uid` (uuid) - Primary key
- `name` (text) - Nombre
- `category_id` (uuid) - FK a categories

#### orders
- `uid` (uuid) - Primary key
- `customer_id` (uuid) - FK a customers
- `total` (numeric) - Total del pedido
- `status` (text) - Estado del pedido
- `created_at` (timestamp) - Fecha de creación

#### order_items
- `uid` (uuid) - Primary key
- `order_id` (uuid) - FK a orders
- `product_id` (uuid) - FK a products
- `quantity` (int4) - Cantidad
- `price` (numeric) - Precio unitario

#### admins
- `uid` (uuid) - Primary key
- `email` (text) - Email del admin
- `created_at` (timestamp)

---

## 🎨 Diseño y Estilos

### Paleta de Colores
- **Rosa**: `#ffc0cb` - Principal, CTAs
- **Rosa Intenso**: `#ff6b9d` - Hover states
- **Azul Pastel**: `#add8e6` - Mundo Bebé
- **Amarillo Crema**: `#fff8dc` - Regalería
- **Marrón**: `#8d6e63` - Texto principal
- **Gris**: `#666` - Texto secundario

### Typography
- **Font Principal**: Inter (Google Fonts)
- **Font Brand**: Fredoka (para logo)
- **Tamaños**:
  - Hero Title: 3rem (móvil) / 4.5rem (desktop)
  - Section Titles: 2rem
  - Body: 1rem
  - Small: 0.875rem

### Espaciado
- Secciones: 4rem margin-bottom
- Cards: 2rem padding
- Grid gaps: 2rem
- Header: 1rem padding

---

## 🔐 Seguridad

### Row Level Security (RLS)
- **Actualmente**: Deshabilitado para testing
- **Producción**: Configurar políticas para:
  - Solo admins pueden modificar productos
  - Público puede leer productos activos
  - Clientes solo ven sus propios pedidos

### Autenticación
- Supabase Auth
- Verificación de email en tabla `admins`
- Sesión persistente

---

## 📱 Funcionalidades Pendientes

### E-commerce
- [ ] Carrito de compras funcional
- [ ] Checkout completo
- [ ] Pasarela de pago (Mercado Pago)
- [ ] Búsqueda de productos
- [ ] Filtros por categoría/precio
- [ ] Página de detalle de producto
- [ ] Newsletter signup

### Admin
- [ ] Reportes y analytics
- [ ] Exportar pedidos a CSV
- [ ] Notificaciones de bajo stock
- [ ] Gestión de cupones de descuento
- [ ] Configuración de envíos

### General
- [ ] Optimización de imágenes (WebP)
- [ ] SEO meta tags
- [ ] Sitemap
- [ ] Google Analytics
- [ ] Chat de soporte
