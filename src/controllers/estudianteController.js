const { prisma } = require('../config/database');

// Crear estudiante
exports.createEstudiante = async (req, res) => {
  try {
    const { usuarioId, cursoId } = req.body;
    const estudiante = await prisma.estudiante.create({
      data: { usuarioId, cursoId }
    });
    res.status(201).json(estudiante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar estudiantes
exports.getEstudiantes = async (req, res) => {
  try {
    const estudiantes = await prisma.estudiante.findMany({
      include: {
        usuario: {
          include: {
            rol: true,
            colegio: true
          }
        },
        curso: true
      }
    });
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar estudiante
exports.updateEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const estudianteExists = await prisma.estudiante.findUnique({
      where: { id: Number(id) },
    });
    if (!estudianteExists) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    const data = req.body;
    const estudiante = await prisma.estudiante.update({
      where: { id: Number(id) },
      data,
    });
    res.json(estudiante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar estudiante
exports.deleteEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const estudianteExists = await prisma.estudiante.findUnique({
      where: { id: Number(id) },
    });
    if (!estudianteExists) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    await prisma.estudiante.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};