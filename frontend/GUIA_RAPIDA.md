# ⚡ Guía Rápida - Stack Moderno

## 🎨 Tailwind CSS - Clases Más Usadas

### Layout y Espaciado
```jsx
// Contenedores
<div className="container mx-auto">           // Contenedor centrado
<div className="max-w-7xl mx-auto px-4">     // Contenedor con padding
<div className="flex items-center">          // Flexbox centrado verticalmente
<div className="grid grid-cols-3 gap-4">     // Grid de 3 columnas

// Espaciado
<div className="p-4">                        // Padding 1rem
<div className="px-4 py-2">                  // Padding horizontal y vertical
<div className="m-4">                        // Margin 1rem
<div className="space-y-4">                  // Espacio vertical entre hijos
```

### Colores Institucionales
```jsx
// Primarios (Azul UNF)
className="bg-primary-500 text-white"
className="text-primary-500 border-primary-500"
className="hover:bg-primary-600"

// Secundarios (Verde UNF)
className="bg-secondary-500 text-white"
className="text-secondary-500"

// Dark (Botones)
className="bg-dark text-white"
className="hover:bg-dark-400"
```

### Tipografía
```jsx
<h1 className="text-3xl font-bold text-gray-900">
<h2 className="text-2xl font-semibold text-gray-800">
<h3 className="text-xl font-medium text-gray-700">
<p className="text-base text-gray-600">
<span className="text-sm text-gray-500">
```

### Botones
```jsx
// Botón primario
<button className="px-4 py-2 bg-primary-500 text-white rounded-md 
                   hover:bg-primary-600 transition-all">

// Botón oscuro
<button className="px-5 py-2 bg-dark text-white rounded-md 
                   hover:bg-dark-400 hover:-translate-y-0.5 hover:shadow-md 
                   transition-all duration-300">

// Botón deshabilitado
<button className="... disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={loading}>
```

### Inputs
```jsx
<input className="w-full px-4 py-3 border border-gray-300 rounded-md
                 focus:outline-none focus:ring-2 focus:ring-primary-500 
                 focus:border-transparent
                 disabled:bg-gray-100 disabled:cursor-not-allowed
                 transition-all" />
```

### Cards
```jsx
<div className="bg-white rounded-lg shadow-md p-6 
               hover:-translate-y-1 hover:shadow-lg 
               transition-all duration-300">
```

### Responsive
```jsx
// Mobile first
<div className="
  w-full           // Móvil: ancho completo
  sm:w-1/2         // Tablet: 50%
  md:w-1/3         // Desktop pequeño: 33%
  lg:w-1/4         // Desktop grande: 25%
">

// Ocultar/Mostrar
<div className="hidden lg:block">  // Solo en pantallas grandes
<div className="block lg:hidden">  // Solo en móvil/tablet
```

---

## 🔄 Zustand - Store

### Usar el Store
```jsx
import useAuthStore from '../store/authStore';

// Obtener todo el estado
const { user, token, login, logout } = useAuthStore();

// Selector específico (mejor rendimiento)
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
```

### Acciones Disponibles
```jsx
// Login
const result = await login(username, password);
if (result.success) {
  // Éxito
} else {
  // Error: result.error
}

// Logout
await logout();

// Verificar autenticación
const isAuth = isAuthenticated();

// Limpiar estado (si necesitas)
clearAuth();
```

### Estado Disponible
```javascript
{
  user: {
    user_id: 1,
    username: "test_user",
    email: "test@example.com",
    first_name: "",
    last_name: "",
  },
  token: "abc123...",
  loading: false,
}
```

---

## 🔔 Sonner - Notificaciones

### Tipos Básicos
```jsx
import { toast } from 'sonner';

toast.success('Operación exitosa');
toast.error('Ocurrió un error');
toast.warning('Advertencia importante');
toast.info('Información');
toast.message('Mensaje simple');
```

### Con Descripción
```jsx
toast.success('Usuario creado', {
  description: 'El usuario ha sido creado exitosamente',
});
```

### Con Duración Personalizada
```jsx
toast.success('Guardado', {
  duration: 2000,  // 2 segundos
});

toast.error('Error crítico', {
  duration: Infinity,  // No se cierra automáticamente
});
```

### Con Acción
```jsx
toast.success('Archivo eliminado', {
  action: {
    label: 'Deshacer',
    onClick: () => console.log('Deshacer'),
  },
});
```

### Con Promesa
```jsx
toast.promise(
  fetchData(),
  {
    loading: 'Cargando datos...',
    success: (data) => `${data.length} registros cargados`,
    error: 'Error al cargar datos',
  }
);
```

### Personalizado
```jsx
toast.custom((t) => (
  <div className="bg-white p-4 rounded-lg shadow-lg">
    <h3 className="font-bold">Título personalizado</h3>
    <p>Contenido personalizado</p>
    <button onClick={() => toast.dismiss(t)}>Cerrar</button>
  </div>
));
```

