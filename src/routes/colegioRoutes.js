const express = require('express');
const router = express.Router();
const colegioController = require('../controllers/colegioController');
const { authenticate, requirePermission } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Rutas con permisos específicos
router.post('/', requirePermission('colegios:create'), colegioController.createColegio);
router.get('/', requirePermission('colegios:read'), colegioController.getColegios);
router.put('/:id', requirePermission('colegios:update'), colegioController.updateColegio);
router.delete('/:id', requirePermission('colegios:delete'), colegioController.deleteColegio);

module.exports = router;