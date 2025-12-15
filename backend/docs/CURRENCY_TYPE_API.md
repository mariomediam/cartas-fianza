# API de Tipos de Moneda (CurrencyType)

## Descripción General

Esta API permite gestionar los tipos de moneda (Nuevos Soles, Dólares, Euros, etc.) utilizados en las cartas fianza. Todos los endpoints requieren autenticación mediante token.

**URL Base**: `/api/currency-types/`

---

## Autenticación

Todos los endpoints requieren autenticación mediante Token. Incluye el token en el header de cada petición:

```
Authorization: Token {tu_token_aquí}
```

Para obtener un token, ver la documentación de autenticación en `AUTH_DOCUMENTATION.md`.

---

## Endpoints Disponibles

### 1. Listar Tipos de Moneda
**GET** `/api/currency-types/`

Lista todos los tipos de moneda registrados.

#### Parámetros de Query (opcionales)

- **Búsqueda** (`search`): Busca en description, code, y symbol
  - Ejemplo: `/api/currency-types/?search=PEN`

- **Filtrado** (`description`, `code`): Filtra por campos exactos
  - Ejemplo: `/api/currency-types/?code=USD`

- **Ordenamiento** (`ordering`): Ordena por cualquier campo
  - Campos disponibles: `id`, `description`, `code`, `created_at`, `updated_at`
  - Ejemplo: `/api/currency-types/?ordering=code`
  - Orden descendente: `/api/currency-types/?ordering=-created_at`

#### Ejemplo de Petición (Postman)

```
GET http://localhost:8000/api/currency-types/
Headers:
  Authorization: Token {tu_token}
```

#### Ejemplo de Respuesta

```json
[
    {
        "id": 1,
        "description": "Nuevos Soles",
        "code": "PEN",
        "symbol": "S/.",
        "created_by": 1,
        "created_by_name": "test_user",
        "created_at": "2024-11-12T13:05:35.123456Z",
        "updated_by": null,
        "updated_by_name": null,
        "updated_at": "2024-11-12T13:05:35.123456Z"
    },
    {
        "id": 2,
        "description": "Dólares Americanos",
        "code": "USD",
        "symbol": "$",
        "created_by": 1,
        "created_by_name": "test_user",
        "created_at": "2024-11-12T13:05:35.234567Z",
        "updated_by": null,
        "updated_by_name": null,
        "updated_at": "2024-11-12T13:05:35.234567Z"
    }
]
```

---

### 2. Obtener Tipo de Moneda Específico
**GET** `/api/currency-types/{id}/`

Obtiene los detalles de un tipo de moneda específico.

#### Ejemplo de Petición (Postman)

```
GET http://localhost:8000/api/currency-types/1/
Headers:
  Authorization: Token {tu_token}
```

#### Ejemplo de Respuesta

```json
{
    "id": 1,
    "description": "Nuevos Soles",
    "code": "PEN",
    "symbol": "S/.",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "2024-11-12T13:05:35.123456Z",
    "updated_by": null,
    "updated_by_name": null,
    "updated_at": "2024-11-12T13:05:35.123456Z"
}
```

---

### 3. Crear Tipo de Moneda
**POST** `/api/currency-types/`

Crea un nuevo tipo de moneda.

#### Campos Requeridos

- `description` (string, max 50 caracteres): Descripción de la moneda
- `code` (string, 3 caracteres, único): Código de la moneda (se convertirá a mayúsculas automáticamente)
- `symbol` (string, max 5 caracteres): Símbolo de la moneda

#### Validaciones

- El campo `code` debe tener exactamente 3 caracteres
- El campo `code` debe ser único
- El `code` se convertirá automáticamente a mayúsculas

#### Ejemplo de Petición (Postman)

```
POST http://localhost:8000/api/currency-types/
Headers:
  Authorization: Token {tu_token}
  Content-Type: application/json

Body (raw JSON):
{
    "description": "Libras Esterlinas",
    "code": "gbp",
    "symbol": "£"
}
```

#### Ejemplo de Respuesta

```json
{
    "id": 4,
    "description": "Libras Esterlinas",
    "code": "GBP",
    "symbol": "£",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "2024-11-12T14:30:00.123456Z",
    "updated_by": null,
    "updated_by_name": null,
    "updated_at": "2024-11-12T14:30:00.123456Z"
}
```

---

### 4. Actualizar Tipo de Moneda (Completo)
**PUT** `/api/currency-types/{id}/`

Actualiza completamente un tipo de moneda existente. Se deben enviar todos los campos.

#### Ejemplo de Petición (Postman)

