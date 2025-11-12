# Sistema de Gestión de Cartas Fianzas

Sistema web para la gestión de cartas fianzas.

## Tecnologías

- **Frontend**: React 19.1
- **Backend**: Django 5.2 + Django REST Framework
- **Base de Datos**: PostgreSQL 18
- **Contenerización**: Docker & Docker Compose

## Estructura del Proyecto

```
cartas-fianza/
├── backend/          # API Django REST Framework
├── frontend/         # Aplicación React
├── docker-compose.dev.yml    # Configuración para desarrollo
├── docker-compose.prod.yml   # Configuración para producción
└── README.md
```

## Configuración para Desarrollo

### Requisitos Previos

- Docker
- Docker Compose

### Pasos para Iniciar

1. Clonar el repositorio

2. Crear archivo de variables de entorno para desarrollo:
```bash
cp .env.example .env.dev
```

3. Editar `.env.dev` con tus configuraciones

4. Construir y levantar los contenedores:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

5. Ejecutar migraciones (primera vez):
```bash
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

6. Crear superusuario:
```bash
docker-compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser
```

7. Acceder a la aplicación:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/
   - Admin Django: http://localhost:8000/admin/

## Configuración para Producción

### Pasos para Desplegar

1. Crear archivo de variables de entorno para producción:
```bash
cp .env.example .env.prod
```

2. Editar `.env.prod` con configuraciones de producción (usar contraseñas seguras)

3. Construir y levantar los contenedores:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

4. Ejecutar migraciones:
```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
```

5. Crear superusuario:
```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

6. Recolectar archivos estáticos:
```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput
```

## Comandos Útiles

### Desarrollo

```bash
# Detener los contenedores
docker-compose -f docker-compose.dev.yml down

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Reconstruir un servicio específico
docker-compose -f docker-compose.dev.yml up -d --build backend

# Acceder a la shell de Django
docker-compose -f docker-compose.dev.yml exec backend python manage.py shell

# Acceder a PostgreSQL
docker-compose -f docker-compose.dev.yml exec db psql -U postgres -d cartas_fianzas_db
```

### Producción

```bash
# Detener los contenedores
docker-compose -f docker-compose.prod.yml down

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Backup de base de datos
docker-compose -f docker-compose.prod.yml exec db pg_dump -U postgres cartas_fianzas_db > backup.sql
```

## Estructura del Proyecto Completa

```
cartas-fianza/
├── backend/                      # API Django
│   ├── config/                   # Configuración del proyecto
│   │   ├── settings.py          # Settings de Django
│   │   ├── urls.py              # URLs principales
│   │   ├── wsgi.py              # WSGI para producción
│   │   └── asgi.py              # ASGI para async
│   ├── apps/                    # Aplicaciones Django
│   │   └── cartas_fianzas/      # Cartas fianzas
│   ├── Dockerfile.dev           # Docker para desarrollo
│   ├── Dockerfile.prod          # Docker para producción
│   ├── requirements.txt         # Dependencias Python
│   └── manage.py                # CLI de Django
├── frontend/                    # Aplicación React
│   ├── public/                  # Archivos públicos
│   ├── src/                     # Código fuente
│   │   ├── App.js              # Componente principal
│   │   ├── App.css             # Estilos principales
│   │   ├── index.js            # Punto de entrada
│   │   └── index.css           # Estilos globales
│   ├── Dockerfile.dev          # Docker para desarrollo
│   ├── Dockerfile.prod         # Docker para producción
│   └── package.json            # Dependencias npm
├── nginx/                      # Configuración Nginx
│   └── nginx.conf              # Config para producción
├── scripts/                    # Scripts útiles
│   ├── start-dev.sh/.bat       # Iniciar desarrollo
│   ├── create-superuser.sh/.bat # Crear superusuario
│   └── backup-db.sh/.bat       # Backup de BD
├── docker-compose.dev.yml      # Docker Compose desarrollo
├── docker-compose.prod.yml     # Docker Compose producción
├── .env.dev.example            # Variables de entorno dev
├── .env.prod.example           # Variables de entorno prod
├── .gitignore                  # Archivos ignorados por Git
├── README.md                   # Este archivo
├── INSTALL.md                  # Guía de instalación
└── CONTRIBUTING.md             # Guía de contribución
```

## Características del Sistema

- 🔐 **Autenticación y Autorización**: Sistema completo de usuarios
- 📄 **Gestión de Cartas Fianzas**: Sistema completo de cartas fianzas
- 🎨 **Panel de Administración**: Interfaz amigable para gestión
- 🔍 **API REST**: API completa con filtros, búsqueda y paginación
- 🐳 **Totalmente Dockerizado**: Fácil de desplegar y escalar
- 📊 **Base de Datos Robusta**: PostgreSQL 18
- 🚀 **Listo para Producción**: Configuración optimizada

