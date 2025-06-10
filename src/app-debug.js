const express = require('express');
const cors = require('cors');
const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Ruta raíz simple
app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a EduMetrics API!',
    version: '1.0.0',
    status: 'running'
  });
});

// Test de ruta con parámetro
app.get('/test/:id', (req, res) => {
  res.json({ 
    message: 'Test route working',
    id: req.params.id 
  });
});

// Importar y usar rutas UNA POR UNA para identificar el problema

// PASO 1: Probar authRoutes (más simple, sin muchos middlewares)
console.log('Importando authRoutes...');
try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('✓ authRoutes importado correctamente');
} catch (error) {
  console.error('❌ Error en authRoutes:', error.message);
}

// PASO 2: Probar userRoutes
console.log('Importando userRoutes...');
try {
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/usuarios', userRoutes);
  console.log('✓ userRoutes importado correctamente');
} catch (error) {
  console.error('❌ Error en userRoutes:', error.message);
}

// PASO 3: Probar roleRoutes
console.log('Importando roleRoutes...');
try {
  const roleRoutes = require('./routes/roleRoutes');
  app.use('/api/roles', roleRoutes);
  console.log('✓ roleRoutes importado correctamente');
} catch (error) {
  console.error('❌ Error en roleRoutes:', error.message);
}

// PASO 4: Probar colegioRoutes
console.log('Importando colegioRoutes...');
try {
  const colegioRoutes = require('./routes/colegioRoutes');
  app.use('/api/colegios', colegioRoutes);
  console.log('✓ colegioRoutes importado correctamente');
} catch (error) {
  console.error('❌ Error en colegioRoutes:', error.message);
}

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
  console.log(`🚀 Servidor EduMetrics corriendo en puerto ${PORT}`);
});

module.exports = app;
