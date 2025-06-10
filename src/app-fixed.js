const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware básico
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a EduMetrics API!',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Importar y usar las rutas de manera segura
console.log('Cargando rutas...');

try {
  // Rutas de autenticación (sin middleware complejo)
  console.log('Importando authRoutes...');
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('✓ authRoutes cargado');

  // Rutas principales con middleware de autenticación
  console.log('Importando userRoutes...');
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/usuarios', userRoutes);
  console.log('✓ userRoutes cargado');

  console.log('Importando roleRoutes...');
  const roleRoutes = require('./routes/roleRoutes');
  app.use('/api/roles', roleRoutes);
  console.log('✓ roleRoutes cargado');

  console.log('Importando colegioRoutes...');
  const colegioRoutes = require('./routes/colegioRoutes');
  app.use('/api/colegios', colegioRoutes);
  console.log('✓ colegioRoutes cargado');

  console.log('Importando cursoRoutes...');
  const cursoRoutes = require('./routes/cursoRoutes');
  app.use('/api/cursos', cursoRoutes);
  console.log('✓ cursoRoutes cargado');

  console.log('Importando asignaturaRoutes...');
  const asignaturaRoutes = require('./routes/asignaturaRoutes');
  app.use('/api/asignaturas', asignaturaRoutes);
  console.log('✓ asignaturaRoutes cargado');

  console.log('Importando estudianteRoutes...');
  const estudianteRoutes = require('./routes/estudianteRoutes');
  app.use('/api/estudiantes', estudianteRoutes);
  console.log('✓ estudianteRoutes cargado');

  console.log('Importando evaluacionRoutes...');
  const evaluacionRoutes = require('./routes/evaluacionRoutes');
  app.use('/api/evaluaciones', evaluacionRoutes);
  console.log('✓ evaluacionRoutes cargado');

  console.log('Importando preguntaRoutes...');
  const preguntaRoutes = require('./routes/preguntaRoutes');
  app.use('/api/preguntas', preguntaRoutes);
  console.log('✓ preguntaRoutes cargado');

  console.log('Importando alternativaRoutes...');
  const alternativaRoutes = require('./routes/alternativaRoutes');
  app.use('/api/alternativas', alternativaRoutes);
  console.log('✓ alternativaRoutes cargado');

  console.log('Importando aplicacionEvaluacionRoutes...');
  const aplicacionEvaluacionRoutes = require('./routes/aplicacionEvaluacionRoutes');
  app.use('/api/aplicaciones', aplicacionEvaluacionRoutes);
  console.log('✓ aplicacionEvaluacionRoutes cargado');

  console.log('Importando calificacionRoutes...');
  const calificacionRoutes = require('./routes/calificacionRoutes');
  app.use('/api/calificaciones', calificacionRoutes);
  console.log('✓ calificacionRoutes cargado');

  console.log('Importando respuestaEstudianteRoutes...');
  const respuestaEstudianteRoutes = require('./routes/respuestaEstudianteRoutes');
  app.use('/api/respuestas', respuestaEstudianteRoutes);
  console.log('✓ respuestaEstudianteRoutes cargado');

  console.log('🎉 Todas las rutas cargadas exitosamente');

} catch (error) {
  console.error('❌ Error al cargar rutas:', error.message);
  console.error('Stack:', error.stack);
}

// Middleware de manejo de errores para Prisma
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Errores de Prisma
  if (err.code === 'P2002') {
    return res.status(400).json({
      error: 'Error de duplicación',
      message: 'Ya existe un registro con estos datos'
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro no encontrado',
      message: 'El registro solicitado no existe'
    });
  }

  // Error general
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
    availableEndpoints: [
      'GET /',
      'POST /api/auth/login',
      'GET /api/usuarios',
      'GET /api/roles',
      'GET /api/colegios',
      'GET /api/cursos',
      'GET /api/asignaturas',
      'GET /api/estudiantes',
      'GET /api/evaluaciones',
      'GET /api/preguntas',
      'GET /api/alternativas',
      'GET /api/aplicaciones',
      'GET /api/calificaciones',
      'GET /api/respuestas'
    ]
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor EduMetrics corriendo en puerto ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`📚 Documentación: http://localhost:${PORT}/api/docs (próximamente)`);
});

// Manejar cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;
