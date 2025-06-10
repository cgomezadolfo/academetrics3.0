const { prisma } = require('../config/database');

// Crear pregunta
exports.createPregunta = async (req, res) => {
  try {
    const { evaluacionId, tipoPregunta, enunciado, rutaImagen, puntajeMaximo, orden } = req.body;
    const pregunta = await prisma.pregunta.create({
      data: { evaluacionId, tipoPregunta, enunciado, rutaImagen, puntajeMaximo, orden }
    });
    res.status(201).json(pregunta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar preguntas
exports.getPreguntas = async (req, res) => {
  try {
    const preguntas = await prisma.pregunta.findMany();
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar pregunta
exports.updatePregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const preguntaExists = await prisma.pregunta.findUnique({
      where: { id: Number(id) },
    });
    if (!preguntaExists) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }
    const data = req.body;
    const pregunta = await prisma.pregunta.update({
      where: { id: Number(id) },
      data,
    });
    res.json(pregunta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar pregunta
exports.deletePregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const preguntaExists = await prisma.pregunta.findUnique({
      where: { id: Number(id) },
    });
    if (!preguntaExists) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }
    await prisma.pregunta.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Pregunta eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};