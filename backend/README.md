# Backend - Sistema de Gestión de Cartas Fianzas

Backend API desarrollado con Django 5.2 y Django REST Framework.

## Estructura del Proyecto

```
backend/
├── config/              # Configuración del proyecto Django
│   ├── settings.py      # Configuración principal
│   ├── urls.py          # URLs principales
│   ├── wsgi.py          # WSGI para producción
│   └── asgi.py          # ASGI para async
├── apps/                # Aplicaciones Django
│   └── cartas_fianzas/  # App para cartas fianzas
├── Dockerfile.dev       # Dockerfile para desarrollo
├── Dockerfile.prod      # Dockerfile para producción
├── requirements.txt     # Dependencias Python
└── manage.py            # Utilidad de gestión Django
```

## Tecnologías Utilizadas

- **Django 5.2**: Framework web
- **Django REST Framework 3.15.2**: API REST
- **PostgreSQL 18**: Base de datos
- **Gunicorn 23.0.0**: Servidor WSGI para producción
- **WhiteNoise**: Servir archivos estáticos
- **django-cors-headers**: Manejo de CORS
- **django-filter**: Filtrado avanzado

## Desarrollo

### Ejecutar Migraciones

```bash
# Desarrollo
docker-compose -f docker-compose.dev.yml exec backend python manage.py makemigrations
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate

# Producción
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
```

### Crear una Nueva App

```bash
docker-compose -f docker-compose.dev.yml exec backend python manage.py startapp nombre_app apps/nombre_app
```

Luego agrega la app en `config/settings.py` en la lista `INSTALLED_APPS`.

### Shell de Django

```bash
docker-compose -f docker-compose.dev.yml exec backend python manage.py shell
```

### Crear Superusuario

```bash
docker-compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser
```

## API Endpoints

Una vez que definas tus modelos, los endpoints estarán disponibles en:

- `/api/` - Lista de todos los endpoints disponibles
- `/api-auth/` - Autenticación de la API
- `/admin/` - Panel de administración de Django

### Características de la API

- **Autenticación**: Session Authentication y Basic Authentication
- **Paginación**: 20 items por página por defecto
- **Filtros**: Disponibles para todos los modelos
- **Búsqueda**: Configurada para cada viewset
- **Ordenamiento**: Por múltiples campos

### Formato de Fecha y Hora

El sistema utiliza el formato configurado por el usuario:
- **Fecha**: dd/mm/yyyy
- **Hora**: HH:MM
- **Fecha y Hora**: dd/mm/yyyy HH:MM

## Configuración

### Variables de Entorno

El proyecto utiliza variables de entorno para la configuración. Ver `.env.dev.example` o `.env.prod.example`.

### Configuración de CORS

En desarrollo, CORS está configurado para permitir peticiones desde:
- http://localhost:3000
- http://127.0.0.1:3000

En producción, deberás agregar tus dominios en `settings.py`.

### Archivos Estáticos

- **Desarrollo**: Servidos por Django directamente
- **Producción**: Servidos por WhiteNoise y recolectados en `/app/staticfiles/`

### Archivos Media

Los archivos subidos por usuarios se guardan en `/app/media/`

## Testing

```bash
# Ejecutar todos los tests
docker-compose -f docker-compose.dev.yml exec backend python manage.py test

# Ejecutar tests de una app específica
docker-compose -f docker-compose.dev.yml exec backend python manage.py test apps.cartas_fianzas

# Con verbosidad
docker-compose -f docker-compose.dev.yml exec backend python manage.py test --verbosity=2
```

## Mejores Prácticas

1. **Modelos**: Define tus modelos en `apps/{nombre_app}/models.py`
2. **Serializers**: Crea serializers en `apps/{nombre_app}/serializers.py`
3. **Views**: Usa ViewSets en `apps/{nombre_app}/views.py`
4. **URLs**: Define las URLs en `apps/{nombre_app}/urls.py`
5. **Admin**: Registra modelos en `apps/{nombre_app}/admin.py`

## Comandos Útiles

```bash
# Ver todas las URLs disponibles
docker-compose -f docker-compose.dev.yml exec backend python manage.py show_urls

# Crear migraciones vacías
docker-compose -f docker-compose.dev.yml exec backend python manage.py makemigrations --empty nombre_app

# Revertir migraciones
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate nombre_app numero_migracion

# Limpiar sesiones expiradas
docker-compose -f docker-compose.dev.yml exec backend python manage.py clearsessions
```

## Seguridad

En producción, asegúrate de:

- ✅ Cambiar `SECRET_KEY` por uno único y seguro
- ✅ Establecer `DEBUG = False`
- ✅ Configurar correctamente `ALLOWED_HOSTS`
- ✅ Usar contraseñas fuertes para la base de datos
- ✅ Habilitar HTTPS
- ✅ Configurar CORS apropiadamente


# ******************************

Comandos importantes para recordar:

Iniciar los contenedores (después de reiniciar la PC):
cd C:\Mario2\Docker\cartas-fianza
docker-compose -f docker-compose.dev.yml up -d

Detener los contenedores:
docker-compose -f docker-compose.dev.yml down

Ver el estado de los contenedores:
docker ps

Ver los logs de los servicios:
# Todos los serviciosdocker-compose -f docker-compose.dev.yml logs -f# Solo backenddocker-compose -f docker-compose.dev.yml logs -f backend# Solo frontenddocker-compose -f docker-compose.dev.yml logs -f frontend

Reiniciar un servicio específico:
docker-compose -f docker-compose.dev.yml restart backend
docker-compose -f docker-compose.dev.yml restart frontend