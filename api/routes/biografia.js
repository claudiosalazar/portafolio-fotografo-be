const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');

// Ruta para obtener todos los datos de la tabla biografia
router.get('/', (req, res) => {
    mysqlConnection.query('SELECT * FROM biografia', (err, rows, fields) => {
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

router.put('/', (req, res) => {
    const { infoBio } = req.body;

    const query = 'UPDATE biografia SET infoBio = ?';
    const values = [infoBio];

    mysqlConnection.query(query, values, (err, result) => {
        if (!err) {
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Fila no encontrada' });
            } else {
                res.json({ message: 'Datos de texto actualizados correctamente' });
            }
        } else {
            console.log('Error al actualizar los datos de texto:', err);
            res.status(500).json({ error: 'Error al actualizar los datos de texto' });
        }
    });
});

module.exports = router;