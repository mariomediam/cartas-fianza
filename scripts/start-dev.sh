#!/bin/bash

# Script para iniciar el entorno de desarrollo

echo "🚀 Iniciando entorno de desarrollo..."
echo ""

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo. Por favor, inicia Docker Desktop."
    exit 1
fi

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose -f docker-compose.dev.yml down

# Construir y levantar contenedores
echo "🔨 Construyendo y levantando contenedores..."
docker-compose -f docker-compose.dev.yml up --build -d

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a que la base de datos esté lista..."
sleep 10

# Ejecutar migraciones
echo "📦 Ejecutando migraciones de Django..."
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate

echo ""
echo "✅ Entorno de desarrollo iniciado correctamente!"
echo ""
echo "📍 URLs disponibles:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000/api/"
echo "   - Admin Django: http://localhost:8000/admin/"
echo ""
echo "📝 Para ver los logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "🛑 Para detener: docker-compose -f docker-compose.dev.yml down"



