const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');
const imageController = require('../controller/imageCarousel.controller');

// Función para generar las URLs de las imágenes
const generateImageUrls = (rows) => {
    return rows.map(row => {
        if (row.imgCarousel) row.imgCarousel = `${row.imgCarousel}`;
        return row;
    });
};

// Ruta para obtener los datos de los campos id e imgCarousel de la tabla carousel
router.get('/', (req, res) => {
    const querySelect = 'SELECT id, imgCarousel FROM carousel';
    mysqlConnection.query(querySelect, (err, rows) => {
        if (err) {
            console.error('Error al obtener los datos:', err);
            return res.status(500).json({ error: 'Error al obtener los datos' });
        }
        const result = rows.length === 0 ? [] : generateImageUrls(rows);
        // console.log('Datos entregados al frontend:', result); // Mostrar los datos en la consola
        res.json(result);
    });
});

// Ruta para subir nuevas imágenes al carousel
router.post('/upload', imageController.uploadCarousel, imageController.uploadImageCarousel);

// Ruta para actualizar una imagen específica del carousel
router.put('/', (req, res) => {
    const { id, imgCarousel } = req.body;

    if (!id || !imgCarousel) {
        return res.status(400).json({ error: 'ID o imgCarousel no proporcionados' });
    }

    const query = 'UPDATE carousel SET imgCarousel = ? WHERE id = ?';
    mysqlConnection.query(query, [imgCarousel, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar los datos:', err);
            return res.status(500).json({ error: 'Error al actualizar los datos' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Fila no encontrada' });
        }
        res.json({ message: 'Datos actualizados correctamente' });
    });
});

module.exports = router;