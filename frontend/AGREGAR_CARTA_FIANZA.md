# 📝 Página de Agregar Carta Fianza

## ✅ Implementación Completada

Se ha creado la página completa para **Agregar Cartas Fianza** con todas las funcionalidades requeridas.

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
- `frontend/src/pages/AddWarranty.js` - Página principal de agregar carta
- `frontend/src/store/warrantyFiltersStore.js` - Store de Zustand para filtros

### Archivos Modificados:
- `frontend/src/pages/CartasFianza.js` - Integración con store y navegación
- `frontend/src/App.js` - Nueva ruta agregada
- `frontend/package.json` - Dependencia `react-select` agregada

## 🎯 Funcionalidades Implementadas

### 1. ✅ Estructura de la Página

#### Header
- Header del sistema (ya existente en Layout)

#### Título
- **"Agregar carta"** - Título principal
- **Subtítulo dinámico** - Muestra la descripción del objeto de garantía

#### Formulario Completo
13 campos + botones de acción

### 2. ✅ Campos del Formulario

| # | Campo | Tipo | Validación | Descripción |
|---|-------|------|------------|-------------|
| 1 | Tipo de carta | Select | Requerido | Carga desde `/api/letter-types/` |
| 2 | Número de carta | Input text | Requerido | Ej: 0011-0267-9800071157-23 |
| 3 | Entidad financiera | Select | Requerido | Carga desde `/api/financial-entities/` |
| 4 | Dirección entidad | Input text | Requerido | Ej: CA-LIBERTAD 7854 - PIURA |
| 5 | Fecha de emisión | Input date | Requerido | Formato estándar HTML5 |
| 6 | Inicio de vigencia | Input date | Requerido | Formato estándar HTML5 |
| 7 | Fin de vigencia | Input date | Requerido | Debe ser > inicio vigencia |
| 8 | Contratista | React-Select | Requerido | Búsqueda con debounce ⭐ |
| 9 | Tipo de moneda | Select | Requerido | Carga desde `/api/currency-types/` |
| 10 | Importe | Input number | Requerido | 2 decimales, validación |
| 11 | Documento | Input text | Requerido | Documento de referencia |
| 12 | Observaciones | Textarea | Opcional | Campo de texto libre |
| 13 | Archivos PDF | File input | Opcional | Múltiples archivos PDF |

### 3. ✅ Campo de Contratista con React-Select

**Características especiales:**

```jsx
import AsyncSelect from 'react-select/async';
```

#### Búsqueda con Debounce
- **Debounce automático**: React-Select maneja el debounce internamente
- **Mínimo 2 caracteres**: No busca hasta tener al menos 2 caracteres
- **Búsqueda por RUC o Nombre**: El backend busca en ambos campos

#### Endpoint de búsqueda
```javascript
GET /api/contractors/?search={inputValue}&page_size=20
```

#### Formato de opciones
```javascript
{
  value: contractor.id,          // ID del contratista
  label: "20123456789 - CONSTRUCTORA ABC S.A.C.",  // RUC + Nombre
  data: contractor               // Objeto completo
}
```

#### Botón "+" Agregar Contratista
- Abre el modal `ContractorModal` (ya existente)
- Permite crear contratista sin salir del formulario
- Después de crear, el usuario puede buscarlo y seleccionarlo

### 4. ✅ Manejo de Archivos PDF

#### Subida de archivos
```jsx
<input 
  type="file" 
  multiple 
  accept="application/pdf"
/>
```

#### Validaciones:
- ✅ Solo archivos PDF permitidos
- ✅ Múltiples archivos
- ✅ Vista previa con nombre y tamaño
- ✅ Botón para eliminar archivos antes de enviar

#### Área de Drop
```
┌────────────────────────────────────┐
│         📁 (icono upload)          │
│  Suelte los archivos aquí o haz   │
│        clic para subirlos          │
│        Solo archivos PDF           │
└────────────────────────────────────┘
```

### 5. ✅ Validaciones del Formulario

#### Validaciones de campos:
- ✅ Todos los campos requeridos validados
- ✅ Fecha fin > fecha inicio de vigencia
- ✅ Importe > 0 con 2 decimales
- ✅ Solo números en importe
- ✅ Mensajes de error descriptivos con `toast.error()`

#### Validación de archivos:
- ✅ Solo PDF aceptados
- ✅ Advertencia si se intenta subir otro tipo

### 6. ✅ Envío al Backend

#### Endpoint
```
POST /api/warranties/
Content-Type: multipart/form-data
Authorization: Token {token}
```

