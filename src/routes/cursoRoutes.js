const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const { authenticate, requirePermission, requireSameCollege } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(authenticate);

// Rutas con permisos específicos
router.post('/', requirePermission('cursos:create'), requireSameCollege('curso'), cursoController.createCurso);
router.get('/', requirePermission('cursos:read'), cursoController.getCursos);
router.get('/:id', requirePermission('cursos:read'), requireSameCollege('curso'), cursoController.getCursoById);
router.put('/:id', requirePermission('cursos:update'), requireSameCollege('curso'), cursoController.updateCurso);
router.delete('/:id', requirePermission('cursos:delete'), requireSameCollege('curso'), cursoController.deleteCurso);

module.exports = router;