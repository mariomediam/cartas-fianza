# API Documentation - FinancialEntity (Entidades Financieras)

## 📍 Endpoints Disponibles

### 1. Listar todas las entidades financieras
**GET** `/api/financial-entities/`

Retorna una lista paginada de todas las entidades financieras.

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
            "description": "SCOTIABANK PERU",
            "created_by": 1,
            "created_by_name": "test_user",
            "created_at": "12/11/2025 16:37",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "12/11/2025 16:37"
        },
        {
            "id": 2,
            "description": "BANCO DE LA NACION",
            "created_by": 1,
            "created_by_name": "test_user",
            "created_at": "12/11/2025 16:37",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "12/11/2025 16:37"
        }
    ]
}
```

---

### 2. Obtener una entidad financiera específica
**GET** `/api/financial-entities/{id}/`

Retorna los detalles de una entidad financiera específica.

**Parámetros:**
- `id` (path) - ID de la entidad financiera

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "description": "SCOTIABANK PERU",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 16:37",
    "updated_by": null,
    "updated_by_name": null,
    "updated_at": "12/11/2025 16:37"
}
```

---

### 3. Crear una nueva entidad financiera
**POST** `/api/financial-entities/`

Crea una nueva entidad financiera.

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "description": "BANCO CONTINENTAL"
}
```

**Respuesta exitosa (201 Created):**
```json
{
    "id": 9,
    "description": "BANCO CONTINENTAL",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 17:00",
    "updated_by": null,
    "updated_by_name": null,
    "updated_at": "12/11/2025 17:00"
}
```

---

### 4. Actualizar completamente una entidad financiera
**PUT** `/api/financial-entities/{id}/`

Actualiza todos los campos de una entidad financiera.

**Parámetros:**
- `id` (path) - ID de la entidad financiera

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "description": "SCOTIABANK PERU S.A."
}
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "description": "SCOTIABANK PERU S.A.",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 16:37",
    "updated_by": 1,
    "updated_by_name": "test_user",
    "updated_at": "12/11/2025 17:05"
}
```

---

### 5. Actualizar parcialmente una entidad financiera
**PATCH** `/api/financial-entities/{id}/`

Actualiza solo los campos especificados.

**Parámetros:**
- `id` (path) - ID de la entidad financiera

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "description": "SCOTIABANK"
}
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "description": "SCOTIABANK",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 16:37",
    "updated_by": 1,
    "updated_by_name": "test_user",
    "updated_at": "12/11/2025 17:10"
}
```

---

### 6. Eliminar una entidad financiera
**DELETE** `/api/financial-entities/{id}/`

Elimina una entidad financiera.

**Parámetros:**
- `id` (path) - ID de la entidad financiera

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
```

**Respuesta exitosa (204 No Content)**

---

## 🔍 Filtros y Búsqueda

### Búsqueda por descripción
```
GET /api/financial-entities/?search=banco
GET /api/financial-entities/?search=scotiabank
```

### Filtrar por descripción exacta
```
GET /api/financial-entities/?description=SCOTIABANK%20PERU
```

### Ordenamiento
```
GET /api/financial-entities/?ordering=description       # Ascendente (A-Z)
GET /api/financial-entities/?ordering=-description      # Descendente (Z-A)
GET /api/financial-entities/?ordering=-created_at       # Por fecha de creación
GET /api/financial-entities/?ordering=id                # Por ID
```

### Paginación
```
GET /api/financial-entities/?page=2
GET /api/financial-entities/?page_size=10
```

---

## 🧪 Ejemplos con cURL

### Listar todas las entidades financieras
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  http://localhost:8000/api/financial-entities/
```

### Obtener una entidad específica
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  http://localhost:8000/api/financial-entities/1/
```

### Crear una nueva entidad financiera
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"description":"BANCO CONTINENTAL"}' \
  http://localhost:8000/api/financial-entities/
```

### Actualizar una entidad financiera
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  -H "Content-Type: application/json" \
  -X PUT \
  -d '{"description":"SCOTIABANK PERU S.A."}' \
  http://localhost:8000/api/financial-entities/1/
```

### Buscar entidades financieras
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  "http://localhost:8000/api/financial-entities/?search=banco"
```

### Eliminar una entidad financiera
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  -X DELETE \
  http://localhost:8000/api/financial-entities/1/
```

---

## 🧪 Uso en Postman

### Configuración de Headers:

Para todas las peticiones, agrega:

| Key | Value |
|-----|-------|
| `Authorization` | `Token 530e8ab5db1624045f20a7bc98a4022169297fc8` |
| `Content-Type` | `application/json` (solo para POST, PUT, PATCH) |

---

## ⚛️ Uso desde React

### Servicio de Entidades Financieras

```javascript
// src/services/financialEntityService.js
import apiClient from './apiClient';

class FinancialEntityService {
  async getAll(params = {}) {
    const response = await apiClient.get('/financial-entities/', { params });
    return response.data;
  }

  async getById(id) {
    const response = await apiClient.get(`/financial-entities/${id}/`);
    return response.data;
  }

  async create(data) {
    const response = await apiClient.post('/financial-entities/', data);
    return response.data;
  }

  async update(id, data) {
    const response = await apiClient.put(`/financial-entities/${id}/`, data);
    return response.data;
  }

  async partialUpdate(id, data) {
    const response = await apiClient.patch(`/financial-entities/${id}/`, data);
    return response.data;
  }

  async delete(id) {
    const response = await apiClient.delete(`/financial-entities/${id}/`);
    return response.data;
  }

  async search(searchTerm) {
    const response = await apiClient.get('/financial-entities/', {
      params: { search: searchTerm }
    });
    return response.data;
  }
}

export default new FinancialEntityService();
```

### Componente de Lista

```javascript
// src/components/FinancialEntityList.jsx
import React, { useState, useEffect } from 'react';
import financialEntityService from '../services/financialEntityService';

function FinancialEntityList() {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    try {
      const data = await financialEntityService.getAll();
      setEntities(data.results || data);
    } catch (err) {
      setError('Error al cargar las entidades financieras');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta entidad?')) {
      try {
        await financialEntityService.delete(id);
        loadEntities(); // Recargar la lista
      } catch (err) {
        alert('Error al eliminar la entidad');
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Entidades Financieras</h2>
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
          {entities.map((entity) => (
            <tr key={entity.id}>
              <td>{entity.id}</td>
              <td>{entity.description}</td>
              <td>{entity.created_at}</td>
              <td>
                <button onClick={() => handleDelete(entity.id)}>
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

export default FinancialEntityList;
```

---

## 📊 Datos de Prueba

Se han creado 8 entidades financieras de ejemplo:

1. SCOTIABANK PERU
2. BANCO DE LA NACION
3. BBVA
4. BCP - BANCO DE CREDITO DEL PERU
5. INTERBANK
6. BANCO PICHINCHA
7. BANCO GNB
8. MIBANCO

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
http://localhost:8000/api/financial-entities/
```

