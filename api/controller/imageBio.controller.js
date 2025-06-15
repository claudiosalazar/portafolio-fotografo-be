const multer = require('multer');
const path = require('path');
const mysqlConnection = require('../connection/connection');

// Configuración de almacenamiento de multer para biografia
const storageBiografia = multer.diskStorage({
    destination: path.join(__dirname, '../../public/uploads/images/biografia'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadBiografia = multer({ storage: storageBiografia });

exports.uploadBiografia = uploadBiografia.single('imgBio');

exports.uploadImageBio = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    }

    const imgBio = `/uploads/images/biografia/${req.file.filename}`;
    const queryUpdate = 'UPDATE imagenBiografia SET imgBio = ? WHERE id = 1';
    const values = [imgBio];

    mysqlConnection.query(queryUpdate, values, (err, result) => {
        if (err) {
            console.error('Error al subir la imagen de biografía:', err);
            return res.status(500).json({ error: 'Error al subir la imagen de biografía' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Fila no encontrada' });
        }

        res.json({ message: 'Imagen de biografía subida correctamente' });
    });
};
