const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');

// Ruta para obtener todos los datos de la tabla inicio
router.get('/', (req, res) => {
    mysqlConnection.query('SELECT * FROM inicio', (err, rows, fields) => {
        if (!err) {
            res.json(rows); 
        } else {
            console.log(err);
        } 
    });
});

// Ruta para actualizar los datos de la tabla inicio
router.put('/', (req, res) => {
    const { titulo, parrafo } = req.body;

    const query = 'UPDATE inicio SET titulo = ?, parrafo = ?';
    const values = [titulo, parrafo];

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