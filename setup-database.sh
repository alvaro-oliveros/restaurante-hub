#!/bin/bash

# Script para crear la base de datos del restaurante

echo "🍽️  Configuración de Base de Datos - Sistema de Restaurante"
echo "============================================================"
echo ""

# Detectar el puerto de PostgreSQL
PORT=5433
if ! nc -z localhost 5433 2>/dev/null; then
    if nc -z localhost 5432 2>/dev/null; then
        PORT=5432
        echo "⚠️  PostgreSQL detectado en puerto 5432 (no 5433)"
        echo "   Necesitas actualizar application.properties"
    else
        echo "❌ PostgreSQL no está corriendo en ningún puerto conocido"
        exit 1
    fi
fi

echo "✅ PostgreSQL detectado en puerto $PORT"
echo ""
echo "Ingresa la contraseña del usuario postgres:"

# Crear la base de datos
psql -U postgres -p $PORT <<EOF
-- Crear la base de datos si no existe
SELECT 'CREATE DATABASE restaurante_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'restaurante_db')\gexec

-- Conectar a la base de datos
\c restaurante_db

-- Verificar la conexión
SELECT 'Base de datos restaurante_db lista ✅' as status;
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Base de datos creada exitosamente"
    echo ""
    echo "Ahora puedes ejecutar el backend:"
    echo "  cd java-mvc-capas-axios/Java-mvc-capas-axios"
    echo "  ./mvnw spring-boot:run"
else
    echo ""
    echo "❌ Error al crear la base de datos"
    echo "   Por favor, verifica tu usuario y contraseña de PostgreSQL"
fi
