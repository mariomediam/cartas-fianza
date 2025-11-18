# 🎯 Cómo Usar el Modal Reutilizable de Contratistas

## 📦 Importación

```javascript
import ContractorModal from '../components/ContractorModal';
```

## 🚀 Uso Básico

### Ejemplo 1: Crear Nuevo Contratista

```javascript
import React, { useState } from 'react';
import ContractorModal from '../components/ContractorModal';

function MiComponente() {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div>
      <button onClick={() => setMostrarModal(true)}>
        + Agregar Contratista
      </button>

      <ContractorModal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onSuccess={() => {
          console.log('¡Contratista creado exitosamente!');
          // Aquí puedes actualizar tu lista, etc.
        }}
        contractor={null}  // null = crear nuevo
      />
    </div>
  );
}
```

### Ejemplo 2: Editar Contratista Existente

```javascript
import React, { useState } from 'react';
import ContractorModal from '../components/ContractorModal';

function MiComponente() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [contratista, setContratista] = useState(null);

  const abrirEdicion = (contraElement) => {
    setContratista(contraElement);
    setMostrarModal(true);
  };

  return (
    <div>
      <button onClick={() => abrirEdicion(miContratista)}>
        Editar
      </button>

      <ContractorModal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setContratista(null);
        }}
        onSuccess={() => {
          console.log('¡Contratista actualizado!');
          // Recargar lista
        }}
        contractor={contratista}  // Objeto con id, business_name, ruc
      />
    </div>
  );
}
```

### Ejemplo 3: Desde Formulario de Carta Fianza

```javascript
import React, { useState } from 'react';
import ContractorModal from '../components/ContractorModal';
import api from '../services/api';

function FormularioCartaFianza() {
  const [mostrarModalContratista, setMostrarModalContratista] = useState(false);
  const [contratistas, setContratistas] = useState([]);

  const recargarContratistas = async () => {
    const response = await api.get('/contractors/?page_size=1000');
    setContratistas(response.data.results);
  };

  return (
    <form>
      {/* Otros campos del formulario */}
      
      {/* Select de contratistas */}
      <div>
        <label>Contratista</label>
        <div className="flex gap-2">
          <select name="contractor" className="flex-1">
            <option value="">Seleccione...</option>
            {contratistas.map(c => (
              <option key={c.id} value={c.id}>
                {c.business_name} - {c.ruc}
              </option>
            ))}
          </select>
          
          {/* Botón para crear contratista sin salir del formulario */}
          <button 
            type="button"
            onClick={() => setMostrarModalContratista(true)}
            className="px-3 py-2 bg-green-600 text-white rounded"
          >
            + Nuevo
          </button>
        </div>
      </div>

      {/* Modal reutilizable */}
      <ContractorModal
        isOpen={mostrarModalContratista}
        onClose={() => setMostrarModalContratista(false)}
        onSuccess={() => {
          recargarContratistas();  // Actualiza el select
          toast.success('Contratista agregado');
        }}
        contractor={null}
        title="Agregar Contratista"
      />
    </form>
  );
}
```

## 📖 API del Modal

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `isOpen` | boolean | ✅ Sí | Controla si el modal está visible |
| `onClose` | function | ✅ Sí | Se ejecuta al cerrar el modal |
| `onSuccess` | function | ✅ Sí | Se ejecuta después de guardar con éxito |
| `contractor` | object \| null | ✅ Sí | Datos para editar (null para crear) |
| `title` | string \| null | ❌ No | Título personalizado (opcional) |

### Objeto Contractor

```javascript
{
  id: number,              // ID del contratista
  business_name: string,   // Razón social
  ruc: string             // RUC (11 dígitos)
}
```

## 💡 Consejos de Uso

### ✅ DO - Buenas Prácticas

```javascript
// ✅ Limpiar estado al cerrar
onClose={() => {
  setMostrarModal(false);
  setContratista(null);  // Limpiar datos
}}

// ✅ Manejar éxito con callback
onSuccess={() => {
  recargarLista();
  toast.success('¡Éxito!');
}}

// ✅ Pasar null para crear nuevo
contractor={null}

// ✅ Pasar objeto completo para editar
contractor={{ id: 1, business_name: "ABC S.A.C.", ruc: "20123456789" }}
```

### ❌ DON'T - Evitar

```javascript
// ❌ No controles el estado interno del modal desde fuera
// El modal maneja su propio formulario

// ❌ No olvides el callback onSuccess
<ContractorModal
  isOpen={true}
  onClose={() => {}}
  // ❌ Falta onSuccess
/>

// ❌ No uses el modal sin estado
<ContractorModal isOpen={true} />  // ❌ Siempre visible
```

## 🎨 Personalización

### Título Personalizado

```javascript
// Título por defecto: "Agregar Contratista" o "Editar Contratista"

// Título personalizado:
<ContractorModal
  title="Registrar Nuevo Proveedor"
  ...
/>
```

## 🔄 Flujo Completo

```
1. Usuario hace clic en botón
   ↓
2. Estado isOpen cambia a true
   ↓
3. Modal se muestra
   ↓
4. Usuario llena formulario
   ↓
5. Usuario hace clic en "Guardar"
   ↓
6. Modal valida datos
   ↓
7. Modal envía petición a API
   ↓
8. Si éxito:
   - onSuccess() se ejecuta
   - Modal se cierra automáticamente
   - Toast de éxito se muestra
   ↓
9. Si error:
   - Toast de error se muestra
   - Modal permanece abierto
   - Usuario puede corregir
```

## 🎯 Casos de Uso Reales

### 1. CRUD Simple
Ya implementado en `frontend/src/pages/Contractors.js`

### 2. Formulario con Relación
Crear contratista desde formulario de carta fianza

### 3. Dashboard con Acciones Rápidas
Editar contratista desde tarjeta de dashboard

### 4. Búsqueda Global
Crear contratista desde resultados de búsqueda

## 📝 Notas Importantes

1. ⚠️ **Validación de RUC**: El modal valida automáticamente que el RUC:
   - Sea solo números
   - Tenga exactamente 11 dígitos

2. ⚠️ **Auto-limpieza**: El modal limpia su formulario automáticamente al abrir/cerrar

3. ⚠️ **Loading State**: El modal muestra un spinner mientras guarda

4. ⚠️ **Errores del Backend**: El modal muestra automáticamente errores de validación del backend

## 🐛 Troubleshooting

### El modal no se muestra
```javascript
// Verifica que isOpen sea true
<ContractorModal isOpen={true} ... />

// Verifica que el estado esté bien configurado
const [show, setShow] = useState(false);
```

### El modal no se cierra después de guardar
```javascript
// El modal se cierra automáticamente después de guardar
// Si no se cierra, verifica que no haya errores en la consola
```

### Los datos no se precargan al editar
```javascript
// Verifica que pasas el objeto completo
contractor={{
  id: 1,
  business_name: "ABC",
  ruc: "20123456789"
}}

// No solo el ID:
contractor={1}  // ❌ Incorrecto
```

---

**Componente:** `ContractorModal.js`  
**Ubicación:** `frontend/src/components/`  
**Estado:** ✅ Listo para usar en producción

