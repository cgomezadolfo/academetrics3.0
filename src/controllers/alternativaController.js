const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear alternativa
exports.createAlternativa = async (req, res) => {
  try {
    const { preguntaId, textoAlternativa, esCorrecta } = req.body;
    const alternativa = await prisma.alternativa.create({
      data: { preguntaId, textoAlternativa, esCorrecta }
    });
    res.status(201).json(alternativa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar alternativas
exports.getAlternativas = async (req, res) => {
  try {
    const alternativas = await prisma.alternativa.findMany();
    res.json(alternativas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar alternativa
exports.updateAlternativa = async (req, res) => {
  try {
    const { id } = req.params;
    const alternativaExists = await prisma.alternativa.findUnique({
      where: { id: Number(id) },
    });
    if (!alternativaExists) {
      return res.status(404).json({ error: 'Alternativa no encontrada' });
    }
    const data = req.body;
    const alternativa = await prisma.alternativa.update({
      where: { id: Number(id) },
      data,
    });
    res.json(alternativa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar alternativa
exports.deleteAlternativa = async (req, res) => {
  try {
    const { id } = req.params;
    const alternativaExists = await prisma.alternativa.findUnique({
      where: { id: Number(id) },
    });
    if (!alternativaExists) {
      return res.status(404).json({ error: 'Alternativa no encontrada' });
    }
    await prisma.alternativa.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Alternativa eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};