const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear aplicación de evaluación
exports.createAplicacion = async (req, res) => {
  try {
    const { evaluacionId, cursoId, fechaAplicacion } = req.body;
    const aplicacion = await prisma.aplicacionEvaluacion.create({
      data: { evaluacionId, cursoId, fechaAplicacion }
    });
    res.status(201).json(aplicacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar aplicaciones
exports.getAplicaciones = async (req, res) => {
  try {
    const aplicaciones = await prisma.aplicacionEvaluacion.findMany();
    res.json(aplicaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar aplicación
exports.updateAplicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const aplicacionExists = await prisma.aplicacionEvaluacion.findUnique({
      where: { id: Number(id) },
    });
    if (!aplicacionExists) {
      return res.status(404).json({ error: 'Aplicación no encontrada' });
    }
    const data = req.body;
    const aplicacion = await prisma.aplicacionEvaluacion.update({
      where: { id: Number(id) },
      data,
    });
    res.json(aplicacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar aplicación
exports.deleteAplicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const aplicacionExists = await prisma.aplicacionEvaluacion.findUnique({
      where: { id: Number(id) },
    });
    if (!aplicacionExists) {
      return res.status(404).json({ error: 'Aplicación no encontrada' });
    }
    await prisma.aplicacionEvaluacion.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Aplicación eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};