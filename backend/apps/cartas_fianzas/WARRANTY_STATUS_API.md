# API Documentation - WarrantyStatus (Estados de Garantía)

## 📍 Endpoints Disponibles

### 1. Listar todos los estados de garantía
**GET** `/api/warranty-statuses/`

Retorna una lista paginada de todos los estados de garantía.

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
```

**Respuesta exitosa (200 OK):**
```json
{
    "count": 8,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "description": "Emisión",
            "created_by": 1,
            "created_by_name": "test_user",
            "created_at": "12/11/2025 17:51",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "12/11/2025 17:51"
        },
        {
            "id": 2,
            "description": "Renovación",
            "created_by": 1,
            "created_by_name": "test_user",
            "created_at": "12/11/2025 17:51",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "12/11/2025 17:51"
        }
    ]
}
```

---

### 2. Obtener un estado de garantía específico
**GET** `/api/warranty-statuses/{id}/`

Retorna los detalles de un estado de garantía específico.

**Parámetros:**
- `id` (path) - ID del estado de garantía

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "description": "Emisión",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 17:51",
    "updated_by": null,
    "updated_by_name": null,
    "updated_at": "12/11/2025 17:51"
}
```

---

### 3. Crear un nuevo estado de garantía
**POST** `/api/warranty-statuses/`

Crea un nuevo estado de garantía.

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "description": "Subsanación"
}
```

**Validaciones:**
- `description`: Campo requerido, máximo 50 caracteres

**Respuesta exitosa (201 Created):**
```json
{
    "id": 9,
    "description": "Subsanación",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 18:00",
    "updated_by": null,
    "updated_by_name": null,
    "updated_at": "12/11/2025 18:00"
}
```

---

### 4. Actualizar completamente un estado de garantía
**PUT** `/api/warranty-statuses/{id}/`

Actualiza todos los campos de un estado de garantía.

**Parámetros:**
- `id` (path) - ID del estado de garantía

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "description": "Emisión de Carta"
}
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "description": "Emisión de Carta",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 17:51",
    "updated_by": 1,
    "updated_by_name": "test_user",
    "updated_at": "12/11/2025 18:05"
}
```

---

### 5. Actualizar parcialmente un estado de garantía
**PATCH** `/api/warranty-statuses/{id}/`

Actualiza solo los campos especificados.

**Parámetros:**
- `id` (path) - ID del estado de garantía

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "description": "Renovación Parcial"
}
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 2,
    "description": "Renovación Parcial",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 17:51",
    "updated_by": 1,
    "updated_by_name": "test_user",
    "updated_at": "12/11/2025 18:10"
}
```

---

### 6. Eliminar un estado de garantía
**DELETE** `/api/warranty-statuses/{id}/`

Elimina un estado de garantía.

**Parámetros:**
- `id` (path) - ID del estado de garantía

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
```

**Respuesta exitosa (204 No Content)**

**Nota:** Solo se puede eliminar un estado si no está siendo utilizado por ningún historial de garantía.

---

## 🔍 Filtros y Búsqueda

### Búsqueda por descripción
```
GET /api/warranty-statuses/?search=emisión
GET /api/warranty-statuses/?search=renovación
```

### Filtrar por descripción exacta
```
GET /api/warranty-statuses/?description=Emisión
```

### Ordenamiento
```
GET /api/warranty-statuses/?ordering=description       # Ascendente (A-Z)
GET /api/warranty-statuses/?ordering=-description      # Descendente (Z-A)
GET /api/warranty-statuses/?ordering=-created_at       # Por fecha de creación
GET /api/warranty-statuses/?ordering=id                # Por ID
```

### Paginación
```
GET /api/warranty-statuses/?page=2
GET /api/warranty-statuses/?page_size=10
```

---

## 🧪 Ejemplos con cURL

### Listar todos los estados de garantía
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  http://localhost:8000/api/warranty-statuses/
```

### Obtener un estado específico
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  http://localhost:8000/api/warranty-statuses/1/
```

### Crear un nuevo estado de garantía
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"description":"Subsanación"}' \
  http://localhost:8000/api/warranty-statuses/
```

### Actualizar un estado de garantía
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  -H "Content-Type: application/json" \
  -X PUT \
  -d '{"description":"Emisión de Carta"}' \
  http://localhost:8000/api/warranty-statuses/1/
```

### Buscar estados de garantía
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  "http://localhost:8000/api/warranty-statuses/?search=renovación"
```

### Eliminar un estado de garantía
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  -X DELETE \
  http://localhost:8000/api/warranty-statuses/1/
```

---

## 🧪 Uso en Postman

### Configuración de Headers:

Para todas las peticiones, agrega:

| Key | Value |
|-----|-------|
| `Authorization` | `Token 530e8ab5db1624045f20a7bc98a4022169297fc8` |
| `Content-Type` | `application/json` (solo para POST, PUT, PATCH) |

### Ejemplo de Body para crear estado:

```json
{
    "description": "Subsanación"
}
```

