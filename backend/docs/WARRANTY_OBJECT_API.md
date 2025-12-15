# API Documentation - WarrantyObject (Objetos de Garantía)

## 📍 Endpoints Disponibles

### 1. Listar todos los objetos de garantía
**GET** `/api/warranty-objects/`

Retorna una lista paginada de todos los objetos de garantía.

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
```

**Respuesta exitosa (200 OK):**
```json
{
    "count": 6,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "description": "MANTENIMIENTO DE VIAS Y DE LA RED DE SEMAFOROS LOCAL",
            "cui": "2456789",
            "created_by": 1,
            "created_by_name": "test_user",
            "created_at": "12/11/2025 17:29",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "12/11/2025 17:29"
        },
        {
            "id": 2,
            "description": "MEJORAMIENTO DE INFRAESTRUCTURA VIAL URBANA",
            "cui": "2345678",
            "created_by": 1,
            "created_by_name": "test_user",
            "created_at": "12/11/2025 17:29",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "12/11/2025 17:29"
        }
    ]
}
```

---

### 2. Obtener un objeto de garantía específico
**GET** `/api/warranty-objects/{id}/`

Retorna los detalles de un objeto de garantía específico.

**Parámetros:**
- `id` (path) - ID del objeto de garantía

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "description": "MANTENIMIENTO DE VIAS Y DE LA RED DE SEMAFOROS LOCAL",
    "cui": "2456789",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 17:29",
    "updated_by": null,
    "updated_by_name": null,
    "updated_at": "12/11/2025 17:29"
}
```

---

### 3. Crear un nuevo objeto de garantía
**POST** `/api/warranty-objects/`

Crea un nuevo objeto de garantía.

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "description": "CONSTRUCCION Y EQUIPAMIENTO DE BIBLIOTECA MUNICIPAL",
    "cui": "2567890"
}
```

**Ejemplo sin CUI (opcional):**
```json
{
    "description": "CONSTRUCCION Y EQUIPAMIENTO DE BIBLIOTECA MUNICIPAL"
}
```

**Validaciones:**
- `description`: Campo requerido, máximo 512 caracteres
- `cui`: Campo **OPCIONAL**, Código Único de Inversión, máximo 10 caracteres

**Respuesta exitosa (201 Created):**
```json
{
    "id": 7,
    "description": "CONSTRUCCION Y EQUIPAMIENTO DE BIBLIOTECA MUNICIPAL",
    "cui": "2567890",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 17:35",
    "updated_by": null,
    "updated_by_name": null,
    "updated_at": "12/11/2025 17:35"
}
```

---

### 4. Actualizar completamente un objeto de garantía
**PUT** `/api/warranty-objects/{id}/`

Actualiza todos los campos de un objeto de garantía.

**Parámetros:**
- `id` (path) - ID del objeto de garantía

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "description": "MANTENIMIENTO DE VIAS Y REHABILITACION DE RED DE SEMAFOROS LOCAL",
    "cui": "2456789"
}
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "description": "MANTENIMIENTO DE VIAS Y REHABILITACION DE RED DE SEMAFOROS LOCAL",
    "cui": "2456789",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 17:29",
    "updated_by": 1,
    "updated_by_name": "test_user",
    "updated_at": "12/11/2025 17:40"
}
```

---

### 5. Actualizar parcialmente un objeto de garantía
**PATCH** `/api/warranty-objects/{id}/`

Actualiza solo los campos especificados.

**Parámetros:**
- `id` (path) - ID del objeto de garantía

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "description": "MANTENIMIENTO Y MEJORAMIENTO DE VIAS Y SEMAFOROS LOCAL"
}
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "description": "MANTENIMIENTO Y MEJORAMIENTO DE VIAS Y SEMAFOROS LOCAL",
    "cui": "2456789",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 17:29",
    "updated_by": 1,
    "updated_by_name": "test_user",
    "updated_at": "12/11/2025 17:45"
}
```

---

### 6. Eliminar un objeto de garantía
**DELETE** `/api/warranty-objects/{id}/`

Elimina un objeto de garantía.

**Parámetros:**
- `id` (path) - ID del objeto de garantía

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
```

