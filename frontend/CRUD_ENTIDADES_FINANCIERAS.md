# 🏦 CRUD de Entidades Financieras

## ✅ Implementación Completada

Se ha creado el CRUD completo para **Entidades Financieras** siguiendo exactamente el mismo patrón, lógica y diseño que Objetos de Garantía.

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
- `frontend/src/pages/FinancialEntities.js` - Página principal del CRUD

### Archivos Modificados:
- `frontend/src/App.js` - Agregada ruta `/catalogos/entidades-financieras`

## 🎯 Funcionalidades Implementadas

### 1. ✅ Listado de Entidades
- Cards con información de cada entidad (Descripción)
- Diseño responsive
- Mensaje cuando no hay datos
- Loading state mientras carga

### 2. ✅ Búsqueda con Botón Explícito
- Input de búsqueda por **descripción**
- Botón "Buscar" al lado derecho
- Búsqueda con Enter (atajo de teclado)
- Carga inicial vacía (sin búsqueda automática)
- Input vacío + Buscar = Todos los registros
- Input con texto + Buscar = Búsqueda filtrada

### 3. ✅ Agregar Nueva Entidad
- Botón "Agregar Entidad Financiera" en la esquina superior derecha
- Modal con formulario para:
  - Descripción (obligatorio, máx. 50 caracteres)
- Validaciones antes de guardar
- Notificaciones de éxito/error
- Placeholder tenue (gray-400)

### 4. ✅ Editar Entidad
- Menú contextual de 3 puntos en cada card
- Opción "Editar" abre el modal con los datos precargados
- Actualización en tiempo real
- Notificaciones de éxito/error

### 5. ✅ Eliminar Entidad
- Menú contextual de 3 puntos en cada card
- Opción "Eliminar" muestra confirmación
- Modal de confirmación con advertencia
- Manejo de errores (si está en uso en cartas fianza)
- Notificaciones de éxito/error

## 🔗 Endpoints Utilizados

```javascript
// Listar todos
GET /api/financial-entities/

// Crear nuevo
POST /api/financial-entities/
Body: { description }

// Actualizar
PUT /api/financial-entities/{id}/
Body: { description }

// Eliminar
DELETE /api/financial-entities/{id}/
```

## 🎨 Diseño y UX

### Header
```
┌──────────────────────────────────────────────────────────┐
│ Entidades Financieras    [+ Agregar Entidad Financiera] │
└──────────────────────────────────────────────────────────┘
```

### Buscador
```
┌──────────────────────────────────────────────────────────┐
│ [🔍 Busca por descripción....................] [Buscar] │
└──────────────────────────────────────────────────────────┘
```

### Cards de Listado
```
┌──────────────────────────────────────────────────────────┐
│ SCOTIABANK PERU                                      ⋮   │
├──────────────────────────────────────────────────────────┤
│ BANCO DE LA NACION                                   ⋮   │
├──────────────────────────────────────────────────────────┤
│ BANCO CONTINENTAL                                    ⋮   │
│                                                          │
│ Menú contextual:                                        │
│   ✏️ Editar                                              │
│   🗑️ Eliminar                                            │
└──────────────────────────────────────────────────────────┘
```

### Modal de Agregar/Editar
```
┌────────────────────────────────────────────┐
│ Agregar/Editar Entidad Financiera    ✕    │
├────────────────────────────────────────────┤
│                                            │
│ Descripción *                              │
│ [________________________________]         │
│  Nombre de la entidad financiera          │
│  (máx. 50 caracteres)                     │
│                                            │
│         [Cancelar]  [Guardar]             │
└────────────────────────────────────────────┘
```

### Modal de Confirmación de Eliminación
```
┌────────────────────────────────────────────┐
│            ⚠️                              │
│                                            │
│  ¿Eliminar entidad financiera?            │
│                                            │
│  ¿Estás seguro de que deseas eliminar     │
│  "SCOTIABANK PERU"? Esta acción no se     │
│  puede deshacer.                           │
│                                            │
│         [Cancelar]  [Eliminar]            │
└────────────────────────────────────────────┘
```

## 💡 Características Técnicas

