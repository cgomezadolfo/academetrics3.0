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

// Las primeras 4 rutas funcionan correctamente según el debug anterior
console.log('Importando las primeras 4 rutas que funcionan...');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const colegioRoutes = require('./routes/colegioRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/colegios', colegioRoutes);
console.log('✓ Primeras 4 rutas importadas correctamente');

// Probar cada ruta restante UNA POR UNA para identificar cuál causa el error

console.log('\n--- PROBANDO RUTAS INDIVIDUALES ---');

// RUTA 5: cursoRoutes
console.log('Probando cursoRoutes...');
try {
  const cursoRoutes = require('./routes/cursoRoutes');
  app.use('/api/cursos', cursoRoutes);
  console.log('✓ cursoRoutes OK');
} catch (error) {
  console.error('❌ ERROR EN cursoRoutes:', error.message);
  process.exit(1);
}

// RUTA 6: asignaturaRoutes
console.log('Probando asignaturaRoutes...');
try {
  const asignaturaRoutes = require('./routes/asignaturaRoutes');
  app.use('/api/asignaturas', asignaturaRoutes);
  console.log('✓ asignaturaRoutes OK');
} catch (error) {
  console.error('❌ ERROR EN asignaturaRoutes:', error.message);
  process.exit(1);
}

// RUTA 7: estudianteRoutes
console.log('Probando estudianteRoutes...');
try {
  const estudianteRoutes = require('./routes/estudianteRoutes');
  app.use('/api/estudiantes', estudianteRoutes);
  console.log('✓ estudianteRoutes OK');
} catch (error) {
  console.error('❌ ERROR EN estudianteRoutes:', error.message);
  process.exit(1);
}

// RUTA 8: evaluacionRoutes
console.log('Probando evaluacionRoutes...');
try {
  const evaluacionRoutes = require('./routes/evaluacionRoutes');
  app.use('/api/evaluaciones', evaluacionRoutes);
  console.log('✓ evaluacionRoutes OK');
} catch (error) {
  console.error('❌ ERROR EN evaluacionRoutes:', error.message);
  process.exit(1);
}

// RUTA 9: preguntaRoutes
console.log('Probando preguntaRoutes...');
try {
  const preguntaRoutes = require('./routes/preguntaRoutes');
  app.use('/api/preguntas', preguntaRoutes);
  console.log('✓ preguntaRoutes OK');
} catch (error) {
  console.error('❌ ERROR EN preguntaRoutes:', error.message);
  process.exit(1);
}

// RUTA 10: alternativaRoutes
console.log('Probando alternativaRoutes...');
try {
  const alternativaRoutes = require('./routes/alternativaRoutes');
  app.use('/api/alternativas', alternativaRoutes);
  console.log('✓ alternativaRoutes OK');
} catch (error) {
  console.error('❌ ERROR EN alternativaRoutes:', error.message);
  process.exit(1);
}

console.log('\n✅ TODAS LAS RUTAS FUNCIONAN CORRECTAMENTE');
console.log('El problema podría estar en la configuración del servidor o middleware...');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor EduMetrics corriendo en puerto ${PORT}`);
});

module.exports = app;