### Cerrar Manualmente
```jsx
const toastId = toast.success('Mensaje');
toast.dismiss(toastId);  // Cerrar uno específico
toast.dismiss();          // Cerrar todos
```

---

## 📅 Tempo - Fechas

### Funciones Principales
```jsx
import {
  formatDate,
  formatDateTime,
  getCurrentDate,
  parseDate,
  toISODate,
  daysBetween,
  getExpiryStatus,
} from '../utils/dateUtils';

// Fecha actual
const today = getCurrentDate();
// "17/11/2025"

// Formatear fecha
const formatted = formatDate(new Date());
const formattedTime = formatDateTime(new Date());

// Parsear desde string
const date = parseDate('25/12/2025');

// Para enviar a la API
const isoDate = toISODate(new Date());
// "2025-11-17"

// Calcular días entre fechas
const days = daysBetween('01/01/2025', '31/12/2025');

// Estado de vencimiento
const status = getExpiryStatus('31/12/2025');
// { status: 'active'|'warning'|'expired', daysLeft: 44 }
```

### Ejemplo Completo
```jsx
import { formatDate, getExpiryStatus } from '../utils/dateUtils';

const WarrantyCard = ({ warranty }) => {
  const expiryDate = formatDate(warranty.expiry_date);
  const status = getExpiryStatus(warranty.expiry_date);

  return (
    <div className={`p-4 rounded-lg ${
      status.status === 'expired' ? 'bg-red-50' :
      status.status === 'warning' ? 'bg-yellow-50' :
      'bg-green-50'
    }`}>
      <p>Vence: {expiryDate}</p>
      <p>Días restantes: {status.daysLeft}</p>
      {status.status === 'expired' && (
        <span className="text-red-600 font-semibold">VENCIDA</span>
      )}
    </div>
  );
};
```

---

## 🎯 Patrones Comunes

### Formulario con Validación
```jsx
import { useState } from 'react';
import { toast } from 'sonner';

const MyForm = () => {
  const [data, setData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/endpoint', data);
      toast.success('Guardado exitosamente');
    } catch (error) {
      toast.error(error.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        className="w-full px-4 py-2 border rounded-md"
        disabled={loading}
      />
      <button 
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-primary-500 text-white rounded-md
                   disabled:bg-gray-400"
      >
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
};
```

### Lista con Estado de Carga
```jsx
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const MyList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/items');
        setItems(response.data);
      } catch (error) {
        toast.error('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">{item.name}</h3>
        </div>
      ))}
    </div>
  );
};
```

### Modal/Dialog
```jsx
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <button onClick={() => setIsOpen(true)}>Abrir Modal</button>

    {isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold mb-4">Título del Modal</h2>
          <p className="text-gray-600 mb-4">Contenido del modal...</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                // Acción
                setIsOpen(false);
              }}
              className="px-4 py-2 bg-primary-500 text-white rounded-md"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
```

---

## 🚀 Snippets VS Code

Crea estos snippets en VS Code para mayor productividad:

### Componente con Tailwind
```json
{
  "React Component with Tailwind": {
    "prefix": "rct",
    "body": [
      "import React from 'react';",
      "",
      "const ${1:ComponentName} = () => {",
      "  return (",
      "    <div className=\"${2:p-4 bg-white rounded-lg}\">",
      "      ${3:/* content */}",
      "    </div>",
      "  );",
      "};",
      "",
      "export default ${1:ComponentName};"
    ]
  }
}
```

### Componente con Estado
```json
{
  "React Component with State": {
    "prefix": "rcst",
    "body": [
      "import React, { useState } from 'react';",
      "import { toast } from 'sonner';",
      "",
      "const ${1:ComponentName} = () => {",
      "  const [${2:state}, set${2/(.*)/${1:/capitalize}/}] = useState(${3:''});",
      "",
      "  const handleSubmit = async (e) => {",
      "    e.preventDefault();",
      "    try {",
      "      ${4:// API call}",
      "      toast.success('${5:Éxito}');",
      "    } catch (error) {",
      "      toast.error('Error');",
      "    }",
      "  };",
      "",
      "  return (",
      "    <form onSubmit={handleSubmit} className=\"space-y-4\">",
      "      ${6:/* content */}",
      "    </form>",
      "  );",
      "};",
      "",
      "export default ${1:ComponentName};"
    ]
  }
}
```

---

## 📖 Referencias Rápidas

| Necesito... | Usar... | Documentación |
|-------------|---------|---------------|
| Estilos | Tailwind CSS | [tailwindcss.com](https://tailwindcss.com) |
| Estado global | Zustand | [zustand-demo.pmnd.rs](https://zustand-demo.pmnd.rs) |
| Notificaciones | Sonner | [sonner.emilkowal.ski](https://sonner.emilkowal.ski) |
| Fechas | Tempo utils | `src/utils/dateUtils.js` |
| API calls | axios | `src/services/api.js` |

---

**¡Feliz desarrollo! 🚀**

