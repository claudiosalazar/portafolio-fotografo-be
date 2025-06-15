const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');
const app = express();
const routes = require('./api/routes');

// Configurar body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurar CORS
app.use(cors());

// Middleware para configurar CORS manualmente para la carpeta public/images
app.use('/uploads/images', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Configurar rutas de la API
const userRoutes = require('./api/routes/user');
app.use('/panel-de-administracion', userRoutes);
app.use('/', routes);

// Servir archivos estáticos desde la carpeta public
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Crear y arrancar el servidor
const port = process.env.PORT || 3001;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;