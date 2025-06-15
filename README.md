# Backend para Portafolio de Fotógrafo

API REST completa desarrollada con [Node.js](https://nodejs.org/es) y Express para gestionar el contenido de un portafolio de fotografía profesional.

## 🚀 Características

- **API REST completa** para gestión de contenido
- **Autenticación JWT** para panel de administración
- **Subida de imágenes** con Multer
- **Base de datos MySQL** para persistencia de datos
- **CORS configurado** para integración con frontend
- **Arquitectura MVC** bien estructurada

## 🛠️ Tecnologías

- **Backend**: Node.js + Express
- **Base de datos**: MySQL2
- **Autenticación**: JSON Web Tokens (JWT)
- **Subida de archivos**: Multer
- **Seguridad**: Helmet, CORS

## 📁 Estructura del Proyecto

```
be-portafolio-fotografo/
├── app.js                    # Servidor principal
├── package.json             # Dependencias del proyecto
├── api/
│   ├── connection/
│   │   ├── connectionExample.js # Ejemplo de configuración DB
│   │   ├── connection.js        # Configuración real (protegida)
│   │   └── README.md           # Guía de configuración
│   ├── controller/             # Controladores de lógica de negocio
│   │   ├── imageBio.controller.js
│   │   ├── imageCarousel.controller.js
│   │   ├── imageGaleria.controller.js
│   │   └── imagePost.controller.js
│   └── routes/                 # Definición de rutas
│       ├── biografia.js
│       ├── carousel.js
│       ├── galeria.js
│       ├── user.js
│       └── ...
├── public/
│   └── uploads/
│       └── images/             # Almacenamiento de imágenes
│           ├── biografia/
│           ├── carousel/
│           ├── galeria/
│           └── post/
├── database/                   # Scripts de base de datos
│   └── schema.sql             # Esquema completo de la DB
├── .env.example               # Plantilla de variables de entorno
└── .gitignore                 # Archivos protegidos del repositorio
```

## ⚙️ Configuración

### Variables de Entorno

Crear un archivo `.env` con las siguientes variables:

```env
# Servidor
NODE_ENV=development
PORT=3001

# Base de datos
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_base_de_datos

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura

# Frontend
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### Base de Datos

El proyecto requiere una base de datos MySQL con las siguientes tablas:

- `biografia` - Información de biografía
- `carousel` - Imágenes del carousel principal
- `galeria` - Galería de fotografías
- `imagenBiografia` - Imagen de perfil
- `inicio` - Contenido de página de inicio
- `post` - Posts del blog
- `proyectos` - Proyectos destacados
- `user` - Usuarios del panel de administración

### 🔒 Protección de Datos Sensibles

Este proyecto está configurado para proteger automáticamente información sensible:

#### Archivos Protegidos (no se suben al repositorio):
- `.env` - Variables de entorno
- `api/connection/connection.js` - Configuración real de DB
- `/public/uploads` - Archivos subidos por usuarios

#### Archivos de Ejemplo Incluidos:
- `.env.example` - Plantilla de variables de entorno
- `api/connection/connectionExample.js` - Ejemplo de configuración DB
- `database/schema.sql` - Esquema de base de datos

## 🚀 Instalación y Uso

### Opción A: Configuración Automática (Recomendada)

```bash
# Ejecutar script de configuración automática
./setup.sh
```

### Opción B: Configuración Manual

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar base de datos

#### a) Crear la base de datos MySQL
```sql
-- Ejecutar en tu cliente MySQL
source database/schema.sql
```

#### b) Configurar conexión
```bash
# Copiar archivo de ejemplo de conexión
cp api/connection/connectionExample.js api/connection/connection.js

# Copiar variables de entorno
cp .env.example .env
```

#### c) Configurar variables de entorno
Editar el archivo `.env` con tus credenciales:
```env
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=nombre_base_de_datos
JWT_SECRET=tu_clave_secreta_muy_segura
```

### 3. Desarrollo

Para iniciar en modo desarrollo con auto-reload:

```bash
node --watch app.js
```

### 4. Producción

```bash
npm start
```

El servidor estará disponible en [http://localhost:3001](http://localhost:3001)

## 📡 Endpoints de la API

### Contenido Público

- `GET /biografia` - Obtener información de biografía
- `GET /carousel` - Obtener imágenes del carousel
- `GET /galeria` - Obtener galería de fotografías
- `GET /inicio` - Obtener contenido de inicio
- `GET /post` - Obtener posts del blog
- `GET /proyectos` - Obtener proyectos

### Panel de Administración

- `POST /panel-de-administracion` - Autenticación de usuario
- `PUT /biografia` - Actualizar biografía
- `POST /imagenBiografia` - Subir imagen de biografía
- `POST /carousel` - Subir imágenes del carousel
- `POST /galeria` - Subir imágenes a galería
- `POST /post` - Subir imágenes de posts

### Archivos Estáticos

- `GET /uploads/images/*` - Servir imágenes subidas

## 🔒 Seguridad

- Autenticación JWT con expiración de 24 horas
- CORS configurado para requests del frontend
- Validación de entrada en todos los endpoints
- Manejo seguro de archivos con Multer

## 📝 Notas de Desarrollo

### Versión 1.0 (Enero 2025)

- ✅ API REST completa implementada
- ✅ Integración con base de datos MySQL
- ✅ Sistema de autenticación JWT
- ✅ Subida y gestión de imágenes
- ✅ Configuración de variables de entorno
- ✅ Manejo de errores mejorado

### Próximas mejoras

- [ ] Implementar bcrypt para hash de contraseñas
- [ ] Agregar middleware de validación de esquemas
- [ ] Implementar rate limiting
- [ ] Agregar logs estructurados
- [ ] Documentación con Swagger/OpenAPI

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📞 Contacto

**Claudio Salazar** - Desarrollador Full Stack

---

*Backend desarrollado para portafolio de fotografía profesional*
