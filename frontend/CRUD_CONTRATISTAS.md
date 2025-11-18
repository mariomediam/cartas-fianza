# 👥 CRUD de Contratistas con Modal Reutilizable

## ✅ Implementación Completada

Se ha creado el CRUD completo para **Contratistas** con una característica especial: **Modal Reutilizable** que puede ser usado desde otros componentes.

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
- `frontend/src/components/ContractorModal.js` - **Modal reutilizable** ⭐
- `frontend/src/pages/Contractors.js` - Página principal del CRUD

### Archivos Modificados:
- `frontend/src/App.js` - Agregada ruta `/catalogos/contratistas`

## 🎯 Funcionalidades Implementadas

### 1. ✅ Búsqueda Multi-campo
- Búsqueda por **RUC** o **Razón Social**
- Backend busca en ambos campos simultáneamente
- Placeholder: "Busca por RUC o razón social"

### 2. ✅ Validación de RUC
- **Solo números**: Rechaza letras y caracteres especiales
- **11 dígitos exactos**: No más, no menos
- **Validación en tiempo real**: No permite escribir más de 11 dígitos
- **Validación en backend**: El servidor también valida

### 3. ✅ Modal Reutilizable ⭐

**Característica Principal:** El modal puede ser usado desde cualquier componente.

```javascript
import ContractorModal from '../components/ContractorModal';

// En tu componente
<ContractorModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={() => console.log('¡Creado!')}
  contractor={null}  // null para crear, objeto para editar
  title="Agregar Nuevo Contratista"  // título personalizado (opcional)
/>
```

## 🔗 Endpoints Utilizados

```javascript
// Listar todos (búsqueda multi-campo)
GET /api/contractors/
GET /api/contractors/?search=20123456789  // Busca en RUC y razón social

// Crear nuevo
POST /api/contractors/
Body: { business_name, ruc }

// Actualizar
PUT /api/contractors/{id}/
Body: { business_name, ruc }

// Eliminar
DELETE /api/contractors/{id}/
```

## 🎨 Diseño y UX

### Header
```
┌──────────────────────────────────────────────────────┐
│ Contratistas              [+ Agregar Contratista]   │
└──────────────────────────────────────────────────────┘
```

### Buscador Multi-campo
```
┌──────────────────────────────────────────────────────┐
│ [🔍 Busca por RUC o razón social.......] [Buscar]  │
└──────────────────────────────────────────────────────┘
```

### Cards de Listado
```
┌──────────────────────────────────────────────────────┐
│ CONSTRUCTORA ABC S.A.C.                          ⋮   │
│ RUC: 20123456789                                     │
├──────────────────────────────────────────────────────┤
│ INGENIEROS ASOCIADOS S.A.                        ⋮   │
│ RUC: 20234567890                                     │
└──────────────────────────────────────────────────────┘
```

### Modal Reutilizable
```
┌────────────────────────────────────────────┐
│ Agregar Contratista                   ✕   │
├────────────────────────────────────────────┤
│                                            │
│ Razón Social / Nombre *                    │
│ [____________________________]             │
│                                            │
│ RUC *                                      │
│ [___________]                              │
│  Registro Único de Contribuyentes         │
│  (11 dígitos)                              │
│                                            │
│         [Cancelar]  [Guardar]             │
└────────────────────────────────────────────┘
```

## ⭐ Modal Reutilizable - Guía Completa

### Props del Componente

```javascript
ContractorModal({
  isOpen,        // boolean - Controla visibilidad
  onClose,       // function - Callback al cerrar
  onSuccess,     // function - Callback tras guardar con éxito
  contractor,    // object | null - Datos para editar (null = crear)
  title          // string | null - Título personalizado (opcional)
})
```

### Ejemplo 1: Crear Nuevo Contratista

```javascript
import { useState } from 'react';
import ContractorModal from '../components/ContractorModal';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Agregar Contratista
      </button>

      <ContractorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          console.log('¡Contratista creado!');
          // Aquí puedes recargar tu lista, etc.
        }}
        contractor={null}  // null = crear nuevo
      />
    </>
  );
}
```

