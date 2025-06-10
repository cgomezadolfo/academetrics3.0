const { prisma } = require('../config/database');

// Crear rol
exports.createRole = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const rol = await prisma.rol.create({
      data: { nombre, descripcion }
    });
    res.status(201).json(rol);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await prisma.rol.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar rol
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const rolExists = await prisma.rol.findUnique({
      where: { id: Number(id) },
    });
    if (!rolExists) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    const data = req.body;
    const rol = await prisma.rol.update({
      where: { id: Number(id) },
      data,
    });
    res.json(rol);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar rol
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const rolExists = await prisma.rol.findUnique({
      where: { id: Number(id) },
    });
    if (!rolExists) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    await prisma.rol.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Rol eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};