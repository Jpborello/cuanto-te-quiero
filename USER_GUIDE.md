# Guía de Usuario - Panel de Administración

## 📖 Índice
1. [Acceso al Sistema](#acceso-al-sistema)
2. [Dashboard](#dashboard)
3. [Gestión de Productos](#gestión-de-productos)
4. [Gestión de Categorías](#gestión-de-categorías)
5. [Gestión de Pedidos](#gestión-de-pedidos)
6. [Gift Cards](#gift-cards)

---

## 🔐 Acceso al Sistema

### Iniciar Sesión
1. Ir a `https://tu-dominio.com/admin/login`
2. Ingresar email y contraseña
3. Click en "Iniciar Sesión"

> **Nota**: Solo usuarios registrados en la tabla `admins` pueden acceder

### Cerrar Sesión
- Click en el botón "Cerrar Sesión" en el sidebar

---

## 📊 Dashboard

El dashboard muestra un resumen general del negocio:

### Métricas Principales
- **Total Productos**: Cantidad total de productos en el catálogo
- **Pedidos Pendientes**: Pedidos que requieren atención
- **Ingresos del Mes**: Total facturado en el mes actual
- **Productos con Bajo Stock**: Productos con menos de 10 unidades

### Acciones Rápidas
- **Nuevo Producto**: Crear un producto nuevo
- **Ver Pedidos**: Ir a la lista de pedidos
- **Gestionar Categorías**: Administrar categorías
- **Gift Cards**: Crear y gestionar gift cards

---

## 📦 Gestión de Productos

### Ver Lista de Productos

1. Click en "Productos" en el sidebar
2. Verás una tabla con todos los productos:
   - ID interno
   - Nombre
   - Categoría
   - Precio
   - Stock
   - Estado (Activo/Inactivo)

### Crear un Nuevo Producto

1. Click en "Nuevo Producto"
2. Completar el formulario:

#### Sección: Información Básica
- **ID Personalizado**: Número de 4 dígitos (ej: 1001)
  - Este ID es para uso interno
  - Debe ser único
  - Facilita la búsqueda en otros sistemas
  
- **Nombre del Producto**: Nombre descriptivo
  - Ejemplo: "Peluche Osito Romántico"
  
- **Descripción**: Detalles del producto
  - Características
  - Materiales
  - Cuidados

#### Sección: Categorización
- **Categoría**: Seleccionar categoría principal
  - Mundo Bebé
  - Dulce Espera
  - Regalería
  
- **Subcategoría** (opcional): Clasificación más específica

#### Sección: Precio e Inventario
- **Precio**: Precio de venta (sin puntos ni comas)
  - Ejemplo: 5000 (para $5.000)
  
- **Stock**: Cantidad disponible
  - Número entero
  - Se descuenta automáticamente con cada venta
  
- **Estado**: Activo/Inactivo
  - Solo productos activos se muestran en el e-commerce

#### Sección: Imágenes del Producto

**3 Imágenes de Producto (JPG/PNG)**
1. Click en "Imagen 1", "Imagen 2" o "Imagen 3"
2. Seleccionar archivo JPG o PNG
3. Esperar a que se suba
4. Ver preview de la imagen
5. Para eliminar: Click en la X roja

**1 GIF Animado (Opcional)**
1. Click en "Subir GIF"
2. Seleccionar archivo GIF
3. Esperar a que se suba
4. Ver preview del GIF

> **Importante**: 
> - Las imágenes se suben a Supabase Storage
> - Tamaño recomendado: 800x800px mínimo
> - Peso máximo: 5MB por imagen

3. Click en "Guardar Producto"
4. Esperar confirmación
5. Serás redirigido a la lista de productos

### Editar un Producto

1. En la lista de productos, click en el ícono de editar (lápiz)
2. Modificar los campos necesarios
3. Click en "Guardar Producto"

### Eliminar un Producto

1. En la lista de productos, click en el ícono de eliminar (basura)
2. Confirmar la eliminación
3. El producto se eliminará permanentemente

> **Advertencia**: Esta acción no se puede deshacer

---

## 🏷️ Gestión de Categorías

### Ver Categorías

1. Click en "Categorías" en el sidebar
2. Verás la lista de todas las categorías

### Crear Nueva Categoría

1. Click en "Nueva Categoría"
2. Ingresar nombre de la categoría
3. (Opcional) Agregar URL de imagen
4. Click en el ícono de guardar (✓)

### Editar Categoría

1. Click en el ícono de editar
2. Modificar el nombre
3. Click en guardar

### Eliminar Categoría

1. Click en el ícono de eliminar
2. Confirmar eliminación

> **Nota**: No se puede eliminar una categoría que tiene productos asociados

---

## 📋 Gestión de Pedidos

### Ver Lista de Pedidos

1. Click en "Pedidos" en el sidebar
2. Verás todos los pedidos con:
   - ID del pedido
   - Cliente
   - Total
   - Estado
   - Fecha

### Ver Detalle de un Pedido

1. Click en un pedido de la lista
2. Verás:
   - Información del cliente
   - Productos del pedido
   - Subtotal, envío, total
   - Estado actual
   - Historial de cambios

### Cambiar Estado de un Pedido

Estados disponibles:
- **Pendiente**: Pedido recién creado
- **Procesando**: Pedido en preparación
- **Enviado**: Pedido despachado
- **Entregado**: Pedido completado
- **Cancelado**: Pedido cancelado

Pasos:
1. Abrir detalle del pedido
2. Seleccionar nuevo estado
3. Click en "Actualizar Estado"
4. El cliente recibirá notificación (si está configurado)

---

## 🎁 Gift Cards

### Crear Gift Card

1. Click en "Gift Cards" en el sidebar
2. Click en "Nueva Gift Card"
3. Seleccionar monto:
   - **Montos fijos**: $5.000, $10.000, $15.000, $20.000
   - **Monto personalizado**: Ingresar valor deseado
4. Click en "Crear Gift Card"
5. Se generará un código único automáticamente

### Gestionar Gift Cards

En la lista verás:
- Código de la gift card
- Monto original
- Balance disponible
- Estado (Activa/Usada/Expirada)
- Fecha de creación

### Estados de Gift Card

- **Activa**: Puede ser usada
- **Usada**: Balance agotado
- **Expirada**: Venció (si se configuró fecha de expiración)

---

## 💡 Consejos y Mejores Prácticas

### Productos
- ✅ Usar IDs consecutivos (1001, 1002, 1003...)
- ✅ Subir imágenes de alta calidad
- ✅ Escribir descripciones detalladas
- ✅ Mantener stock actualizado
- ✅ Desactivar productos sin stock en lugar de eliminarlos

### Imágenes
- ✅ Tamaño mínimo: 800x800px
- ✅ Fondo blanco o transparente
- ✅ Mostrar el producto claramente
- ✅ Usar GIF solo si agrega valor (ej: producto en uso)

### Categorías
- ✅ Usar nombres claros y descriptivos
- ✅ No crear categorías muy específicas
- ✅ Usar subcategorías para organizar mejor

### Pedidos
- ✅ Actualizar estado regularmente
- ✅ Procesar pedidos pendientes diariamente
- ✅ Verificar stock antes de confirmar

---

## ❓ Preguntas Frecuentes

### ¿Puedo recuperar un producto eliminado?
No, la eliminación es permanente. Se recomienda desactivar en lugar de eliminar.

### ¿Cómo cambio el precio de un producto?
Editar el producto y modificar el campo "Precio".

### ¿Qué pasa si subo más de 3 imágenes?
El sistema solo permite 3 imágenes de producto + 1 GIF.

### ¿Puedo cambiar el ID de un producto?
No, el ID es único y no se puede modificar después de crear el producto.

### ¿Cómo sé si un producto tiene bajo stock?
El dashboard muestra una alerta de productos con menos de 10 unidades.

---

## 🆘 Soporte

Para problemas técnicos o consultas:
- Email: soporte@cuantotequiero.com
- Teléfono: +54 9 11 1234-5678
