// Sistema de permisos basado en roles para EduMetrics
// Define qué operaciones puede realizar cada rol

const PERMISSIONS = {
  // Gestión de roles - Solo Superadmin puede gestionar roles
  'roles:create': ['Superadmin'],
  'roles:read': ['Superadmin', 'Admin', 'UTP'],
  'roles:update': ['Superadmin'],
  'roles:delete': ['Superadmin'],

  // Gestión de colegios - Solo Superadmin puede crear/eliminar colegios
  'colegios:create': ['Superadmin'],
  'colegios:read': ['Superadmin', 'Admin', 'UTP'],
  'colegios:update': ['Superadmin', 'Admin'],
  'colegios:delete': ['Superadmin'],

  // Gestión de usuarios
  'usuarios:create': ['Superadmin', 'Admin', 'UTP'],
  'usuarios:read': ['Superadmin', 'Admin', 'UTP', 'Profesor'],
  'usuarios:update': ['Superadmin', 'Admin', 'UTP'],
  'usuarios:delete': ['Superadmin', 'Admin'],

  // Gestión de cursos
  'cursos:create': ['Superadmin', 'Admin', 'UTP'],
  'cursos:read': ['Superadmin', 'Admin', 'UTP', 'Profesor', 'Estudiante'],
  'cursos:update': ['Superadmin', 'Admin', 'UTP'],
  'cursos:delete': ['Superadmin', 'Admin', 'UTP'],

  // Gestión de asignaturas
  'asignaturas:create': ['Superadmin', 'Admin', 'UTP'],
  'asignaturas:read': ['Superadmin', 'Admin', 'UTP', 'Profesor', 'Estudiante'],
  'asignaturas:update': ['Superadmin', 'Admin', 'UTP'],
  'asignaturas:delete': ['Superadmin', 'Admin', 'UTP'],

  // Gestión de estudiantes
  'estudiantes:create': ['Superadmin', 'Admin', 'UTP'],
  'estudiantes:read': ['Superadmin', 'Admin', 'UTP', 'Profesor'],
  'estudiantes:update': ['Superadmin', 'Admin', 'UTP'],
  'estudiantes:delete': ['Superadmin', 'Admin', 'UTP'],

  // Gestión de evaluaciones
  'evaluaciones:create': ['Superadmin', 'Admin', 'UTP', 'Profesor'],
  'evaluaciones:read': ['Superadmin', 'Admin', 'UTP', 'Profesor', 'Estudiante'],
  'evaluaciones:update': ['Superadmin', 'Admin', 'UTP', 'Profesor'],
  'evaluaciones:delete': ['Superadmin', 'Admin', 'UTP', 'Profesor'],

  // Gestión de preguntas
  'preguntas:create': ['Superadmin', 'Admin', 'UTP', 'Profesor'],
  'preguntas:read': ['Superadmin', 'Admin', 'UTP', 'Profesor', 'Estudiante'],
  'preguntas:update': ['Superadmin', 'Admin', 'UTP', 'Profesor'],
  'preguntas:delete': ['Superadmin', 'Admin', 'UTP', 'Profesor'],

  // Gestión de alternativas
  'alternativas:create': ['Superadmin', 'Admin', 'UTP', 'Profesor'],
  'alternativas:read': ['Superadmin', 'Admin', 'UTP', 'Profesor', 'Estudiante'],
  'alternativas:update': ['Superadmin', 'Admin', 'UTP', 'Profesor'],
  'alternativas:delete': ['Superadmin', 'Admin', 'UTP', 'Profesor'],

  // Gestión de aplicaciones de evaluación
  'aplicaciones:create': ['Superadmin', 'Admin', 'UTP', 'Profesor'],
  'aplicaciones:read': ['Superadmin', 'Admin', 'UTP', 'Profesor', 'Estudiante'],
  'aplicaciones:update': ['Superadmin', 'Admin', 'UTP', 'Profesor'],
  'aplicaciones:delete': ['Superadmin', 'Admin', 'UTP', 'Profesor'],

  // Gestión de calificaciones
  'calificaciones:create': ['Superadmin', 'Admin', 'UTP', 'Profesor'],
  'calificaciones:read': ['Superadmin', 'Admin', 'UTP', 'Profesor', 'Estudiante'],
  'calificaciones:update': ['Superadmin', 'Admin', 'UTP', 'Profesor'],
  'calificaciones:delete': ['Superadmin', 'Admin', 'UTP'],

  // Gestión de respuestas de estudiantes
  'respuestas:create': ['Superadmin', 'Admin', 'UTP', 'Profesor', 'Estudiante'],
  'respuestas:read': ['Superadmin', 'Admin', 'UTP', 'Profesor', 'Estudiante'],
  'respuestas:update': ['Superadmin', 'Admin', 'UTP', 'Profesor', 'Estudiante'],
  'respuestas:delete': ['Superadmin', 'Admin', 'UTP', 'Profesor']
};

// Jerarquía de roles para determinar accesos implícitos
const ROLE_HIERARCHY = {
  'Superadmin': 5,
  'Admin': 4,
  'UTP': 3,
  'Profesor': 2,
  'Estudiante': 1
};

// Verificar si un rol tiene un permiso específico
const hasPermission = (userRole, permission) => {
  if (!PERMISSIONS[permission]) {
    return false;
  }
  return PERMISSIONS[permission].includes(userRole);
};

// Verificar si un rol puede realizar una acción sobre otro rol
const canManageRole = (currentRole, targetRole) => {
  const currentLevel = ROLE_HIERARCHY[currentRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole] || 0;
  return currentLevel > targetLevel;
};

// Obtener todos los permisos de un rol
const getRolePermissions = (role) => {
  const rolePermissions = [];
  for (const [permission, allowedRoles] of Object.entries(PERMISSIONS)) {
    if (allowedRoles.includes(role)) {
      rolePermissions.push(permission);
    }
  }
  return rolePermissions;
};

module.exports = {
  PERMISSIONS,
  ROLE_HIERARCHY,
  hasPermission,
  canManageRole,
  getRolePermissions
};
