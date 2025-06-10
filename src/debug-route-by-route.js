// Debug script to test route imports one by one
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Debug server running' });
});

const routesToTest = [
  { name: 'authRoutes', path: './routes/authRoutes', mount: '/api/auth' },
  { name: 'userRoutes', path: './routes/userRoutes', mount: '/api/usuarios' },
  { name: 'roleRoutes', path: './routes/roleRoutes', mount: '/api/roles' },
  { name: 'colegioRoutes', path: './routes/colegioRoutes', mount: '/api/colegios' },
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

async function testRoutes() {
  for (let i = 0; i < routesToTest.length; i++) {
    const route = routesToTest[i];
    console.log(`\n🔍 Testing ${route.name} (${i + 1}/${routesToTest.length})...`);
    
    try {
      // Import the route
      console.log(`  📥 Importing ${route.path}...`);
      const routeHandler = require(route.path);
      console.log(`  ✅ Import successful`);
      
      // Mount the route
      console.log(`  🔗 Mounting at ${route.mount}...`);
      app.use(route.mount, routeHandler);
      console.log(`  ✅ Mount successful`);
      
    } catch (error) {
      console.error(`  ❌ ERROR in ${route.name}:`);
      console.error(`     Type: ${error.constructor.name}`);
      console.error(`     Message: ${error.message}`);
      console.error(`     Stack: ${error.stack}`);
      
      // Stop testing here since we found the problematic route
      console.log(`\n🎯 FOUND THE PROBLEM: ${route.name} is causing the path-to-regexp error`);
      process.exit(1);
    }
  }
  
  console.log('\n🎉 All routes imported and mounted successfully!');
  
  // Start server
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Debug server running on port ${PORT}`);
  });
}

testRoutes();
