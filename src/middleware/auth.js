const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { hasPermission, canManageRole, ROLE_HIERARCHY } = require('../config/permissions');

const prisma = new PrismaClient();

// Middleware de autenticación
exports.authenticate = async (req, res, next) => {
  try {
    // Verificar si hay token en el header Authorization
    const authHeader = req.headers.authorization;
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // Si no hay token, usar user-id del header para desarrollo/testing
    if (!token) {
      const userId = req.headers['user-id'];
      if (!userId) {
        return res.status(401).json({ 
          error: 'No autorizado - Token JWT o user-id requerido' 
        });
      }
      
      // Buscar el usuario directamente (modo desarrollo)
      const user = await prisma.usuario.findUnique({
        where: { id: Number(userId) },
        include: { rol: true, colegio: true }
      });

      if (!user) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      if (!user.activo) {
        return res.status(401).json({ error: 'Usuario inactivo' });
      }

      req.user = user;
      return next();
    }

    // Verificar JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Buscar el usuario con el ID del token
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      include: { rol: true, colegio: true }
    });

    if (!user || !user.activo) {
      return res.status(401).json({ error: 'Token inválido o usuario inactivo' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Middleware de autorización basado en permisos
exports.requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const userRole = req.user.rol.nombre;
    
    if (!hasPermission(userRole, permission)) {
      return res.status(403).json({ 
        error: `Acceso denegado. No tienes permisos para: ${permission}` 
      });
    }

    next();
  };
};

// Middleware de autorización por roles (método alternativo)
exports.authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const userRole = req.user.rol.nombre;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: `Acceso denegado. Se requiere uno de estos roles: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};

// Middleware para verificar si puede gestionar un usuario específico
exports.canManageUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    const targetUserId = Number(id);

    // Si es el mismo usuario, puede gestionarse a sí mismo (con limitaciones)
    if (currentUser.id === targetUserId) {
      req.isSelfManagement = true;
      return next();
    }

    // Obtener el usuario objetivo
    const targetUser = await prisma.usuario.findUnique({
      where: { id: targetUserId },
      include: { rol: true, colegio: true }
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const currentRole = currentUser.rol.nombre;
    const targetRole = targetUser.rol.nombre;

    // Verificar jerarquía de roles
    if (!canManageRole(currentRole, targetRole)) {
      return res.status(403).json({ 
        error: `No tienes permisos para gestionar un usuario con rol ${targetRole}` 
      });
    }

    // Verificar que pertenezcan al mismo colegio (excepto Superadmin)
    if (currentRole !== 'Superadmin') {
      if (currentUser.colegioId !== targetUser.colegioId) {
        return res.status(403).json({ 
          error: 'Solo puedes gestionar usuarios de tu mismo colegio' 
        });
      }
    }

    req.targetUser = targetUser;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware para verificar acceso a recursos del mismo colegio
exports.requireSameCollege = (resourceType = 'recurso') => {
  return async (req, res, next) => {
    try {
      const currentUser = req.user;
      
      // Superadmin puede acceder a cualquier colegio
      if (currentUser.rol.nombre === 'Superadmin') {
        return next();
      }

      // Para otros roles, verificar pertenencia al colegio
      // Esta lógica se puede personalizar según el tipo de recurso
      req.allowedCollegeId = currentUser.colegioId;
      
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

// Middleware para verificar si puede acceder a recursos de estudiantes
exports.canAccessStudentData = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const userRole = currentUser.rol.nombre;

    // Roles administrativos pueden ver todos los estudiantes de su colegio
    if (['Superadmin', 'Admin', 'UTP'].includes(userRole)) {
      return next();
    }

    // Profesores pueden ver estudiantes de sus cursos/asignaturas
    if (userRole === 'Profesor') {
      // Aquí podrías implementar lógica específica para verificar
      // que el profesor tenga acceso a los estudiantes específicos
      return next();
    }

    // Estudiantes solo pueden ver sus propios datos
    if (userRole === 'Estudiante') {
      const { id } = req.params;
      const estudiante = await prisma.estudiante.findUnique({
        where: { usuarioId: currentUser.id }
      });

      if (estudiante && estudiante.id === Number(id)) {
        return next();
      }

      return res.status(403).json({ 
        error: 'Solo puedes acceder a tus propios datos' 
      });
    }

    res.status(403).json({ error: 'Acceso denegado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware para verificar propiedad de recursos (evaluaciones, etc.)
exports.requireResourceOwnership = (resourceModel, ownerField = 'profesorId') => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const currentUser = req.user;
      const userRole = currentUser.rol.nombre;

      // Validar que el ID sea un número válido
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID de recurso inválido' });
      }

      // Roles administrativos pueden acceder a cualquier recurso de su colegio
      if (['Superadmin', 'Admin', 'UTP'].includes(userRole)) {
        return next();
      }

      // Verificar que el modelo existe en Prisma Client
      if (!prisma[resourceModel]) {
        console.error(`Modelo ${resourceModel} no encontrado en Prisma Client`);
        return res.status(500).json({ error: 'Error de configuración del servidor' });
      }

      // Verificar propiedad del recurso
      const resource = await prisma[resourceModel].findUnique({
        where: { id: Number(id) }
      });

      if (!resource) {
        return res.status(404).json({ error: 'Recurso no encontrado' });
      }

      // Verificar si el usuario es el propietario
      if (resource[ownerField] !== currentUser.id) {
        return res.status(403).json({ 
          error: 'Solo puedes gestionar tus propios recursos' 
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Error en requireResourceOwnership:', error);
      res.status(500).json({ error: error.message });
    }
  };
};