**Respuesta exitosa (204 No Content)**

**Nota:** Solo se puede eliminar un objeto de garantía si no tiene garantías asociadas.

---

## 🔍 Filtros y Búsqueda

### Búsqueda por descripción o CUI
```
GET /api/warranty-objects/?search=mantenimiento
GET /api/warranty-objects/?search=2456789
GET /api/warranty-objects/?search=vias
```

### Filtrar por descripción exacta
```
GET /api/warranty-objects/?description=MANTENIMIENTO%20DE%20VIAS%20Y%20DE%20LA%20RED%20DE%20SEMAFOROS%20LOCAL
```

### Filtrar por CUI exacto
```
GET /api/warranty-objects/?cui=2456789
```

### Ordenamiento
```
GET /api/warranty-objects/?ordering=description      # Ascendente (A-Z)
GET /api/warranty-objects/?ordering=-description     # Descendente (Z-A)
GET /api/warranty-objects/?ordering=cui              # Por CUI ascendente
GET /api/warranty-objects/?ordering=-created_at      # Por fecha de creación (más reciente primero)
GET /api/warranty-objects/?ordering=created_at       # Por fecha de creación (más antiguo primero)
```

### Paginación
```
GET /api/warranty-objects/?page=2
GET /api/warranty-objects/?page_size=10
```

### Combinación de filtros
```
GET /api/warranty-objects/?search=infraestructura&ordering=cui&page_size=5
```

---

## 🧪 Ejemplos con cURL

### Listar todos los objetos de garantía
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  http://localhost:8000/api/warranty-objects/
```

### Obtener un objeto específico
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  http://localhost:8000/api/warranty-objects/1/
```

### Crear un nuevo objeto de garantía
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"description":"CONSTRUCCION Y EQUIPAMIENTO DE BIBLIOTECA MUNICIPAL","cui":"2567890"}' \
  http://localhost:8000/api/warranty-objects/
```

### Actualizar un objeto de garantía
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  -H "Content-Type: application/json" \
  -X PUT \
  -d '{"description":"MANTENIMIENTO DE VIAS Y REHABILITACION","cui":"2456789"}' \
  http://localhost:8000/api/warranty-objects/1/
```

### Buscar objetos de garantía
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  "http://localhost:8000/api/warranty-objects/?search=mantenimiento"
```

### Eliminar un objeto de garantía
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  -X DELETE \
  http://localhost:8000/api/warranty-objects/1/
```

---

## 🧪 Uso en Postman

### Configuración de Headers:

Para todas las peticiones, agrega:

| Key | Value |
|-----|-------|
| `Authorization` | `Token 530e8ab5db1624045f20a7bc98a4022169297fc8` |
| `Content-Type` | `application/json` (solo para POST, PUT, PATCH) |

### Ejemplo de Body para crear objeto de garantía:

```json
{
    "description": "CONSTRUCCION Y EQUIPAMIENTO DE BIBLIOTECA MUNICIPAL",
    "cui": "2567890"
}
```

---

## ⚛️ Uso desde React

### Servicio de Objetos de Garantía

```javascript
// src/services/warrantyObjectService.js
import apiClient from './apiClient';

class WarrantyObjectService {
  async getAll(params = {}) {
    const response = await apiClient.get('/warranty-objects/', { params });
    return response.data;
  }

  async getById(id) {
    const response = await apiClient.get(`/warranty-objects/${id}/`);
    return response.data;
  }

  async create(data) {
    const response = await apiClient.post('/warranty-objects/', data);
    return response.data;
  }

  async update(id, data) {
    const response = await apiClient.put(`/warranty-objects/${id}/`, data);
    return response.data;
  }

  async partialUpdate(id, data) {
    const response = await apiClient.patch(`/warranty-objects/${id}/`, data);
    return response.data;
  }

  async delete(id) {
    const response = await apiClient.delete(`/warranty-objects/${id}/`);
    return response.data;
  }

  async search(searchTerm) {
    const response = await apiClient.get('/warranty-objects/', {
      params: { search: searchTerm }
    });
    return response.data;
  }

  async findByCUI(cui) {
    const response = await apiClient.get('/warranty-objects/', {
      params: { cui }
    });
    return response.data;
  }
}

export default new WarrantyObjectService();
```

