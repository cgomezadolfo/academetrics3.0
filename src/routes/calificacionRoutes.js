const express = require('express');
const router = express.Router();
const controller = require('../controllers/calificacionController');
const { authenticate, requirePermission } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Rutas con permisos específicos
router.post('/', requirePermission('calificaciones:create'), controller.createCalificacion);
router.get('/', requirePermission('calificaciones:read'), controller.getCalificaciones);
router.put('/:id', requirePermission('calificaciones:update'), controller.updateCalificacion);
router.delete('/:id', requirePermission('calificaciones:delete'), controller.deleteCalificacion);

module.exports = router;