### Ejemplo 2: Editar Contratista Existente

```javascript
import { useState } from 'react';
import ContractorModal from '../components/ContractorModal';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);

  const handleEdit = (contractor) => {
    setSelectedContractor(contractor);
    setShowModal(true);
  };

  return (
    <>
      <button onClick={() => handleEdit(myContractor)}>
        Editar
      </button>

      <ContractorModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedContractor(null);
        }}
        onSuccess={() => {
          console.log('¡Contratista actualizado!');
          // Recargar lista
        }}
        contractor={selectedContractor}  // Objeto con datos
      />
    </>
  );
}
```

### Ejemplo 3: Título Personalizado

```javascript
<ContractorModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={handleSuccess}
  contractor={null}
  title="Registrar Nuevo Proveedor"  // Título personalizado
/>
```

### Ejemplo 4: Uso desde Página de Cartas Fianza

```javascript
// En tu página de cartas fianza
import ContractorModal from '../components/ContractorModal';

function WarrantyForm() {
  const [showContractorModal, setShowContractorModal] = useState(false);
  const [contractors, setContractors] = useState([]);

  const refreshContractors = async () => {
    const response = await api.get('/contractors/');
    setContractors(response.data.results);
  };

  return (
    <div>
      {/* Tu formulario de carta fianza */}
      <select name="contractor">
        {contractors.map(c => (
          <option key={c.id} value={c.id}>{c.business_name}</option>
        ))}
      </select>
      
      {/* Botón para crear contratista sin salir del formulario */}
      <button onClick={() => setShowContractorModal(true)}>
        + Nuevo Contratista
      </button>

      {/* Modal reutilizable */}
      <ContractorModal
        isOpen={showContractorModal}
        onClose={() => setShowContractorModal(false)}
        onSuccess={() => {
          refreshContractors();  // Actualiza el select
          toast.success('Contratista agregado al formulario');
        }}
        contractor={null}
        title="Agregar Contratista al Formulario"
      />
    </div>
  );
}
```

## 💡 Características Técnicas del Modal

### 1. Estado Interno Manejado

```javascript
const [formData, setFormData] = useState({
  business_name: '',
  ruc: '',
});
const [loading, setLoading] = useState(false);
```

### 2. Limpieza Automática

```javascript
useEffect(() => {
  if (isOpen && contractor) {
    // Cargar datos para editar
    setFormData({
      business_name: contractor.business_name || '',
      ruc: contractor.ruc || '',
    });
  } else if (isOpen && !contractor) {
    // Limpiar formulario para nuevo
    setFormData({
      business_name: '',
      ruc: '',
    });
  }
}, [isOpen, contractor]);
```

### 3. Validación de RUC en Tiempo Real

```javascript
const handleRucChange = (e) => {
  // Solo números, máximo 11 dígitos
  const value = e.target.value.replace(/\D/g, '').slice(0, 11);
  setFormData({ ...formData, ruc: value });
};
```

### 4. Validación Completa antes de Enviar

```javascript
const validateRuc = (ruc) => {
  if (!/^\d+$/.test(ruc)) {
    return 'El RUC debe contener solo números';
  }
  if (ruc.length !== 11) {
    return 'El RUC debe tener exactamente 11 dígitos';
  }
  return null;
};
```

### 5. Loading State en Botón

```javascript
<button type="submit" disabled={loading}>
  {loading ? (
    <>
      <div className="spinner"></div>
      <span>Guardando...</span>
    </>
  ) : (
    <span>{contractor ? 'Actualizar' : 'Guardar'}</span>
  )}
</button>
```

### 6. Manejo de Errores del Backend

```javascript
if (error.response?.data) {
  const errors = error.response.data;
  Object.keys(errors).forEach(key => {
    if (Array.isArray(errors[key])) {
      errors[key].forEach(msg => toast.error(`${key}: ${msg}`));
    } else {
      toast.error(`${key}: ${errors[key]}`);
    }
  });
}
```

## 📊 Modelo de Datos

