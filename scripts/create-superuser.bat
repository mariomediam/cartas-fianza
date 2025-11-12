@echo off
REM Script para crear un superusuario en Django en Windows

echo Creando superusuario de Django...
echo.

REM Verificar si estamos en desarrollo o producción
if "%1"=="prod" (
    set COMPOSE_FILE=docker-compose.prod.yml
    echo Modo: PRODUCCION
) else (
    set COMPOSE_FILE=docker-compose.dev.yml
    echo Modo: DESARROLLO
)

docker-compose -f %COMPOSE_FILE% exec backend python manage.py createsuperuser



