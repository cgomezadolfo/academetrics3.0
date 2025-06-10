const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');
const { authenticate, requirePermission, canAccessStudentData } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Rutas con permisos específicos
router.post('/', requirePermission('estudiantes:create'), estudianteController.createEstudiante);
router.get('/', requirePermission('estudiantes:read'), estudianteController.getEstudiantes);
router.put('/:id', requirePermission('estudiantes:update'), canAccessStudentData, estudianteController.updateEstudiante);
router.delete('/:id', requirePermission('estudiantes:delete'), canAccessStudentData, estudianteController.deleteEstudiante);

module.exports = router;