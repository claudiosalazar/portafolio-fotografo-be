const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');
const imageController = require('../controller/imageGaleria.controller');

// Ruta para obtener todos los datos id, foto y alt de la tabla galeria donde el album es 'paisajes'
router.get('/', (req, res) => {
    const querySelect = 'SELECT id, foto, alt FROM galeria WHERE album = ?';
    const values = ['personas'];

    mysqlConnection.query(querySelect, values, (err, rows, fields) => {
        if (!err) {
            if (rows.length === 0) {
                // Si no hay filas que coincidan, devolver una respuesta vacía
                return res.json([]);
            }
            rows.forEach(row => {
                if (row.foto) row.foto = `${row.foto}`;
            });

            res.json(rows); 
        } else {
            console.log('Error al obtener los datos:', err);
            res.status(500).json({ error: 'Error al obtener los datos' });
        } 
    });
});

// Ruta para subir una nueva imagen a la galería de paisajes
router.post('/upload', imageController.uploadGaleria, imageController.uploadImageGaleria);

module.exports = router;