```
PUT http://localhost:8000/api/currency-types/4/
Headers:
  Authorization: Token {tu_token}
  Content-Type: application/json

Body (raw JSON):
{
    "description": "Libras Esterlinas Británicas",
    "code": "GBP",
    "symbol": "£"
}
```

#### Ejemplo de Respuesta

```json
{
    "id": 4,
    "description": "Libras Esterlinas Británicas",
    "code": "GBP",
    "symbol": "£",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "2024-11-12T14:30:00.123456Z",
    "updated_by": 1,
    "updated_by_name": "test_user",
    "updated_at": "2024-11-12T14:35:00.123456Z"
}
```

---

### 5. Actualizar Tipo de Moneda (Parcial)
**PATCH** `/api/currency-types/{id}/`

Actualiza parcialmente un tipo de moneda. Solo se envían los campos que se desean cambiar.

#### Ejemplo de Petición (Postman)

```
PATCH http://localhost:8000/api/currency-types/1/
Headers:
  Authorization: Token {tu_token}
  Content-Type: application/json

Body (raw JSON):
{
    "symbol": "S/ "
}
```

#### Ejemplo de Respuesta

```json
{
    "id": 1,
    "description": "Nuevos Soles",
    "code": "PEN",
    "symbol": "S/ ",
    "created_by": 1,
    "created_by_name": "test_user",
    "created_at": "2024-11-12T13:05:35.123456Z",
    "updated_by": 1,
    "updated_by_name": "test_user",
    "updated_at": "2024-11-12T14:40:00.123456Z"
}
```

---

### 6. Eliminar Tipo de Moneda
**DELETE** `/api/currency-types/{id}/`

Elimina un tipo de moneda. **PRECAUCIÓN**: Esta acción es permanente.

#### Ejemplo de Petición (Postman)

```
DELETE http://localhost:8000/api/currency-types/4/
Headers:
  Authorization: Token {tu_token}
```

#### Ejemplo de Respuesta

Código de estado: `204 No Content` (sin contenido en el body)

---

## Códigos de Moneda Comunes

| Código | Descripción                | Símbolo |
|--------|----------------------------|---------|
| PEN    | Nuevos Soles               | S/.     |
| USD    | Dólares Americanos         | $       |
| EUR    | Euros                      | €       |
| GBP    | Libras Esterlinas          | £       |
| JPY    | Yen Japonés                | ¥       |
| CAD    | Dólar Canadiense           | C$      |
| AUD    | Dólar Australiano          | A$      |
| CHF    | Franco Suizo               | CHF     |

**Nota**: Los códigos de moneda siguen el estándar ISO 4217.

---

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Petición exitosa (GET, PUT, PATCH) |
| 201 | Created - Recurso creado exitosamente (POST) |
| 204 | No Content - Recurso eliminado exitosamente (DELETE) |
| 400 | Bad Request - Error en los datos enviados |
| 401 | Unauthorized - No autenticado o token inválido |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## Ejemplos de Errores

### Error de Validación (400 Bad Request)

```json
{
    "code": [
        "El código debe tener exactamente 3 caracteres"
    ]
}
```

### Error de Autenticación (401 Unauthorized)

```json
{
    "detail": "Las credenciales de autenticación no se proveyeron."
}
```

### Error de No Encontrado (404 Not Found)

```json
{
    "detail": "No encontrado."
}
```

### Error de Código Duplicado (400 Bad Request)

```json
{
    "code": [
        "currency type con este Código ya existe."
    ]
}
```

---

## Uso en React

### Configuración del Cliente

```javascript
// api/currencyTypeApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Crear instancia de axios con configuración por defecto
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token en cada petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Listar tipos de moneda
export const getCurrencyTypes = async (params = {}) => {
    const response = await api.get('/currency-types/', { params });
    return response.data;
};

// Obtener tipo de moneda por ID
export const getCurrencyType = async (id) => {
    const response = await api.get(`/currency-types/${id}/`);
    return response.data;
};

// Crear tipo de moneda
export const createCurrencyType = async (data) => {
    const response = await api.post('/currency-types/', data);
    return response.data;
};

// Actualizar tipo de moneda (completo)
export const updateCurrencyType = async (id, data) => {
    const response = await api.put(`/currency-types/${id}/`, data);
    return response.data;
};

// Actualizar tipo de moneda (parcial)
export const patchCurrencyType = async (id, data) => {
    const response = await api.patch(`/currency-types/${id}/`, data);
    return response.data;
};

// Eliminar tipo de moneda
export const deleteCurrencyType = async (id) => {
    const response = await api.delete(`/currency-types/${id}/`);
    return response.data;
};

export default api;
```

