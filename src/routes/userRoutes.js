const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, requirePermission, canManageUser } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Rutas con permisos específicos
router.post('/', requirePermission('usuarios:create'), userController.createUser);
router.get('/', requirePermission('usuarios:read'), userController.getUsers);
router.get('/:id', requirePermission('usuarios:read'), canManageUser, userController.getUserById);
router.put('/:id', requirePermission('usuarios:update'), canManageUser, userController.updateUser);
router.delete('/:id', requirePermission('usuarios:delete'), canManageUser, userController.deleteUser);

module.exports = router;