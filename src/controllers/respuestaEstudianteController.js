const { prisma } = require('../config/database');

// Crear respuesta
exports.createRespuesta = async (req, res) => {
  try {
    const { calificacionId, preguntaId, respuestaTexto, alternativaSeleccionadaId, puntajeObtenidoPregunta, esCorrecta } = req.body;
    const respuesta = await prisma.respuestaEstudiante.create({
      data: { calificacionId, preguntaId, respuestaTexto, alternativaSeleccionadaId, puntajeObtenidoPregunta, esCorrecta }
    });
    res.status(201).json(respuesta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar respuestas
exports.getRespuestas = async (req, res) => {
  try {
    const respuestas = await prisma.respuestaEstudiante.findMany();
    res.json(respuestas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar respuesta
exports.updateRespuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const respuestaExists = await prisma.respuestaEstudiante.findUnique({
      where: { id: Number(id) },
    });
    if (!respuestaExists) {
      return res.status(404).json({ error: 'Respuesta no encontrada' });
    }
    const data = req.body;
    const respuesta = await prisma.respuestaEstudiante.update({
      where: { id: Number(id) },
      data,
    });
    res.json(respuesta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar respuesta
exports.deleteRespuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const respuestaExists = await prisma.respuestaEstudiante.findUnique({
      where: { id: Number(id) },
    });
    if (!respuestaExists) {
      return res.status(404).json({ error: 'Respuesta no encontrada' });
    }
    await prisma.respuestaEstudiante.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Respuesta eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};