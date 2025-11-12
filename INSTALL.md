# Guía de Instalación - Sistema de Gestión de Cartas Fianzas

Esta guía te ayudará a instalar y configurar el sistema paso a paso.

## Requisitos Previos

### Software Necesario

1. **Docker Desktop**
   - Windows: [Descargar Docker Desktop para Windows](https://www.docker.com/products/docker-desktop)
   - Versión mínima: 20.10.0
   - Asegúrate de que Docker Desktop esté corriendo antes de continuar

2. **Git** (opcional, para clonar el repositorio)
   - [Descargar Git](https://git-scm.com/downloads)

### Requisitos del Sistema

- **RAM**: Mínimo 4GB (recomendado 8GB)
- **Espacio en Disco**: Mínimo 5GB libres
- **Sistema Operativo**: Windows 10/11, Linux, o macOS

## Instalación para Desarrollo

### Paso 1: Obtener el Código

Si tienes Git instalado:
```bash
git clone <url-del-repositorio>
cd cartas-fianza
```

### Paso 2: Configurar Variables de Entorno

Copia el archivo de ejemplo y edítalo con tus valores:

**En Windows (PowerShell):**
```powershell
Copy-Item .env.example .env.dev
```

**En Linux/Mac:**
```bash
cp .env.example .env.dev
```

Edita el archivo `.env.dev` con tus configuraciones. Los valores por defecto funcionarán para desarrollo.

### Paso 3: Iniciar el Entorno de Desarrollo

#### Opción A: Usar Scripts Automáticos (Recomendado)

**En Windows:**
```batch
scripts\start-dev.bat
```

**En Linux/Mac:**
```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

#### Opción B: Comandos Manuales

```bash
# Construir y levantar los contenedores
docker-compose -f docker-compose.dev.yml up --build -d

# Esperar unos segundos y ejecutar migraciones
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate

# Crear superusuario (opcional)
docker-compose -f docker-compose.dev.yml exec backend python manage.py createsuperuser
```

### Paso 4: Verificar la Instalación

Una vez que los contenedores estén corriendo, verifica que todo funcione:

1. **Frontend**: Abre http://localhost:3000 en tu navegador
2. **Backend API**: Abre http://localhost:8000/api/ 
3. **Admin Django**: Abre http://localhost:8000/admin/

Si ves las páginas correctamente, ¡la instalación fue exitosa! 🎉

### Paso 5: Crear un Superusuario

Para acceder al panel de administración de Django:

**En Windows:**
```batch
scripts\create-superuser.bat
```

**En Linux/Mac:**
```bash
./scripts/create-superuser.sh
```

Sigue las instrucciones para crear tu usuario administrador.

## Instalación para Producción

### Paso 1: Configurar Variables de Entorno

Crea y edita el archivo de producción:

```bash
cp .env.example .env.prod
```

**IMPORTANTE**: Edita `.env.prod` y cambia:
- `DJANGO_SECRET_KEY`: Genera una clave secreta única y segura
- `DJANGO_DEBUG`: Debe ser `False`
- `DB_PASSWORD`: Usa una contraseña fuerte
- `DJANGO_ALLOWED_HOSTS`: Agrega tus dominios

### Paso 2: Construir y Levantar los Contenedores

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Paso 3: Ejecutar Migraciones y Recolectar Estáticos

```bash
# Ejecutar migraciones
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Recolectar archivos estáticos
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput

# Crear superusuario
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

### Paso 4: Configurar Nginx (si es necesario)

El archivo `nginx/nginx.conf` ya está configurado. Si necesitas usar HTTPS:

1. Obtén certificados SSL (puedes usar Let's Encrypt)
2. Modifica `nginx/nginx.conf` para agregar la configuración SSL
3. Reinicia nginx: `docker-compose -f docker-compose.prod.yml restart nginx`

## Comandos Útiles

### Ver Logs

```bash
# Ver todos los logs
docker-compose -f docker-compose.dev.yml logs -f

# Ver logs de un servicio específico
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f db
```

### Detener los Contenedores

```bash
# Desarrollo
docker-compose -f docker-compose.dev.yml down

# Producción
docker-compose -f docker-compose.prod.yml down
```

### Reiniciar un Servicio

```bash
# Desarrollo
docker-compose -f docker-compose.dev.yml restart backend

# Producción
docker-compose -f docker-compose.prod.yml restart backend
```

### Acceder a la Shell de Django

```bash
# Desarrollo
docker-compose -f docker-compose.dev.yml exec backend python manage.py shell

# Producción
docker-compose -f docker-compose.prod.yml exec backend python manage.py shell
```

### Hacer Backup de la Base de Datos

**En Windows:**
```batch
scripts\backup-db.bat
```

**En Linux/Mac:**
```bash
./scripts/backup-db.sh
```

Para producción, agrega `prod` como parámetro:
```bash
./scripts/backup-db.sh prod
```

## Solución de Problemas

### Error: "Docker no está corriendo"

**Solución**: Abre Docker Desktop y espera a que inicie completamente.

### Error: "Puerto ya en uso"

**Solución**: Otro servicio está usando el puerto. Opciones:
1. Detén el otro servicio
2. Cambia el puerto en `docker-compose.dev.yml`

### Error: "No se puede conectar a la base de datos"

**Solución**: 
1. Verifica que el contenedor de PostgreSQL esté corriendo: `docker ps`
2. Espera unos segundos más (la BD tarda en iniciar)
3. Reinicia los contenedores

### Los cambios en el código no se reflejan

**Frontend**: 
- Verifica que el volumen esté montado correctamente
- Intenta limpiar: `docker-compose -f docker-compose.dev.yml restart frontend`

**Backend**:
- Django recarga automáticamente en desarrollo
- Si no funciona, reinicia: `docker-compose -f docker-compose.dev.yml restart backend`

## Próximos Pasos

1. Accede al panel de administración y familiarízate con la interfaz
2. Revisa la documentación de la API en http://localhost:8000/api/
3. Comienza a desarrollar tus modelos y endpoints personalizados

## Soporte

Si encuentras problemas durante la instalación, revisa:
- Los logs de Docker: `docker-compose -f docker-compose.dev.yml logs`
- La documentación de Docker: https://docs.docker.com/
- La documentación de Django: https://docs.djangoproject.com/