### Componente de Formulario

```javascript
// src/components/WarrantyObjectForm.jsx
import React, { useState } from 'react';
import warrantyObjectService from '../services/warrantyObjectService';

function WarrantyObjectForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    description: '',
    cui: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const newObject = await warrantyObjectService.create(formData);
      alert('Objeto de garantía creado exitosamente');
      setFormData({ description: '', cui: '' });
      if (onSuccess) onSuccess(newObject);
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        alert('Error al crear el objeto de garantía');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Descripción:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          maxLength={512}
          rows={4}
          placeholder="Ejemplo: MANTENIMIENTO DE VIAS Y DE LA RED DE SEMAFOROS LOCAL"
        />
        {errors.description && (
          <span className="error">{errors.description}</span>
        )}
      </div>

      <div>
        <label>CUI (Código Único de Inversión) - Opcional:</label>
        <input
          type="text"
          name="cui"
          value={formData.cui}
          onChange={handleChange}
          maxLength={10}
          placeholder="2456789 (opcional)"
        />
        {errors.cui && (
          <span className="error">{errors.cui}</span>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Crear Objeto de Garantía'}
      </button>
    </form>
  );
}

export default WarrantyObjectForm;
```

### Componente de Lista

```javascript
// src/components/WarrantyObjectList.jsx
import React, { useState, useEffect } from 'react';
import warrantyObjectService from '../services/warrantyObjectService';

function WarrantyObjectList() {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = async () => {
    try {
      const data = await warrantyObjectService.getAll();
      setObjects(data.results || data);
    } catch (err) {
      console.error('Error al cargar objetos de garantía:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await warrantyObjectService.search(searchTerm);
      setObjects(data.results || data);
    } catch (err) {
      console.error('Error en la búsqueda:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este objeto de garantía?')) {
      try {
        await warrantyObjectService.delete(id);
        loadObjects();
      } catch (err) {
        alert('Error al eliminar el objeto de garantía');
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Objetos de Garantía</h2>
      
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar por descripción o CUI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Buscar</button>
        <button type="button" onClick={loadObjects}>
          Ver Todos
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>CUI</th>
            <th>Descripción</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {objects.map((obj) => (
            <tr key={obj.id}>
              <td>{obj.cui}</td>
              <td>{obj.description}</td>
              <td>{obj.created_at}</td>
              <td>
                <button onClick={() => handleDelete(obj.id)}>
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

export default WarrantyObjectList;
```

---

## 📊 Datos de Prueba

Se han creado 6 objetos de garantía de ejemplo:

1. CUI: 2456789 - MANTENIMIENTO DE VIAS Y DE LA RED DE SEMAFOROS LOCAL
2. CUI: 2345678 - MEJORAMIENTO DE INFRAESTRUCTURA VIAL URBANA
3. CUI: 2234567 - CONSTRUCCION DE PARQUE MUNICIPAL Y AREAS VERDES
4. CUI: 2123456 - REHABILITACION Y AMPLIACION DEL SISTEMA DE AGUA POTABLE
5. CUI: 2012345 - MEJORAMIENTO DEL SERVICIO DE LIMPIEZA PUBLICA
6. CUI: 1901234 - CONSTRUCCION DE LOCAL COMUNAL MULTIUSOS

---

## 📝 Sobre el CUI

**CUI** - Código Único de Inversión

Es un código que identifica de manera única cada proyecto de inversión pública en Perú. Se utiliza en el Sistema Nacional de Programación Multianual y Gestión de Inversiones (Invierte.pe).

- **Longitud máxima:** 10 caracteres
- **Obligatorio:** **NO** (Campo opcional)
- **Ejemplo:** 2456789
- **Nota:** Puedes crear objetos de garantía sin CUI si aún no ha sido asignado

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
http://localhost:8000/api/warranty-objects/
```