---

## ⚛️ Uso desde React

### Servicio de Estados de Garantía

```javascript
// src/services/warrantyStatusService.js
import apiClient from './apiClient';

class WarrantyStatusService {
  async getAll(params = {}) {
    const response = await apiClient.get('/warranty-statuses/', { params });
    return response.data;
  }

  async getById(id) {
    const response = await apiClient.get(`/warranty-statuses/${id}/`);
    return response.data;
  }

  async create(data) {
    const response = await apiClient.post('/warranty-statuses/', data);
    return response.data;
  }

  async update(id, data) {
    const response = await apiClient.put(`/warranty-statuses/${id}/`, data);
    return response.data;
  }

  async partialUpdate(id, data) {
    const response = await apiClient.patch(`/warranty-statuses/${id}/`, data);
    return response.data;
  }

  async delete(id) {
    const response = await apiClient.delete(`/warranty-statuses/${id}/`);
    return response.data;
  }

  async search(searchTerm) {
    const response = await apiClient.get('/warranty-statuses/', {
      params: { search: searchTerm }
    });
    return response.data;
  }
}

export default new WarrantyStatusService();
```

### Componente de Formulario

```javascript
// src/components/WarrantyStatusForm.jsx
import React, { useState } from 'react';
import warrantyStatusService from '../services/warrantyStatusService';

function WarrantyStatusForm({ onSuccess }) {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newStatus = await warrantyStatusService.create({ description });
      alert('Estado de garantía creado exitosamente');
      setDescription('');
      if (onSuccess) onSuccess(newStatus);
    } catch (err) {
      setError(err.response?.data?.description?.[0] || 'Error al crear el estado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Descripción:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={50}
          placeholder="Ejemplo: Emisión, Renovación, Devolución"
        />
        {error && <span className="error">{error}</span>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Crear Estado'}
      </button>
    </form>
  );
}

export default WarrantyStatusForm;
```

### Componente de Lista

```javascript
// src/components/WarrantyStatusList.jsx
import React, { useState, useEffect } from 'react';
import warrantyStatusService from '../services/warrantyStatusService';

function WarrantyStatusList() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async () => {
    try {
      const data = await warrantyStatusService.getAll();
      setStatuses(data.results || data);
    } catch (err) {
      console.error('Error al cargar estados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await warrantyStatusService.search(searchTerm);
      setStatuses(data.results || data);
    } catch (err) {
      console.error('Error en la búsqueda:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este estado?')) {
      try {
        await warrantyStatusService.delete(id);
        loadStatuses();
      } catch (err) {
        alert('Error al eliminar el estado');
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Estados de Garantía</h2>
      
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar estado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Buscar</button>
        <button type="button" onClick={loadStatuses}>
          Ver Todos
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map((status) => (
            <tr key={status.id}>
              <td>{status.id}</td>
              <td>{status.description}</td>
              <td>{status.created_at}</td>
              <td>
                <button onClick={() => handleDelete(status.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WarrantyStatusList;
```

### Componente de Selector (para formularios)

```javascript
// src/components/WarrantyStatusSelector.jsx
import React, { useState, useEffect } from 'react';
import warrantyStatusService from '../services/warrantyStatusService';

function WarrantyStatusSelector({ value, onChange, required = false }) {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async () => {
    try {
      const data = await warrantyStatusService.getAll();
      setStatuses(data.results || data);
    } catch (err) {
      console.error('Error al cargar estados:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <select disabled><option>Cargando...</option></select>;

  return (
    <select value={value} onChange={onChange} required={required}>
      <option value="">Seleccione un estado</option>
      {statuses.map((status) => (
        <option key={status.id} value={status.id}>
          {status.description}
        </option>
      ))}
    </select>
  );
}

export default WarrantyStatusSelector;
```

---

## 📊 Datos de Prueba

Se han creado 8 estados de garantía de ejemplo:

1. Emisión
2. Renovación
3. Devolución
4. Ampliación
5. Reducción
6. Ejecución
7. Vigente
8. Vencido

---

## 📝 Estados de Garantía Comunes

Los estados de garantía representan las diferentes etapas y acciones que puede tener una carta fianza:

- **Emisión:** Primera emisión de la carta fianza
- **Renovación:** Extensión del período de vigencia
- **Devolución:** Devolución de la carta fianza al contratista
- **Ampliación:** Aumento del monto garantizado
- **Reducción:** Disminución del monto garantizado
- **Ejecución:** Ejecución de la garantía por incumplimiento
- **Vigente:** Estado actual de la garantía activa
- **Vencido:** Garantía que ha expirado

---

## 🔒 Autenticación

**Todos los endpoints requieren autenticación.**

Usa el token en el header:
```
Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8
```

Para obtener un token, ver `AUTH_DOCUMENTATION.md`

---

## 🌐 Interfaz Web Interactiva

Prueba la API directamente desde el navegador:
```
http://localhost:8000/api/warranty-statuses/
```

