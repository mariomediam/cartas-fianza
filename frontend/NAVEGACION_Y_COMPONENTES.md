# 📱 Guía de Navegación y Componentes

## 🎯 Resumen Ejecutivo

Se implementó **Flowbite Navbar** para resolver el problema de espacio en móvil y se creó una librería de **iconos SVG reutilizables**.

---

## 📱 Navegación Mejorada

### ✅ Problema Resuelto

**Antes:**
```
❌ Menú móvil ocupaba toda la pantalla
❌ Submenús siempre visibles
❌ Difícil navegación en dispositivos pequeños
```

**Ahora:**
```
✅ Menú colapsa en un botón hamburguesa (☰)
✅ Submenús en dropdowns compactos
✅ Animaciones suaves
✅ Más espacio para contenido
```

### 📐 Breakpoints

| Dispositivo | Ancho | Comportamiento |
|-------------|-------|----------------|
| Móvil 📱 | < 768px | Menú colapsado con botón hamburguesa |
| Tablet 📱 | ≥ 768px y < 1024px | Menú horizontal sin submenús expandidos |
| Desktop 🖥️ | ≥ 1024px | Menú completo horizontal |

---

## 🎨 Componentes de Iconos

### 📦 Ubicación

```
frontend/src/components/icons/
├── FileXIcon.js           # Documentos rechazados/vencidos
├── FileCheckIcon.js       # Documentos aprobados
├── FileTextIcon.js        # Documentos generales
├── CheckCircleIcon.js     # Estados exitosos
├── AlertCircleIcon.js     # Alertas/advertencias
├── ClockIcon.js           # Fechas/plazos
├── index.js               # Exportaciones centralizadas
└── README.md              # Documentación de iconos
```

### 💡 Uso de Iconos

#### Importación Simple

```javascript
import { FileXIcon, FileCheckIcon, ClockIcon } from '../components/icons';

// En tu JSX
<FileXIcon size={24} color="#ef4444" />
<FileCheckIcon size={20} color="#22c55e" />
<ClockIcon size={18} />
```

#### Con Tailwind CSS

```javascript
<div className="flex items-center gap-2 text-red-600">
  <FileXIcon size={20} />
  <span>Carta vencida</span>
</div>

<div className="flex items-center gap-2 text-green-600">
  <FileCheckIcon size={20} />
  <span>Carta vigente</span>
</div>

<div className="flex items-center gap-2 text-yellow-600">
  <ClockIcon size={20} />
  <span>Próxima a vencer</span>
</div>
```

### 📊 Iconos para Estados de Cartas Fianza

