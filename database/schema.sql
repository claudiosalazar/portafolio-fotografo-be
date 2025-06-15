-- Base de datos para Backend Portafolio de Fotógrafo
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS claudios_blog_fotografo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE claudios_blog_fotografo;

-- Tabla de usuarios para panel de administración
CREATE TABLE IF NOT EXISTS user (
    userName VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de biografía
CREATE TABLE IF NOT EXISTS biografia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    infoBio TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de imagen de biografía
CREATE TABLE IF NOT EXISTS imagenBiografia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    imgBio VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de carousel principal
CREATE TABLE IF NOT EXISTS carousel (
    id INT PRIMARY KEY AUTO_INCREMENT,
    imgCarousel VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de galería de fotografías
CREATE TABLE IF NOT EXISTS galeria (
    id INT PRIMARY KEY AUTO_INCREMENT,
    album VARCHAR(100),
    foto VARCHAR(255),
    alt VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de contenido de inicio
CREATE TABLE IF NOT EXISTS inicio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255),
    contenido TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de posts del blog
CREATE TABLE IF NOT EXISTS post (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255),
    contenido TEXT,
    imagen VARCHAR(255),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de proyectos destacados
CREATE TABLE IF NOT EXISTS proyectos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255),
    descripcion TEXT,
    imagen VARCHAR(255),
    url VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Insertar datos iniciales

-- Usuario administrador por defecto (cambiar contraseña en producción)
INSERT INTO user (userName, password) VALUES 
('admin', 'admin123') 
ON DUPLICATE KEY UPDATE userName = userName;

-- Datos iniciales para biografía
INSERT INTO biografia (id, infoBio) VALUES 
(1, 'Con una pasión innata por capturar la esencia del mundo natural y humano, se ha especializado en fotografía de paisajes, animales y retratos.')
ON DUPLICATE KEY UPDATE infoBio = VALUES(infoBio);

-- Inicializar imagen de biografía
INSERT INTO imagenBiografia (id, imgBio) VALUES 
(1, NULL)
ON DUPLICATE KEY UPDATE id = id;

-- Inicializar carousel (3 imágenes)
INSERT INTO carousel (id, imgCarousel) VALUES 
(1, NULL),
(2, NULL),
(3, NULL)
ON DUPLICATE KEY UPDATE id = id;

-- Datos de ejemplo para inicio
INSERT INTO inicio (id, titulo, contenido) VALUES 
(1, 'Bienvenido a mi Portafolio', 'Explora mi mundo a través del lente')
ON DUPLICATE KEY UPDATE titulo = VALUES(titulo), contenido = VALUES(contenido);

-- Nota: Recuerda cambiar la contraseña del usuario admin en producción
-- y configurar las variables de entorno correctamente.
