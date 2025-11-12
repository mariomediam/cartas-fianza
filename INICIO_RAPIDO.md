# 🚀 Inicio Rápido - Sistema de Gestión de Cartas Fianzas

Esta guía te ayudará a levantar el sistema en menos de 5 minutos.

## ⚡ Requisitos Previos

- ✅ Docker Desktop instalado y corriendo
- ✅ 4GB de RAM disponibles
- ✅ 5GB de espacio en disco

## 📦 Pasos para Iniciar

### 1️⃣ Configurar Variables de Entorno

**Windows (PowerShell):**
```powershell
Copy-Item .env.dev.example .env.dev
```

**Linux/Mac/Git Bash:**
```bash
cp .env.dev.example .env.dev
```

### 2️⃣ Iniciar el Sistema

**Windows:**
```batch
scripts\start-dev.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh
```

### 3️⃣ Crear Superusuario (Opcional)

**Windows:**
```batch
scripts\create-superuser.bat
```

**Linux/Mac:**
```bash
./scripts/create-superuser.sh
```

Sigue las instrucciones para crear tu usuario administrador.

### 4️⃣ Acceder al Sistema

Una vez que los contenedores estén corriendo (espera unos 30-60 segundos):

| Servicio | URL | Descripción |
|----------|-----|-------------|
| 🌐 **Frontend** | http://localhost:3000 | Aplicación React |
| 🔌 **API** | http://localhost:8000/api/ | API REST |
| 🔐 **Admin** | http://localhost:8000/admin/ | Panel de administración |

## 🎯 ¿Qué Incluye el Sistema?

### ✅ Backend (Django)
- Django 5.2 configurado
- Django REST Framework para APIs
- PostgreSQL 18 como base de datos
- Estructura de apps preparada:
  - `cartas_fianzas/` - Para gestión de cartas fianzas

### ✅ Frontend (React)
- React 19.1 configurado
- Página de bienvenida funcional
- Listo para desarrollo de componentes

### ✅ Base de Datos
- PostgreSQL 18
- Persistencia de datos con Docker volumes

### ✅ Docker
- Configuración completa para desarrollo
- Configuración completa para producción
- Scripts de automatización

## 📝 Próximos Pasos

Ahora que el sistema está corriendo, puedes:

1. **Definir tus Modelos**: Edita los archivos en `backend/apps/*/models.py`
2. **Crear Migraciones**: 
   ```bash
   docker-compose -f docker-compose.dev.yml exec backend python manage.py makemigrations
   docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate
   ```
3. **Desarrollar la API**: Crea serializers, views y URLs
4. **Desarrollar el Frontend**: Crea componentes en React

## 🛠️ Comandos Útiles

### Ver Logs
```bash
# Todos los servicios
docker-compose -f docker-compose.dev.yml logs -f

# Solo backend
docker-compose -f docker-compose.dev.yml logs -f backend

# Solo frontend
docker-compose -f docker-compose.dev.yml logs -f frontend
```

### Detener el Sistema
```bash
docker-compose -f docker-compose.dev.yml down
```

### Reiniciar un Servicio
```bash
# Reiniciar backend
docker-compose -f docker-compose.dev.yml restart backend

# Reiniciar frontend
docker-compose -f docker-compose.dev.yml restart frontend
```

### Acceder a la Shell de Django
```bash
docker-compose -f docker-compose.dev.yml exec backend python manage.py shell
```

### Ejecutar Migraciones
```bash
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate
```

## ❓ Problemas Comunes

### Docker no está corriendo
**Error:** `Cannot connect to the Docker daemon`

**Solución:** Abre Docker Desktop y espera a que inicie completamente.

### Puerto en uso
**Error:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solución:** 
1. Detén el servicio que está usando el puerto
2. O cambia el puerto en `docker-compose.dev.yml`

### Los cambios no se reflejan
**Solución:**
```bash
# Reconstruir los contenedores
docker-compose -f docker-compose.dev.yml up --build -d
```

### La base de datos no se conecta
**Solución:**
1. Espera 10-15 segundos más (la BD tarda en iniciar)
2. Verifica los logs: `docker-compose -f docker-compose.dev.yml logs db`
3. Reinicia el backend: `docker-compose -f docker-compose.dev.yml restart backend`

## 📚 Más Información

- **Documentación Completa**: Ver [README.md](README.md)
- **Guía de Instalación Detallada**: Ver [INSTALL.md](INSTALL.md)
- **Comandos Útiles**: Ver [COMANDOS_UTILES.md](COMANDOS_UTILES.md)
- **Cómo Contribuir**: Ver [CONTRIBUTING.md](CONTRIBUTING.md)

## 🎉 ¡Listo!

Tu sistema está corriendo y listo para desarrollo. 

Ahora puedes empezar a:
- ✏️ Definir tus modelos
- 🔧 Crear tus endpoints
- 🎨 Desarrollar tu interfaz

¡Feliz desarrollo! 🚀

---

**Nota:** Este archivo es una guía rápida. Para instrucciones más detalladas, consulta [INSTALL.md](INSTALL.md).