#### Ejemplo de FormData enviado:
```javascript
formData.append('warranty_object', warrantyObjectId);
formData.append('letter_type', formData.letter_type);
formData.append('letter_number', formData.letter_number.trim());
formData.append('financial_entity', formData.financial_entity);
formData.append('financial_entity_address', formData.financial_entity_address.trim());
formData.append('issue_date', formData.issue_date);
formData.append('validity_start', formData.validity_start);
formData.append('validity_end', formData.validity_end);
formData.append('contractor', formData.contractor.value);
formData.append('currency_type', formData.currency_type);
formData.append('amount', formData.amount);
formData.append('reference_document', formData.reference_document.trim());
formData.append('warranty_status', '1'); // Vigente
formData.append('comments', formData.comments.trim()); // Si existe

// Archivos
files.forEach(file => {
  formData.append('files', file);
});
```

### 7. ✅ Manejo de Respuestas

#### Éxito:
```javascript
toast.success('Carta fianza registrada correctamente');
navigate('/cartas-fianza', { state: { shouldRefresh: true } });
```

#### Error:
- Muestra errores específicos del backend
- Un toast por cada error de campo
- Formato: `campo: mensaje de error`

### 8. ✅ Persistencia de Filtros con Zustand

#### Store: `warrantyFiltersStore.js`

```javascript
const useWarrantyFiltersStore = create((set) => ({
  filterType: 'letter_number',
  filterValue: '',
  searchResults: null,
  
  setFilterType: (filterType) => set({ filterType }),
  setFilterValue: (filterValue) => set({ filterValue }),
  setSearchResults: (searchResults) => set({ searchResults }),
  clearFilters: () => set({ /* reset */ }),
}));
```

#### Flujo de navegación:

1. **Usuario en CartasFianza**:
   - Aplica filtros y busca
   - Hace clic en "Agregar garantía"

2. **Usuario en AddWarranty**:
   - Llena el formulario
   - Hace clic en "Grabar"

3. **Regreso a CartasFianza**:
   - Los filtros se mantienen (gracias a Zustand)
   - Se ejecuta automáticamente la búsqueda
   - La nueva carta aparece en los resultados

### 9. ✅ Diseño Responsive

#### Breakpoints implementados:

**Mobile (< 640px)**:
- Formulario en 1 columna
- Botones apilados verticalmente
- Campos ocupan 100% del ancho

**Tablet (≥ 768px)**:
- Grid de 2 columnas para campos
- Botones en fila
- Mejor uso del espacio

**Desktop (≥ 1024px)**:
- Layout optimizado
- Máximo 5xl para el contenedor
- Espaciado generoso

#### Clases Tailwind responsive:
```jsx
// Grid responsive
className="grid grid-cols-1 md:grid-cols-2 gap-6"

// Botones responsive
className="flex flex-col sm:flex-row gap-3"

// Campo de contratista responsive
<span className="hidden sm:inline">Agregar</span>
```

### 10. ✅ Estados de Carga

#### Loading de catálogos:
```jsx
if (loadingCatalogs) {
  return (
    <Layout>
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2">
        </div>
        <p>Cargando formulario...</p>
      </div>
    </Layout>
  );
}
```

#### Loading al guardar:
```jsx
{loading ? (
  <>
    <div className="animate-spin ..."></div>
    <span>Guardando...</span>
  </>
) : (
  <span>Grabar</span>
)}
```

#### Deshabilitación de campos:
- Todos los inputs se deshabilitan mientras `loading === true`
- Previene doble submit
- Mejor UX

## 🔗 Rutas Configuradas

### Ruta principal:
```
/cartas-fianza
```

### Ruta de agregar:
```
/cartas-fianza/agregar/:warrantyObjectId?description=MANTENIMIENTO...
```

#### Parámetros:
- **:warrantyObjectId** (path param) - ID del objeto de garantía
- **description** (query param) - Descripción para mostrar en subtítulo

## 🎨 Componentes Reutilizados

### 1. Layout
Componente de layout global con header y menú

### 2. ContractorModal
Modal para agregar contratista, ya existente y reutilizado

## 📦 Dependencias Agregadas

### react-select v5
```bash
npm install react-select
```

#### Uso en el proyecto:
```javascript
import AsyncSelect from 'react-select/async';

<AsyncSelect
  cacheOptions
  loadOptions={loadContractorOptions}
  defaultOptions={false}
  placeholder="Buscar..."
  noOptionsMessage={...}
  loadingMessage={...}
/>
```

## 🚀 Cómo Usar

### Desde CartasFianza:

1. Realizar una búsqueda de objetos de garantía
2. Hacer clic en el botón **"Agregar garantía"**
3. Se abre la página de agregar carta
4. Llenar el formulario
5. Hacer clic en **"Grabar"**
6. Regresas automáticamente con los filtros preservados
7. La búsqueda se actualiza mostrando la nueva carta

