const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticate, requirePermission } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Rutas con permisos específicos
router.post('/', requirePermission('roles:create'), roleController.createRole);
router.get('/', requirePermission('roles:read'), roleController.getRoles);
router.put('/:id', requirePermission('roles:update'), roleController.updateRole);
router.delete('/:id', requirePermission('roles:delete'), roleController.deleteRole);

module.exports = router;