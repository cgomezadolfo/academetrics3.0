const express = require('express');
const cors = require('cors');

console.log('🔍 Probando rutas gradualmente para encontrar el error path-to-regexp...\n');

// Test 1: Solo Express básico
console.log('Test 1: Express básico...');
try {
  const app1 = express();
  app1.use(cors());
  app1.use(express.json());
  
  app1.get('/', (req, res) => {
    res.json({ message: 'Test básico' });
  });
  
  console.log('✓ Express básico funciona\n');
} catch (error) {
  console.error('❌ Error en Express básico:', error.message);
  process.exit(1);
}

// Test 2: Con authRoutes
console.log('Test 2: Agregando authRoutes...');
try {
  const app2 = express();
  app2.use(cors());
  app2.use(express.json());
  
  const authRoutes = require('./routes/authRoutes');
  app2.use('/api/auth', authRoutes);
  
  console.log('✓ authRoutes agregado correctamente\n');
} catch (error) {
  console.error('❌ Error con authRoutes:', error.message);
  process.exit(1);
}

// Test 3: Con authRoutes + userRoutes
console.log('Test 3: Agregando authRoutes + userRoutes...');
try {
  const app3 = express();
  app3.use(cors());
  app3.use(express.json());
  
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  
  app3.use('/api/auth', authRoutes);
  app3.use('/api/usuarios', userRoutes);
  
  console.log('✓ authRoutes + userRoutes agregados correctamente\n');
} catch (error) {
  console.error('❌ Error con authRoutes + userRoutes:', error.message);
  process.exit(1);
}

// Test 4: Con authRoutes + userRoutes + roleRoutes
console.log('Test 4: Agregando authRoutes + userRoutes + roleRoutes...');
try {
  const app4 = express();
  app4.use(cors());
  app4.use(express.json());
  
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const roleRoutes = require('./routes/roleRoutes');
  
  app4.use('/api/auth', authRoutes);
  app4.use('/api/usuarios', userRoutes);
  app4.use('/api/roles', roleRoutes);
  
  console.log('✓ authRoutes + userRoutes + roleRoutes agregados correctamente\n');
} catch (error) {
  console.error('❌ Error con authRoutes + userRoutes + roleRoutes:', error.message);
  process.exit(1);
}

// Test 5: Con los primeros 4 (que sabemos que funcionan)
console.log('Test 5: Agregando los primeros 4 archivos de rutas...');
try {
  const app5 = express();
  app5.use(cors());
  app5.use(express.json());
  
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const roleRoutes = require('./routes/roleRoutes');
  const colegioRoutes = require('./routes/colegioRoutes');
  
  app5.use('/api/auth', authRoutes);
  app5.use('/api/usuarios', userRoutes);
  app5.use('/api/roles', roleRoutes);
  app5.use('/api/colegios', colegioRoutes);
  
  console.log('✓ Primeros 4 archivos de rutas agregados correctamente\n');
} catch (error) {
  console.error('❌ Error con los primeros 4 archivos:', error.message);
  process.exit(1);
}

