const express = require('express');
const router = express.Router();
const alternativaController = require('../controllers/alternativaController');
const { authenticate, requirePermission } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Rutas con permisos específicos
router.post('/', requirePermission('alternativas:create'), alternativaController.createAlternativa);
router.get('/', requirePermission('alternativas:read'), alternativaController.getAlternativas);
router.put('/:id', requirePermission('alternativas:update'), alternativaController.updateAlternativa);
router.delete('/:id', requirePermission('alternativas:delete'), alternativaController.deleteAlternativa);

module.exports = router;