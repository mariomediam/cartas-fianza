@echo off
REM Script para hacer backup de la base de datos en Windows

for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%b%%a)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
set TIMESTAMP=%mydate%_%mytime%
set BACKUP_FILE=backup_%TIMESTAMP%.sql

echo Creando backup de la base de datos...
echo.

REM Verificar si estamos en desarrollo o producción
if "%1"=="prod" (
    set COMPOSE_FILE=docker-compose.prod.yml
    echo Modo: PRODUCCION
) else (
    set COMPOSE_FILE=docker-compose.dev.yml
    echo Modo: DESARROLLO
)

REM Crear directorio de backups si no existe
if not exist backups mkdir backups

REM Realizar backup
docker-compose -f %COMPOSE_FILE% exec -T db pg_dump -U postgres cartas_fianzas_db > backups\%BACKUP_FILE%

if %errorlevel% == 0 (
    echo Backup creado exitosamente: backups\%BACKUP_FILE%
) else (
    echo Error al crear el backup
    exit /b 1
)



