// Configuración de la conexión a la base de datos
// Desarrollo: SQLite local | Producción: Turso

const { PrismaClient } = require('@prisma/client');

// Función para crear cliente de Prisma
function crearConexionBaseDatos() {
  let prismaConfig = {
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error']
  };

  // Capturar las variables de entorno al inicio
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  // En producción (Vercel), usar adaptador de Turso si las variables están presentes
  if (tursoUrl && tursoToken) {
    console.log('🔧 Configurando conexión a Turso para producción...');
    console.log('🔍 URL encontrada:', tursoUrl ? 'Sí ✅' : 'No ❌');
    console.log('🔍 Token encontrado:', tursoToken ? 'Sí ✅' : 'No ❌');
    
    try {
      const { PrismaLibSQL } = require('@prisma/adapter-libsql');
      const { createClient } = require('@libsql/client');
      
      const clienteLibSQL = createClient({
        url: tursoUrl,
        authToken: tursoToken,
      });
      
      const adaptadorLibSQL = new PrismaLibSQL(clienteLibSQL);
      prismaConfig.adapter = adaptadorLibSQL;
      
      console.log('✅ Configuración de Turso aplicada');
    } catch (error) {
      console.error('❌ Error configurando Turso:', error.message);
      console.log('🔄 Fallback a SQLite local');
    }
  } else {
    console.log('✅ Usando SQLite local para desarrollo');
  }

  const prisma = new PrismaClient(prismaConfig);
  return prisma;
}

// Crear una única instancia de Prisma para toda la aplicación
const prisma = crearConexionBaseDatos();

// Función para cerrar la conexión cuando sea necesario
async function cerrarConexion() {
  await prisma.$disconnect();
  console.log('🔌 Conexión cerrada');
}

// Manejar el cierre de la aplicación
process.on('SIGINT', async () => {
  console.log('🛑 Cerrando aplicación...');
  await cerrarConexion();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Terminando aplicación...');
  await cerrarConexion();
  process.exit(0);
});

// Exportar para usar en otros archivos
module.exports = { prisma, cerrarConexion };
