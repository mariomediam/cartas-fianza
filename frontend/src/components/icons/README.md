# Componentes de Iconos

Esta carpeta contiene componentes de iconos reutilizables basados en SVG para el sistema de cartas fianzas.

## Iconos Disponibles

- **FileXIcon**: Icono de archivo con X (para documentos rechazados/eliminados)
- **FileCheckIcon**: Icono de archivo con check (para documentos aprobados)
- **FileTextIcon**: Icono de archivo de texto (para documentos generales)
- **CheckCircleIcon**: Icono de círculo con check (para estados exitosos)
- **AlertCircleIcon**: Icono de alerta (para advertencias)
- **ClockIcon**: Icono de reloj (para fechas/plazos)

## Uso

### Importación Individual

```javascript
import FileXIcon from './components/icons/FileXIcon';

function MyComponent() {
  return <FileXIcon size={24} color="#ef4444" />;
}
```

### Importación desde index.js (Recomendado)

```javascript
import { FileXIcon, CheckCircleIcon, ClockIcon } from './components/icons';

function MyComponent() {
  return (
    <div>
      <FileXIcon size={24} color="#ef4444" />
      <CheckCircleIcon size={24} color="#22c55e" />
      <ClockIcon size={20} color="#3b82f6" />
    </div>
  );
}
```

## Props

Todos los iconos aceptan las siguientes props:

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `size` | number | 24 | Tamaño del icono en píxeles |
| `color` | string | 'currentColor' | Color del trazo del icono |
| `className` | string | '' | Clases CSS adicionales |

## Ejemplos

### Con Tailwind CSS

```javascript
import { FileCheckIcon, AlertCircleIcon } from './components/icons';

function StatusBadge({ status }) {
  if (status === 'aprobado') {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <FileCheckIcon size={20} />
        <span>Aprobado</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 text-yellow-600">
      <AlertCircleIcon size={20} />
      <span>Pendiente</span>
    </div>
  );
}
```

### Con estilos inline

```javascript
import { ClockIcon } from './components/icons';

function Deadline() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <ClockIcon size={18} color="#ff6b6b" />
      <span>Vence pronto</span>
    </div>
  );
}
```

## Agregar Nuevos Iconos

Para agregar un nuevo icono:

1. Crea un nuevo archivo en esta carpeta (ej: `NuevoIcon.js`)
2. Copia la estructura de cualquier icono existente
3. Reemplaza el contenido del SVG con tu nuevo icono
4. Exporta el nuevo icono en `index.js`

```javascript
// NuevoIcon.js
import React from 'react';

const NuevoIcon = ({ size = 24, color = 'currentColor', className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Tu código SVG aquí */}
    </svg>
  );
};

export default NuevoIcon;
```

Luego agrega la exportación en `index.js`:

```javascript
export { default as NuevoIcon } from './NuevoIcon';
```

