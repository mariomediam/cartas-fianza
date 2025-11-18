# Frontend - Sistema de Gestión de Cartas Fianzas

Frontend desarrollado con React 19.1 para el sistema de gestión de cartas fianzas.

## 🚀 Tecnologías

- **React 19.1** - Librería UI
- **React Router 7.1** - Enrutamiento
- **Tailwind CSS 3.4** - Estilos utility-first
- **Flowbite & Flowbite React** - Componentes UI
- **Zustand 5.0** - Gestión de estado
- **Axios 1.7** - Cliente HTTP
- **Sonner 2.0** - Notificaciones toast

## Estructura del Proyecto

```
frontend/
├── public/                    # Archivos estáticos
├── src/                       # Código fuente
│   ├── components/            # Componentes reutilizables
│   │   ├── icons/            # Iconos SVG personalizados
│   │   ├── Layout.js         # Layout principal con Navbar
│   │   └── PrivateRoute.js   # Rutas protegidas
│   ├── pages/                # Páginas/vistas
│   ├── services/             # Servicios API
│   ├── store/                # Estado global (Zustand)
│   ├── utils/                # Utilidades
│   ├── App.js                # Componente principal
│   ├── flowbite-theme.js     # Tema personalizado Flowbite
│   ├── index.js              # Punto de entrada
│   └── index.css             # Estilos globales
├── Dockerfile.dev            # Dockerfile para desarrollo
├── Dockerfile.prod           # Dockerfile para producción
├── tailwind.config.js        # Configuración Tailwind + Flowbite
└── package.json              # Dependencias
```

## Desarrollo Local

### Sin Docker

```bash
npm install
npm start
```

### Con Docker

Ver el README principal del proyecto.

## Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run build`: Crea la build de producción
- `npm test`: Ejecuta los tests
- `npm run eject`: Expone la configuración (irreversible)

## Variables de Entorno

Crear un archivo `.env` basado en `.env.example`:

```
REACT_APP_API_URL=http://localhost:8000/api
```

## 📱 Componentes UI

### Navbar con Flowbite

El sistema utiliza el componente **Navbar** de Flowbite para una navegación responsive optimizada:

- ✅ **Móvil**: Menú colapsable con botón hamburguesa
- ✅ **Desktop**: Menú horizontal con dropdowns
- ✅ **Animaciones**: Transiciones suaves entre estados
- ✅ **Accesibilidad**: Cumple estándares WCAG

**Ver documentación completa:** [FLOWBITE_NAVBAR.md](./FLOWBITE_NAVBAR.md)

### Iconos SVG Personalizados

Librería de iconos reutilizables en `src/components/icons/`:

```javascript
import { FileXIcon, FileCheckIcon, ClockIcon } from './components/icons';

// Uso
<FileXIcon size={24} color="#ef4444" />
<FileCheckIcon size={20} className="text-green-600" />
<ClockIcon size={18} />
```

**Iconos disponibles:**
- `FileXIcon` - Documentos rechazados/vencidos
- `FileCheckIcon` - Documentos aprobados/vigentes
- `FileTextIcon` - Documentos generales
- `CheckCircleIcon` - Estados exitosos
- `AlertCircleIcon` - Alertas/advertencias
- `ClockIcon` - Fechas/plazos

**Ver documentación completa:** [src/components/icons/README.md](./src/components/icons/README.md)

## 📚 Documentación Adicional

- [FLOWBITE_NAVBAR.md](./FLOWBITE_NAVBAR.md) - Implementación del navbar responsive
- [NAVEGACION_Y_COMPONENTES.md](./NAVEGACION_Y_COMPONENTES.md) - Guía completa de navegación y componentes
- [GUIA_RAPIDA.md](./GUIA_RAPIDA.md) - Guía rápida de desarrollo
- [DASHBOARD_IMPLEMENTACION.md](./DASHBOARD_IMPLEMENTACION.md) - Implementación del dashboard

## 🎨 Colores Institucionales

El proyecto utiliza los colores oficiales de la Universidad Nacional de Frontera:

```javascript
// tailwind.config.js
colors: {
  primary: {
    500: '#2c5f8d',  // Azul UNF
    600: '#234c71',
    700: '#1a3955',
    800: '#112639',
  },
  secondary: {
    500: '#4a9d5f',  // Verde UNF
    600: '#3b7e4c',
  }
}
```



