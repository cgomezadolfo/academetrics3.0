const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seeding de la base de datos...');

    // 1. Crear roles básicos
    console.log('📝 Creando roles...');
    const roles = [
      { nombre: 'Superadmin', descripcion: 'Administrador del sistema' },
      { nombre: 'Admin', descripcion: 'Administrador del colegio' },
      { nombre: 'UTP', descripcion: 'Unidad Técnico Pedagógica' },
      { nombre: 'Profesor', descripcion: 'Profesor del colegio' },
      { nombre: 'Estudiante', descripcion: 'Estudiante del colegio' }
    ];

    for (const roleData of roles) {
      await prisma.rol.upsert({
        where: { nombre: roleData.nombre },
        update: {},
        create: roleData
      });
    }

    // 2. Crear colegio de ejemplo
    console.log('🏫 Creando colegio de ejemplo...');
    const colegio = await prisma.colegio.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nombre: 'Colegio San Patricio',
        direccion: 'Av. Providencia 123, Santiago',
        telefono: '+56 2 2345 6789'
      }
    });

    // 3. Obtener roles creados
    const roleMap = {};
    const allRoles = await prisma.rol.findMany();
    allRoles.forEach(role => {
      roleMap[role.nombre] = role.id;
    });

    // 4. Crear usuarios de ejemplo
    console.log('👥 Creando usuarios de ejemplo...');
    const usuarios = [
      {
        email: 'superadmin@edumetrics.com',
        password: 'superadmin123',
        nombre: 'Super',
        apellidoPaterno: 'Admin',
        apellidoMaterno: 'Sistema',
        rut: '11111111-1',
        rolId: roleMap['Superadmin'],
        colegioId: colegio.id
      },
      {
        email: 'admin@sanpatricio.cl',
        password: 'admin123',
        nombre: 'María',
        apellidoPaterno: 'González',
        apellidoMaterno: 'López',
        rut: '12345678-9',
        rolId: roleMap['Admin'],
        colegioId: colegio.id
      },
      {
        email: 'utp@sanpatricio.cl',
        password: 'utp123',
        nombre: 'Carlos',
        apellidoPaterno: 'Rodríguez',
        apellidoMaterno: 'Pérez',
        rut: '98765432-1',
        rolId: roleMap['UTP'],
        colegioId: colegio.id
      },
      {
        email: 'profesor@sanpatricio.cl',
        password: 'profesor123',
        nombre: 'Ana',
        apellidoPaterno: 'Martínez',
        apellidoMaterno: 'Silva',
        rut: '87654321-0',
        rolId: roleMap['Profesor'],
        colegioId: colegio.id
      },
      {
        email: 'estudiante@sanpatricio.cl',
        password: 'estudiante123',
        nombre: 'Juan',
        apellidoPaterno: 'Pérez',
        apellidoMaterno: 'González',
        rut: '19876543-2',
        rolId: roleMap['Estudiante'],
        colegioId: colegio.id
      }
    ];

    for (const userData of usuarios) {
      const { password, ...userDataWithoutPassword } = userData;
      const passwordHash = await bcrypt.hash(password, 10);

      await prisma.usuario.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          ...userDataWithoutPassword,
          passwordHash
        }
      });
    }

    // 5. Crear cursos de ejemplo
    console.log('📚 Creando cursos de ejemplo...');
    const cursos = [
      { nivel: '1°', letra: 'A', jornada: 'Mañana', colegioId: colegio.id },
      { nivel: '1°', letra: 'B', jornada: 'Mañana', colegioId: colegio.id },
      { nivel: '2°', letra: 'A', jornada: 'Mañana', colegioId: colegio.id },
      { nivel: '3°', letra: 'A', jornada: 'Tarde', colegioId: colegio.id }
    ];

    for (const cursoData of cursos) {
      await prisma.curso.upsert({
        where: {
          id: cursos.indexOf(cursoData) + 1
        },
        update: {},
        create: cursoData
      });
    }

    // 6. Crear asignaturas de ejemplo
    console.log('📖 Creando asignaturas de ejemplo...');
    const asignaturas = [
      { nombre: 'Matemáticas', cursoId: 1, colegioId: colegio.id },
      { nombre: 'Lenguaje y Comunicación', cursoId: 1, colegioId: colegio.id },
      { nombre: 'Historia', cursoId: 1, colegioId: colegio.id },
      { nombre: 'Ciencias Naturales', cursoId: 2, colegioId: colegio.id },
      { nombre: 'Inglés', cursoId: 2, colegioId: colegio.id }
    ];

    for (const asignaturaData of asignaturas) {
      await prisma.asignatura.upsert({
        where: {
          id: asignaturas.indexOf(asignaturaData) + 1
        },
        update: {},
        create: asignaturaData
      });
    }

    // 7. Crear estudiante vinculado al usuario
    console.log('🎓 Creando registro de estudiante...');
    const estudianteUser = await prisma.usuario.findUnique({
      where: { email: 'estudiante@sanpatricio.cl' }
    });

    if (estudianteUser) {
      await prisma.estudiante.upsert({
        where: { usuarioId: estudianteUser.id },
        update: {},
        create: {
          usuarioId: estudianteUser.id,
          cursoId: 1 // 1° A
        }
      });
    }

    console.log('✅ Seeding completado exitosamente!');
    console.log('\n📋 Usuarios creados:');
    console.log('- superadmin@edumetrics.com / superadmin123');
    console.log('- admin@sanpatricio.cl / admin123');
    console.log('- utp@sanpatricio.cl / utp123');
    console.log('- profesor@sanpatricio.cl / profesor123');
    console.log('- estudiante@sanpatricio.cl / estudiante123');

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Proceso de seeding finalizado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
