# 🔐 Documentación del Sistema de Login

## ✅ Implementación Completada

Se ha implementado un sistema completo de autenticación con las siguientes características:

### 📋 Características Implementadas

1. **Formulario de Login Responsive**
   - ✅ Diseño moderno y profesional
   - ✅ Logo de la Universidad Nacional de Frontera
   - ✅ Validación de campos
   - ✅ Mensajes de error claros
   - ✅ Imagen lateral de oficina (oculta en móviles)

2. **Autenticación con Token**
   - ✅ Integración con API de Django (`/api/auth/login/`)
   - ✅ Almacenamiento seguro del token en localStorage
   - ✅ Interceptor automático para agregar token a las peticiones
   - ✅ Manejo de sesiones expiradas

3. **Rutas Protegidas**
   - ✅ Sistema de rutas privadas
   - ✅ Redirección automática al login si no está autenticado
   - ✅ Redirección al dashboard después del login

4. **Dashboard**
   - ✅ Página de inicio después del login
   - ✅ Información del usuario
   - ✅ Botón de cerrar sesión
   - ✅ Diseño responsive

## 🚀 Cómo Usar

### 1. Acceder al Sistema

Abre tu navegador y visita:
```
http://localhost:3000
```

### 2. Credenciales de Prueba

Usa estas credenciales para iniciar sesión:

```
Usuario: test_user
Contraseña: testpass123
```

### 3. Flujo de Autenticación

1. **Login**: Ingresa tus credenciales en la página de login
2. **Validación**: El sistema valida las credenciales con el backend
3. **Token**: Se genera y almacena un token de autenticación
4. **Redirección**: Automáticamente se redirige al dashboard
5. **Sesión**: El token se incluye automáticamente en todas las peticiones

### 4. Cerrar Sesión

Haz clic en el botón "Cerrar Sesión" en el dashboard para:
- Eliminar el token del servidor
- Limpiar el localStorage
- Redirigir al login

## 📱 Diseño Responsive

El formulario de login es completamente responsive:

- **Desktop (> 968px)**: 
  - Formulario a la izquierda
  - Imagen de oficina a la derecha
  - Layout de dos columnas

- **Tablet (< 968px)**:
  - La imagen desaparece
  - Formulario ocupa toda la pantalla
  - Layout de una columna

- **Mobile (< 480px)**:
  - Diseño optimizado para móviles
  - Campos más compactos
  - Texto más pequeño

## 🛠️ Estructura de Archivos

```
frontend/src/
├── components/
│   └── PrivateRoute.js          # Componente de ruta protegida
├── context/
│   └── AuthContext.js           # Contexto de autenticación global
├── pages/
│   ├── Login.js                 # Página de login
│   ├── Login.css                # Estilos del login
│   ├── Dashboard.js             # Dashboard principal
│   └── Dashboard.css            # Estilos del dashboard
├── services/
│   └── api.js                   # Servicio de API y autenticación
└── App.js                       # Configuración de rutas
```

## 🔧 API Endpoints Utilizados

### Login
```
POST /api/auth/login/
Body: {
  "username": "test_user",
  "password": "testpass123"
}

Response: {
  "token": "abc123...",
  "user_id": 1,
  "username": "test_user",
  "email": "test@example.com",
  "first_name": "",
  "last_name": ""
}
```

### Logout
```
POST /api/auth/logout/
Headers: {
  "Authorization": "Token abc123..."
}

Response: {
  "message": "Sesión cerrada exitosamente"
}
```

### Obtener Usuario Actual
```
GET /api/auth/me/
Headers: {
  "Authorization": "Token abc123..."
}

Response: {
  "user_id": 1,
  "username": "test_user",
  "email": "test@example.com",
  ...
}
```

## 🔐 Seguridad

### Token Storage
- El token se almacena en `localStorage`
- Se incluye automáticamente en todas las peticiones mediante interceptor
- Se elimina automáticamente al cerrar sesión o cuando expira

### Interceptor de Axios
```javascript
// Agrega el token a cada petición
config.headers.Authorization = `Token ${token}`;

// Maneja errores 401 (no autorizado)
if (error.response?.status === 401) {
  // Redirige al login automáticamente
}
```

### Rutas Protegidas
- Las rutas privadas verifican autenticación antes de renderizar
- Redirección automática al login si no hay token válido
- Estado de carga mientras se verifica la autenticación

## 📝 Próximos Pasos

Para continuar con el desarrollo:

1. **Agregar más páginas**: Cartas Fianza, Entidades, Contratistas, etc.
2. **Implementar CRUD**: Operaciones completas para cada módulo
3. **Mejorar Dashboard**: Agregar estadísticas y gráficos
4. **Perfil de Usuario**: Página para editar información del usuario
5. **Cambio de Contraseña**: Funcionalidad para cambiar contraseña
6. **Recuperación de Contraseña**: Sistema de reset de contraseña

## 🎨 Personalización

### Cambiar Colores
Edita los colores en `Login.css` y `Dashboard.css`:

```css
/* Color principal */
#2c5f8d  /* Azul de la universidad */

/* Color secundario */
#4a9d5f  /* Verde */

/* Color de botones */
#0d1b2a  /* Azul oscuro */
```

### Cambiar Imagen de Login
Edita la URL de la imagen en `Login.css`:

```css
.login-right {
  background-image: url('tu-nueva-imagen-url');
}
```

## 🐛 Solución de Problemas

### Error: "Credenciales inválidas"
- Verifica que el usuario exista en la base de datos
- Confirma que el backend esté corriendo en `http://localhost:8000`
- Revisa las credenciales: `test_user` / `testpass123`

### Error: Network Error
- Verifica que el backend esté corriendo
- Confirma que CORS esté configurado correctamente
- Revisa la variable `REACT_APP_API_URL` en `.env`

### No redirige al dashboard
- Abre la consola del navegador para ver errores
- Verifica que el token se esté guardando en localStorage
- Confirma que las rutas estén bien configuradas

## 📞 Soporte

Para más información sobre la API, consulta:
- `backend/apps/cartas_fianzas/AUTH_DOCUMENTATION.md`
- `backend/README.md`

---

**Desarrollado para la Universidad Nacional de Frontera - Sullana**

