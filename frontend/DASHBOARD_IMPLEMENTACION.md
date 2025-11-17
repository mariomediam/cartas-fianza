# 📊 Implementación del Dashboard Principal

## 🎯 Objetivo

Implementar el dashboard principal del Sistema de Gestión de Cartas Fianza con navegación completa, estadísticas en tiempo real y tabla de alertas.

---

## ✅ Características Implementadas

### 1️⃣ Componente Layout (Navegación Principal)

**Archivo:** `frontend/src/components/Layout.js`

#### Navbar con 5 Menús Principales:

1. **🏠 Inicio** - Lleva al dashboard principal
2. **📚 Catálogos** - Menú desplegable con submenús:
   - Objetos de Garantía
   - Tipos de Carta
   - Entidades Financieras
   - Contratistas
   - Estados de Garantía
   - Tipos de Moneda

3. **📋 Cartas fianza** - Administración de cartas fianza

4. **📊 Reportes** - Menú desplegable con submenús:
   - Reporte General
   - Cartas Vencidas
   - Cartas por Vencer
   - Por Entidad Financiera
   - Por Contratista

5. **👥 Usuarios** - Administración de usuarios

#### Avatar del Usuario:
- ✅ Muestra iniciales del usuario
- ✅ Dropdown al hacer clic/hover
- ✅ Muestra nombre completo
- ✅ Muestra email
- ✅ Botón de cerrar sesión

#### Responsive:
- ✅ Menú completo en desktop
- ✅ Menú hamburguesa en móvil
- ✅ Submenús desplegables

---

### 2️⃣ Dashboard Principal

**Archivo:** `frontend/src/pages/Dashboard.js`

#### Tarjetas de Estadísticas:

1. **🔴 Cartas Vencidas**
   - Endpoint: `/api/warranties/vencidas/`
   - Muestra total de cartas vencidas
   - Color rojo (border-red-500)
   - Icono de alerta
   - Mensaje: "Requieren gestión urgente"

2. **🟡 Cartas Por Vencer (1-15 días)**
   - Endpoint: `/api/warranties/por-vencer/`
   - Muestra total de cartas próximas a vencer
   - Color amarillo (border-yellow-500)
   - Icono de advertencia
   - Mensaje: "Requieren atención próximamente"

3. **🟢 Cartas Vigentes (>15 días)**
   - Endpoint: `/api/warranties/vigentes/`
   - Muestra total de cartas vigentes
   - Color verde (border-green-500)
   - Icono de check
   - Mensaje: "En buen estado"

#### Tabla de Cartas Críticas:

Muestra listado combinado de cartas vencidas y por vencer con 4 columnas:

| Columna | Descripción | Campo API |
|---------|-------------|-----------|
| **Objeto de la carta** | Tipo de garantía | `warranty_object_description` |
| **Número** | Tipo + Número de carta | `letter_type_description` + `letter_number` |
| **Vencimiento** | Fecha de vencimiento | `validity_end` (formateado DD/MM/YYYY) |
| **Estado** | Tiempo vencido/restante | `time_expired` o `time_remaining` |

**Características de la tabla:**
- ✅ Ordenada por fecha de vencimiento
- ✅ Hover effect en las filas
- ✅ Badges de color según estado:
  - Rojo para vencidas
  - Amarillo para por vencer
- ✅ Responsive (scroll horizontal en móvil)
- ✅ Mensaje cuando no hay cartas críticas

---

### 3️⃣ Mejoras en la Gestión de Tokens

**Archivo:** `frontend/src/services/api.js`

#### Cambios Realizados:

1. **Interceptor de Request mejorado:**
   ```javascript
   // Lee el token del storage de Zustand (auth-storage)
   const authStorage = localStorage.getItem('auth-storage');
   if (authStorage) {
     const { state } = JSON.parse(authStorage);
     if (state?.token) {
       config.headers.Authorization = `Token ${state.token}`;
     }
   }
   ```

2. **Interceptor de Response mejorado:**
   ```javascript
   // Limpia el storage de Zustand al recibir 401
   if (error.response?.status === 401 && !error.config.url.includes('/auth/login/')) {
     localStorage.removeItem('auth-storage');
     window.location.href = '/login';
   }
   ```

