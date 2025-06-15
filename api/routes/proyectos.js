const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');

// Obtener todos los proyectos
router.get('/', (req, res) => {
    mysqlConnection.query('SELECT * FROM proyectos ORDER BY id DESC', (err, rows) => {
        if (!err) {
            res.json(rows); 
        } else {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener los proyectos' });
        }
    });
});

// Agregar un nuevo proyecto
router.post('/', (req, res) => {
    const { anoProyecto, tituloProyecto, infoProyecto } = req.body;

    console.log(req.body); // Agrega esto para verificar lo que llega al backend

    if (!anoProyecto || !tituloProyecto || !infoProyecto) {
        return res.status(400).json({ error: 'Por favor, completa todos los campos requeridos: titulo, anio, info' });
    }

    const query = `INSERT INTO proyectos (anoProyecto, tituloProyecto, infoProyecto) VALUES (?, ?, ?)`;

    mysqlConnection.query(query, [anoProyecto, tituloProyecto, infoProyecto], (err, result) => {
        if (!err) {
            res.status(201).json({
                message: 'Proyecto agregado exitosamente',
                proyectoId: result.insertId,
            });
        } else {
            console.error('Error al ejecutar la consulta:', err); // Agrega logs para el error de SQL
            res.status(500).json({ error: 'Error al agregar el proyecto' });
        }
    });
});

module.exports = router;
