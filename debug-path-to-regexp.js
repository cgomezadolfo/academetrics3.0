// Test específico para identificar el problema con path-to-regexp
console.log('Iniciando diagnóstico de path-to-regexp...\n');

try {
  const express = require('express');
  console.log('✓ Express importado');

  // Test 1: Crear app básica
  const app = express();
  console.log('✓ App creada');

  // Test 2: Rutas básicas
  app.get('/', (req, res) => res.json({ ok: true }));
  app.get('/test/:id', (req, res) => res.json({ id: req.params.id }));
  console.log('✓ Rutas básicas definidas');

  // Test 3: Importar middleware de auth paso a paso
  console.log('\nProbando importación de middleware...');
  
  // Primero importar solo las dependencias
  const { PrismaClient } = require('@prisma/client');
  console.log('✓ PrismaClient importado');
  
  const jwt = require('jsonwebtoken');
  console.log('✓ JWT importado');
  
  // Importar permissions
  const { hasPermission, canManageRole, ROLE_HIERARCHY } = require('./src/config/permissions');
  console.log('✓ Permissions importado');
  
  // Importar middleware de auth
  const { authenticate, requirePermission } = require('./src/middleware/auth');
  console.log('✓ Auth middleware importado');

  // Test 4: Crear rutas con middleware
  const router = express.Router();
  
  // Test con middleware simple
  router.get('/simple', (req, res) => res.json({ message: 'simple' }));
  console.log('✓ Ruta simple creada');
  
  // Test con middleware authenticate (comentado primero)
  // router.use(authenticate);
  // console.log('✓ Authenticate middleware aplicado');
  
  // Test con requirePermission (comentado primero)
  // router.get('/protected', requirePermission('test:read'), (req, res) => res.json({ protected: true }));
  // console.log('✓ Ruta protegida creada');
  
  app.use('/api/test', router);
  console.log('✓ Router montado en app');

  console.log('\n✅ Diagnóstico completado sin errores - El problema está en otra parte');

} catch (error) {
  console.log('\n❌ Error encontrado:');
  console.log('Mensaje:', error.message);
  console.log('Stack:', error.stack);
}

process.exit(0);