| Estado | Icono | Color Sugerido | Código |
|--------|-------|----------------|--------|
| Vencida | `<FileXIcon />` | Rojo (#ef4444) | `text-red-500` |
| Vigente | `<FileCheckIcon />` | Verde (#22c55e) | `text-green-500` |
| Por Vencer | `<ClockIcon />` | Amarillo (#eab308) | `text-yellow-500` |
| Alerta | `<AlertCircleIcon />` | Naranja (#f97316) | `text-orange-500` |
| Aprobada | `<CheckCircleIcon />` | Verde (#10b981) | `text-emerald-500` |

### 🎨 Props Disponibles

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `size` | number | 24 | Tamaño en píxeles |
| `color` | string | "currentColor" | Color del trazo (hereda por defecto) |
| `className` | string | "" | Clases CSS adicionales |

---

## 🔧 Estructura del Layout

### Componentes Principales

```
Layout.js
├── Navbar (Flowbite)
│   ├── Navbar.Brand (Logo + Título)
│   ├── Navbar.Toggle (Botón hamburguesa móvil)
│   ├── Navbar.Collapse (Menú colapsable)
│   │   ├── Navbar.Link (Enlaces simples)
│   │   └── Dropdown (Menús con submenús)
│   └── Dropdown (Usuario)
│       └── Dropdown.Item (Cerrar sesión)
├── Main (Contenido)
└── Footer
```

### 🎨 Colores Institucionales

```javascript
// Universidad Nacional de Frontera
primary: {
  500: '#2c5f8d',  // Azul principal UNF
  600: '#234c71',
  700: '#1a3955',
  800: '#112639',
}

secondary: {
  500: '#4a9d5f',  // Verde secundario UNF
  600: '#3b7e4c',
}
```

---

## 🚀 Ejemplos de Uso Completos

### Ejemplo 1: Tarjeta de Estado con Icono

```javascript
import { FileXIcon } from '../components/icons';

function CartaVencida({ cantidad }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border-l-4 border-red-500 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <FileXIcon size={20} />
            Cartas Vencidas
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {cantidad}
          </p>
        </div>
        <div className="bg-red-100 rounded-full p-3">
          <FileXIcon size={32} color="#dc2626" />
        </div>
      </div>
    </div>
  );
}
```

### Ejemplo 2: Badge con Estado

```javascript
import { ClockIcon, FileXIcon, FileCheckIcon } from '../components/icons';

function EstadoBadge({ estado }) {
  const config = {
    vencida: {
      icon: FileXIcon,
      color: 'red',
      text: 'Vencida'
    },
    vigente: {
      icon: FileCheckIcon,
      color: 'green',
      text: 'Vigente'
    },
    porVencer: {
      icon: ClockIcon,
      color: 'yellow',
      text: 'Por vencer'
    }
  };

  const { icon: Icon, color, text } = config[estado];

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full 
                     text-xs font-medium bg-${color}-100 text-${color}-800`}>
      <Icon size={14} />
      {text}
    </span>
  );
}
```

### Ejemplo 3: Lista con Iconos

```javascript
import { FileCheckIcon, ClockIcon, FileXIcon } from '../components/icons';

function ListaCartas({ cartas }) {
  return (
    <ul className="space-y-2">
      {cartas.map((carta) => (
        <li key={carta.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
          {carta.estado === 'vigente' && <FileCheckIcon size={20} className="text-green-600" />}
          {carta.estado === 'por-vencer' && <ClockIcon size={20} className="text-yellow-600" />}
          {carta.estado === 'vencida' && <FileXIcon size={20} className="text-red-600" />}
          
          <div className="flex-1">
            <p className="font-medium">{carta.numero}</p>
            <p className="text-sm text-gray-600">{carta.objeto}</p>
          </div>
          
          <span className="text-sm text-gray-500">{carta.vencimiento}</span>
        </li>
      ))}
    </ul>
  );
}
```

---

## 📋 Checklist de Implementación

### ✅ Completado

- [x] Instalación de Flowbite y Flowbite React
- [x] Configuración de Tailwind CSS
- [x] Tema personalizado con colores institucionales
- [x] Navbar responsive con collapse en móvil
- [x] Dropdowns para submenús (Catálogos, Reportes)
- [x] Dropdown de usuario con cerrar sesión
- [x] Componentes de iconos SVG reutilizables
- [x] Documentación completa

### 🎯 Funcionalidades

- [x] Navegación en móvil (menú hamburguesa)
- [x] Navegación en tablet/desktop (horizontal)
- [x] Submenús colapsables
- [x] Estados activos en rutas
- [x] Hover effects
- [x] Animaciones suaves
- [x] Accesibilidad (WCAG)

---

## 🔍 Testing

### Probar en diferentes dispositivos

1. **Móvil (< 768px)**
   - ✅ Menú colapsado por defecto
   - ✅ Botón hamburguesa visible
   - ✅ Al hacer clic, menú se expande
   - ✅ Submenús en dropdowns

2. **Tablet (768px - 1024px)**
   - ✅ Menú horizontal
   - ✅ Items visibles
   - ✅ Dropdowns funcionan

3. **Desktop (> 1024px)**
   - ✅ Menú completo
   - ✅ Todos los items visibles
   - ✅ Hover states

### Comandos para testing

```bash
# Iniciar servidor de desarrollo
cd frontend
npm start

# El servidor se abre en http://localhost:3000
# Usa las DevTools para simular diferentes dispositivos
```

---

## 📚 Referencias

- [Flowbite Navbar](https://flowbite.com/docs/components/navbar/)
- [Flowbite React](https://flowbite-react.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

---

## 🆘 Solución de Problemas

### El menú no colapsa en móvil

**Solución:** Verifica que `import 'flowbite'` esté en `src/index.js`

### Los iconos no se muestran

**Solución:** Verifica la importación:
```javascript
import { FileXIcon } from '../components/icons'; // ✅ Correcto
import FileXIcon from '../components/icons/FileXIcon'; // ✅ También correcto
```

### Los colores no se aplican

**Solución:** Verifica que Tailwind esté procesando los archivos:
```javascript
// tailwind.config.js
content: [
  "./src/**/*.{js,jsx,ts,tsx}",
  "node_modules/flowbite-react/lib/esm/**/*.js",
],
```

---

**✨ Implementación completada exitosamente!**

