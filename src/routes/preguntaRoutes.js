const express = require('express');
const router = express.Router();
const preguntaController = require('../controllers/preguntaController');
const { authenticate, requirePermission } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Rutas con permisos específicos
router.post('/', requirePermission('preguntas:create'), preguntaController.createPregunta);
router.get('/', requirePermission('preguntas:read'), preguntaController.getPreguntas);
router.put('/:id', requirePermission('preguntas:update'), preguntaController.updatePregunta);
router.delete('/:id', requirePermission('preguntas:delete'), preguntaController.deletePregunta);

module.exports = router;