# Comandos Útiles - Referencia Rápida

## Inicio Rápido

### Iniciar Entorno de Desarrollo
```bash
# Windows
scripts\start-dev.bat

# Linux/Mac
./scripts/start-dev.sh
```

### Detener Todo
```bash
docker-compose -f docker-compose.dev.yml down
```

## Docker Compose

### Desarrollo

```bash
# Iniciar servicios
docker-compose -f docker-compose.dev.yml up -d

# Iniciar con rebuild
docker-compose -f docker-compose.dev.yml up --build -d

# Detener servicios
docker-compose -f docker-compose.dev.yml down

# Detener y eliminar volúmenes (¡cuidado!)
docker-compose -f docker-compose.dev.yml down -v

# Ver logs de todos los servicios
docker-compose -f docker-compose.dev.yml logs -f

# Ver logs de un servicio específico
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f db

# Reiniciar un servicio
docker-compose -f docker-compose.dev.yml restart backend

# Ver estado de los servicios
docker-compose -f docker-compose.dev.yml ps

# Reconstruir un servicio específico
docker-compose -f docker-compose.dev.yml up -d --build backend
```

### Producción

```bash
# Iniciar servicios
docker-compose -f docker-compose.prod.yml up -d --build

# Detener servicios
docker-compose -f docker-compose.prod.yml down

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Reiniciar un servicio
docker-compose -f docker-compose.prod.yml restart backend
```

## Django (Backend)

### Migraciones

```bash
# Crear migraciones
docker-compose -f docker-compose.dev.yml exec backend python manage.py makemigrations

# Aplicar migraciones
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate

# Ver migraciones
docker-compose -f docker-compose.dev.yml exec backend python manage.py showmigrations

# Revertir migración
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate nombre_app numero_migracion
```

### Usuarios

```bash
# Crear superusuario (interactivo)
docker-compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser

# O usar script
scripts\create-superuser.bat  # Windows
./scripts/create-superuser.sh # Linux/Mac

# Cambiar contraseña de usuario
docker-compose -f docker-compose.dev.yml exec backend python manage.py changepassword nombre_usuario
```

### Shell y Comandos

```bash
# Abrir shell de Django
docker-compose -f docker-compose.dev.yml exec backend python manage.py shell

# Abrir shell de Python
docker-compose -f docker-compose.dev.yml exec backend python

# Abrir bash en el contenedor
docker-compose -f docker-compose.dev.yml exec backend bash
```

### Datos

```bash
# Cargar datos iniciales (fixtures)
docker-compose -f docker-compose.dev.yml exec backend python manage.py loaddata nombre_fixture

# Crear fixture desde la base de datos
docker-compose -f docker-compose.dev.yml exec backend python manage.py dumpdata nombre_app > fixture.json

# Limpiar sesiones expiradas
docker-compose -f docker-compose.dev.yml exec backend python manage.py clearsessions
```

### Archivos Estáticos

```bash
# Recolectar archivos estáticos
docker-compose -f docker-compose.dev.yml exec backend python manage.py collectstatic

# Recolectar sin confirmación
docker-compose -f docker-compose.dev.yml exec backend python manage.py collectstatic --noinput

# Limpiar archivos estáticos antiguos
docker-compose -f docker-compose.dev.yml exec backend python manage.py collectstatic --clear --noinput
```

### Testing

```bash
# Ejecutar todos los tests
docker-compose -f docker-compose.dev.yml exec backend python manage.py test

# Ejecutar tests de una app específica
docker-compose -f docker-compose.dev.yml exec backend python manage.py test apps.bienes

# Ejecutar con verbosidad
docker-compose -f docker-compose.dev.yml exec backend python manage.py test --verbosity=2

# Ejecutar tests y generar reporte de cobertura
docker-compose -f docker-compose.dev.yml exec backend coverage run --source='.' manage.py test
docker-compose -f docker-compose.dev.yml exec backend coverage report
```

### Crear Nueva App

```bash
# Crear nueva app en Django
docker-compose -f docker-compose.dev.yml exec backend python manage.py startapp nombre_app apps/nombre_app
```

## PostgreSQL (Base de Datos)

### Acceso

```bash
# Acceder a psql
docker-compose -f docker-compose.dev.yml exec db psql -U postgres -d cartas_fianzas_db

# Ejecutar consulta SQL directa
docker-compose -f docker-compose.dev.yml exec db psql -U postgres -d cartas_fianzas_db -c "SELECT * FROM auth_user;"
```

### Backup y Restauración

```bash
# Crear backup (con script)
scripts\backup-db.bat  # Windows
./scripts/backup-db.sh # Linux/Mac

# Crear backup (manual)
docker-compose -f docker-compose.dev.yml exec -T db pg_dump -U postgres cartas_fianzas_db > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker-compose -f docker-compose.dev.yml exec -T db psql -U postgres cartas_fianzas_db < backup.sql

# Backup de una tabla específica
docker-compose -f docker-compose.dev.yml exec -T db pg_dump -U postgres -t nombre_tabla cartas_fianzas_db > tabla_backup.sql
```

### Información

