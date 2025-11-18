# 📋 CRUD de Objetos de Garantía

## ✅ Implementación Completada

Se ha creado el CRUD completo para **Objetos de Garantía** (Bien/Servicio/Obra/Otros) siguiendo el diseño proporcionado.

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
- `frontend/src/pages/WarrantyObjects.js` - Página principal del CRUD

### Archivos Modificados:
- `frontend/src/App.js` - Agregada ruta `/catalogos/objetos-garantia`

## 🎯 Funcionalidades Implementadas

### 1. ✅ Listado de Objetos
- Cards con información de cada objeto (Descripción y CUI)
- Diseño responsive
- Mensaje cuando no hay datos
- Loading state mientras carga

### 2. ✅ Búsqueda en Tiempo Real
- Buscador por **descripción** o **CUI**
- Filtrado instantáneo mientras escribes
- Icono de búsqueda en el input

### 3. ✅ Agregar Nuevo Objeto
- Botón "Agregar Bien/Servicio/Obra" en la esquina superior derecha
- Modal con formulario para:
  - Descripción (obligatorio)
  - CUI (obligatorio)
- Validaciones antes de guardar
- Notificaciones de éxito/error

### 4. ✅ Editar Objeto
- Menú contextual de 3 puntos en cada card
- Opción "Editar" abre el modal con los datos precargados
- Actualización en tiempo real
- Notificaciones de éxito/error

### 5. ✅ Eliminar Objeto
- Menú contextual de 3 puntos en cada card
- Opción "Eliminar" muestra confirmación
- Modal de confirmación con advertencia
- Manejo de errores (si está en uso)
- Notificaciones de éxito/error

## 🔗 Endpoints Utilizados

```javascript
// Listar todos
GET /api/warranty-objects/

// Crear nuevo
POST /api/warranty-objects/
Body: { description, cui }

// Actualizar
PUT /api/warranty-objects/{id}/
Body: { description, cui }

// Eliminar
DELETE /api/warranty-objects/{id}/
```

## 🎨 Diseño y UX

### Header
```
┌─────────────────────────────────────────────────────────────┐
│ Bien / Servicio / Obras / Otros    [+ Agregar Bien/...] │
└─────────────────────────────────────────────────────────────┘
```

### Buscador
```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 Busca por descripción                                    │
└─────────────────────────────────────────────────────────────┘
```

### Cards de Listado
```
┌─────────────────────────────────────────────────────────────┐
│ SERVICIO - ADP 002-2006-CEP-ANYOS FINMP C...         ⋮     │
│ CUI: 2345678                                                │
│                                                             │
│ Menú contextual:                                           │
│   ✏️ Editar                                                 │
│   🗑️ Eliminar                                               │
└─────────────────────────────────────────────────────────────┘
```

### Modal de Agregar/Editar
```
┌──────────────────────────────────────────────┐
│ Agregar/Editar Objeto de Garantía       ✕   │
├──────────────────────────────────────────────┤
│                                              │
│ Descripción *                                │
│ [________________________________]           │
│                                              │
│ CUI *                                        │
│ [________________________________]           │
│                                              │
│         [Cancelar]  [Guardar]               │
└──────────────────────────────────────────────┘
```

### Modal de Confirmación de Eliminación
```
┌──────────────────────────────────────────────┐
│            ⚠️                                │
│                                              │
│  ¿Eliminar objeto de garantía?             │
│                                              │
│  ¿Estás seguro de que deseas eliminar       │
│  "..."? Esta acción no se puede deshacer.   │
│                                              │
│         [Cancelar]  [Eliminar]              │
└──────────────────────────────────────────────┘
```

## 💡 Características Técnicas

### Estado de la Aplicación
```javascript
const [objects, setObjects] = useState([]);           // Lista completa
const [filteredObjects, setFilteredObjects] = useState([]); // Lista filtrada
const [searchTerm, setSearchTerm] = useState('');     // Término de búsqueda
const [showModal, setShowModal] = useState(false);    // Modal agregar/editar
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Modal eliminar
const [editingObject, setEditingObject] = useState(null); // Objeto en edición
const [deletingObject, setDeletingObject] = useState(null); // Objeto a eliminar
const [openMenuId, setOpenMenuId] = useState(null);   // Menú contextual abierto
```

### Validaciones
- ✅ Campo "Descripción" obligatorio
- ✅ Campo "CUI" obligatorio
- ✅ Notificación de errores del backend
- ✅ Confirmación antes de eliminar

### Notificaciones (Sonner Toast)
- ✅ Éxito al crear
- ✅ Éxito al actualizar
- ✅ Éxito al eliminar
- ❌ Error al cargar datos
- ❌ Error al guardar
- ❌ Error al eliminar (ej: objeto en uso)
- ⚠️ Campos obligatorios faltantes

