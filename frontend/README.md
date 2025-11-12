# Frontend - Sistema de Gestión de Cartas Fianzas

Frontend desarrollado con React 19.1 para el sistema de gestión de cartas fianzas.

## Estructura del Proyecto

```
frontend/
├── public/           # Archivos estáticos
├── src/              # Código fuente
│   ├── App.js        # Componente principal
│   ├── App.css       # Estilos principales
│   ├── index.js      # Punto de entrada
│   └── index.css     # Estilos globales
├── Dockerfile.dev    # Dockerfile para desarrollo
├── Dockerfile.prod   # Dockerfile para producción
└── package.json      # Dependencias
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