### Componente de Ejemplo

```javascript
// components/CurrencyTypeList.jsx
import React, { useState, useEffect } from 'react';
import { getCurrencyTypes, createCurrencyType, deleteCurrencyType } from '../api/currencyTypeApi';

const CurrencyTypeList = () => {
    const [currencyTypes, setCurrencyTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Formulario para nuevo tipo de moneda
    const [newCurrencyType, setNewCurrencyType] = useState({
        description: '',
        code: '',
        symbol: ''
    });

    // Cargar tipos de moneda al montar el componente
    useEffect(() => {
        loadCurrencyTypes();
    }, []);

    const loadCurrencyTypes = async () => {
        try {
            setLoading(true);
            const data = await getCurrencyTypes({ ordering: 'description' });
            setCurrencyTypes(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los tipos de moneda');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCurrencyType(newCurrencyType);
            setNewCurrencyType({ description: '', code: '', symbol: '' });
            loadCurrencyTypes();
        } catch (err) {
            setError('Error al crear el tipo de moneda');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este tipo de moneda?')) {
            try {
                await deleteCurrencyType(id);
                loadCurrencyTypes();
            } catch (err) {
                setError('Error al eliminar el tipo de moneda');
                console.error(err);
            }
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div>
            <h2>Tipos de Moneda</h2>
            
            {/* Formulario para crear nuevo tipo de moneda */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Descripción (ej: Nuevos Soles)"
                    value={newCurrencyType.description}
                    onChange={(e) => setNewCurrencyType({...newCurrencyType, description: e.target.value})}
                    required
                    maxLength={50}
                />
                <input
                    type="text"
                    placeholder="Código (ej: PEN)"
                    value={newCurrencyType.code}
                    onChange={(e) => setNewCurrencyType({...newCurrencyType, code: e.target.value})}
                    required
                    maxLength={3}
                />
                <input
                    type="text"
                    placeholder="Símbolo (ej: S/.)"
                    value={newCurrencyType.symbol}
                    onChange={(e) => setNewCurrencyType({...newCurrencyType, symbol: e.target.value})}
                    required
                    maxLength={5}
                />
                <button type="submit">Crear Tipo de Moneda</button>
            </form>

            {/* Lista de tipos de moneda */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descripción</th>
                        <th>Código</th>
                        <th>Símbolo</th>
                        <th>Creado por</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currencyTypes.map((currencyType) => (
                        <tr key={currencyType.id}>
                            <td>{currencyType.id}</td>
                            <td>{currencyType.description}</td>
                            <td>{currencyType.code}</td>
                            <td>{currencyType.symbol}</td>
                            <td>{currencyType.created_by_name}</td>
                            <td>
                                <button onClick={() => handleDelete(currencyType.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CurrencyTypeList;
```

### Hook Personalizado

```javascript
// hooks/useCurrencyTypes.js
import { useState, useEffect } from 'react';
import { getCurrencyTypes } from '../api/currencyTypeApi';

export const useCurrencyTypes = () => {
    const [currencyTypes, setCurrencyTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrencyTypes = async () => {
            try {
                setLoading(true);
                const data = await getCurrencyTypes({ ordering: 'description' });
                setCurrencyTypes(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrencyTypes();
    }, []);

    return { currencyTypes, loading, error };
};
```

---

## Notas Importantes

1. **Autenticación**: Todos los endpoints requieren autenticación mediante token.

2. **Código de Moneda**: 
   - Debe tener exactamente 3 caracteres
   - Se convertirá automáticamente a mayúsculas
   - Debe ser único en el sistema

3. **Estándar ISO 4217**: Se recomienda usar códigos de moneda según el estándar ISO 4217.

4. **Auditoría**: Los campos `created_by`, `created_at`, `updated_by` y `updated_at` se gestionan automáticamente.

5. **Eliminación**: Ten cuidado al eliminar tipos de moneda que puedan estar siendo utilizados por cartas fianza existentes.

6. **Formato de fechas**: Las fechas se devuelven en formato ISO 8601 (UTC) y deben mostrarse según tu configuración local [[memory:2499711]] en formato dd/mm/yyyy HH:MM.

---

## Pruebas con Postman

1. Asegúrate de tener un token válido (ver `AUTH_DOCUMENTATION.md`)
2. Agrega el token en el header: `Authorization: Token {tu_token}`
3. Prueba primero el endpoint GET para verificar la conexión
4. Luego prueba crear un tipo de moneda con POST
5. Verifica que se apliquen las validaciones correctamente

---

## Soporte

Para más información sobre autenticación, consulta `AUTH_DOCUMENTATION.md`.

