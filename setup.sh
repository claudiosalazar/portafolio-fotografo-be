#!/bin/bash

# Script de inicialización del proyecto Backend Portafolio Fotógrafo
# Este script configura automáticamente los archivos necesarios para el desarrollo

echo "🚀 Iniciando configuración del proyecto..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/"
    exit 1
fi

# Verificar si MySQL está instalado y ejecutándose
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL no encontrado. Asegúrate de tenerlo instalado y ejecutándose."
fi

echo "📦 Instalando dependencias..."
npm install

echo "📄 Configurando archivos de ejemplo..."

# Crear archivo de conexión si no existe
if [ ! -f "api/connection/connection.js" ]; then
    echo "🔧 Creando archivo de conexión..."
    cp api/connection/connectionExample.js api/connection/connection.js
    echo "✅ Archivo api/connection/connection.js creado"
else
    echo "⚠️  El archivo api/connection/connection.js ya existe, saltando..."
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "🔧 Creando archivo de variables de entorno..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
else
    echo "⚠️  El archivo .env ya existe, saltando..."
fi

# Crear directorio de uploads si no existe
echo "📁 Configurando directorios de archivos..."
mkdir -p public/uploads/images/biografia
mkdir -p public/uploads/images/carousel
mkdir -p public/uploads/images/galeria
mkdir -p public/uploads/images/post
echo "✅ Directorios de uploads creados"

echo ""
echo "🎉 ¡Configuración inicial completada!"
echo ""
echo "📋 SIGUIENTES PASOS:"
echo ""
echo "1. 🔧 Configura tu base de datos MySQL:"
echo "   mysql -u root -p < database/schema.sql"
echo ""
echo "2. ✏️  Edita el archivo .env con tus credenciales:"
echo "   nano .env"
echo ""
echo "3. 🚀 Inicia el servidor de desarrollo:"
echo "   npm run dev"
echo ""
echo "4. 🌐 Abre tu navegador en:"
echo "   http://localhost:3001"
echo ""
echo "📚 Para más información, consulta el README.md"
echo ""
echo "⚠️  IMPORTANTE: Nunca subas los archivos .env o api/connection/connection.js"
echo "   al repositorio público. Están protegidos en .gitignore"
echo ""
