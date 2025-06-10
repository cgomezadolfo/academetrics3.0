// Script para probar cada archivo de rutas individualmente
const express = require('express');

console.log('🔍 Probando archivos de rutas individualmente...\n');

// Lista de archivos de rutas a probar
const routeFiles = [
  { name: 'cursoRoutes', path: './routes/cursoRoutes', mount: '/api/cursos' },
  { name: 'asignaturaRoutes', path: './routes/asignaturaRoutes', mount: '/api/asignaturas' },
  { name: 'estudianteRoutes', path: './routes/estudianteRoutes', mount: '/api/estudiantes' },
  { name: 'evaluacionRoutes', path: './routes/evaluacionRoutes', mount: '/api/evaluaciones' },
  { name: 'preguntaRoutes', path: './routes/preguntaRoutes', mount: '/api/preguntas' },
  { name: 'alternativaRoutes', path: './routes/alternativaRoutes', mount: '/api/alternativas' },
  { name: 'aplicacionEvaluacionRoutes', path: './routes/aplicacionEvaluacionRoutes', mount: '/api/aplicaciones' },
  { name: 'calificacionRoutes', path: './routes/calificacionRoutes', mount: '/api/calificaciones' },
  { name: 'respuestaEstudianteRoutes', path: './routes/respuestaEstudianteRoutes', mount: '/api/respuestas' }
];

async function testRoute(routeInfo) {
  try {
    console.log(`Probando ${routeInfo.name}...`);
    
    // Crear nueva instancia de Express para cada prueba
    const app = express();
    
    // Importar el archivo de rutas
    const routes = require(routeInfo.path);
    
    // Intentar montar las rutas
    app.use(routeInfo.mount, routes);
    
    console.log(`✓ ${routeInfo.name} importado y montado correctamente`);
    return true;
  } catch (error) {
    console.error(`❌ Error en ${routeInfo.name}:`);
    console.error(`   ${error.message}`);
    if (error.stack) {
      console.error(`   Stack: ${error.stack.split('\n')[0]}`);
    }
    return false;
  }
}

async function runTests() {
  console.log('Iniciando pruebas individuales...\n');
  
  for (const routeInfo of routeFiles) {
    const success = await testRoute(routeInfo);
    if (!success) {
      console.log(`\n🚨 Error encontrado en: ${routeInfo.name}`);
      process.exit(1);
    }
    console.log(''); // Línea en blanco
  }
  
  console.log('🎉 Todas las rutas se importaron correctamente');
}

runTests().catch(console.error);
