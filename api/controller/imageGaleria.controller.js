const multer = require('multer');
const path = require('path');
const mysqlConnection = require('../connection/connection');

// Configuración de almacenamiento de multer para galeria
const storageGaleria = multer.diskStorage({
    destination: path.join(__dirname, '../../public/uploads/images/galeria'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadGaleria = multer({ storage: storageGaleria });

exports.uploadGaleria = uploadGaleria.array('fotos', 6);

exports.uploadImageGaleria = async (req, res) => {
    console.log('Archivos subidos:', req.files);
    const { album, alt } = req.body;

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No se han subido imágenes' });
    }

    if (!album || !alt) {
        return res.status(400).json({ error: 'Faltan datos requeridos: album o alt' });
    }

    try {
        const queries = req.files.map(file => {
            const foto = `/uploads/images/galeria/${file.filename}`;
            const queryInsert = 'INSERT INTO galeria (album, foto, alt) VALUES (?, ?, ?)';
            const values = [album, foto, alt];

            return new Promise((resolve, reject) => {
                mysqlConnection.query(queryInsert, values, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.insertId);
                    }
                });
            });
        });

        const ids = await Promise.all(queries);
        res.json({ message: 'Imágenes de galería subidas correctamente', ids });
    } catch (err) {
        console.error('Error al subir las imágenes de galería:', err);
        res.status(500).json({ error: 'Error al subir las imágenes de galería' });
    }
};
