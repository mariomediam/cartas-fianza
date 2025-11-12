# API Documentation - Contractor (Contratistas)

## 📍 Endpoints Disponibles

### 1. Listar todos los contratistas
**GET** `/api/contractors/`

Retorna una lista paginada de todos los contratistas.

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
            "business_name": "CONSTRUCTORA ABC S.A.C.",
            "ruc": "20123456789",
            "created_by": 1,
            "created_by_name": "test_user",
            "created_at": "12/11/2025 16:58",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "12/11/2025 16:58"
        },
        {
            "id": 2,
            "business_name": "INGENIEROS ASOCIADOS S.A.",
            "ruc": "20234567890",
            "created_by": 1,
            "created_by_name": "test_user",
            "created_at": "12/11/2025 16:58",
            "updated_by": null,
            "updated_by_name": null,
            "updated_at": "12/11/2025 16:58"
        }
    ]
}
```

---

### 2. Obtener un contratista específico
**GET** `/api/contractors/{id}/`

Retorna los detalles de un contratista específico.

**Parámetros:**
- `id` (path) - ID del contratista

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "business_name": "CONSTRUCTORA ABC S.A.C.",
    "ruc": "20123456789",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 16:58",
    "updated_by": null,
    "updated_by_name": null,
    "updated_at": "12/11/2025 16:58"
}
```

---

### 3. Crear un nuevo contratista
**POST** `/api/contractors/`

Crea un nuevo contratista.

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "business_name": "CONSTRUCCIONES DEL SUR S.A.",
    "ruc": "20789012345"
}
```

**Validaciones:**
- `ruc`: Debe tener exactamente 11 dígitos numéricos
- `ruc`: Debe ser único en el sistema
- `business_name`: Campo requerido

**Respuesta exitosa (201 Created):**
```json
{
    "id": 7,
    "business_name": "CONSTRUCCIONES DEL SUR S.A.",
    "ruc": "20789012345",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 17:15",
    "updated_by": null,
    "updated_by_name": null,
    "updated_at": "12/11/2025 17:15"
}
```

**Respuesta de error (400 Bad Request):**
```json
{
    "ruc": [
        "El RUC debe tener exactamente 11 dígitos"
    ]
}
```

---

### 4. Actualizar completamente un contratista
**PUT** `/api/contractors/{id}/`

Actualiza todos los campos de un contratista.

**Parámetros:**
- `id` (path) - ID del contratista

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "business_name": "CONSTRUCTORA ABC PERU S.A.C.",
    "ruc": "20123456789"
}
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "business_name": "CONSTRUCTORA ABC PERU S.A.C.",
    "ruc": "20123456789",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 16:58",
    "updated_by": 1,
    "updated_by_name": "test_user",
    "updated_at": "12/11/2025 17:20"
}
```

---

### 5. Actualizar parcialmente un contratista
**PATCH** `/api/contractors/{id}/`

Actualiza solo los campos especificados.

**Parámetros:**
- `id` (path) - ID del contratista

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "business_name": "CONSTRUCTORA ABC PERU S.A.C."
}
```

**Respuesta exitosa (200 OK):**
```json
{
    "id": 1,
    "business_name": "CONSTRUCTORA ABC PERU S.A.C.",
    "ruc": "20123456789",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "12/11/2025 16:58",
    "updated_by": 1,
    "updated_by_name": "test_user",
    "updated_at": "12/11/2025 17:25"
}
```

---

### 6. Eliminar un contratista
**DELETE** `/api/contractors/{id}/`

Elimina un contratista.

**Parámetros:**
- `id` (path) - ID del contratista

**Headers requeridos:**
```
Authorization: Token tu-token-aqui
```

**Respuesta exitosa (204 No Content)**

**Nota:** Solo se puede eliminar un contratista si no tiene garantías asociadas.

---

## 🔍 Filtros y Búsqueda

### Búsqueda por nombre o RUC
```
GET /api/contractors/?search=constructora
GET /api/contractors/?search=20123456789
GET /api/contractors/?search=ABC
```

### Filtrar por nombre exacto
```
GET /api/contractors/?business_name=CONSTRUCTORA%20ABC%20S.A.C.
```

### Filtrar por RUC exacto
```
GET /api/contractors/?ruc=20123456789
```

### Ordenamiento
```
GET /api/contractors/?ordering=business_name      # Ascendente (A-Z)
GET /api/contractors/?ordering=-business_name     # Descendente (Z-A)
GET /api/contractors/?ordering=ruc                # Por RUC ascendente
GET /api/contractors/?ordering=-created_at        # Por fecha de creación (más reciente primero)
```

### Paginación
```
GET /api/contractors/?page=2
GET /api/contractors/?page_size=10
```

### Combinación de filtros
```
GET /api/contractors/?search=constructora&ordering=business_name&page_size=5
```

---

## 🧪 Ejemplos con cURL

### Listar todos los contratistas
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  http://localhost:8000/api/contractors/
```

### Obtener un contratista específico
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  http://localhost:8000/api/contractors/1/
```

### Crear un nuevo contratista
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"business_name":"CONSTRUCCIONES DEL SUR S.A.","ruc":"20789012345"}' \
  http://localhost:8000/api/contractors/
```

### Actualizar un contratista
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  -H "Content-Type: application/json" \
  -X PUT \
  -d '{"business_name":"CONSTRUCTORA ABC PERU S.A.C.","ruc":"20123456789"}' \
  http://localhost:8000/api/contractors/1/
