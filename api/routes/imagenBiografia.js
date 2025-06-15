const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');
const imageController = require('../controller/imageBio.controller');

// Ruta para obtener todos los datos de la tabla imagenBiografia
router.get('/', (req, res) => {
    mysqlConnection.query('SELECT * FROM imagenBiografia', (err, rows, fields) => {
        if (!err) {
            if (rows.length === 0) {
                // Si la tabla está vacía, devolver una respuesta vacía
                return res.json([]);
            }

            // Asegúrate de que las URLs de las imágenes se generen correctamente
            rows.forEach(row => {
                if (row.imgBio) row.imgBio = `${row.imgBio}`;
            });
            res.json(rows); 
        } else {
            console.log(err);
            res.status(500).json({ error: 'Error al obtener los datos' });
        } 
    });
});

// Ruta para subir una nueva imagen a la biografía
router.post('/upload', imageController.uploadBiografia, imageController.uploadImageBio);

// Ruta para actualizar la imagen de la biografía
router.put('/', (req, res) => {
    const { value } = req.body;

    if (!value) {
        return res.status(400).json({ error: 'Valor inválido' });
    }

    // Obtener los datos actuales de la base de datos
    const querySelect = 'SELECT imgBio FROM imagenBiografia WHERE id = 1';
    mysqlConnection.query(querySelect, (err, rows) => {
        if (err) {
            console.log('Error al obtener los datos actuales:', err);
            return res.status(500).json({ error: 'Error al obtener los datos actuales' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Fila no encontrada' });
        }

        const currentData = rows[0];

        // Mantener los datos actuales si no se proporciona un nuevo valor
        const newImgBio = value || currentData.imgBio;

        const queryUpdate = 'UPDATE imagenBiografia SET imgBio = ? WHERE id = 1';
        const values = [newImgBio];

        mysqlConnection.query(queryUpdate, values, (err, result) => {
            if (!err) {
                if (result.affectedRows === 0) {
                    res.status(404).json({ error: 'Fila no encontrada' });
                } else {
                    res.json({ message: 'Datos actualizados correctamente' });
                }
            } else {
                console.log('Error al actualizar los datos:', err);
                res.status(500).json({ error: 'Error al actualizar los datos' });
            }
        });
    });
});

module.exports = router;