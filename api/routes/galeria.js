const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');

// Ruta para obtener los datos de las 6 filas con los últimos id de la tabla galeria
router.get('/', (req, res) => {
    const querySelect = 'SELECT id, foto, alt FROM galeria ORDER BY id DESC LIMIT 6';

    mysqlConnection.query(querySelect, (err, rows, fields) => {
        if (!err) {
            if (rows.length === 0) {
                // Si no hay filas que coincidan, devolver una respuesta vacía
                return res.json([]);
            }

            rows.forEach(row => {
                if (row.foto) row.foto = `${row.foto}`;
            });

            console.log('Datos entregados al frontend:', rows); // Mostrar los datos en la consola
            res.json(rows); 
        } else {
            console.log('Error al obtener los datos:', err);
            res.status(500).json({ error: 'Error al obtener los datos' });
        } 
    });
});


module.exports = router;