```

### Buscar contratistas
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  "http://localhost:8000/api/contractors/?search=constructora"
```

### Eliminar un contratista
```bash
curl -H "Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8" \
  -X DELETE \
  http://localhost:8000/api/contractors/1/
```

---

## 🧪 Uso en Postman

### Configuración de Headers:

Para todas las peticiones, agrega:

| Key | Value |
|-----|-------|
| `Authorization` | `Token 530e8ab5db1624045f20a7bc98a4022169297fc8` |
| `Content-Type` | `application/json` (solo para POST, PUT, PATCH) |

### Ejemplo de Body para crear contratista:

```json
{
    "business_name": "CONSTRUCCIONES DEL SUR S.A.",
    "ruc": "20789012345"
}
```

---

## ⚛️ Uso desde React

### Servicio de Contratistas

```javascript
// src/services/contractorService.js
import apiClient from './apiClient';

class ContractorService {
  async getAll(params = {}) {
    const response = await apiClient.get('/contractors/', { params });
    return response.data;
  }

  async getById(id) {
    const response = await apiClient.get(`/contractors/${id}/`);
    return response.data;
  }

  async create(data) {
    const response = await apiClient.post('/contractors/', data);
    return response.data;
  }

  async update(id, data) {
    const response = await apiClient.put(`/contractors/${id}/`, data);
    return response.data;
  }

  async partialUpdate(id, data) {
    const response = await apiClient.patch(`/contractors/${id}/`, data);
    return response.data;
  }

  async delete(id) {
    const response = await apiClient.delete(`/contractors/${id}/`);
    return response.data;
  }

  async search(searchTerm) {
    const response = await apiClient.get('/contractors/', {
      params: { search: searchTerm }
    });
    return response.data;
  }

  async findByRuc(ruc) {
    const response = await apiClient.get('/contractors/', {
      params: { ruc }
    });
    return response.data;
  }
}

export default new ContractorService();
```

### Componente de Formulario

```javascript
// src/components/ContractorForm.jsx
import React, { useState } from 'react';
import contractorService from '../services/contractorService';

function ContractorForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    business_name: '',
    ruc: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateRuc = (ruc) => {
    if (!/^\d{11}$/.test(ruc)) {
      return 'El RUC debe tener exactamente 11 dígitos';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validación local
    const rucError = validateRuc(formData.ruc);
    if (rucError) {
      setErrors({ ruc: rucError });
      return;
    }

    setLoading(true);

    try {
      const newContractor = await contractorService.create(formData);
      alert('Contratista creado exitosamente');
      setFormData({ business_name: '', ruc: '' });
      if (onSuccess) onSuccess(newContractor);
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        alert('Error al crear el contratista');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Razón Social / Nombre:</label>
        <input
          type="text"
          name="business_name"
          value={formData.business_name}
          onChange={handleChange}
          required
          maxLength={255}
        />
        {errors.business_name && (
          <span className="error">{errors.business_name}</span>
        )}
      </div>

      <div>
        <label>RUC:</label>
        <input
          type="text"
          name="ruc"
          value={formData.ruc}
          onChange={handleChange}
          required
          maxLength={11}
          pattern="\d{11}"
          placeholder="12345678901"
        />
        {errors.ruc && (
          <span className="error">{errors.ruc}</span>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Crear Contratista'}
      </button>
    </form>
  );
}

export default ContractorForm;
```

### Componente de Lista

```javascript
// src/components/ContractorList.jsx
import React, { useState, useEffect } from 'react';
import contractorService from '../services/contractorService';

function ContractorList() {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContractors();
  }, []);

  const loadContractors = async () => {
    try {
      const data = await contractorService.getAll();
      setContractors(data.results || data);
    } catch (err) {
      console.error('Error al cargar contratistas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await contractorService.search(searchTerm);
      setContractors(data.results || data);
    } catch (err) {
      console.error('Error en la búsqueda:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este contratista?')) {
      try {
        await contractorService.delete(id);
        loadContractors();
      } catch (err) {
        alert('Error al eliminar el contratista');
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Contratistas</h2>
      
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar por nombre o RUC..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Buscar</button>
        <button type="button" onClick={loadContractors}>
          Ver Todos
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Razón Social / Nombre</th>
            <th>RUC</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contractors.map((contractor) => (
            <tr key={contractor.id}>
              <td>{contractor.id}</td>
              <td>{contractor.business_name}</td>
              <td>{contractor.ruc}</td>
              <td>{contractor.created_at}</td>
              <td>
                <button onClick={() => handleDelete(contractor.id)}>
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

export default ContractorList;
```

---

## 📊 Datos de Prueba

Se han creado 6 contratistas de ejemplo:

1. CONSTRUCTORA ABC S.A.C. - RUC: 20123456789
2. INGENIEROS ASOCIADOS S.A. - RUC: 20234567890
3. CONSORCIO INFRAESTRUCTURA PERU - RUC: 20345678901
4. EMPRESA DE SERVICIOS GENERALES XYZ E.I.R.L. - RUC: 20456789012
5. CONSTRUCTORA LOS ANDES S.A. - RUC: 20567890123
6. CORPORACION DE OBRAS CIVILES - RUC: 20678901234

---

## ✅ Validaciones del RUC

El RUC (Registro Único de Contribuyentes) en Perú tiene las siguientes validaciones:

- Debe tener exactamente **11 dígitos**
- Solo debe contener **números**
- Debe ser **único** en el sistema
- Es un campo **obligatorio**

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
http://localhost:8000/api/contractors/
```

