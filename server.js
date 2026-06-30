const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Archivos estáticos (HTML, CSS, JS, imágenes)
app.use(express.static(__dirname));

// Rutas API
app.use('/api/auth', require('./api/auth'));
app.use('/api/data', require('./api/data'));

// Ruta por defecto para SPA/página principal
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor solo si se ejecuta directamente (localmente con node server.js)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
