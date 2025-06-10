// Debug script para interceptar llamadas a path-to-regexp
const express = require('express');
const cors = require('cors');

// Interceptar la función pathToRegexp para ver qué está causando el error
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id) {
  const result = originalRequire.apply(this, arguments);
  
  if (id === 'path-to-regexp') {
    console.log('📦 path-to-regexp requerido desde:', this.filename);
    
    // Interceptar la función principal
    const originalPathToRegexp = result.pathToRegexp;
    result.pathToRegexp = function(...args) {
      console.log('🔍 pathToRegexp llamado con:', args);
      try {
        return originalPathToRegexp.apply(this, args);
      } catch (error) {
        console.error('❌ ERROR en pathToRegexp:', error.message);
        console.error('📍 Argumentos que causaron el error:', args);
        throw error;
      }
    };
    
    // Interceptar la función parse también
    const originalParse = result.parse;
    result.parse = function(...args) {
      console.log('🔍 parse llamado con:', args);
      try {
        return originalParse.apply(this, args);
      } catch (error) {
        console.error('❌ ERROR en parse:', error.message);
        console.error('📍 Argumentos que causaron el error:', args);
        throw error;
      }
    };
  }
  
  return result;
};

console.log('🚀 Iniciando debug con interceptación de path-to-regexp...');

const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

console.log('✅ Express inicializado');

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a EduMetrics API!',
    version: '1.0.0',
    status: 'running'
  });
});

console.log('✅ Ruta raíz configurada');

// Importar rutas una por una y ver cuál causa el error
console.log('📁 Importando rutas...');

try {
  console.log('1️⃣ Importando authRoutes...');
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('✅ authRoutes OK');

  console.log('2️⃣ Importando userRoutes...');
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/usuarios', userRoutes);
  console.log('✅ userRoutes OK');

  console.log('3️⃣ Importando roleRoutes...');
  const roleRoutes = require('./routes/roleRoutes');
  app.use('/api/roles', roleRoutes);
  console.log('✅ roleRoutes OK');

  console.log('4️⃣ Importando colegioRoutes...');
  const colegioRoutes = require('./routes/colegioRoutes');
  app.use('/api/colegios', colegioRoutes);
  console.log('✅ colegioRoutes OK');

  console.log('5️⃣ Importando cursoRoutes...');
  const cursoRoutes = require('./routes/cursoRoutes');
  app.use('/api/cursos', cursoRoutes);
  console.log('✅ cursoRoutes OK');

  console.log('6️⃣ Importando asignaturaRoutes...');
  const asignaturaRoutes = require('./routes/asignaturaRoutes');
  app.use('/api/asignaturas', asignaturaRoutes);
  console.log('✅ asignaturaRoutes OK');

  console.log('7️⃣ Importando estudianteRoutes...');
  const estudianteRoutes = require('./routes/estudianteRoutes');
  app.use('/api/estudiantes', estudianteRoutes);
  console.log('✅ estudianteRoutes OK');

  console.log('8️⃣ Importando evaluacionRoutes...');
  const evaluacionRoutes = require('./routes/evaluacionRoutes');
  app.use('/api/evaluaciones', evaluacionRoutes);
  console.log('✅ evaluacionRoutes OK');

  console.log('9️⃣ Importando preguntaRoutes...');
  const preguntaRoutes = require('./routes/preguntaRoutes');
  app.use('/api/preguntas', preguntaRoutes);
  console.log('✅ preguntaRoutes OK');

  console.log('🔟 Importando alternativaRoutes...');
  const alternativaRoutes = require('./routes/alternativaRoutes');
  app.use('/api/alternativas', alternativaRoutes);
  console.log('✅ alternativaRoutes OK');

  console.log('1️⃣1️⃣ Importando aplicacionEvaluacionRoutes...');
  const aplicacionEvaluacionRoutes = require('./routes/aplicacionEvaluacionRoutes');
  app.use('/api/aplicaciones', aplicacionEvaluacionRoutes);
  console.log('✅ aplicacionEvaluacionRoutes OK');

  console.log('1️⃣2️⃣ Importando calificacionRoutes...');
  const calificacionRoutes = require('./routes/calificacionRoutes');
  app.use('/api/calificaciones', calificacionRoutes);
  console.log('✅ calificacionRoutes OK');

  console.log('1️⃣3️⃣ Importando respuestaEstudianteRoutes...');
  const respuestaEstudianteRoutes = require('./routes/respuestaEstudianteRoutes');
  app.use('/api/respuestas', respuestaEstudianteRoutes);
  console.log('✅ respuestaEstudianteRoutes OK');

  console.log('🎉 Todas las rutas importadas exitosamente!');

} catch (error) {
  console.error('💥 ERROR DETECTADO:', error.message);
  console.error('📍 Stack trace:', error.stack);
  process.exit(1);
}

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error en middleware:', err.stack);
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
