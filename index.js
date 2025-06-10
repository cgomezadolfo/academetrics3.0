// Cargar variables de entorno ANTES que cualquier otra cosa
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas (ahora desde src/routes/ porque estamos en la raíz)
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const colegioRoutes = require('./src/routes/colegioRoutes');
const cursoRoutes = require('./src/routes/cursoRoutes');
const asignaturaRoutes = require('./src/routes/asignaturaRoutes');
const estudianteRoutes = require('./src/routes/estudianteRoutes');
const evaluacionRoutes = require('./src/routes/evaluacionRoutes');
const preguntaRoutes = require('./src/routes/preguntaRoutes');
const alternativaRoutes = require('./src/routes/alternativaRoutes');
const aplicacionEvaluacionRoutes = require('./src/routes/aplicacionEvaluacionRoutes');
const calificacionRoutes = require('./src/routes/calificacionRoutes');
const respuestaEstudianteRoutes = require('./src/routes/respuestaEstudianteRoutes');

// Configurar rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/colegios', colegioRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/asignaturas', asignaturaRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/evaluaciones', evaluacionRoutes);
app.use('/api/preguntas', preguntaRoutes);
app.use('/api/alternativas', alternativaRoutes);
app.use('/api/aplicaciones', aplicacionEvaluacionRoutes);
app.use('/api/calificaciones', calificacionRoutes);
app.use('/api/respuestas', respuestaEstudianteRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a EduMetrics API!',
    version: '1.0.0',    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      roles: '/api/roles',
      colegios: '/api/colegios',
      // cursos: '/api/cursos',
      // asignaturas: '/api/asignaturas',
      // estudiantes: '/api/estudiantes',
      // evaluaciones: '/api/evaluaciones',
      // preguntas: '/api/preguntas',
      // alternativas: '/api/alternativas',
      // aplicaciones: '/api/aplicaciones',
      // calificaciones: '/api/calificaciones',
      // respuestas: '/api/respuestas'
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Error de validación de Prisma
  if (err.code === 'P2002') {
    return res.status(400).json({
      error: 'Ya existe un registro con esos datos únicos'
    });
  }
  
  // Error de registro no encontrado
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro no encontrado'
    });
  }
  
  // Error de violación de constraint
  if (err.code === 'P2003') {
    return res.status(400).json({
      error: 'Violación de restricción de clave foránea'
    });
  }
  
  res.status(500).json({
    error: 'Error interno del servidor'
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
  console.log(`📋 API disponible en: http://localhost:${PORT}`);
  console.log(`🔐 Auth endpoints en: http://localhost:${PORT}/api/auth`);
});

module.exports = app;