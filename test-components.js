// Test simple para identificar el problema exacto
console.log('Iniciando test de importaciones individuales...\n');

const testComponents = [
  { name: 'Express', test: () => require('express') },
  { name: 'CORS', test: () => require('cors') },
  { name: 'Prisma Client', test: () => require('@prisma/client') },
  { name: 'JWT', test: () => require('jsonwebtoken') },
  { name: 'Config Permissions', test: () => require('./src/config/permissions') },
  { name: 'Auth Middleware', test: () => require('./src/middleware/auth') },
  { name: 'Auth Controller', test: () => require('./src/controllers/authController') },
  { name: 'User Controller', test: () => require('./src/controllers/userController') },
  { name: 'Role Controller', test: () => require('./src/controllers/roleController') },
  { name: 'Colegio Controller', test: () => require('./src/controllers/colegioController') },
  { name: 'Auth Routes', test: () => require('./src/routes/authRoutes') },
  { name: 'User Routes', test: () => require('./src/routes/userRoutes') },
  { name: 'Role Routes', test: () => require('./src/routes/roleRoutes') },
  { name: 'Colegio Routes', test: () => require('./src/routes/colegioRoutes') }
];

for (const component of testComponents) {
  try {
    component.test();
    console.log(`✅ ${component.name} - OK`);
  } catch (error) {
    console.log(`❌ ${component.name} - ERROR:`);
    console.log(`   ${error.message}`);
    if (error.stack) {
      console.log(`   Stack trace: ${error.stack.split('\n')[1]}`);
    }
    break; // Parar en el primer error
  }
}

console.log('\nTest completado.');
