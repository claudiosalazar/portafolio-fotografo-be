const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');

router.get('/', (req, res) => {
    const querySelect = 'SELECT id, fecha, tituloPost, contenido, imgPost, alt FROM post ORDER BY id DESC LIMIT 3';
    mysqlConnection.getConnection((err, connection) => {
        if (err) {
            console.log('Error al conectar a la base de datos:', err);
            return res.status(500).json({ error: 'Error al conectar a la base de datos' });
        }
        connection.query(querySelect, (err, rows) => {
            if (err) {
                console.log('Error al obtener los datos:', err);
                return res.status(500).json({ error: 'Error al obtener los datos' });
            } else {
                // Asegúrate de que las URLs de las imágenes se generen correctamente
                rows.forEach((row) => {
                    if (Buffer.isBuffer(row.imgPost)) {
                        // Convierte el Buffer a un string con la ruta de la imagen
                        row.imgPost = row.imgPost.toString();
                    }
                });
                res.json(rows);
            }
            connection.release(); // libera la conexión
        });
    });
});

module.exports = router;