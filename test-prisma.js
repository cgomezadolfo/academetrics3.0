const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Test para ver qué modelos están disponibles
console.log('Modelos disponibles en Prisma Client:');
console.log(Object.keys(prisma));

// Test específico para evaluacion
try {
  console.log('Probando prisma.evaluacion...');
  // Solo verificar que existe, no ejecutar la query
  if (typeof prisma.evaluacion === 'object') {
    console.log('✓ prisma.evaluacion existe');
  }
} catch (error) {
  console.log('✗ Error con prisma.evaluacion:', error.message);
}

process.exit(0);
