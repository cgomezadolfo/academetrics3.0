const { prisma } = require('../config/database');

// Crear evaluación
exports.createEvaluacion = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      puntajeTotal,
      asignaturaId,
      estado,
      mostrarCalificaciones,
      notaMinima,
      notaMaxima,
      porcentajeAprobacion
    } = req.body;

    const currentUser = req.user;
    const currentRole = currentUser.rol.nombre;

    // Verificar que la asignatura existe y pertenece al colegio correcto
    const asignatura = await prisma.asignatura.findUnique({
      where: { id: Number(asignaturaId) },
      include: { curso: true }
    });

    if (!asignatura) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }

    // Verificar permisos de colegio
    if (currentRole !== 'Superadmin' && asignatura.curso.colegioId !== currentUser.colegioId) {
      return res.status(403).json({ 
        error: 'Solo puedes crear evaluaciones en tu propio colegio' 
      });
    }

    const evaluacion = await prisma.evaluacion.create({
      data: {
        titulo,
        descripcion,
        puntajeTotal,
        profesorId: currentUser.id, // Siempre el usuario actual
        asignaturaId: Number(asignaturaId),
        colegioId: currentUser.colegioId,
        estado: estado || 'Borrador',
        mostrarCalificaciones: mostrarCalificaciones ?? true,
        notaMinima,
        notaMaxima,
        porcentajeAprobacion
      },
      include: {
        profesor: {
          select: {
            id: true,
            nombre: true,
            apellidoPaterno: true,
            apellidoMaterno: true
          }
        },
        asignatura: true,
        colegio: true
      }
    });

    res.status(201).json(evaluacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Listar evaluaciones
exports.getEvaluaciones = async (req, res) => {
  try {
    const currentUser = req.user;
    const currentRole = currentUser.rol.nombre;

    let whereClause = {};

    // Filtrar según el rol
    if (currentRole === 'Estudiante') {
      // Los estudiantes solo ven evaluaciones de sus cursos y asignaturas
      const estudiante = await prisma.estudiante.findUnique({
        where: { usuarioId: currentUser.id },
        include: { curso: { include: { asignaturas: true } } }
      });

      if (estudiante) {
        const asignaturaIds = estudiante.curso.asignaturas.map(a => a.id);
        whereClause.asignaturaId = { in: asignaturaIds };
        whereClause.estado = 'Publicada'; // Solo evaluaciones publicadas
      } else {
        whereClause.id = -1; // No encontrar nada si no es estudiante
      }
    } else if (currentRole === 'Profesor') {
      // Los profesores ven sus propias evaluaciones + las de su colegio si tienen permisos
      whereClause.OR = [
        { profesorId: currentUser.id },
        { colegioId: currentUser.colegioId }
      ];
    } else if (['UTP', 'Admin'].includes(currentRole)) {
      // UTP y Admin ven evaluaciones de su colegio
      whereClause.colegioId = currentUser.colegioId;
    }
    // Superadmin ve todas (sin filtro)

    const evaluaciones = await prisma.evaluacion.findMany({
      where: whereClause,
      include: {
        profesor: {
          select: {
            id: true,
            nombre: true,
            apellidoPaterno: true,
            apellidoMaterno: true
          }
        },
        asignatura: {
          include: {
            curso: true
          }
        },
        colegio: true,
        _count: {
          select: {
            preguntas: true,
            aplicaciones: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(evaluaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar evaluación
exports.updateEvaluacion = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = req.resource; // Viene del middleware requireResourceOwnership
    const data = req.body;

    // No permitir cambio de profesor
    if (data.profesorId) {
      delete data.profesorId;
    }

    // No permitir cambio de colegio
    if (data.colegioId) {
      delete data.colegioId;
    }

    const evaluacion = await prisma.evaluacion.update({
      where: { id: Number(id) },
      data,
      include: {
        profesor: {
          select: {
            id: true,
            nombre: true,
            apellidoPaterno: true,
            apellidoMaterno: true
          }
        },
        asignatura: {
          include: { curso: true }
        },
        colegio: true
      }
    });

    res.json(evaluacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar evaluación
exports.deleteEvaluacion = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = req.resource; // Viene del middleware requireResourceOwnership

    // Verificar que no tenga aplicaciones
    const aplicaciones = await prisma.aplicacionEvaluacion.findMany({
      where: { evaluacionId: Number(id) }
    });

    if (aplicaciones.length > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar la evaluación porque ya tiene aplicaciones' 
      });
    }

    await prisma.evaluacion.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Evaluación eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};