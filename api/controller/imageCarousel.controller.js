const multer = require('multer');
const path = require('path');
const mysqlConnection = require('../connection/connection');

// Configuración de almacenamiento de multer para carousel
const storageCarousel = multer.diskStorage({
    destination: path.join(__dirname, '../../public/uploads/images/carousel'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadCarousel = multer({ storage: storageCarousel });

exports.uploadCarousel = uploadCarousel.fields([
    { name: 'imgCarousel1', maxCount: 1 },
    { name: 'imgCarousel2', maxCount: 1 },
    { name: 'imgCarousel3', maxCount: 1 }
]);

exports.uploadImageCarousel = (req, res) => {
    console.log('Archivos subidos:', req.files);
    const getImagePath = (file) => file ? `/uploads/images/carousel/${file[0].filename}` : null;

    const imgCarousel1 = getImagePath(req.files.imgCarousel1);
    const imgCarousel2 = getImagePath(req.files.imgCarousel2);
    const imgCarousel3 = getImagePath(req.files.imgCarousel3);

    const updateImage = (id, imgCarousel, callback) => {
        const query = 'UPDATE carousel SET imgCarousel = ? WHERE id = ?';
        mysqlConnection.query(query, [imgCarousel, id], (err, result) => {
            if (err) {
                console.error('Error al actualizar la imagen:', err);
                return callback(err);
            }
            if (result.affectedRows === 0) {
                return callback(new Error('Fila no encontrada'));
            }
            callback(null);
        });
    };

    const tasks = [];
    if (imgCarousel1) tasks.push((callback) => updateImage(1, imgCarousel1, callback));
    if (imgCarousel2) tasks.push((callback) => updateImage(2, imgCarousel2, callback));
    if (imgCarousel3) tasks.push((callback) => updateImage(3, imgCarousel3, callback));

    if (tasks.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron imágenes para actualizar' });
    }

    let completedTasks = 0;
    tasks.forEach((task) => {
        task((err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            completedTasks++;
            if (completedTasks === tasks.length) {
                res.json({ message: 'Imágenes subidas correctamente' });
            }
        });
    });
};