## Stack Tecnológico

### Backend
- **Django 5.2**: Framework web de Python
- **Django REST Framework 3.15.2**: Toolkit para APIs REST
- **PostgreSQL 18**: Base de datos relacional
- **Gunicorn**: Servidor WSGI para producción
- **WhiteNoise**: Servir archivos estáticos

### Frontend
- **React 19.1**: Biblioteca de JavaScript para interfaces
- **Axios**: Cliente HTTP para las peticiones
- **React Router**: Enrutamiento en React

### DevOps
- **Docker**: Contenerización
- **Docker Compose**: Orquestación de contenedores
- **Nginx**: Servidor web y proxy inverso

## Inicio Rápido

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd cartas-fianza
```

### 2. Configurar Variables de Entorno
```bash
# Windows PowerShell
Copy-Item .env.dev.example .env.dev

# Linux/Mac
cp .env.dev.example .env.dev
```

### 3. Iniciar con Scripts Automáticos

**Windows:**
```batch
scripts\start-dev.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

### 4. Crear Superusuario

**Windows:**
```batch
scripts\create-superuser.bat
```

**Linux/Mac:**
```bash
./scripts/create-superuser.sh
```

### 5. Acceder a la Aplicación
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000/api/
- **Admin**: http://localhost:8000/admin/

## Documentación Adicional

- 📖 **[Guía de Instalación Completa](INSTALL.md)**: Instrucciones detalladas paso a paso
- 🤝 **[Guía de Contribución](CONTRIBUTING.md)**: Cómo agregar modelos, vistas y endpoints
- 💡 **[Comandos Útiles](COMANDOS_UTILES.md)**: Referencia rápida de comandos Docker y Django
- 📋 **[Estructura del Proyecto](ESTRUCTURA_PROYECTO.txt)**: Árbol completo del proyecto
- 🔧 **[README del Backend](backend/README.md)**: Documentación específica del backend
- ⚛️ **[README del Frontend](frontend/README.md)**: Documentación específica del frontend

## Scripts Útiles

### Desarrollo
```bash
# Iniciar entorno de desarrollo
./scripts/start-dev.sh          # Linux/Mac
scripts\start-dev.bat            # Windows

# Crear superusuario
./scripts/create-superuser.sh   # Linux/Mac
scripts\create-superuser.bat    # Windows

# Backup de base de datos
./scripts/backup-db.sh          # Linux/Mac
scripts\backup-db.bat           # Windows
```

### Comandos Docker
```bash
# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Detener servicios
docker-compose -f docker-compose.dev.yml down

# Reconstruir servicios
docker-compose -f docker-compose.dev.yml up --build -d

# Reiniciar un servicio
docker-compose -f docker-compose.dev.yml restart backend
```

## Mantenimiento

### Migraciones de Base de Datos
```bash
# Crear migraciones
docker-compose -f docker-compose.dev.yml exec backend python manage.py makemigrations

# Aplicar migraciones
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

### Backup y Restauración
```bash
# Crear backup
./scripts/backup-db.sh

# Restaurar backup
docker-compose -f docker-compose.dev.yml exec -T db psql -U postgres cartas_fianzas_db < backup.sql
```

## Solución de Problemas

### Puerto en Uso
Si el puerto 3000, 8000 o 5432 está en uso:
1. Detén el servicio que está usando el puerto
2. O modifica el puerto en `docker-compose.dev.yml`

### Docker no Inicia
1. Verifica que Docker Desktop esté corriendo
2. Reinicia Docker Desktop
3. Verifica que tienes suficiente memoria asignada a Docker

### Cambios no se Reflejan
```bash
# Reconstruir contenedores
docker-compose -f docker-compose.dev.yml up --build -d

# Limpiar volúmenes (cuidado: borra datos)
docker-compose -f docker-compose.dev.yml down -v
```

## Seguridad

⚠️ **IMPORTANTE para Producción**:
- Cambia `DJANGO_SECRET_KEY` por uno único y seguro
- Establece `DJANGO_DEBUG=False`
- Usa contraseñas fuertes para la base de datos
- Configura correctamente `ALLOWED_HOSTS`
- Implementa HTTPS con certificados SSL
- Revisa y ajusta las configuraciones de CORS

## Soporte y Contribución

- 📧 Para reportar bugs o sugerir características, abre un issue
- 🤝 Para contribuir código, lee [CONTRIBUTING.md](CONTRIBUTING.md)
- 📚 Para más información, consulta la documentación de [Django](https://docs.djangoproject.com/) y [React](https://react.dev/)

## Licencia

Todos los derechos reservados.

