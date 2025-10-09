const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('./database');
const { authenticateToken, isAdmin } = require('./middleware');

const router = express.Router();
const saltRounds = 10;
const jwtSecret = 'tu_secreto_jwt_super_secreto'; // ¡Cámbialo por algo más seguro!

// GET /api/users - Obtener la lista de usuarios para el login
router.get('/users', (req, res) => {
    const sql = 'SELECT id, username, name, role FROM users';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res
                .status(500)
                .json({ error: 'Error al consultar los usuarios' });
        }
        res.json(rows);
    });
});

// POST /api/register - Registrar un nuevo usuario (protegido para admins)
router.post('/register', authenticateToken, isAdmin, (req, res) => {
    const { username, name, password, role } = req.body;

    if (!username || !name || !password || !role) {
        return res
            .status(400)
            .json({ error: 'Todos los campos son requeridos' });
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res
                .status(500)
                .json({ error: 'Error al hashear la contraseña' });
        }

        const sql =
            'INSERT INTO users (username, name, password_hash, role) VALUES (?, ?, ?, ?)';
        db.run(sql, [username, name, hash, role], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res
                        .status(409)
                        .json({ error: 'El nombre de usuario ya existe' });
                }
                return res
                    .status(500)
                    .json({ error: 'Error al registrar el usuario' });
            }
            res.status(201).json({ id: this.lastID, username });
        });
    });
});

// POST /api/login - Iniciar sesión
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ error: 'Usuario y contraseña son requeridos' });
    }

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        bcrypt.compare(password, user.password_hash, (err, result) => {
            if (result) {
                const payload = {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    name: user.name,
                };
                const token = jwt.sign(payload, jwtSecret, {
                    expiresIn: '24h',
                });
                res.json({ token, user: payload });
            } else {
                res.status(401).json({ error: 'Credenciales incorrectas' });
            }
        });
    });
});

// DELETE /api/users/:id - Eliminar un usuario (solo admin)
router.delete('/users/:id', authenticateToken, isAdmin, (req, res) => {
    // Prevenir que un admin se elimine a sí mismo
    if (req.user.id === parseInt(req.params.id, 10)) {
        return res.status(403).json({
            error: 'No puedes eliminar tu propia cuenta de administrador.',
        });
    }

    const sql = 'DELETE FROM users WHERE id = ?';
    db.run(sql, [req.params.id], function (err) {
        if (err) {
            return res
                .status(500)
                .json({ error: 'Error al eliminar el usuario' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    });
});

module.exports = router;