### Estado de la Aplicación
```javascript
const [entities, setEntities] = useState([]);              // Lista de entidades
const [loading, setLoading] = useState(false);            // Indicador de carga
const [searchTerm, setSearchTerm] = useState('');         // Término de búsqueda
const [hasSearched, setHasSearched] = useState(false);    // ¿Ya buscó?
const [showModal, setShowModal] = useState(false);        // Modal agregar/editar
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Modal eliminar
const [editingEntity, setEditingEntity] = useState(null); // Entidad en edición
const [deletingEntity, setDeletingEntity] = useState(null); // Entidad a eliminar
const [openMenuId, setOpenMenuId] = useState(null);       // Menú contextual abierto
```

### Validaciones
- ✅ Campo "Descripción" obligatorio
- ✅ Máximo 50 caracteres en descripción
- ✅ Notificación de errores del backend
- ✅ Confirmación antes de eliminar

### Notificaciones (Sonner Toast)
- ✅ Éxito al crear
- ✅ Éxito al actualizar
- ✅ Éxito al eliminar
- ❌ Error al cargar datos
- ❌ Error al guardar
- ❌ Error al eliminar (ej: entidad en uso)
- ⚠️ Campos obligatorios faltantes

### Estados de Carga
- ✅ Mensaje inicial "Realiza una búsqueda"
- ✅ Spinner mientras busca
- ✅ Mensaje "No se encontraron resultados"
- ✅ Lista de resultados

## 🔐 Seguridad

- ✅ Ruta protegida con `<PrivateRoute>`
- ✅ Requiere autenticación para acceder
- ✅ Token JWT en todas las peticiones (configurado en `api.js`)

## 🚀 Cómo Acceder

1. Inicia sesión en el sistema
2. En el menú superior, haz clic en **"Catálogos"**
3. Selecciona **"Entidades Financieras"**
4. Serás redirigido a `/catalogos/entidades-financieras`

## 📱 Responsive Design

### Móvil (< 768px)
- ✅ Cards en una sola columna
- ✅ Botones adaptados al tamaño
- ✅ Modal ocupa toda la pantalla disponible

### Tablet/Desktop (≥ 768px)
- ✅ Layout optimizado
- ✅ Mejor aprovechamiento del espacio
- ✅ Hover effects en cards

## 🎨 Estilos y Colores