3. **Logout Service mejorado:**
   ```javascript
   logout: async () => {
     try {
       const response = await api.post('/auth/logout/');
       return response.data;
     } finally {
       localStorage.removeItem('auth-storage');
     }
   }
   ```

---

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
- ✅ `frontend/src/components/Layout.js` (300+ líneas)

### Archivos Modificados:
- ✅ `frontend/src/pages/Dashboard.js` (refactorización completa - 248 líneas)
- ✅ `frontend/src/services/api.js` (mejoras en gestión de tokens)

---

## 🎨 Diseño Visual

### Colores Utilizados:

| Elemento | Color Tailwind | Hex |
|----------|----------------|-----|
| Navbar | `primary-600` a `primary-700` | Gradiente azul |
| Vencidas | `red-500` | #EF4444 |
| Por Vencer | `yellow-500` | #F59E0B |
| Vigentes | `green-500` | #10B981 |
| Avatar | `secondary-400` a `secondary-600` | Gradiente naranja |

### Efectos y Animaciones:

- ✅ Hover effects en tarjetas de estadísticas
- ✅ Transiciones suaves en menús desplegables
- ✅ Loading spinner durante carga de datos
- ✅ Hover effects en filas de la tabla
- ✅ Shadow elevation en elementos interactivos

---

## 🔌 Integración con API

### Endpoints Consumidos:

```javascript
// Obtener datos en paralelo
const [vencidasRes, porVencerRes, vigentesRes] = await Promise.all([
  api.get('/warranties/vencidas/'),     // Lista completa
  api.get('/warranties/por-vencer/'),    // Lista completa
  api.get('/warranties/vigentes/')       // Solo conteo
]);
```

### Estructura de Datos:

**Respuesta de `/vencidas/` y `/por-vencer/`:**
```json
{
  "count": 5,
  "results": [
    {
      "warranty_id": 10,
      "warranty_object_description": "Fiel Cumplimiento",
      "letter_type_description": "Fianza Solidaria",
      "letter_number": "CF-2024-010",
      "validity_end": "2024-12-31",
      "time_expired": "10 meses, 17 días",      // Solo en vencidas
      "time_remaining": "3 días"                // Solo en por vencer
    }
  ]
}
```

**Respuesta de `/vigentes/`:**
```json
{
  "count": 128
}
```

---

## 📱 Responsive Design

### Breakpoints:

| Tamaño | Comportamiento |
|--------|----------------|
| **Mobile (<640px)** | 1 columna, menú hamburguesa |
| **Tablet (640px-1024px)** | 2 columnas, menú completo |
| **Desktop (>1024px)** | 3 columnas, menú completo con dropdowns |

### Características Responsive:

- ✅ Navbar se convierte en menú móvil
- ✅ Tarjetas de estadísticas en columna en móvil
- ✅ Tabla con scroll horizontal en móviles
- ✅ Logo oculto en móviles pequeños

---

## 🚀 Cómo Usar

### 1. Iniciar el Frontend

```bash
cd frontend
npm start
```

### 2. Navegar al Dashboard

Después de iniciar sesión, serás redirigido automáticamente al dashboard:

```
http://localhost:3000/dashboard
```

### 3. Interactuar con el Dashboard

- **Ver estadísticas:** Se cargan automáticamente al entrar
- **Ver tabla de alertas:** Muestra cartas vencidas y por vencer
- **Navegar por menús:** Click en Catálogos o Reportes para ver submenús
- **Ver perfil:** Click en el avatar para ver opciones
- **Cerrar sesión:** Click en "Cerrar Sesión" en el dropdown del avatar

---

## 🎯 Funcionalidades Clave

### 1. Carga de Datos en Paralelo

```javascript
useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  setLoading(true);
  try {
    // Tres llamadas en paralelo para mejor rendimiento
    const [vencidasRes, porVencerRes, vigentesRes] = await Promise.all([...]);
    // Actualizar estado
  } catch (error) {
    toast.error('Error al cargar las estadísticas');
  } finally {
    setLoading(false);
  }
};
```

### 2. Formateo de Fechas

```javascript
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
```

### 3. Combinación y Ordenamiento de Datos

