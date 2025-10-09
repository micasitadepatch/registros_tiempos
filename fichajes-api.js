const express = require('express');
const { db } = require('./database');
const { authenticateToken, isAdmin } = require('./middleware');

const router = express.Router();

// Proteger todas las rutas de fichajes
router.use(authenticateToken);

// GET /api/fichajes - Obtener todos los fichajes (admin) o los propios (empleado)
router.get('/fichajes', (req, res) => {
    let sql;
    let params = [];

    if (req.user.role === 'admin') {
        // El admin puede ver todos los fichajes, opcionalmente filtrados por user_id
        sql =
            'SELECT f.id, u.name as employee_name, f.timestamp, f.type FROM fichajes f JOIN users u ON f.user_id = u.id';
        if (req.query.user_id) {
            sql += ' WHERE f.user_id = ?';
            params.push(req.query.user_id);
        }
    } else {
        // Un empleado solo puede ver sus propios fichajes
        sql =
            'SELECT f.id, u.name as employee_name, f.timestamp, f.type FROM fichajes f JOIN users u ON f.user_id = u.id WHERE f.user_id = ?';
        params.push(req.user.id);
    }

    sql += ' ORDER BY f.timestamp DESC';

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res
                .status(500)
                .json({ error: 'Error al consultar los fichajes' });
        }
        res.json(rows);
    });
});

// POST /api/fichajes - Crear un nuevo fichaje (entrada/salida)
router.post('/fichajes', (req, res) => {
    const { user_id, type, timestamp } = req.body;

    // Un admin puede fichar por cualquier usuario, un empleado solo por sí mismo
    const targetUserId = req.user.role === 'admin' ? user_id : req.user.id;

    if (!targetUserId || !type || !timestamp) {
        return res.status(400).json({
            error: 'Faltan datos requeridos (user_id, type, timestamp)',
        });
    }

    const sql =
        'INSERT INTO fichajes (user_id, type, timestamp) VALUES (?, ?, ?)';
    db.run(sql, [targetUserId, type, timestamp], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error al crear el fichaje' });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// PUT /api/fichajes/:id - Actualizar un fichaje (solo admin)
router.put('/fichajes/:id', isAdmin, (req, res) => {
    const { timestamp, type } = req.body;
    if (!timestamp || !type) {
        return res
            .status(400)
            .json({ error: 'Timestamp y type son requeridos' });
    }

    const sql = 'UPDATE fichajes SET timestamp = ?, type = ? WHERE id = ?';
    db.run(sql, [timestamp, type, req.params.id], function (err) {
        if (err) {
            return res
                .status(500)
                .json({ error: 'Error al actualizar el fichaje' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Fichaje no encontrado' });
        }
        res.json({ message: 'Fichaje actualizado' });
    });
});

// DELETE /api/fichajes/:id - Eliminar un fichaje (solo admin)
router.delete('/fichajes/:id', isAdmin, (req, res) => {
    const sql = 'DELETE FROM fichajes WHERE id = ?';
    db.run(sql, [req.params.id], function (err) {
        if (err) {
            return res
                .status(500)
                .json({ error: 'Error al eliminar el fichaje' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Fichaje no encontrado' });
        }
        res.json({ message: 'Fichaje eliminado' });
    });
});

module.exports = router;
