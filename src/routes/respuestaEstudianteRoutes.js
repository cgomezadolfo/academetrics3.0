const express = require('express');
const router = express.Router();
const controller = require('../controllers/respuestaEstudianteController');
const { authenticate, requirePermission } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Rutas con permisos específicos
router.post('/', requirePermission('respuestas:create'), controller.createRespuesta);
router.get('/', requirePermission('respuestas:read'), controller.getRespuestas);
router.put('/:id', requirePermission('respuestas:update'), controller.updateRespuesta);
router.delete('/:id', requirePermission('respuestas:delete'), controller.deleteRespuesta);

module.exports = router;