### Estados de Carga
- ✅ Spinner mientras carga datos
- ✅ Mensaje "No hay objetos" cuando está vacío
- ✅ Mensaje "No se encontraron resultados" cuando la búsqueda no tiene resultados

## 🔐 Seguridad

- ✅ Ruta protegida con `<PrivateRoute>`
- ✅ Requiere autenticación para acceder
- ✅ Token JWT en todas las peticiones (configurado en `api.js`)

## 🚀 Cómo Acceder

1. Inicia sesión en el sistema
2. En el menú superior, haz clic en **"Catálogos"**
3. Selecciona **"Objetos de Garantía"**
4. Serás redirigido a `/catalogos/objetos-garantia`

## 📱 Responsive Design

### Móvil (< 768px)
- ✅ Cards en una sola columna
- ✅ Botones adaptados al tamaño
- ✅ Modal ocupa toda la pantalla disponible

### Tablet/Desktop (≥ 768px)
- ✅ Layout optimizado
- ✅ Mejor aprovechamiento del espacio
- ✅ Hover effects en cards

## 🎨 Estilos Utilizados

### Colores
- **Primary**: Azul UNF (#2c5f8d) para botones principales
- **Gris**: Para textos secundarios y bordes
- **Rojo**: Para acciones de eliminación
- **Verde**: Para notificaciones de éxito

### Componentes
- **Cards**: Bordes sutiles, hover con sombra
- **Modales**: Fondo oscuro semitransparente, sombra grande
- **Botones**: Transiciones suaves, estados hover
- **Inputs**: Focus ring azul, bordes redondeados

## 🔄 Flujo de Uso

### Crear Nuevo Objeto
1. Clic en "Agregar Bien/Servicio/Obra"
2. Llenar formulario (Descripción, CUI)
3. Clic en "Guardar"
4. ✅ Notificación de éxito
5. Lista se actualiza automáticamente

### Editar Objeto
1. Clic en menú de 3 puntos (⋮)
2. Clic en "Editar"
3. Modificar datos en el formulario
4. Clic en "Actualizar"
5. ✅ Notificación de éxito
6. Lista se actualiza automáticamente

### Eliminar Objeto
1. Clic en menú de 3 puntos (⋮)
2. Clic en "Eliminar"
3. Confirmar en el modal de advertencia
4. Clic en "Eliminar"
5. ✅ Notificación de éxito
6. Lista se actualiza automáticamente

### Buscar Objeto
1. Escribir en el campo de búsqueda
2. Resultados se filtran automáticamente
3. Busca en: Descripción y CUI

## 🐛 Manejo de Errores

### Error al cargar datos
```javascript
toast.error('Error al cargar los objetos de garantía');
```

### Error al guardar (validación)
```javascript
toast.error('La descripción es obligatoria');
toast.error('El CUI es obligatorio');
```

### Error al guardar (backend)
```javascript
// Muestra errores específicos del backend
Object.keys(errors).forEach(key => {
  toast.error(`${key}: ${errors[key]}`);
});
```

### Error al eliminar (objeto en uso)
```javascript
if (error.response?.status === 400 || error.response?.status === 409) {
  toast.error('No se puede eliminar porque está siendo utilizado en cartas fianza');
}
```

## 📊 Modelo de Datos

```javascript
{
  warranty_object_id: number,  // ID único
  description: string,          // Descripción del objeto
  cui: string,                  // Código único de inversión
  created_at: string,           // Fecha de creación (ISO)
  updated_at: string            // Fecha de actualización (ISO)
}
```

## 🔧 Extensiones Futuras Sugeridas

- [ ] Paginación para listas grandes
- [ ] Exportar a Excel/PDF
- [ ] Importar desde Excel
- [ ] Filtros avanzados (por fecha, etc.)
- [ ] Ordenamiento (por descripción, CUI, fecha)
- [ ] Búsqueda con autocompletado
- [ ] Historial de cambios
- [ ] Indicador de objetos en uso

## ✨ Características Destacadas

1. **UX Intuitiva**: Menú contextual de 3 puntos como WhatsApp/Gmail
2. **Búsqueda en Tiempo Real**: No necesitas hacer clic en "Buscar"
3. **Validaciones Claras**: Mensajes específicos de qué falta
4. **Confirmación de Eliminación**: Evita borrados accidentales
5. **Estados de Carga**: Usuario siempre sabe qué está pasando
6. **Responsive**: Funciona en cualquier dispositivo
7. **Accesibilidad**: Etiquetas claras, navegación por teclado
8. **Notificaciones Toast**: No intrusivas, se ocultan automáticamente

---

**✅ CRUD Completado y Funcional**

**Ruta:** `/catalogos/objetos-garantia`

**Fecha:** 18 de Noviembre, 2025