```javascript
const criticalWarranties = [
  ...vencidasList.map(w => ({ ...w, tipo: 'vencida' })),
  ...porVencerList.map(w => ({ ...w, tipo: 'por-vencer' }))
].sort((a, b) => new Date(a.validity_end) - new Date(b.validity_end));
```

### 4. Manejo de Estados Vacíos

```javascript
{criticalWarranties.length === 0 ? (
  <div className="text-center">
    <h3>¡Todo en orden!</h3>
    <p>No hay cartas vencidas ni próximas a vencer.</p>
  </div>
) : (
  <table>...</table>
)}
```

---

## 🔒 Seguridad

### Autenticación:

- ✅ Token JWT almacenado en Zustand persist
- ✅ Token incluido automáticamente en headers
- ✅ Redirección automática al login si 401
- ✅ Limpieza de storage al cerrar sesión

### Protección de Rutas:

```jsx
// En App.js (ya implementado)
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>
```

---

## 🎨 Personalización

### Cambiar Colores del Tema:

Editar `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#0095c8',  // Color principal
          600: '#007ba3',
          // ...
        },
        secondary: {
          500: '#f57b0c',  // Color secundario
          // ...
        }
      }
    }
  }
}
```

### Agregar Nuevos Menús:

En `Layout.js`:

```javascript
const menuItems = [
  // ... menús existentes
  { 
    name: 'Nuevo Menú', 
    path: '/nuevo-menu', 
    icon: '🆕' 
  },
];
```

### Cambiar Logo:

Reemplazar el archivo:
```
frontend/public/images/logo-unf.png
```

---

## 🐛 Resolución de Problemas

### Problema: "Error al cargar las estadísticas"

**Solución:**
1. Verificar que el backend esté corriendo
2. Verificar que los endpoints estén disponibles:
   - `/api/warranties/vencidas/`
   - `/api/warranties/por-vencer/`
   - `/api/warranties/vigentes/`
3. Verificar token de autenticación

### Problema: No se muestran las tarjetas

**Solución:**
1. Abrir DevTools Console
2. Verificar errores de red
3. Verificar que los endpoints retornen datos

### Problema: Avatar no muestra iniciales

**Solución:**
1. Verificar que el usuario tenga `first_name` y `last_name`
2. Si no, se usará el `username`

---

## 📊 Próximas Mejoras (Roadmap)

### Fase 1: ✅ Completado
- ✅ Navbar con menús desplegables
- ✅ Avatar con dropdown
- ✅ Tarjetas de estadísticas
- ✅ Tabla de cartas críticas

### Fase 2: ⏳ Pendiente
- ⏳ Implementar páginas de catálogos
- ⏳ Implementar gestión de cartas fianza
- ⏳ Implementar páginas de reportes
- ⏳ Implementar gestión de usuarios

### Fase 3: 🔮 Futuro
- 🔮 Gráficos y visualizaciones
- 🔮 Filtros y búsqueda avanzada
- 🔮 Exportación a PDF/Excel
- 🔮 Notificaciones en tiempo real

---

## 📚 Recursos

### Documentación Backend:
- `backend/API_CARTAS_VENCIDAS.md`
- `backend/API_CARTAS_POR_VENCER.md`
- `backend/API_CARTAS_VIGENTES.md`
- `backend/RESUMEN_ENDPOINTS_ESTADO_CARTAS.md`

### Tecnologías Usadas:
- React 18
- React Router v6
- Tailwind CSS
- Zustand (state management)
- Sonner (toast notifications)
- Axios (HTTP client)

---

**Fecha de Implementación:** 17/11/2025  
**Status:** ✅ Completado y Funcionando  
**Próximo Paso:** Implementar páginas de Catálogos

---

## 🎉 ¡Listo para Usar!

El dashboard principal está completamente implementado y funcionando. Los usuarios pueden:

1. ✅ Iniciar sesión
2. ✅ Ver estadísticas en tiempo real
3. ✅ Ver listado de cartas críticas
4. ✅ Navegar por los menús principales
5. ✅ Cerrar sesión desde el avatar

**Para iniciar:**
```bash
# Backend
docker-compose -f docker-compose.dev.yml up -d

# Frontend
cd frontend
npm start
```

**Acceder a:**
```
http://localhost:3000/login
```

¡Disfruta del nuevo dashboard! 🚀

