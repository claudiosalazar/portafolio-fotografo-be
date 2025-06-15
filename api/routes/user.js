const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');
const jwt = require('jsonwebtoken');

// Clave secreta para JWT desde variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-in-production';

router.post('/', (req, res) => {
    const { userName, password } = req.body;
    
    // Validar datos de entrada
    if (!userName || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }
    
    mysqlConnection.query('SELECT userName FROM user WHERE userName = ? AND password = ?', 
      [userName, password], 
      (err, rows, fields) => {
        if (err) {
          console.error('Error en consulta de autenticación:', err);
          return res.status(500).json({ error: 'Error en el servidor' });
        }
        
        if (rows.length > 0) {
          let data = JSON.stringify(rows[0]);
          const token = jwt.sign({ userName: rows[0].userName }, JWT_SECRET, { expiresIn: '24h' });
          res.json({ token, message: 'Autenticación exitosa' });
        } else {
          res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
    });
  });

module.exports = router;