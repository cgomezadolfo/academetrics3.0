const express = require('express');
const router = express.Router();
const controller = require('../controllers/aplicacionEvaluacionController');
const { authenticate, requirePermission } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Rutas con permisos específicos
router.post('/', requirePermission('aplicaciones:create'), controller.createAplicacion);
router.get('/', requirePermission('aplicaciones:read'), controller.getAplicaciones);
router.put('/:id', requirePermission('aplicaciones:update'), controller.updateAplicacion);
router.delete('/:id', requirePermission('aplicaciones:delete'), controller.deleteAplicacion);

module.exports = router;