// Test 6: Agregando cursoRoutes (el siguiente en orden)
console.log('Test 6: Agregando cursoRoutes...');
try {
  const app6 = express();
  app6.use(cors());
  app6.use(express.json());
  
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const roleRoutes = require('./routes/roleRoutes');
  const colegioRoutes = require('./routes/colegioRoutes');
  const cursoRoutes = require('./routes/cursoRoutes');
  
  app6.use('/api/auth', authRoutes);
  app6.use('/api/usuarios', userRoutes);
  app6.use('/api/roles', roleRoutes);
  app6.use('/api/colegios', colegioRoutes);
  app6.use('/api/cursos', cursoRoutes);
  
  console.log('✓ cursoRoutes agregado correctamente\n');
} catch (error) {
  console.error('❌ Error al agregar cursoRoutes:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// Test 7: Agregando asignaturaRoutes
console.log('Test 7: Agregando asignaturaRoutes...');
try {
  const app7 = express();
  app7.use(cors());
  app7.use(express.json());
  
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const roleRoutes = require('./routes/roleRoutes');
  const colegioRoutes = require('./routes/colegioRoutes');
  const cursoRoutes = require('./routes/cursoRoutes');
  const asignaturaRoutes = require('./routes/asignaturaRoutes');
  
  app7.use('/api/auth', authRoutes);
  app7.use('/api/usuarios', userRoutes);
  app7.use('/api/roles', roleRoutes);
  app7.use('/api/colegios', colegioRoutes);
  app7.use('/api/cursos', cursoRoutes);
  app7.use('/api/asignaturas', asignaturaRoutes);
  
  console.log('✓ asignaturaRoutes agregado correctamente\n');
} catch (error) {
  console.error('❌ Error al agregar asignaturaRoutes:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// Test 8: Agregando estudianteRoutes
console.log('Test 8: Agregando estudianteRoutes...');
try {
  const app8 = express();
  app8.use(cors());
  app8.use(express.json());
  
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const roleRoutes = require('./routes/roleRoutes');
  const colegioRoutes = require('./routes/colegioRoutes');
  const cursoRoutes = require('./routes/cursoRoutes');
  const asignaturaRoutes = require('./routes/asignaturaRoutes');
  const estudianteRoutes = require('./routes/estudianteRoutes');
  
  app8.use('/api/auth', authRoutes);
  app8.use('/api/usuarios', userRoutes);
  app8.use('/api/roles', roleRoutes);
  app8.use('/api/colegios', colegioRoutes);
  app8.use('/api/cursos', cursoRoutes);
  app8.use('/api/asignaturas', asignaturaRoutes);
  app8.use('/api/estudiantes', estudianteRoutes);
  
  console.log('✓ estudianteRoutes agregado correctamente\n');
} catch (error) {
  console.error('❌ Error al agregar estudianteRoutes:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// Test 9: Agregando evaluacionRoutes
console.log('Test 9: Agregando evaluacionRoutes...');
try {
  const app9 = express();
  app9.use(cors());
  app9.use(express.json());
  
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const roleRoutes = require('./routes/roleRoutes');
  const colegioRoutes = require('./routes/colegioRoutes');
  const cursoRoutes = require('./routes/cursoRoutes');
  const asignaturaRoutes = require('./routes/asignaturaRoutes');
  const estudianteRoutes = require('./routes/estudianteRoutes');
  const evaluacionRoutes = require('./routes/evaluacionRoutes');
  
  app9.use('/api/auth', authRoutes);
  app9.use('/api/usuarios', userRoutes);
  app9.use('/api/roles', roleRoutes);
  app9.use('/api/colegios', colegioRoutes);
  app9.use('/api/cursos', cursoRoutes);
  app9.use('/api/asignaturas', asignaturaRoutes);
  app9.use('/api/estudiantes', estudianteRoutes);
  app9.use('/api/evaluaciones', evaluacionRoutes);
  
  console.log('✓ evaluacionRoutes agregado correctamente\n');
} catch (error) {
  console.error('❌ Error al agregar evaluacionRoutes:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// Test 10: Agregando preguntaRoutes
console.log('Test 10: Agregando preguntaRoutes...');
try {
  const app10 = express();
  app10.use(cors());
  app10.use(express.json());
  
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const roleRoutes = require('./routes/roleRoutes');
  const colegioRoutes = require('./routes/colegioRoutes');
  const cursoRoutes = require('./routes/cursoRoutes');
  const asignaturaRoutes = require('./routes/asignaturaRoutes');
  const estudianteRoutes = require('./routes/estudianteRoutes');
  const evaluacionRoutes = require('./routes/evaluacionRoutes');
  const preguntaRoutes = require('./routes/preguntaRoutes');
  
  app10.use('/api/auth', authRoutes);
  app10.use('/api/usuarios', userRoutes);
  app10.use('/api/roles', roleRoutes);
  app10.use('/api/colegios', colegioRoutes);
  app10.use('/api/cursos', cursoRoutes);
  app10.use('/api/asignaturas', asignaturaRoutes);
  app10.use('/api/estudiantes', estudianteRoutes);
  app10.use('/api/evaluaciones', evaluacionRoutes);
  app10.use('/api/preguntas', preguntaRoutes);
  
  console.log('✓ preguntaRoutes agregado correctamente\n');
} catch (error) {
  console.error('❌ Error al agregar preguntaRoutes:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// Test 11: Agregando alternativaRoutes
console.log('Test 11: Agregando alternativaRoutes...');
try {
  const app11 = express();
  app11.use(cors());
  app11.use(express.json());
  
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const roleRoutes = require('./routes/roleRoutes');
  const colegioRoutes = require('./routes/colegioRoutes');
  const cursoRoutes = require('./routes/cursoRoutes');
  const asignaturaRoutes = require('./routes/asignaturaRoutes');
  const estudianteRoutes = require('./routes/estudianteRoutes');
  const evaluacionRoutes = require('./routes/evaluacionRoutes');
  const preguntaRoutes = require('./routes/preguntaRoutes');
  const alternativaRoutes = require('./routes/alternativaRoutes');
  
  app11.use('/api/auth', authRoutes);
  app11.use('/api/usuarios', userRoutes);
  app11.use('/api/roles', roleRoutes);
  app11.use('/api/colegios', colegioRoutes);
  app11.use('/api/cursos', cursoRoutes);
  app11.use('/api/asignaturas', asignaturaRoutes);
  app11.use('/api/estudiantes', estudianteRoutes);
  app11.use('/api/evaluaciones', evaluacionRoutes);
  app11.use('/api/preguntas', preguntaRoutes);
  app11.use('/api/alternativas', alternativaRoutes);
  
  console.log('✓ alternativaRoutes agregado correctamente\n');
} catch (error) {
  console.error('❌ Error al agregar alternativaRoutes:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

console.log('🎉 Todas las rutas principales agregadas correctamente!');
console.log('Ahora probemos las rutas restantes...\n');

// Test 12: Agregando aplicacionEvaluacionRoutes
console.log('Test 12: Agregando aplicacionEvaluacionRoutes...');
try {
  const app12 = express();
  app12.use(cors());
  app12.use(express.json());
  
  // Todas las rutas anteriores
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const roleRoutes = require('./routes/roleRoutes');
  const colegioRoutes = require('./routes/colegioRoutes');
  const cursoRoutes = require('./routes/cursoRoutes');
  const asignaturaRoutes = require('./routes/asignaturaRoutes');
  const estudianteRoutes = require('./routes/estudianteRoutes');
  const evaluacionRoutes = require('./routes/evaluacionRoutes');
  const preguntaRoutes = require('./routes/preguntaRoutes');
  const alternativaRoutes = require('./routes/alternativaRoutes');
  const aplicacionEvaluacionRoutes = require('./routes/aplicacionEvaluacionRoutes');
  
  app12.use('/api/auth', authRoutes);
  app12.use('/api/usuarios', userRoutes);
  app12.use('/api/roles', roleRoutes);
  app12.use('/api/colegios', colegioRoutes);
  app12.use('/api/cursos', cursoRoutes);
  app12.use('/api/asignaturas', asignaturaRoutes);
  app12.use('/api/estudiantes', estudianteRoutes);
  app12.use('/api/evaluaciones', evaluacionRoutes);
  app12.use('/api/preguntas', preguntaRoutes);
  app12.use('/api/alternativas', alternativaRoutes);
  app12.use('/api/aplicaciones', aplicacionEvaluacionRoutes);
  
  console.log('✓ aplicacionEvaluacionRoutes agregado correctamente\n');
} catch (error) {
  console.error('❌ Error al agregar aplicacionEvaluacionRoutes:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// Test 13: Agregando calificacionRoutes
console.log('Test 13: Agregando calificacionRoutes...');
try {
  const app13 = express();
  app13.use(cors());
  app13.use(express.json());
  
  // Todas las rutas anteriores
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const roleRoutes = require('./routes/roleRoutes');
  const colegioRoutes = require('./routes/colegioRoutes');
  const cursoRoutes = require('./routes/cursoRoutes');
  const asignaturaRoutes = require('./routes/asignaturaRoutes');
  const estudianteRoutes = require('./routes/estudianteRoutes');
  const evaluacionRoutes = require('./routes/evaluacionRoutes');
  const preguntaRoutes = require('./routes/preguntaRoutes');
  const alternativaRoutes = require('./routes/alternativaRoutes');
  const aplicacionEvaluacionRoutes = require('./routes/aplicacionEvaluacionRoutes');
  const calificacionRoutes = require('./routes/calificacionRoutes');
  
  app13.use('/api/auth', authRoutes);
  app13.use('/api/usuarios', userRoutes);
  app13.use('/api/roles', roleRoutes);
  app13.use('/api/colegios', colegioRoutes);
  app13.use('/api/cursos', cursoRoutes);
  app13.use('/api/asignaturas', asignaturaRoutes);
  app13.use('/api/estudiantes', estudianteRoutes);
  app13.use('/api/evaluaciones', evaluacionRoutes);
  app13.use('/api/preguntas', preguntaRoutes);
  app13.use('/api/alternativas', alternativaRoutes);
  app13.use('/api/aplicaciones', aplicacionEvaluacionRoutes);
  app13.use('/api/calificaciones', calificacionRoutes);
  
  console.log('✓ calificacionRoutes agregado correctamente\n');
} catch (error) {
  console.error('❌ Error al agregar calificacionRoutes:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// Test 14: Agregando respuestaEstudianteRoutes (el último)
console.log('Test 14: Agregando respuestaEstudianteRoutes...');
try {
  const app14 = express();
  app14.use(cors());
  app14.use(express.json());
  
  // Todas las rutas
  const authRoutes = require('./routes/authRoutes');
  const userRoutes = require('./routes/userRoutes');
  const roleRoutes = require('./routes/roleRoutes');
  const colegioRoutes = require('./routes/colegioRoutes');
  const cursoRoutes = require('./routes/cursoRoutes');
  const asignaturaRoutes = require('./routes/asignaturaRoutes');
  const estudianteRoutes = require('./routes/estudianteRoutes');
  const evaluacionRoutes = require('./routes/evaluacionRoutes');
  const preguntaRoutes = require('./routes/preguntaRoutes');
  const alternativaRoutes = require('./routes/alternativaRoutes');
  const aplicacionEvaluacionRoutes = require('./routes/aplicacionEvaluacionRoutes');
  const calificacionRoutes = require('./routes/calificacionRoutes');
  const respuestaEstudianteRoutes = require('./routes/respuestaEstudianteRoutes');
  
  app14.use('/api/auth', authRoutes);
  app14.use('/api/usuarios', userRoutes);
  app14.use('/api/roles', roleRoutes);
  app14.use('/api/colegios', colegioRoutes);
  app14.use('/api/cursos', cursoRoutes);
  app14.use('/api/asignaturas', asignaturaRoutes);
  app14.use('/api/estudiantes', estudianteRoutes);
  app14.use('/api/evaluaciones', evaluacionRoutes);
  app14.use('/api/preguntas', preguntaRoutes);
  app14.use('/api/alternativas', alternativaRoutes);
  app14.use('/api/aplicaciones', aplicacionEvaluacionRoutes);
  app14.use('/api/calificaciones', calificacionRoutes);
  app14.use('/api/respuestas', respuestaEstudianteRoutes);
  
  console.log('✓ respuestaEstudianteRoutes agregado correctamente\n');
} catch (error) {
  console.error('❌ Error al agregar respuestaEstudianteRoutes:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

console.log('🎉 ¡TODAS LAS RUTAS SE AGREGARON CORRECTAMENTE!');
console.log('El problema del path-to-regexp no se está reproduciendo en este test.');
console.log('Esto sugiere que el problema puede estar en el archivo app.js principal');
console.log('o en alguna configuración específica del middleware.');