```bash
# Ver bases de datos
docker-compose -f docker-compose.dev.yml exec db psql -U postgres -c "\l"

# Ver tablas
docker-compose -f docker-compose.dev.yml exec db psql -U postgres -d cartas_fianzas_db -c "\dt"

# Describir tabla
docker-compose -f docker-compose.dev.yml exec db psql -U postgres -d cartas_fianzas_db -c "\d nombre_tabla"

# Ver tamaño de la base de datos
docker-compose -f docker-compose.dev.yml exec db psql -U postgres -d cartas_fianzas_db -c "SELECT pg_size_pretty(pg_database_size('cartas_fianzas_db'));"
```

## React (Frontend)

### NPM

```bash
# Instalar nueva dependencia
docker-compose -f docker-compose.dev.yml exec frontend npm install nombre_paquete

# Actualizar dependencias
docker-compose -f docker-compose.dev.yml exec frontend npm update

# Ver dependencias desactualizadas
docker-compose -f docker-compose.dev.yml exec frontend npm outdated

# Limpiar cache de npm
docker-compose -f docker-compose.dev.yml exec frontend npm cache clean --force
```

### Build

```bash
# Crear build de producción
docker-compose -f docker-compose.dev.yml exec frontend npm run build

# Ejecutar tests
docker-compose -f docker-compose.dev.yml exec frontend npm test
```

### Shell

```bash
# Acceder a shell del contenedor frontend
docker-compose -f docker-compose.dev.yml exec frontend sh

# Ejecutar comando en el contenedor
docker-compose -f docker-compose.dev.yml exec frontend ls -la
```

## Docker (General)

### Contenedores

```bash
# Listar contenedores corriendo
docker ps

# Listar todos los contenedores
docker ps -a

# Detener todos los contenedores
docker stop $(docker ps -aq)

# Eliminar todos los contenedores detenidos
docker container prune

# Ver logs de un contenedor
docker logs -f nombre_contenedor
```

### Imágenes

```bash
# Listar imágenes
docker images

# Eliminar imagen
docker rmi nombre_imagen

# Eliminar imágenes sin usar
docker image prune

# Eliminar todas las imágenes sin usar
docker image prune -a
```

### Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Eliminar volumen
docker volume rm nombre_volumen

# Eliminar volúmenes sin usar
docker volume prune

# Inspeccionar volumen
docker volume inspect nombre_volumen
```

### Limpieza General

```bash
# Limpiar todo lo que no se está usando
docker system prune

# Limpiar todo incluyendo volúmenes
docker system prune -a --volumes

# Ver uso de espacio en disco
docker system df
```

## Nginx (Producción)

```bash
# Reiniciar nginx
docker-compose -f docker-compose.prod.yml restart nginx

# Ver configuración de nginx
docker-compose -f docker-compose.prod.yml exec nginx cat /etc/nginx/nginx.conf

# Ver logs de nginx
docker-compose -f docker-compose.prod.yml logs -f nginx

# Verificar sintaxis de configuración
docker-compose -f docker-compose.prod.yml exec nginx nginx -t

# Recargar configuración sin detener
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

## Solución de Problemas

### Reiniciar Todo Limpiamente

```bash
# 1. Detener todo
docker-compose -f docker-compose.dev.yml down

# 2. Eliminar volúmenes (opcional, borra datos)
docker-compose -f docker-compose.dev.yml down -v

# 3. Limpiar sistema Docker
docker system prune -f

# 4. Reconstruir e iniciar
docker-compose -f docker-compose.dev.yml up --build -d

# 5. Ejecutar migraciones
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

### Ver Uso de Recursos

```bash
# Ver uso de CPU y memoria de los contenedores
docker stats

# Ver procesos en un contenedor
docker-compose -f docker-compose.dev.yml top backend
```

### Acceder Directamente a un Contenedor

```bash
# Backend
docker-compose -f docker-compose.dev.yml exec backend bash

# Frontend
docker-compose -f docker-compose.dev.yml exec frontend sh

# Base de datos
docker-compose -f docker-compose.dev.yml exec db bash
```

## Variables de Entorno

### Cambiar Variables sin Reiniciar

```bash
# 1. Edita el archivo .env.dev
# 2. Recrea los contenedores
docker-compose -f docker-compose.dev.yml up -d --force-recreate
```

## Atajos Útiles

### Alias para Bash/Zsh (Linux/Mac)

Agrega a tu `~/.bashrc` o `~/.zshrc`:

```bash
alias dcu='docker-compose -f docker-compose.dev.yml up -d'
alias dcd='docker-compose -f docker-compose.dev.yml down'
alias dcl='docker-compose -f docker-compose.dev.yml logs -f'
alias dcr='docker-compose -f docker-compose.dev.yml restart'
alias dce='docker-compose -f docker-compose.dev.yml exec'
alias djm='docker-compose -f docker-compose.dev.yml exec backend python manage.py'
```

Uso:
```bash
dcu           # Iniciar servicios
dcd           # Detener servicios
dcl backend   # Ver logs del backend
djm migrate   # Ejecutar migraciones
```

### PowerShell (Windows)

Crea un archivo `profile.ps1`:

```powershell
function dcu { docker-compose -f docker-compose.dev.yml up -d }
function dcd { docker-compose -f docker-compose.dev.yml down }
function dcl { docker-compose -f docker-compose.dev.yml logs -f $args }
function dcr { docker-compose -f docker-compose.dev.yml restart $args }
```



