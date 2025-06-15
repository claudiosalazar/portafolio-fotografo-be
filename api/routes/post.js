const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');
const imageController = require('../controller/imagePost.controller');

// Configurar el límite de tamaño de la carga útil
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    const querySelect = 'SELECT id, fecha, tituloPost, contenido, imgPost, alt FROM post ORDER BY id';
    mysqlConnection.getConnection((err, connection) => {
        if (err) {
            console.log('Error al conectar a la base de datos:', err);
            return res.status(500).json({ error: 'Error al conectar a la base de datos' });
        }
        connection.query(querySelect, (err, rows) => {
            if (err) {
                console.log('Error al obtener los datos:', err);
                return res.status(500).json({ error: 'Error al obtener los datos' });
            } else {
                // Asegúrate de que las URLs de las imágenes se generen correctamente
                rows.forEach((row) => {
                    if (Buffer.isBuffer(row.imgPost)) {
                        // Convierte el Buffer a un string con la ruta de la imagen
                        row.imgPost = row.imgPost.toString(); // Asegúrate de que esto sea la ruta correcta
                    }
                });
                // console.log('Datos entregados al frontend:', rows); // Mostrar los datos en la consola
                res.json(rows);
            }
            connection.release(); // libera la conexión
        });
    });
});

// Ruta para obtener un post específico por ID
router.get('/:id', (req, res) => {
    const postId = req.params.id;
    mysqlConnection.getConnection((err, connection) => {
        if (err) {
            console.log('Error al conectar a la base de datos:', err);
            return res.status(500).json({ error: 'Error al conectar a la base de datos' });
        }
        connection.query('SELECT * FROM post WHERE id = ?', [postId], (err, rows) => {
            if (err) {
                console.log('Error al obtener los datos:', err);
                res.status(500).json({ error: 'Error al obtener los datos' });
            } else if (rows.length === 0) {
                res.status(404).json({ error: 'Post no encontrado' });
            } else {
                const post = rows[0];
                if (Buffer.isBuffer(post.imgPost)) {
                    post.imgPost = post.imgPost.toString('utf-8');
                }
                res.json(post);
            }
            connection.release();
        });
    });
});

// Ruta para subir una imagen y crear un nuevo post
router.post('/upload', imageController.uploadImagenPublicacionPost, (req, res) => {
    const { tituloPost, contenido, alt } = req.body;
    console.log('Datos recibidos:', { tituloPost, contenido, alt, imgPost: req.file.path }); // Log para depuración

    if (!tituloPost || !contenido || !req.file || !alt) {
        console.log('Faltan datos requeridos'); // Log para depuración
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const imgPost = `/uploads/images/post/${req.file.filename}`;

    mysqlConnection.getConnection((err, connection) => {
        if (err) {
            console.log('Error al conectar a la base de datos:', err);
            return res.status(500).json({ error: 'Error al conectar a la base de datos' });
        }
        const query = 'INSERT INTO post (tituloPost, contenido, imgPost, alt) VALUES (?, ?, ?, ?)';
        connection.query(query, [tituloPost, contenido, imgPost, alt], (err, result) => {
            if (err) {
                console.log('Error al crear el post:', err);
                res.status(500).json({ error: 'Error al crear el post' });
            } else {
                res.json({ message: 'Post creado correctamente', id: result.insertId });
            }
            connection.release();
        });
    });
});

// Ruta para actualizar un post por ID
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10); // Convertir id a número
    const { tituloPost, contenido, imgPost, alt } = req.body;
    console.log('Datos recibidos para actualizar:', { id, tituloPost, contenido, imgPost, alt }); // Log para depuración

    // Verificar que al menos uno de los campos no sea undefined
    if (tituloPost === undefined && contenido === undefined && imgPost === undefined && alt === undefined) {
        return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
    }

    mysqlConnection.getConnection((err, connection) => {
        if (err) {
            console.log('Error al conectar a la base de datos:', err);
            return res.status(500).json({ error: 'Error al conectar a la base de datos' });
        }

        // Obtener los datos actuales del post
        connection.query('SELECT * FROM post WHERE id = ?', [id], (err, rows) => {
            if (err) {
                console.log('Error al obtener los datos actuales del post:', err);
                return res.status(500).json({ error: 'Error al obtener los datos actuales del post' });
            }

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Post no encontrado' });
            }

            const currentPost = rows[0];
            const updates = {};
            if (tituloPost !== undefined && tituloPost !== currentPost.tituloPost) updates.tituloPost = tituloPost;
            if (contenido !== undefined && contenido !== currentPost.contenido) updates.contenido = contenido;
            if (imgPost !== undefined && imgPost !== currentPost.imgPost) updates.imgPost = imgPost;
            if (alt !== undefined && alt !== currentPost.alt) updates.alt = alt;

            if (Object.keys(updates).length === 0) {
                console.log('No hay cambios para actualizar'); // Log para depuración
                return res.status(200).json({ message: 'No hay cambios para actualizar' });
            }

            // Construir la consulta de actualización dinámicamente
            const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
            const values = Object.values(updates);
            values.push(id);

            const query = `UPDATE post SET ${fields} WHERE id = ?`;
            console.log('Consulta de actualización:', query); // Log para depuración
            console.log('Valores de actualización:', values); // Log para depuración

            connection.query(query, values, (err, result) => {
                if (err) {
                    console.log('Error al actualizar el post:', err);
                    return res.status(500).json({ error: 'Error al actualizar el post' });
                } else {
                    res.json({ message: 'Post actualizado correctamente' });
                }
                connection.release();
            });
        });
    });
});

// Ruta para eliminar un post por ID
router.delete('/:id', (req, res) => {
    const postId = req.params.id;
    mysqlConnection.getConnection((err, connection) => {
        if (err) {
            console.log('Error al conectar a la base de datos:', err);
            return res.status(500).json({ error: 'Error al conectar a la base de datos' });
        }
        connection.query('DELETE FROM post WHERE id = ?', [postId], (err, result) => {
            if (err) {
                console.log('Error al eliminar el post:', err);
                res.status(500).json({ error: 'Error al eliminar el post' });
            } else {
                res.json({ message: 'Post eliminado correctamente' });
            }
            connection.release();
        });
    });
});

module.exports = router;