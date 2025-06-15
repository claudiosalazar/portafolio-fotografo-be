const express = require('express');
const path = require('path');
const router = express.Router();

// Array explícito con los nombres de los archivos de rutas
const routeFiles = [
    'biografia.js',
    'imagenBiografia.js',
    'carousel.js',
    'galeria.js',
    'galeriaAnimales.js',
    'galeriaPaisajes.js',
    'galeriaPersonas.js',
    'inicio.js',
    'post.js',
    'postInicio.js',
    'proyectos.js',
    'user.js'
    // Agrega aquí otros archivos de rutas según sea necesario
];

// Registrar cada ruta
routeFiles.forEach(file => {
    const route = require(path.join(__dirname, file));
    router.use(`/${path.basename(file, '.js')}`, route);
});

module.exports = router;