const { validateRequiredFields, generateValidationMessage } = require('../utils/validation');
const { prisma } = require('../config/database');

// Crear asignatura
exports.createAsignatura = async (req, res) => {
  try {
    const { nombre, cursoId } = req.body;
    
    // Validar campos obligatorios
    const requiredFields = ['nombre', 'cursoId'];
    const fieldLabels = {
      nombre: 'Nombre de la asignatura',
      cursoId: 'Curso'
    };

    const validation = validateRequiredFields(req.body, requiredFields, fieldLabels);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: generateValidationMessage('asignatura', 'crear', validation.errors)
      });
    }

    // Verificar que el curso existe
    const targetCurso = await prisma.curso.findUnique({ 
      where: { id: Number(cursoId) },
      include: { colegio: true }
    });
    if (!targetCurso) {
      return res.status(400).json({ 
        error: 'No se puede crear la asignatura: El curso seleccionado no existe' 
      });
    }

    const asignatura = await prisma.asignatura.create({
      data: { 
        nombre: nombre.trim(), 
        cursoId: Number(cursoId) 
      },
      include: {
        curso: {
          include: {
            colegio: true
          }
        }
      }
    });
    
    res.status(201).json(asignatura);
  } catch (error) {
    console.error('💥 Error en createAsignatura:', error);
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'No se puede crear la asignatura: Ya existe una asignatura con este nombre en el curso seleccionado'
      });
    }
    
    res.status(400).json({ 
      error: 'No se puede crear la asignatura: Ha ocurrido un error inesperado. Verifique que todos los datos estén correctos.'
    });
  }
};

// Listar asignaturas
exports.getAsignaturas = async (req, res) => {
  try {
    const asignaturas = await prisma.asignatura.findMany();
    res.json(asignaturas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener asignatura por ID
exports.getAsignaturaById = async (req, res) => {
  try {
    const { id } = req.params;
    const asignatura = await prisma.asignatura.findUnique({
      where: { id: Number(id) },
      include: {
        curso: {
          include: {
            colegio: true
          }
        }
      }
    });
    
    if (!asignatura) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }
    
    res.json(asignatura);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar asignatura
exports.updateAsignatura = async (req, res) => {
  try {
    console.log('🔍 PUT /asignaturas/:id iniciado');
    console.log('🔍 ID del parámetro:', req.params.id);
    console.log('🔍 Datos recibidos en req.body:', req.body);
    
    const { id } = req.params;
    const data = req.body;
    
    // Verificar que la asignatura existe
    const asignaturaExists = await prisma.asignatura.findUnique({
      where: { id: Number(id) },
    });
    if (!asignaturaExists) {
      console.log('❌ Asignatura no encontrada con ID:', id);
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }

    console.log('✅ Asignatura encontrada:', asignaturaExists);

    // Validar campos que se están intentando cambiar
    const allowedFields = ['nombre', 'cursoId'];
    const providedFields = Object.keys(data);
    const invalidFields = providedFields.filter(field => !allowedFields.includes(field));
    
    // Solo mostrar advertencia de campos inválidos, pero continuar (para compatibilidad con frontend)
    if (invalidFields.length > 0) {
      console.log('⚠️ Campos ignorados (no válidos):', invalidFields);
    }

    // Filtrar solo los campos válidos
    const filteredData = {};
    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        filteredData[field] = data[field];
      }
    });

    console.log('📤 Datos filtrados para actualización:', filteredData);

    // Validar campos obligatorios que no estén vacíos
    for (const field of Object.keys(filteredData)) {
      if (filteredData[field] === null || filteredData[field] === '') {
        const fieldLabels = {
          nombre: 'Nombre de la asignatura',
          cursoId: 'Curso'
        };
        console.log(`❌ Campo vacío detectado: ${field}`);
        return res.status(400).json({
          error: `No se puede actualizar la asignatura: El campo ${fieldLabels[field]} no puede estar vacío`
        });
      }
    }

    // Verificar que el curso existe si se está cambiando
    if (filteredData.cursoId) {
      console.log('🔍 Verificando que el curso existe:', filteredData.cursoId);
      const targetCurso = await prisma.curso.findUnique({ 
        where: { id: Number(filteredData.cursoId) },
        include: { colegio: true }
      });
      if (!targetCurso) {
        console.log('❌ Curso no encontrado con ID:', filteredData.cursoId);
        return res.status(400).json({ 
          error: 'No se puede actualizar la asignatura: El curso seleccionado no existe'
        });
      }
      console.log('✅ Curso encontrado:', targetCurso);
    }

    // Procesar datos para actualización
    const updateData = {};
    if (filteredData.nombre) updateData.nombre = filteredData.nombre.trim();
    if (filteredData.cursoId) updateData.cursoId = Number(filteredData.cursoId);

    console.log('📝 Datos finales para actualizar en BD:', updateData);

    const asignatura = await prisma.asignatura.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        curso: {
          include: {
            colegio: true
          }
        }
      }
    });
    
    console.log('✅ Asignatura actualizada exitosamente:', asignatura);
    res.json(asignatura);
  } catch (error) {
    console.error('💥 Error en updateAsignatura:', error);
    console.error('💥 Stack trace:', error.stack);
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'No se puede actualizar la asignatura: Ya existe una asignatura con este nombre en el curso seleccionado'
      });
    }
    
    res.status(400).json({ 
      error: 'No se puede actualizar la asignatura: Ha ocurrido un error inesperado. Verifique que todos los datos estén correctos.'
    });
  }
};

// Eliminar asignatura
exports.deleteAsignatura = async (req, res) => {
  try {
    const { id } = req.params;
    const asignaturaExists = await prisma.asignatura.findUnique({
      where: { id: Number(id) },
    });
    if (!asignaturaExists) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }
    await prisma.asignatura.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Asignatura eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};