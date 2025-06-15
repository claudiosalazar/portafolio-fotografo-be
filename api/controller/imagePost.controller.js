const multer = require('multer');
const path = require('path');
const mysqlConnection = require('../connection/connection');

// Configuración de almacenamiento de multer
const storagePost = multer.diskStorage({
    destination: path.join(__dirname, '../../public/uploads/images/post'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Configuración de Multer con límite de tamaño de archivo
const uploadImagenPublicacionPost = multer({ 
    storage: storagePost
});

// Middleware para manejar la carga de una sola imagen
exports.uploadImagenPublicacionPost = uploadImagenPublicacionPost.single('imgPost'); // Solo una imagen

// Método para procesar la imagen
exports.uploadImgPost = (req, res) => {
    const { alt } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    }

    if (!alt) {
        return res.status(400).json({ error: 'Faltan datos requeridos: alt' });
    }

    const imgPost = `/uploads/images/post/${req.file.filename}`;
    const queryInsert = 'INSERT INTO post (imgPost, alt) VALUES (?, ?)';
    const values = [imgPost, alt];

    mysqlConnection.query(queryInsert, values, (err, result) => {
        if (err) {
            console.log('Error al subir la imagen:', err);
            return res.status(500).json({ error: 'Error al subir la imagen' });
        }
        res.json({ message: 'Imagen subida correctamente', id: result.insertId });
    });
};

// Método para actualizar la imagen
exports.updateImgPost = (req, res) => {
    const { id } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    }

    if (!id) {
        return res.status(400).json({ error: 'Faltan datos requeridos: id o alt' });
    }

    const imgPost = `/uploads/images/post/${req.file.filename}`;
    const queryUpdate = 'UPDATE post SET imgPost = ? WHERE id = ?';
    const values = [imgPost, alt, id];

    mysqlConnection.query(queryUpdate, values, (err, result) => {
        if (err) {
            console.log('Error al actualizar la imagen:', err);
            return res.status(500).json({ error: 'Error al actualizar la imagen' });
        }
        res.json({ message: 'Imagen actualizada correctamente' });
    });
};

// Método para eliminar la imagen
exports.deleteImgPost = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Falta el id de la imagen' });
    }

    const queryDelete = 'DELETE FROM post WHERE id = ?';
    mysqlConnection.query(queryDelete, [id], (err, result) => {
        if (err) {
            console.log('Error al eliminar la imagen:', err);
            return res.status(500).json({ error: 'Error al eliminar la imagen' });
        }
        res.json({ message: 'Imagen eliminada correctamente' });
    });
};