```javascript
{
  id: number,                    // ID único
  business_name: string,         // Razón Social (máx. 255 caracteres)
  ruc: string,                   // RUC (11 dígitos, único)
  created_by: number,           // ID del usuario que creó
  created_by_name: string,      // Nombre del usuario que creó
  created_at: string,           // Fecha de creación (ISO)
  updated_by: number,           // ID del usuario que actualizó
  updated_by_name: string,      // Nombre del usuario que actualizó
  updated_at: string            // Fecha de actualización (ISO)
}
```

## 🔄 Flujo de Uso

### Buscar Contratistas
```
1. Usuario escribe RUC o razón social (o deja vacío)
2. Hace clic en "Buscar"
3. Backend busca en ambos campos
4. Muestra resultados
```

### Crear Contratista
```
1. Click en "Agregar Contratista"
2. Modal se abre vacío
3. Usuario llena:
   - Razón Social
   - RUC (auto-valida mientras escribe)
4. Click en "Guardar"
5. Modal se cierra
6. Callback onSuccess se ejecuta
7. Lista se actualiza
```

### Editar Contratista
```
1. Click en menú ⋮ → Editar
2. Modal se abre con datos precargados
3. Usuario modifica datos
4. Click en "Actualizar"
5. Modal se cierra
6. Callback onSuccess se ejecuta
7. Lista se actualiza
```

## 🎯 Validaciones Implementadas

### Frontend (Modal)
```javascript
✅ Razón social obligatoria
✅ RUC obligatorio
✅ RUC solo números (regex: /^\d+$/)
✅ RUC exactamente 11 dígitos
✅ Auto-limita input a 11 dígitos
✅ No permite pegar texto no numérico
```

### Backend (API)
```python
✅ RUC debe ser solo dígitos
✅ RUC debe tener 11 dígitos
✅ RUC debe ser único (no duplicados)
✅ Razón social no puede estar vacía
```

## 🎨 Estilos y UX

