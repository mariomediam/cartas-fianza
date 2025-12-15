# Documentación de Autenticación - Sistema de Cartas Fianzas

## 🔐 Sistema de Token Authentication

El sistema utiliza **Token Authentication** para permitir que aplicaciones frontend (como React) se autentiquen de forma segura.

---

## 📍 Endpoints de Autenticación

### 1. Login (Obtener Token)
**POST** `/api/auth/login/`

Autentica al usuario y retorna un token de acceso.

**Body (JSON):**
```json
{
    "username": "test_user",
    "password": "testpass123"
}
```

**Respuesta exitosa (200 OK):**
```json
{
    "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
    "user_id": 1,
    "username": "test_user",
    "email": "test@example.com",
    "first_name": "",
    "last_name": ""
}
```

**Respuesta de error (401 Unauthorized):**
```json
{
    "error": "Credenciales inválidas"
}
```

---

### 2. Logout (Eliminar Token)
**POST** `/api/auth/logout/`

Cierra la sesión del usuario eliminando su token.

**Headers requeridos:**
```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

**Respuesta exitosa (200 OK):**
```json
{
    "message": "Sesión cerrada exitosamente"
}
```

---

### 3. Obtener información del usuario
**GET** `/api/auth/me/`

Obtiene información del usuario autenticado actualmente.

**Headers requeridos:**
```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

**Respuesta exitosa (200 OK):**
```json
{
    "user_id": 1,
    "username": "test_user",
    "email": "test@example.com",
    "first_name": "",
    "last_name": "",
    "is_staff": false,
    "is_superuser": false
}
```

---

## 🧪 Cómo probar en Postman

### Paso 1: Login

1. **Método:** POST
2. **URL:** `http://localhost:8000/api/auth/login/`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body (raw JSON):**
   ```json
   {
       "username": "test_user",
       "password": "testpass123"
   }
   ```
5. **Enviar** y copiar el `token` de la respuesta

### Paso 2: Usar el Token en otras peticiones

1. **Método:** GET
2. **URL:** `http://localhost:8000/api/letter-types/`
3. **Headers:**
   - `Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b`
4. **Enviar**

**💡 Tip:** En Postman, ve a la pestaña "Authorization", selecciona "API Key" y configura:
- Key: `Authorization`
- Value: `Token tu-token-aqui`
- Add to: `Header`

---

## ⚛️ Cómo usar desde React

### 1. Instalación de dependencias

```bash
npm install axios
# o
npm install fetch
```

### 2. Servicio de Autenticación (authService.js)

```javascript
// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

class AuthService {
  async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login/`, {
        username,
        password
      });
      
      if (response.data.token) {
        // Guardar el token en localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  async logout() {
    const token = this.getToken();
    
    if (token) {
      try {
        await axios.post(
          `${API_URL}/auth/logout/`,
          {},
          {
            headers: { Authorization: `Token ${token}` }
          }
        );
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
```

### 3. Interceptor de Axios (apiClient.js)

```javascript
// src/services/apiClient.js
import axios from 'axios';
import authService from './authService';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Agregar el token automáticamente a todas las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 4. Servicio de Letter Types (letterTypeService.js)

```javascript
// src/services/letterTypeService.js
import apiClient from './apiClient';

class LetterTypeService {
  async getAll() {
    const response = await apiClient.get('/letter-types/');
    return response.data;
  }

  async getById(id) {
    const response = await apiClient.get(`/letter-types/${id}/`);
    return response.data;
  }

  async create(data) {
    const response = await apiClient.post('/letter-types/', data);
    return response.data;
  }

  async update(id, data) {
    const response = await apiClient.put(`/letter-types/${id}/`, data);
    return response.data;
  }

  async delete(id) {
    const response = await apiClient.delete(`/letter-types/${id}/`);
    return response.data;
  }

  async search(searchTerm) {
    const response = await apiClient.get(`/letter-types/?search=${searchTerm}`);
    return response.data;
  }
}

export default new LetterTypeService();
```

### 5. Componente de Login

```javascript
// src/components/Login.jsx
import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(username, password);
      navigate('/dashboard'); // Redirigir al dashboard
    } catch (err) {
      setError(err.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}

export default Login;
```

### 6. Componente de Lista de Letter Types

```javascript
// src/components/LetterTypeList.jsx
import React, { useState, useEffect } from 'react';
import letterTypeService from '../services/letterTypeService';

function LetterTypeList() {
  const [letterTypes, setLetterTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLetterTypes();
  }, []);

  const loadLetterTypes = async () => {
    try {
      const data = await letterTypeService.getAll();
      setLetterTypes(data.results || data);
    } catch (err) {
      setError('Error al cargar los tipos de carta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Tipos de Carta</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Fecha de Creación</th>
          </tr>
        </thead>
        <tbody>
          {letterTypes.map((type) => (
            <tr key={type.id}>
              <td>{type.id}</td>
              <td>{type.description}</td>
              <td>{type.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LetterTypeList;
```

### 7. Ruta Protegida (PrivateRoute)

```javascript
// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

function PrivateRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
```

---

## 🔒 Seguridad

### Mejores Prácticas:

1. **HTTPS en producción:** Siempre usa HTTPS para transmitir tokens
2. **No expongas el token:** Nunca lo incluyas en URLs o logs
3. **Expira sesiones:** Considera implementar tokens con expiración (JWT)
4. **Almacenamiento seguro:** localStorage es vulnerable a XSS, considera alternativas más seguras
5. **Validación:** Siempre valida los tokens en el backend

### Configuración de CORS:

Asegúrate de que tu frontend esté en `CORS_ALLOWED_ORIGINS` en `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React development
    "http://127.0.0.1:3000",
]
```

---

## 📝 Resumen del Flujo

1. **Usuario ingresa credenciales** en el formulario de login
2. **Frontend envía POST** a `/api/auth/login/`
3. **Backend valida** y retorna token
4. **Frontend guarda token** en localStorage
5. **Todas las peticiones posteriores** incluyen el header `Authorization: Token xxx`
6. **Backend valida el token** en cada petición
7. **Usuario cierra sesión:** POST a `/api/auth/logout/` y se elimina el token

---

## 🧪 Credenciales de Prueba

```
Username: test_user
Password: testpass123
```

---

## 🚀 Siguiente Paso

Ahora puedes usar el token para hacer peticiones a cualquier endpoint protegido:

```bash
# Obtener todos los letter types
curl -H "Authorization: Token tu-token-aqui" \
  http://localhost:8000/api/letter-types/

# Crear un nuevo letter type
curl -H "Authorization: Token tu-token-aqui" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"description":"Nuevo tipo"}' \
  http://localhost:8000/api/letter-types/
```

