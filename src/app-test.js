const express = require('express');
const cors = require('cors');
const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Importar solo rutas básicas sin middleware de autenticación
const userController = require('./controllers/userController');
const roleController = require('./controllers/roleController');

// Rutas simples sin autenticación
app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a EduMetrics API!',
    version: '1.0.0',
    status: 'OK'
  });
});

// Rutas de test sin autenticación
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

app.get('/api/test/:id', (req, res) => {
  res.json({ id: req.params.id, message: 'Parameter test working' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.method} ${req.originalUrl} no existe`
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Test EduMetrics corriendo en puerto ${PORT}`);
});

module.exports = app;
