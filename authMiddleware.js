const jwt = require('jsonwebtoken');

// Usar variable de entorno si existe, o clave local segura
const SECRET_KEY = process.env.JWT_SECRET || "super-secret-jwt-key-portfolio";

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer <TOKEN>

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado: Token de autenticación requerido' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Acceso denegado: Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken, SECRET_KEY };
