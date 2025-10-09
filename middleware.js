const jwt = require('jsonwebtoken');
const jwtSecret = 'tu_secreto_jwt_super_secreto'; // Debe ser el mismo que en auth-api.js

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // No hay token, no autorizado
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Token no válido o expirado
        }
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            error: 'Acceso denegado. Se requiere rol de administrador.',
        });
    }
    next();
};

module.exports = { authenticateToken, isAdmin };
