const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear calificación
exports.createCalificacion = async (req, res) => {
  try {
    const { aplicacionEvaluacionId, estudianteId, puntajeObtenido, calificacionFinal, observaciones } = req.body;
    const calificacion = await prisma.calificacion.create({
      data: { aplicacionEvaluacionId, estudianteId, puntajeObtenido, calificacionFinal, observaciones }
    });
    res.status(201).json(calificacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar calificaciones
exports.getCalificaciones = async (req, res) => {
  try {
    const calificaciones = await prisma.calificacion.findMany();
    res.json(calificaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar calificación
exports.updateCalificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const calificacionExists = await prisma.calificacion.findUnique({
      where: { id: Number(id) },
    });
    if (!calificacionExists) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }
    const data = req.body;
    const calificacion = await prisma.calificacion.update({
      where: { id: Number(id) },
      data,
    });
    res.json(calificacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar calificación
exports.deleteCalificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const calificacionExists = await prisma.calificacion.findUnique({
      where: { id: Number(id) },
    });
    if (!calificacionExists) {
      return res.status(404).json({ error: 'Calificación no encontrada' });
    }
    await prisma.calificacion.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Calificación eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};