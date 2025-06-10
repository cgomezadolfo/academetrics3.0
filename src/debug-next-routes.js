// Script para identificar específicamente qué archivo de rutas causa el error path-to-regexp
const express = require('express');

const app = express();
app.use(express.json());

console.log('🔍 Probando archivos de rutas uno por uno...\n');

// Primeros 4 archivos que sabemos que funcionan
console.log('✅ Los siguientes archivos YA funcionan:');
console.log('- authRoutes.js');
console.log('- userRoutes.js'); 
console.log('- roleRoutes.js');
console.log('- colegioRoutes.js\n');

// Ahora probar los siguientes archivos uno por uno
const routesToTest = [
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

async function testRouteFile(routeInfo) {
  console.log(`🧪 Probando: ${routeInfo.name}...`);
  
  try {
    // Solo importar el archivo sin montarlo
    const routeModule = require(routeInfo.path);
    console.log(`   ✅ Importación exitosa de ${routeInfo.name}`);
    
    // Intentar montarlo en Express
    app.use(routeInfo.mount, routeModule);
    console.log(`   ✅ Montaje exitoso de ${routeInfo.name} en ${routeInfo.mount}`);
    
    return true;
  } catch (error) {
    console.log(`   ❌ ERROR en ${routeInfo.name}:`);
    console.log(`   📋 Mensaje: ${error.message}`);
    console.log(`   📋 Tipo: ${error.name}`);
    
    if (error.stack) {
      console.log(`   📋 Stack trace:`);
      console.log(error.stack.split('\n').slice(0, 5).map(line => `      ${line}`).join('\n'));
    }
    
    return false;
  }
}

async function runTests() {
  console.log('🚀 Iniciando pruebas individuales...\n');
  
  for (const routeInfo of routesToTest) {
    const success = await testRouteFile(routeInfo);
    
    if (!success) {
      console.log(`\n🎯 ENCONTRADO: El problema está en ${routeInfo.name}`);
      console.log(`📁 Archivo: ${routeInfo.path}.js`);
      console.log(`🔗 Mount point: ${routeInfo.mount}`);
      break;
    }
    
    console.log(); // Línea en blanco para separar
  }
  
  console.log('\n✨ Prueba completada.');
}

runTests().catch(console.error);
