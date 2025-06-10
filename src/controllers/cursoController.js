const { validateRequiredFields, generateValidationMessage } = require('../utils/validation');
const { prisma } = require('../config/database');

// Crear curso
exports.createCurso = async (req, res) => {
  try {
    const { nivel, letra, jornada, colegioId } = req.body;
    
    // Validar campos obligatorios
    const requiredFields = ['nivel', 'letra', 'jornada', 'colegioId'];
    const fieldLabels = {
      nivel: 'Nivel',
      letra: 'Letra',
      jornada: 'Jornada',
      colegioId: 'Colegio'
    };

    const validation = validateRequiredFields(req.body, requiredFields, fieldLabels);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: generateValidationMessage('curso', 'crear', validation.errors)
      });
    }

    // Verificar que el colegio existe
    const targetColegio = await prisma.colegio.findUnique({ where: { id: Number(colegioId) } });
    if (!targetColegio) {
      return res.status(400).json({ 
        error: 'No se puede crear el curso: El colegio seleccionado no existe' 
      });
    }

    const curso = await prisma.curso.create({
      data: { 
        nivel: nivel.trim(), 
        letra: letra.trim().toUpperCase(), 
        jornada: jornada.trim(), 
        colegioId: Number(colegioId) 
      },
      include: {
        colegio: true
      }
    });
    
    res.status(201).json(curso);
  } catch (error) {
    console.error('💥 Error en createCurso:', error);
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'No se puede crear el curso: Ya existe un curso con esta combinación de nivel, letra y jornada en este colegio'
      });
    }
    
    res.status(400).json({ 
      error: 'No se puede crear el curso: Ha ocurrido un error inesperado. Verifique que todos los datos estén correctos.'
    });
  }
};

// Listar cursos
exports.getCursos = async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener curso por ID
exports.getCursoById = async (req, res) => {
  try {
    const { id } = req.params;
    const curso = await prisma.curso.findUnique({
      where: { id: Number(id) },
      include: {
        colegio: true,
        asignaturas: true
      }
    });
    
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    
    res.json(curso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar curso
exports.updateCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Verificar que el curso existe
    const cursoExists = await prisma.curso.findUnique({
      where: { id: Number(id) },
    });
    if (!cursoExists) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    // Validar campos que se están intentando cambiar
    const allowedFields = ['nivel', 'letra', 'jornada', 'colegioId'];
    const providedFields = Object.keys(data);
    const invalidFields = providedFields.filter(field => !allowedFields.includes(field));
    
    if (invalidFields.length > 0) {
      return res.status(400).json({
        error: `No se puede actualizar el curso: Los siguientes campos no son válidos: ${invalidFields.join(', ')}`
      });
    }

    // Validar campos obligatorios que no estén vacíos
    for (const field of allowedFields) {
      if (data[field] !== undefined && (data[field] === null || data[field] === '')) {
        const fieldLabels = {
          nivel: 'Nivel',
          letra: 'Letra', 
          jornada: 'Jornada',
          colegioId: 'Colegio'
        };
        return res.status(400).json({
          error: `No se puede actualizar el curso: El campo ${fieldLabels[field]} no puede estar vacío`
        });
      }
    }

    // Verificar que el colegio existe si se está cambiando
    if (data.colegioId) {
      const targetColegio = await prisma.colegio.findUnique({ where: { id: Number(data.colegioId) } });
      if (!targetColegio) {
        return res.status(400).json({ 
          error: 'No se puede actualizar el curso: El colegio seleccionado no existe'
        });
      }
    }

    // Procesar datos para actualización
    const updateData = {};
    if (data.nivel) updateData.nivel = data.nivel.trim();
    if (data.letra) updateData.letra = data.letra.trim().toUpperCase();
    if (data.jornada) updateData.jornada = data.jornada.trim();
    if (data.colegioId) updateData.colegioId = Number(data.colegioId);

    const curso = await prisma.curso.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        colegio: true
      }
    });
    
    res.json(curso);
  } catch (error) {
    console.error('💥 Error en updateCurso:', error);
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'No se puede actualizar el curso: Ya existe un curso con esta combinación de nivel, letra y jornada en este colegio'
      });
    }
    
    res.status(400).json({ 
      error: 'No se puede actualizar el curso: Ha ocurrido un error inesperado. Verifique que todos los datos estén correctos.'
    });
  }
};

// Eliminar curso
exports.deleteCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const cursoExists = await prisma.curso.findUnique({
      where: { id: Number(id) },
    });
    if (!cursoExists) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    await prisma.curso.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Curso eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};