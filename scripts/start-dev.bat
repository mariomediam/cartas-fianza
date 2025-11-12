@echo off
REM Script para iniciar el entorno de desarrollo en Windows

echo Iniciando entorno de desarrollo...
echo.

REM Verificar si Docker está corriendo
docker info >nul 2>&1
if errorlevel 1 (
    echo Error: Docker no esta corriendo. Por favor, inicia Docker Desktop.
    exit /b 1
)

REM Detener contenedores existentes
echo Deteniendo contenedores existentes...
docker-compose -f docker-compose.dev.yml down

REM Construir y levantar contenedores
echo Construyendo y levantando contenedores...
docker-compose -f docker-compose.dev.yml up --build -d

REM Esperar a que la base de datos esté lista
echo Esperando a que la base de datos este lista...
timeout /t 10 /nobreak >nul

REM Ejecutar migraciones
echo Ejecutando migraciones de Django...
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate

echo.
echo Entorno de desarrollo iniciado correctamente!
echo.
echo URLs disponibles:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:8000/api/
echo    - Admin Django: http://localhost:8000/admin/
echo.
echo Para ver los logs: docker-compose -f docker-compose.dev.yml logs -f
echo Para detener: docker-compose -f docker-compose.dev.yml down