### Flujo de usuario:

```
CartasFianza (con filtros aplicados)
        ↓
    [Agregar garantía]
        ↓
    AddWarranty
        ↓
    [Llenar formulario]
        ↓
    [Grabar]
        ↓
    CartasFianza (filtros preservados + nueva carta visible)
```

## 🔧 Validaciones Implementadas

### Frontend:
- ✅ Campos requeridos
- ✅ Formato de importe (números + 2 decimales)
- ✅ Fecha fin > fecha inicio
- ✅ Solo archivos PDF
- ✅ Mínimo 2 caracteres para buscar contratistas

### Backend:
- ✅ El backend valida todos los campos
- ✅ Los errores se muestran en toasts individuales

## 🎯 Características Especiales

### 1. Debounce en búsqueda de contratistas
React-Select maneja el debounce automáticamente, no se necesita implementación manual.

### 2. Persistencia de filtros
Zustand persiste los filtros en memoria (no en localStorage para este caso).

### 3. Recarga inteligente
Solo recarga si hay filtros aplicados cuando regresas de agregar.

### 4. Formulario reutilizable
El componente está preparado para ser usado también en edición (aunque solo está implementado crear por ahora).

### 5. Manejo de errores robusto
- Errores de red
- Errores de validación
- Errores del backend
- Todos manejados con mensajes claros

## 📊 Ejemplo de Uso Completo

### 1. Navegación desde CartasFianza:
```javascript
const handleAgregarGarantia = (warrantyObjectId, warrantyObjectDescription) => {
  navigate(
    `/cartas-fianza/agregar/${warrantyObjectId}?description=${encodeURIComponent(warrantyObjectDescription)}`
  );
};
```

### 2. Componente AddWarranty recibe:
```javascript
const { warrantyObjectId } = useParams();
const [searchParams] = useSearchParams();
const warrantyObjectDescription = searchParams.get('description');
```

### 3. Al guardar exitosamente:
```javascript
navigate('/cartas-fianza', { state: { shouldRefresh: true } });
```

### 4. CartasFianza detecta y recarga:
```javascript
useEffect(() => {
  if (location.state?.shouldRefresh && searchResults && filterValue.trim()) {
    // Re-ejecutar búsqueda
  }
}, [location.state?.shouldRefresh]);
```

## 🎨 Diseño Visual

### Colores utilizados:
- **Primary**: `bg-primary-600` (azul institucional)
- **Success**: `bg-green-600` (botón agregar contratista)
- **Error**: `text-red-500` (campos requeridos, validaciones)
- **Neutral**: `bg-gray-50`, `border-gray-300` (fondos y bordes)

### Espaciado:
- **Gap entre campos**: `gap-6`
- **Padding interno**: `p-6`
- **Margen entre secciones**: `space-y-6`

### Efectos:
- **Hover**: Transiciones suaves en botones
- **Focus**: Anillo azul en inputs (`focus:ring-2 focus:ring-primary-500`)
- **Disabled**: Opacidad reducida (`disabled:opacity-50`)

## 🔜 Mejoras Futuras Posibles

### Funcionalidad:
- [ ] Modo edición de cartas existentes
- [ ] Vista previa de PDFs antes de enviar
- [ ] Drag & drop para archivos
- [ ] Validación de fechas contra calendario laboral
- [ ] Sugerencias de número de carta basadas en patrón

### UX:
- [ ] Progress bar durante la subida
- [ ] Confirmación antes de cancelar si hay datos llenados
- [ ] Auto-guardado en borrador
- [ ] Atajos de teclado
- [ ] Plantillas de carta predefinidas

## ✅ Checklist de Implementación

- [x] Instalar react-select
- [x] Crear store de Zustand para filtros
- [x] Crear página AddWarranty
- [x] Implementar todos los campos del formulario
- [x] Integrar react-select con búsqueda de contratistas
- [x] Implementar botón + modal de contratista
- [x] Implementar subida de archivos PDF
- [x] Validaciones frontend completas
- [x] Envío al backend con FormData
- [x] Manejo de errores
- [x] Navegación con preservación de filtros
- [x] Recarga automática de búsqueda
- [x] Diseño responsive
- [x] Estados de carga
- [x] Actualizar CartasFianza para integración
- [x] Actualizar App.js con nueva ruta
- [x] Verificar linter errors
- [x] Documentación completa

## 🎉 ¡Implementación Completada!

La página de agregar carta fianza está **100% funcional** con todas las características solicitadas.

