
/**
 * Utilidades para validación de datos de entrada
 * Proporciona funciones para validar campos obligatorios y generar mensajes de error específicos
 */

/**
 * Valida que todos los campos obligatorios estén presentes y no estén vacíos
 * @param {Object} data - Los datos a validar
 * @param {Array} requiredFields - Array de nombres de campos obligatorios
 * @param {Object} fieldLabels - Objeto que mapea nombres de campos a etiquetas amigables
 * @returns {Object} - { isValid: boolean, errors: Array, message: string }
 */
exports.validateRequiredFields = (data, requiredFields, fieldLabels = {}) => {
  const errors = [];
  const missingFields = [];
  const emptyFields = [];

  // Verificar cada campo obligatorio
  requiredFields.forEach(field => {
    const fieldLabel = fieldLabels[field] || field;
    
    // Verificar si el campo está presente en los datos
    if (!(field in data)) {
      missingFields.push(fieldLabel);
      return;
    }

    const value = data[field];
    
    // Verificar si el campo está vacío o es null/undefined
    if (value === null || value === undefined || value === '') {
      emptyFields.push(fieldLabel);
    }

    // Para números, verificar que sean válidos
    if (field.includes('Id') && value !== null && value !== undefined) {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue <= 0) {
        errors.push(`${fieldLabel} debe ser un número válido mayor a 0`);
      }
    }
  });

  // Agregar campos faltantes a los errores
  if (missingFields.length > 0) {
    errors.push(`Faltan los siguientes campos: ${missingFields.join(', ')}`);
  }

  // Agregar campos vacíos a los errores
  if (emptyFields.length > 0) {
    errors.push(`Los siguientes campos no pueden estar vacíos: ${emptyFields.join(', ')}`);
  }

  const isValid = errors.length === 0;
  let message = '';

  if (!isValid) {
    if (errors.length === 1) {
      message = errors[0];
    } else {
      message = `Se encontraron ${errors.length} errores de validación: ${errors.join('. ')}`;
    }
  }

  return {
    isValid,
    errors,
    message
  };
};

/**
 * Valida formato de email
 * @param {string} email - El email a validar
 * @returns {boolean} - true si el email es válido
 */
exports.validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida formato de RUT chileno
 * @param {string} rut - El RUT a validar
 * @returns {boolean} - true si el RUT es válido
 */
exports.validateRUT = (rut) => {
  if (!rut || typeof rut !== 'string') return false;
  
  // Remover espacios en blanco, puntos y guiones
  const cleanRut = rut.trim().replace(/\s/g, '').replace(/\./g, '').replace(/-/g, '');
  
  // Verificar que tenga entre 8 y 9 caracteres (7-8 números + 1 dígito verificador)
  if (cleanRut.length < 8 || cleanRut.length > 9) return false;
  
  // Extraer número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1);
  const verificador = cleanRut.slice(-1).toLowerCase();
  
  // Verificar que el número sea válido (solo dígitos)
  if (!/^\d+$/.test(rutNumber)) return false;
  
  // Verificar que el dígito verificador sea válido (0-9 o k)
  if (!/^[0-9k]$/.test(verificador)) return false;
  
  // Calcular dígito verificador usando algoritmo estándar
  let suma = 0;
  let multiplicador = 2;
  
  // Procesar cada dígito desde el final hacia el inicio
  for (let i = rutNumber.length - 1; i >= 0; i--) {
    suma += parseInt(rutNumber[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const resto = suma % 11;
  const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'k' : (11 - resto).toString();
    return verificador === dvCalculado;
};

/**
 * Formatea un RUT para mostrar en formato 12.345.678-9
 * @param {string} rut - El RUT a formatear
 * @returns {string} - RUT formateado o el valor original si no es válido
 */
exports.formatRUT = (rut) => {
  if (!rut || typeof rut !== 'string') return rut;
  
  // Remover espacios, puntos y guiones para limpiar
  const cleanRut = rut.trim().replace(/\s/g, '').replace(/\./g, '').replace(/-/g, '');
  
  // Verificar que tenga al menos 8 caracteres y solo números + k/K al final
  if (cleanRut.length < 8 || cleanRut.length > 9) return rut;
  if (!/^\d+[0-9kK]$/.test(cleanRut)) return rut;
  
  // Separar número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1);
  const verificador = cleanRut.slice(-1).toUpperCase();
  
  // Formatear con puntos cada 3 dígitos desde la derecha
  const formattedNumber = rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formattedNumber}-${verificador}`;
};

/**
 * Limpia un RUT removiendo formato para validación
 * @param {string} rut - El RUT a limpiar
 * @returns {string} - RUT sin formato
 */
exports.cleanRUT = (rut) => {
  if (!rut || typeof rut !== 'string') return '';
  return rut.trim().replace(/\s/g, '').replace(/\./g, '').replace(/-/g, '');
};

/**
 * Genera un mensaje de error personalizado para validaciones específicas
 * @param {string} entity - Tipo de entidad (usuario, curso, asignatura, etc.)
 * @param {string} operation - Operación (crear, actualizar)
 * @param {Array} errors - Array de errores específicos
 * @returns {string} - Mensaje de error formateado
 */
exports.generateValidationMessage = (entity, operation, errors) => {
  const operations = {
    crear: 'crear',
    actualizar: 'actualizar',
    editar: 'actualizar'
  };

  const entities = {
    usuario: 'el usuario',
    curso: 'el curso',
    asignatura: 'la asignatura',
    evaluacion: 'la evaluación',
    colegio: 'el colegio'
  };

  const verb = operations[operation.toLowerCase()] || operation;
  const entityLabel = entities[entity.toLowerCase()] || entity;

  if (errors.length === 1) {
    return `No se puede ${verb} ${entityLabel}: ${errors[0]}`;
  } else {
    return `No se puede ${verb} ${entityLabel}. Se encontraron los siguientes problemas: ${errors.join('. ')}`;
  }
};