### Colores (Idénticos a Objetos de Garantía)
- **Primary**: Azul UNF (#2c5f8d) para botones principales
- **Gris**: Para textos secundarios y bordes
- **Rojo**: Para acciones de eliminación
- **Verde**: Para notificaciones de éxito

### Componentes (Consistencia Total)
- **Cards**: Bordes sutiles, hover con sombra
- **Modales**: Fondo oscuro semitransparente, sombra grande
- **Botones**: Transiciones suaves, estados hover
- **Inputs**: Focus ring azul, bordes redondeados
- **Placeholders**: Color tenue (gray-400)

## 🔄 Flujo de Uso

### Buscar Entidades
1. Usuario abre la página
2. Ve mensaje "Realiza una búsqueda"
3. Opcionalmente escribe un término
4. Hace clic en "Buscar" (o presiona Enter)
5. Sistema muestra resultados

### Crear Nueva Entidad
1. Clic en "Agregar Entidad Financiera"
2. Llenar formulario (Descripción)
3. Clic en "Guardar"
4. ✅ Notificación de éxito
5. Si había búsqueda activa, se actualiza la lista

### Editar Entidad
1. Clic en menú de 3 puntos (⋮)
2. Clic en "Editar"
3. Modificar datos en el formulario
4. Clic en "Actualizar"
5. ✅ Notificación de éxito
6. Lista se actualiza

### Eliminar Entidad
1. Clic en menú de 3 puntos (⋮)
2. Clic en "Eliminar"
3. Confirmar en el modal de advertencia
4. Clic en "Eliminar"
5. ✅ Notificación de éxito
6. Lista se actualiza

## 📊 Modelo de Datos

```javascript
{
  id: number,                    // ID único
  description: string,           // Descripción (máx. 50 caracteres)
  created_by: number,           // ID del usuario que creó
  created_by_name: string,      // Nombre del usuario que creó
  created_at: string,           // Fecha de creación (ISO)
  updated_by: number,           // ID del usuario que actualizó
  updated_by_name: string,      // Nombre del usuario que actualizó
  updated_at: string            // Fecha de actualización (ISO)
}
```

## 🔄 Diferencias con Objetos de Garantía

| Característica | Objetos de Garantía | Entidades Financieras |
|----------------|---------------------|----------------------|
| **Campos** | description + cui (opcional) | description (obligatorio) |
| **Título página** | "Bien / Servicio / Obras / Otros" | "Entidades Financieras" |
| **Botón agregar** | "Agregar Bien/Servicio/Obra" | "Agregar Entidad Financiera" |
| **Modal título** | "Objeto de Garantía" | "Entidad Financiera" |
| **Campo CUI** | Sí (opcional) | No |
| **Textarea** | Sí (4 filas) | No (input simple) |
| **Max length** | 512 caracteres | 50 caracteres |
| **Placeholder** | "Ej: Construcción de carretera" | "Ej: SCOTIABANK PERU" |
| **Icono card** | 📦 | 🏦 |

## ✨ Características Compartidas

Ambos CRUDs comparten:
- ✅ Búsqueda con botón explícito
- ✅ Carga inicial vacía
- ✅ Menú contextual de 3 puntos
- ✅ Modales para crear/editar
- ✅ Confirmación de eliminación
- ✅ Mismos colores y estilos
- ✅ Mismo comportamiento responsive
- ✅ Mismas notificaciones
- ✅ Placeholder tenue (gray-400)

## 🎯 Ejemplos de Entidades

```javascript
// Ejemplos comunes de entidades financieras en Perú:
{
  description: "SCOTIABANK PERU"
}
{
  description: "BANCO DE LA NACION"
}
{
  description: "BANCO CONTINENTAL"
}
{
  description: "BBVA PERU"
}
{
  description: "BCP - BANCO DE CREDITO"
}
{
  description: "INTERBANK"
}
```

## 🐛 Manejo de Errores

### Error al cargar datos
```javascript
toast.error('Error al buscar las entidades financieras');
```

### Error al guardar (validación)
```javascript
toast.error('La descripción es obligatoria');
```

### Error al guardar (backend)
```javascript
// Muestra errores específicos del backend
Object.keys(errors).forEach(key => {
  toast.error(`${key}: ${errors[key]}`);
});
```

### Error al eliminar (entidad en uso)
```javascript
if (error.response?.status === 400 || error.response?.status === 409) {
  toast.error('No se puede eliminar porque está siendo utilizada en cartas fianza');
}
```

## 🔧 Extensiones Futuras Sugeridas

- [ ] Campo adicional: RUC de la entidad
- [ ] Campo adicional: Dirección
- [ ] Campo adicional: Teléfono/Email de contacto
- [ ] Campo adicional: Estado (Activo/Inactivo)
- [ ] Ordenamiento por nombre (A-Z)
- [ ] Exportar a Excel/PDF
- [ ] Importar desde Excel
- [ ] Logo de la entidad financiera

## 📊 Comparación Visual

### Objetos de Garantía
```
┌────────────────────────────────────────┐
│ SERVICIO - ADP 002-2006...        ⋮   │
│ CUI: 2345678                           │
└────────────────────────────────────────┘
```

### Entidades Financieras
```
┌────────────────────────────────────────┐
│ SCOTIABANK PERU                    ⋮   │
└────────────────────────────────────────┘
```

## 🎓 Patrón de Diseño Aplicado

**Patrón:** Consistencia de UI (UI Consistency Pattern)

Beneficios:
- ✅ Usuario aprende una vez, aplica en todas partes
- ✅ Desarrollo más rápido (reutilización de código)
- ✅ Menos errores (patrones probados)
- ✅ Mejor mantenibilidad

## 🔜 Próximos CRUDs Sugeridos

Siguiendo el mismo patrón:
1. **Tipos de Carta** (description)
2. **Contratistas** (business_name, ruc, address, phone)
3. **Estados de Garantía** (description)
4. **Tipos de Moneda** (description, symbol, code)

---

**Implementado por:** Sistema de IA  
**Fecha:** 18 de Noviembre, 2025  
**Patrón base:** CRUD de Objetos de Garantía  
**Consistencia:** 100% con el diseño existente  
**Estado:** ✅ Completado y funcional