### Colores (Consistentes)
- **Primary**: Azul UNF (#2c5f8d)
- **Gris**: Textos secundarios
- **Rojo**: Eliminación
- **Verde**: Éxito
- **Placeholder**: Gray-400 (tenue)

### Estados del Modal
- ✅ Loading state mientras guarda
- ✅ Botones deshabilitados mientras carga
- ✅ Cierre deshabilitado mientras guarda
- ✅ Animación de entrada/salida

### Responsive
- ✅ Mobile: Modal ocupa 90% del ancho
- ✅ Desktop: Modal max-width 28rem
- ✅ Padding adaptativo

## 🔐 Seguridad

- ✅ Ruta protegida con `<PrivateRoute>`
- ✅ Token JWT en todas las peticiones
- ✅ Validación en frontend Y backend
- ✅ RUC único (no duplicados)

## 🚀 Ventajas del Modal Reutilizable

### ✅ Reutilización
- Usa el mismo modal desde múltiples páginas
- No duplicas código
- Fácil mantenimiento

### ✅ Consistencia
- Mismo diseño en toda la app
- Mismas validaciones
- Mismos mensajes de error

### ✅ Flexibilidad
- Título personalizable
- Callbacks configurables
- Funciona para crear Y editar

### ✅ Encapsulación
- Maneja su propio estado
- No contamina el componente padre
- Fácil de testear

## 📚 Casos de Uso del Modal Reutilizable

### 1. Desde CRUD de Contratistas
```javascript
// Ya implementado en Contractors.js
<ContractorModal
  isOpen={showModal}
  onClose={handleCloseModal}
  onSuccess={handleSuccess}
  contractor={editingContractor}
/>
```

### 2. Desde Formulario de Carta Fianza (Futuro)
```javascript
// Crear contratista sin salir del formulario
<ContractorModal
  isOpen={showQuickAdd}
  onClose={() => setShowQuickAdd(false)}
  onSuccess={(newContractor) => {
    // Actualizar select de contratistas
    // Auto-seleccionar el nuevo contratista
    refreshContractorsList();
    setSelectedContractorId(newContractor.id);
  }}
  contractor={null}
  title="Agregar Contratista Rápido"
/>
```

### 3. Desde Dashboard de Reportes (Futuro)
```javascript
// Editar contratista desde reporte
<ContractorModal
  isOpen={showEdit}
  onClose={() => setShowEdit(false)}
  onSuccess={() => {
    refreshReport();
  }}
  contractor={selectedContractor}
  title="Editar Información del Contratista"
/>
```

### 4. Desde Búsqueda Global (Futuro)
```javascript
// Crear contratista desde barra de búsqueda
<ContractorModal
  isOpen={showCreate}
  onClose={() => setShowCreate(false)}
  onSuccess={() => {
    toast.success('Contratista creado. ¿Deseas crear una carta fianza?');
  }}
  contractor={null}
  title="Nuevo Contratista"
/>
```

## 🔜 Extensiones Futuras

### Modal Actual
- [ ] Agregar campo: Dirección
- [ ] Agregar campo: Teléfono
- [ ] Agregar campo: Email
- [ ] Agregar campo: Representante Legal
- [ ] Validación de RUC con SUNAT API
- [ ] Autocompletado desde SUNAT

### Otros Modales Reutilizables
- [ ] WarrantyObjectModal (Objetos de Garantía)
- [ ] FinancialEntityModal (Entidades Financieras)
- [ ] WarrantyStatusModal (Estados de Garantía)

## 📊 Comparación: Modal Reutilizable vs Modal Interno

| Característica | Modal Interno | Modal Reutilizable ⭐ |
|----------------|---------------|----------------------|
| **Archivo** | Dentro de la página | Componente separado |
| **Reutilización** | ❌ No | ✅ Sí |
| **Mantenimiento** | Múltiples lugares | Un solo lugar |
| **Consistencia** | Difícil | Automática |
| **Testing** | Complejo | Simple |
| **Código duplicado** | Alto | Cero |
| **Flexibilidad** | Limitada | Alta |

## 🎓 Patrón de Diseño

**Patrón:** Compound Component Pattern + Controlled Component

Beneficios:
- ✅ Encapsulación completa
- ✅ API clara y simple
- ✅ Reutilizable en toda la app
- ✅ Fácil de mantener
- ✅ Fácil de testear

## 🐛 Manejo de Errores

### RUC Duplicado
```javascript
// Backend devuelve:
{
  "ruc": ["contractor with this ruc already exists."]
}

// Modal muestra:
toast.error('ruc: contractor with this ruc already exists.');
```

### RUC Inválido
```javascript
// Frontend valida antes de enviar:
if (ruc.length !== 11) {
  toast.error('El RUC debe tener exactamente 11 dígitos');
  return;
}
```

### Contratista en Uso
```javascript
// Al intentar eliminar:
if (error.response?.status === 400 || error.response?.status === 409) {
  toast.error('No se puede eliminar porque está siendo utilizado en cartas fianza');
}
```

## 📝 Ejemplos de RUC Válidos

```javascript
// Personas Jurídicas (empiezan con 20)
"20123456789"  // ✅ Válido
"20234567890"  // ✅ Válido

// Personas Naturales (empiezan con 10)
"10123456789"  // ✅ Válido

// INVÁLIDOS
"2012345678"   // ❌ Solo 10 dígitos
"201234567890" // ❌ 12 dígitos
"20ABC456789"  // ❌ Contiene letras
"20-12345678"  // ❌ Contiene guión
```

## ✨ Características Destacadas

1. **Modal Reutilizable**: Úsalo desde cualquier componente
2. **Búsqueda Multi-campo**: RUC o Razón Social
3. **Validación en Tiempo Real**: RUC se valida mientras escribes
4. **Loading States**: Usuario siempre sabe qué está pasando
5. **Manejo de Errores**: Mensajes claros del backend
6. **Consistencia Total**: Mismo patrón que otros CRUDs

---

**Implementado por:** Sistema de IA  
**Fecha:** 18 de Noviembre, 2025  
**Característica especial:** ⭐ Modal Reutilizable  
**Ruta:** `/catalogos/contratistas`  
**Estado:** ✅ Completado y funcional

