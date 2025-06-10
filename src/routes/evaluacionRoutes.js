const express = require('express');
const router = express.Router();
const evaluacionController = require('../controllers/evaluacionController');
const { authenticate, requirePermission, requireResourceOwnership } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Rutas con permisos específicos
router.post('/', requirePermission('evaluaciones:create'), evaluacionController.createEvaluacion);
router.get('/', requirePermission('evaluaciones:read'), evaluacionController.getEvaluaciones);
router.put('/:id', requirePermission('evaluaciones:update'), evaluacionController.updateEvaluacion);
router.delete('/:id', requirePermission('evaluaciones:delete'), evaluacionController.deleteEvaluacion);

module.exports = router;