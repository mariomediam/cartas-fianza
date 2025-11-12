#!/bin/bash

# Script para crear un superusuario en Django

echo "🔐 Creando superusuario de Django..."
echo ""

# Verificar si estamos en desarrollo o producción
if [ "$1" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    echo "📦 Modo: PRODUCCIÓN"
else
    COMPOSE_FILE="docker-compose.dev.yml"
    echo "📦 Modo: DESARROLLO"
fi

docker-compose -f $COMPOSE_FILE exec backend python manage.py createsuperuser



