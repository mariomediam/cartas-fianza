#!/bin/bash

# Script para hacer backup de la base de datos

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backup_${TIMESTAMP}.sql"

echo "💾 Creando backup de la base de datos..."
echo ""

# Verificar si estamos en desarrollo o producción
if [ "$1" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    echo "📦 Modo: PRODUCCIÓN"
else
    COMPOSE_FILE="docker-compose.dev.yml"
    echo "📦 Modo: DESARROLLO"
fi

# Crear directorio de backups si no existe
mkdir -p backups

# Realizar backup
docker-compose -f $COMPOSE_FILE exec -T db pg_dump -U postgres cartas_fianzas_db > "backups/${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo "✅ Backup creado exitosamente: backups/${BACKUP_FILE}"
else
    echo "❌ Error al crear el backup"
    exit 1
fi



