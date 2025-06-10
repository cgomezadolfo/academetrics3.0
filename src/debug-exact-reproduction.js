console.log('🔍 Reproduciendo el error exacto de app.js...');

const express = require('express');
const cors = require('cors');

try {
  console.log('Paso 1: Creando app Express...');
  const app = express();

  console.log('Paso 2: Configurando middleware básico...');
  app.use(cors());
  app.use(express.json());

  console.log('Paso 3: Importando rutas UNA POR UNA...');
  
  console.log('  - Importando authRoutes...');
  const authRoutes = require('./routes/authRoutes');
  
  console.log('  - Importando userRoutes...');
  const userRoutes = require('./routes/userRoutes');
  
  console.log('  - Importando roleRoutes...');
  const roleRoutes = require('./routes/roleRoutes');
  
  console.log('  - Importando colegioRoutes...');
  const colegioRoutes = require('./routes/colegioRoutes');
  
  console.log('  - Importando cursoRoutes...');
  const cursoRoutes = require('./routes/cursoRoutes');
  
  console.log('  - Importando asignaturaRoutes...');
  const asignaturaRoutes = require('./routes/asignaturaRoutes');
  
  console.log('  - Importando estudianteRoutes...');
  const estudianteRoutes = require('./routes/estudianteRoutes');
  
  console.log('  - Importando evaluacionRoutes...');
  const evaluacionRoutes = require('./routes/evaluacionRoutes');
  
  console.log('  - Importando preguntaRoutes...');
  const preguntaRoutes = require('./routes/preguntaRoutes');
  
  console.log('  - Importando alternativaRoutes...');
  const alternativaRoutes = require('./routes/alternativaRoutes');
  
  console.log('  - Importando aplicacionEvaluacionRoutes...');
  const aplicacionEvaluacionRoutes = require('./routes/aplicacionEvaluacionRoutes');
  
  console.log('  - Importando calificacionRoutes...');
  const calificacionRoutes = require('./routes/calificacionRoutes');
  
  console.log('  - Importando respuestaEstudianteRoutes...');
  const respuestaEstudianteRoutes = require('./routes/respuestaEstudianteRoutes');

  console.log('\n✓ Todas las rutas importadas exitosamente');

  console.log('\nPaso 4: Montando rutas UNA POR UNA...');
  
  console.log('  - Montando /api/auth...');
  app.use('/api/auth', authRoutes);
  
  console.log('  - Montando /api/usuarios...');
  app.use('/api/usuarios', userRoutes);
  
  console.log('  - Montando /api/roles...');
  app.use('/api/roles', roleRoutes);
  
  console.log('  - Montando /api/colegios...');
  app.use('/api/colegios', colegioRoutes);
  
  console.log('  - Montando /api/cursos...');
  app.use('/api/cursos', cursoRoutes);
  
  console.log('  - Montando /api/asignaturas...');
  app.use('/api/asignaturas', asignaturaRoutes);
  
  console.log('  - Montando /api/estudiantes...');
  app.use('/api/estudiantes', estudianteRoutes);
  
  console.log('  - Montando /api/evaluaciones...');
  app.use('/api/evaluaciones', evaluacionRoutes);
  
  console.log('  - Montando /api/preguntas...');
  app.use('/api/preguntas', preguntaRoutes);
  
  console.log('  - Montando /api/alternativas...');
  app.use('/api/alternativas', alternativaRoutes);
  
  console.log('  - Montando /api/aplicaciones...');
  app.use('/api/aplicaciones', aplicacionEvaluacionRoutes);
  
  console.log('  - Montando /api/calificaciones...');
  app.use('/api/calificaciones', calificacionRoutes);
  
  console.log('  - Montando /api/respuestas...');
  app.use('/api/respuestas', respuestaEstudianteRoutes);

  console.log('\n✓ Todas las rutas montadas exitosamente');

  console.log('\nPaso 5: Configurando ruta raíz...');
  app.get('/', (req, res) => {
    res.json({
      message: '¡Bienvenido a EduMetrics API!',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        usuarios: '/api/usuarios',
        roles: '/api/roles',
        colegios: '/api/colegios',
        cursos: '/api/cursos',
        asignaturas: '/api/asignaturas',
        estudiantes: '/api/estudiantes',
        evaluaciones: '/api/evaluaciones',
        preguntas: '/api/preguntas',
        alternativas: '/api/alternativas',
        aplicaciones: '/api/aplicaciones',
        calificaciones: '/api/calificaciones',
        respuestas: '/api/respuestas'
      }
    });
  });

  console.log('\nPaso 6: Configurando middleware de error...');
  app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: err.message
    });
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Endpoint no encontrado',
      message: `La ruta ${req.method} ${req.originalUrl} no existe`
    });
  });

  console.log('\n🎉 ¡Aplicación configurada exitosamente sin errores!');
  console.log('El problema no se reproduce con este enfoque paso a paso.');

} catch (error) {
  console.error('\n❌ ERROR DETECTADO:');
  console.error('Tipo:', error.name);
  console.error('Mensaje:', error.message);
  console.error('Stack:', error.stack);
  
  if (error.message.includes('path-to-regexp')) {
    console.error('\n🔍 Este es el error de path-to-regexp que estamos buscando!');
  }
}
