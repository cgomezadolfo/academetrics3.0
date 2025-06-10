const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear colegio
exports.createColegio = async (req, res) => {
  try {
    const { nombre, direccion, telefono } = req.body;
    const colegio = await prisma.colegio.create({
      data: { nombre, direccion, telefono }
    });
    res.status(201).json(colegio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar colegios
exports.getColegios = async (req, res) => {
  try {
    const currentUser = req.user;
    const currentRole = currentUser.rol.nombre;

    let whereClause = {};

    // Si no es Superadmin, solo puede ver su propio colegio
    if (currentRole !== 'Superadmin') {
      whereClause.id = currentUser.colegioId;
    }

    const colegios = await prisma.colegio.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            usuarios: true,
            cursos: true,
            evaluaciones: true
          }
        }
      }
    });

    res.json(colegios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar colegio
exports.updateColegio = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    const currentRole = currentUser.rol.nombre;

    // Verificar que existe el colegio
    const colegioExists = await prisma.colegio.findUnique({
      where: { id: Number(id) },
    });
    
    if (!colegioExists) {
      return res.status(404).json({ error: 'Colegio no encontrado' });
    }

    // Solo Superadmin y Admin del mismo colegio pueden actualizar
    if (currentRole !== 'Superadmin' && currentUser.colegioId !== Number(id)) {
      return res.status(403).json({ 
        error: 'Solo puedes actualizar tu propio colegio' 
      });
    }

    const data = req.body;
    const colegio = await prisma.colegio.update({
      where: { id: Number(id) },
      data,
    });
    
    res.json(colegio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar colegio
exports.deleteColegio = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que existe el colegio
    const colegioExists = await prisma.colegio.findUnique({
      where: { id: Number(id) },
      include: {
        _count: {
          select: {
            usuarios: true,
            cursos: true,
            evaluaciones: true
          }
        }
      }
    });
    
    if (!colegioExists) {
      return res.status(404).json({ error: 'Colegio no encontrado' });
    }

    // Verificar que no tenga datos dependientes
    if (colegioExists._count.usuarios > 0 || 
        colegioExists._count.cursos > 0 || 
        colegioExists._count.evaluaciones > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el colegio porque tiene datos asociados' 
      });
    }

    await prisma.colegio.delete({
      where: { id: Number(id) },
    });
    
    res.json({ message: 'Colegio eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};