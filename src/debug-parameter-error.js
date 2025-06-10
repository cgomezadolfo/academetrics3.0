// Debug script para encontrar el parámetro malformado en path-to-regexp
const express = require('express');

console.log('🔍 Buscando parámetro malformado en rutas...\n');

// Función para probar una ruta individual y capturar errores
function testRoute(path, description) {
  try {
    const app = express();
    const router = express.Router();
    
    // Intentar crear la ruta
    router.get(path, (req, res) => res.json({ test: 'ok' }));
    app.use('/test', router);
    
    console.log(`✓ ${description}: "${path}" - OK`);
    return true;
  } catch (error) {
    console.log(`❌ ${description}: "${path}" - ERROR: ${error.message}`);
    return false;
  }
}

// Lista de patrones de rutas comunes que podrían estar causando problemas
const routePatterns = [
  { path: '/', desc: 'Ruta raíz' },
  { path: '/:id', desc: 'Parámetro ID básico' },
  { path: '/:id/', desc: 'Parámetro ID con slash final' },
  { path: '/:id?', desc: 'Parámetro ID opcional' },
  { path: '/:id*', desc: 'Parámetro ID wildcard' },
  { path: '/:id+', desc: 'Parámetro ID repetido' },
  { path: '/:', desc: 'Dos puntos sin nombre (PROBLEMA POTENCIAL)' },
  { path: '/:/', desc: 'Dos puntos con slash (PROBLEMA POTENCIAL)' },
  { path: '/:id/:sub', desc: 'Múltiples parámetros' },
  { path: '/users/:id', desc: 'Ruta con prefijo y parámetro' },
  { path: '/users/:id/posts', desc: 'Ruta con parámetro en medio' },
  { path: '/users/:id/posts/:postId', desc: 'Múltiples parámetros con nombres' },
];

console.log('Probando patrones de rutas comunes...\n');

routePatterns.forEach(pattern => {
  testRoute(pattern.path, pattern.desc);
});

console.log('\n🔍 Ahora vamos a revisar los archivos de rutas reales...\n');

// Función para extraer patrones de rutas de los archivos
function analyzeRouteFile(filePath, routeName) {
  try {
    console.log(`\n📁 Analizando ${routeName}...`);
    
    const fs = require('fs');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Buscar patrones de rutas usando regex
    const routePatterns = content.match(/router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g);
    
    if (routePatterns) {
      routePatterns.forEach(pattern => {
        const match = pattern.match(/['"`]([^'"`]+)['"`]/);
        if (match) {
          const routePath = match[1];
          testRoute(routePath, `${routeName} - ${routePath}`);
        }
      });
    } else {
      console.log(`  ⚠️  No se encontraron patrones de rutas en ${routeName}`);
    }
    
    return true;
  } catch (error) {
    console.log(`  ❌ Error leyendo ${routeName}: ${error.message}`);
    return false;
  }
}

// Analizar todos los archivos de rutas
const routeFiles = [
  { path: './routes/authRoutes.js', name: 'authRoutes' },
  { path: './routes/userRoutes.js', name: 'userRoutes' },
  { path: './routes/roleRoutes.js', name: 'roleRoutes' },
  { path: './routes/colegioRoutes.js', name: 'colegioRoutes' },
  { path: './routes/cursoRoutes.js', name: 'cursoRoutes' },
  { path: './routes/asignaturaRoutes.js', name: 'asignaturaRoutes' },
  { path: './routes/estudianteRoutes.js', name: 'estudianteRoutes' },
  { path: './routes/evaluacionRoutes.js', name: 'evaluacionRoutes' },
  { path: './routes/preguntaRoutes.js', name: 'preguntaRoutes' },
  { path: './routes/alternativaRoutes.js', name: 'alternativaRoutes' },
  { path: './routes/aplicacionEvaluacionRoutes.js', name: 'aplicacionEvaluacionRoutes' },
  { path: './routes/calificacionRoutes.js', name: 'calificacionRoutes' },
  { path: './routes/respuestaEstudianteRoutes.js', name: 'respuestaEstudianteRoutes' },
];

routeFiles.forEach(file => {
  analyzeRouteFile(file.path, file.name);
});

console.log('\n✨ Análisis completado. Si hay parámetros problemáticos, aparecerán marcados con ❌');
