const bcrypt = require('bcrypt');
const { validateRequiredFields, validateEmail, validateRUT, generateValidationMessage } = require('../utils/validation');
const { prisma } = require('../config/database');

// Crear usuario
exports.createUser = async (req, res) => {
  try {
    const { email, password, nombre, apellidoPaterno, apellidoMaterno, rut, rolId, colegioId } = req.body;
    const currentUser = req.user;
    const currentRole = currentUser.rol.nombre;

    // Validar campos obligatorios
    const requiredFields = ['email', 'password', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'rut', 'rolId', 'colegioId'];
    const fieldLabels = {
      email: 'Email',
      password: 'Contraseña',
      nombre: 'Nombre',
      apellidoPaterno: 'Apellido Paterno',
      apellidoMaterno: 'Apellido Materno',
      rut: 'RUT',
      rolId: 'Rol',
      colegioId: 'Colegio'
    };

    const validation = validateRequiredFields(req.body, requiredFields, fieldLabels);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: generateValidationMessage('usuario', 'crear', validation.errors)
      });
    }

    // Validar formato de email
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: 'No se puede crear el usuario: El formato del email no es válido'
      });
    }

    // Validar formato de RUT
    if (!validateRUT(rut)) {
      return res.status(400).json({ 
        error: 'No se puede crear el usuario: El formato del RUT no es válido'
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'No se puede crear el usuario: La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Validar que tenga permisos para crear usuarios en este colegio
    if (currentRole !== 'Superadmin' && colegioId !== currentUser.colegioId) {
      return res.status(403).json({ 
        error: 'Solo puedes crear usuarios en tu propio colegio' 
      });
    }

    // Verificar que no esté creando un usuario con rol superior
    const targetRole = await prisma.rol.findUnique({ where: { id: Number(rolId) } });
    if (!targetRole) {
      return res.status(400).json({ error: 'No se puede crear el usuario: El rol seleccionado no existe' });
    }

    const { canManageRole } = require('../config/permissions');
    if (!canManageRole(currentRole, targetRole.nombre)) {
      return res.status(403).json({ 
        error: `No puedes crear usuarios con rol ${targetRole.nombre}` 
      });
    }

    // Verificar que el colegio existe
    const targetColegio = await prisma.colegio.findUnique({ where: { id: Number(colegioId) } });
    if (!targetColegio) {
      return res.status(400).json({ error: 'No se puede crear el usuario: El colegio seleccionado no existe' });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.usuario.create({
      data: {
        email,
        passwordHash,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        rut,
        rolId: Number(rolId),
        colegioId: Number(colegioId),
      },
      include: {
        rol: true,
        colegio: true
      }
    });

    // No devolver el hash de la contraseña
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    // Manejar errores específicos de Prisma
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      if (field === 'email') {
        return res.status(400).json({ 
          error: 'No se puede crear el usuario: Ya existe un usuario con este email'
        });
      } else if (field === 'rut') {
        return res.status(400).json({ 
          error: 'No se puede crear el usuario: Ya existe un usuario con este RUT'
        });
      }
    }
    
    console.error('💥 Error en createUser:', error);
    res.status(400).json({ 
      error: 'No se puede crear el usuario: Ha ocurrido un error inesperado. Verifique que todos los datos estén correctos.'
    });
  }
};

// Listar usuarios
exports.getUsers = async (req, res) => {
  try {
    const currentUser = req.user;
    const currentRole = currentUser.rol.nombre;

    let whereClause = {};

    // Filtrar por colegio si no es Superadmin
    if (currentRole !== 'Superadmin') {
      whereClause.colegioId = currentUser.colegioId;
    }    const users = await prisma.usuario.findMany({
      where: whereClause,
      include: {
        rol: true,
        colegio: true
      }
    });

    // Remove passwordHash from response for security
    const safeUsers = users.map(user => {
      const { passwordHash, ...safeUser } = user;
      return safeUser;
    });

    res.json(safeUsers);  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuario específico por ID
exports.getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const currentUser = req.user;
    const currentRole = currentUser.rol.nombre;

    // Validar que el ID sea un número válido
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    // Construir condiciones de búsqueda
    let whereClause = { id: userId };

    // Si no es Superadmin, solo puede ver usuarios de su mismo colegio
    if (currentRole !== 'Superadmin') {
      whereClause.colegioId = currentUser.colegioId;
    }

    const user = await prisma.usuario.findFirst({
      where: whereClause,
      include: {
        rol: true,
        colegio: true
      }
    });

    // Si no se encuentra el usuario
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado o no tienes permisos para verlo' 
      });
    }

    // Remover passwordHash por seguridad
    const { passwordHash, ...safeUser } = user;

    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    console.log('🔍 PUT /usuarios/:id iniciado');
    console.log('🔍 ID del parámetro:', req.params.id);
    console.log('🔍 Datos recibidos en req.body:', req.body);
    console.log('🔍 Usuario actual (req.user):', req.user ? {
      id: req.user.id,
      nombre: req.user.nombre,
      rol: req.user.rol.nombre
    } : 'No hay usuario');
    console.log('🔍 targetUser:', req.targetUser ? {
      id: req.targetUser.id,
      nombre: req.targetUser.nombre,
      rol: req.targetUser.rol.nombre
    } : 'No hay targetUser');
    console.log('🔍 isSelfManagement:', req.isSelfManagement);

    const { id } = req.params;
    const data = req.body;
    const currentUser = req.user;
    const targetUser = req.targetUser; // Viene del middleware canManageUser    // Si es autogestión, limitar campos que puede cambiar
    if (req.isSelfManagement) {
      console.log('✅ Es autogestión - aplicando restricciones');
      const allowedFields = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'email'];
      const filteredData = {};
      
      // Validar campos que se están intentando cambiar
      const providedFields = Object.keys(data);
      const invalidFields = providedFields.filter(field => 
        !allowedFields.includes(field) && field !== 'password'
      );
      
      if (invalidFields.length > 0) {
        return res.status(403).json({
          error: `No puedes modificar los siguientes campos: ${invalidFields.join(', ')}`
        });
      }

      // Validar campos obligatorios que no estén vacíos
      allowedFields.forEach(field => {
        if (data[field] !== undefined) {
          if (data[field] === null || data[field] === '') {
            return res.status(400).json({
              error: `No se puede actualizar el usuario: El campo ${field} no puede estar vacío`
            });
          }
          filteredData[field] = data[field];
        }
      });

      // Validar email si se está cambiando
      if (filteredData.email && !validateEmail(filteredData.email)) {
        return res.status(400).json({ 
          error: 'No se puede actualizar el usuario: El formato del email no es válido'
        });
      }

      // Hash de nueva contraseña si se proporciona
      if (data.password) {
        if (data.password.length < 6) {
          return res.status(400).json({ 
            error: 'No se puede actualizar el usuario: La contraseña debe tener al menos 6 caracteres'
          });
        }
        console.log('🔒 Hasheando nueva contraseña para autogestión');
        filteredData.passwordHash = await bcrypt.hash(data.password, 10);
      }

      console.log('📤 Datos filtrados para autogestión:', filteredData);const user = await prisma.usuario.update({
        where: { id: Number(id) },
        data: filteredData,
        select: {
          id: true,
          email: true,
          nombre: true,
          apellidoPaterno: true,
          apellidoMaterno: true,
          rut: true,
          activo: true,
          createdAt: true,
          updatedAt: true,
          rol: true,
          colegio: true
        }
      });

      console.log('✅ Usuario actualizado exitosamente (autogestión)');
      return res.json(user);
    }    console.log('✅ No es autogestión - verificando gestión de otros usuarios');

    // Validar campos que se están intentando cambiar
    const allowedFields = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'email', 'rut', 'rolId', 'colegioId', 'activo'];
    const providedFields = Object.keys(data);
    const invalidFields = providedFields.filter(field => 
      !allowedFields.includes(field) && field !== 'password'
    );
    
    if (invalidFields.length > 0) {
      return res.status(400).json({
        error: `No se puede actualizar el usuario: Los siguientes campos no son válidos: ${invalidFields.join(', ')}`
      });
    }

    // Validar campos obligatorios que no estén vacíos
    const requiredFields = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'email', 'rut'];
    for (const field of requiredFields) {
      if (data[field] !== undefined && (data[field] === null || data[field] === '')) {
        return res.status(400).json({
          error: `No se puede actualizar el usuario: El campo ${field} no puede estar vacío`
        });
      }
    }

    // Validar email si se está cambiando
    if (data.email && !validateEmail(data.email)) {
      return res.status(400).json({ 
        error: 'No se puede actualizar el usuario: El formato del email no es válido'
      });
    }

    // Validar RUT si se está cambiando
    if (data.rut && !validateRUT(data.rut)) {
      return res.status(400).json({ 
        error: 'No se puede actualizar el usuario: El formato del RUT no es válido'
      });
    }

    // Para gestión de otros usuarios, validar cambios de rol
    if (data.rolId) {
      console.log('🔍 Verificando cambio de rol a:', data.rolId);
      const newRole = await prisma.rol.findUnique({ where: { id: Number(data.rolId) } });
      
      if (!newRole) {
        return res.status(400).json({ 
          error: 'No se puede actualizar el usuario: El rol seleccionado no existe'
        });
      }
      
      const { canManageRole } = require('../config/permissions');
      
      if (!canManageRole(currentUser.rol.nombre, newRole.nombre)) {
        console.log('❌ No puede asignar el rol:', newRole.nombre);
        return res.status(403).json({ 
          error: `No puedes asignar el rol ${newRole.nombre}` 
        });
      }
      console.log('✅ Puede asignar el rol:', newRole.nombre);
    }

    // Validar colegio si se está cambiando
    if (data.colegioId) {
      const targetColegio = await prisma.colegio.findUnique({ where: { id: Number(data.colegioId) } });
      if (!targetColegio) {
        return res.status(400).json({ 
          error: 'No se puede actualizar el usuario: El colegio seleccionado no existe'
        });
      }
    }

    // Hash de nueva contraseña si se proporciona
    if (data.password) {
      if (data.password.length < 6) {
        return res.status(400).json({ 
          error: 'No se puede actualizar el usuario: La contraseña debe tener al menos 6 caracteres'
        });
      }
      console.log('🔒 Hasheando nueva contraseña');
      data.passwordHash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }

    console.log('📤 Datos finales a actualizar:', data);    const user = await prisma.usuario.update({
      where: { id: Number(id) },
      data,
      select: {
        id: true,
        email: true,
        nombre: true,
        apellidoPaterno: true,
        apellidoMaterno: true,
        rut: true,
        activo: true,
        createdAt: true,
        updatedAt: true,
        rol: true,
        colegio: true
      }
    });

    console.log('✅ Usuario actualizado exitosamente');
    res.json(user);  } catch (error) {
    console.error('💥 Error en updateUser:', error);
    console.error('💥 Stack trace:', error.stack);
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      if (field === 'email') {
        return res.status(400).json({ 
          error: 'No se puede actualizar el usuario: Ya existe otro usuario con este email'
        });
      } else if (field === 'rut') {
        return res.status(400).json({ 
          error: 'No se puede actualizar el usuario: Ya existe otro usuario con este RUT'
        });
      }
    }
    
    res.status(400).json({ 
      error: 'No se puede actualizar el usuario: Ha ocurrido un error inesperado. Verifique que todos los datos estén correctos.'
    });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const targetUser = req.targetUser; // Viene del middleware canManageUser

    // No permitir autoelimunación
    if (req.isSelfManagement) {
      return res.status(403).json({ 
        error: 'No puedes eliminar tu propia cuenta' 
      });
    }

    await prisma.usuario.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};