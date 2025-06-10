const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getRolePermissions } = require('../config/permissions');
const { prisma } = require('../config/database');

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar el usuario por email
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { 
        rol: true, 
        colegio: true,
        estudiante: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    if (!user.activo) {
      return res.status(401).json({ 
        error: 'Usuario inactivo' 
      });
    }

    // Verificar contraseña (en producción usar bcrypt)
    // const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    // Por ahora comparación directa para desarrollo
    const passwordMatch = password === user.passwordHash;

    if (!passwordMatch) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        roleId: user.rolId,
        roleName: user.rol.nombre,
        colegioId: user.colegioId
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Obtener permisos del usuario
    const permissions = getRolePermissions(user.rol.nombre);

    // Preparar respuesta sin contraseña
    const { passwordHash, ...userResponse } = user;

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        ...userResponse,
        permissions
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Verificar que el usuario aún existe y está activo
      const user = await prisma.usuario.findUnique({
        where: { id: decoded.userId },
        include: { rol: true, colegio: true }
      });

      if (!user || !user.activo) {
        return res.status(401).json({ error: 'Usuario no válido' });
      }

      // Generar nuevo token
      const newToken = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          roleId: user.rolId,
          roleName: user.rol.nombre,
          colegioId: user.colegioId
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({ token: newToken });

    } catch (jwtError) {
      return res.status(401).json({ error: 'Token inválido' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout (invalidar token del lado del cliente)
exports.logout = (req, res) => {
  res.json({ 
    message: 'Logout exitoso. Token invalidado del lado del cliente.' 
  });
};

// Obtener perfil del usuario actual
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    const permissions = getRolePermissions(user.rol.nombre);

    const { passwordHash, ...userProfile } = user;

    res.json({
      ...userProfile,
      permissions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Contraseña actual y nueva contraseña son requeridas' 
      });
    }

    const user = await prisma.usuario.findUnique({
      where: { id: userId }
    });

    // Verificar contraseña actual
    // const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    const passwordMatch = currentPassword === user.passwordHash;

    if (!passwordMatch) {
      return res.status(400).json({ 
        error: 'Contraseña actual incorrecta' 
      });
    }

    // Hashear nueva contraseña (en producción usar bcrypt)
    // const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const hashedNewPassword = newPassword; // Para desarrollo

    await prisma.usuario.update({
      where: { id: userId },
      data: { passwordHash: hashedNewPassword }
    });

    res.json({ 
      message: 'Contraseña actualizada correctamente' 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
