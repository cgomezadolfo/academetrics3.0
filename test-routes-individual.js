// Test para identificar qué ruta está causando el problema
const express = require('express');

const routesToTest = [
  './src/routes/authRoutes',
  './src/routes/userRoutes', 
  './src/routes/roleRoutes',
  './src/routes/colegioRoutes',
  './src/routes/cursoRoutes',
  './src/routes/asignaturaRoutes',
  './src/routes/estudianteRoutes',
  './src/routes/evaluacionRoutes',
  './src/routes/preguntaRoutes',
  './src/routes/alternativaRoutes',
  './src/routes/aplicacionEvaluacionRoutes',
  './src/routes/calificacionRoutes',
  './src/routes/respuestaEstudianteRoutes'
];

console.log('Probando importación de rutas una por una...\n');

for (const routePath of routesToTest) {
  try {
    console.log(`Probando: ${routePath}`);
    const route = require(routePath);
    
    // Intentar crear una app de prueba con esta ruta
    const testApp = express();
    testApp.use('/test', route);
    
    console.log(`✅ ${routePath} - OK`);
  } catch (error) {
    console.log(`❌ ${routePath} - ERROR:`);
    console.log(`   ${error.message}`);
    console.log(`   Stack: ${error.stack}`);
    break; // Parar en el primer error
  }
}

console.log('\nTest completado.');
