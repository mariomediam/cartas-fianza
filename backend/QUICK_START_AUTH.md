# Inicio Rápido - Autenticación con Token

## 🚀 Para Postman (AHORA)

### Opción 1: Usar Token Directo

1. **Headers** en todas las peticiones a `/api/letter-types/`:
   ```
   Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8
   ```

2. **Prueba:**
   - Método: GET
   - URL: `http://localhost:8000/api/letter-types/`
   - Header: `Authorization: Token 530e8ab5db1624045f20a7bc98a4022169297fc8`

### Opción 2: Login para obtener tu propio token

1. **Login:**
   - Método: POST
   - URL: `http://localhost:8000/api/auth/login/`
   - Body (JSON):
     ```json
     {
         "username": "test_user",
         "password": "testpass123"
     }
     ```
   - Respuesta te dará un token nuevo

2. **Usar el token** en tus peticiones:
   - Header: `Authorization: Token el-token-que-recibiste`

---

## ⚛️ Para React (DESPUÉS)

### 1. Crear servicio de autenticación (`authService.js`):

```javascript
// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

class AuthService {
  async login(username, password) {
    const response = await axios.post(`${API_URL}/auth/login/`, {
      username,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
```

### 2. Crear cliente API (`apiClient.js`):

```javascript
// src/services/apiClient.js
import axios from 'axios';
import authService from './authService';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Agregar token automáticamente
apiClient.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default apiClient;
```

### 3. Usar en componentes:

```javascript
import apiClient from './services/apiClient';

// Obtener letter types
const response = await apiClient.get('/letter-types/');

// Crear letter type
const newType = await apiClient.post('/letter-types/', {
  description: 'Nuevo tipo'
});
```

---

## 📋 Endpoints Disponibles

### Autenticación:
- `POST /api/auth/login/` - Obtener token
- `POST /api/auth/logout/` - Cerrar sesión
- `GET /api/auth/me/` - Info del usuario

### Letter Types:
- `GET /api/letter-types/` - Listar todos
- `POST /api/letter-types/` - Crear nuevo
- `GET /api/letter-types/{id}/` - Obtener uno
- `PUT /api/letter-types/{id}/` - Actualizar
- `DELETE /api/letter-types/{id}/` - Eliminar

---

## ✅ Credenciales de Prueba

```
Username: test_user
Password: testpass123
Token: 530e8ab5db1624045f20a7bc98a4022169297fc8
```

---

## 📚 Documentación Completa

Ver `AUTH_DOCUMENTATION.md` para más detalles y ejemplos completos con React.

