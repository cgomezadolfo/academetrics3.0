// Probar importaciones y modelos paso a paso
console.log('Iniciando test de importaciones...');

try {
  console.log('1. Importando express...');
  const express = require('express');
  console.log('✓ Express importado correctamente');

  console.log('2. Importando cors...');
  const cors = require('cors');
  console.log('✓ CORS importado correctamente');

  console.log('3. Importando @prisma/client...');
  const { PrismaClient } = require('@prisma/client');
  console.log('✓ PrismaClient importado correctamente');

  console.log('4. Creando instancia de Prisma...');
  const prisma = new PrismaClient();
  console.log('✓ Instancia de Prisma creada');

  console.log('5. Verificando modelos disponibles...');
  const models = Object.keys(prisma).filter(key => 
    typeof prisma[key] === 'object' && 
    prisma[key].findMany && 
    !key.startsWith('_')
  );
  console.log('Modelos disponibles:', models);

  console.log('6. Importando config/permissions...');
  const { hasPermission } = require('./src/config/permissions');
  console.log('✓ Permissions importado correctamente');

  console.log('7. Importando middleware/auth...');
  const { authenticate } = require('./src/middleware/auth');
  console.log('✓ Auth middleware importado correctamente');

  console.log('✅ Todas las importaciones exitosas');

} catch (error) {
  console.error('❌ Error en la importación:', error.message);
  console.error('Stack trace:', error.stack);
}

process.exit(0);
