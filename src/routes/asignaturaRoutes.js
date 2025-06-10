const express = require('express');
const router = express.Router();
const asignaturaController = require('../controllers/asignaturaController');
const { authenticate, requirePermission, requireSameCollege } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Rutas con permisos específicos
router.post('/', requirePermission('asignaturas:create'), requireSameCollege('asignatura'), asignaturaController.createAsignatura);
router.get('/', requirePermission('asignaturas:read'), asignaturaController.getAsignaturas);
router.get('/:id', requirePermission('asignaturas:read'), requireSameCollege('asignatura'), asignaturaController.getAsignaturaById);
router.put('/:id', requirePermission('asignaturas:update'), requireSameCollege('asignatura'), asignaturaController.updateAsignatura);
router.delete('/:id', requirePermission('asignaturas:delete'), requireSameCollege('asignatura'), asignaturaController.deleteAsignatura);

module.exports = router;