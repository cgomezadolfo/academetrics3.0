const express = require('express');
const cors = require('cors');
const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Importar solo las rutas básicas una por una para identificar el problema
console.log('Importando authRoutes...');
const authRoutes = require('./routes/authRoutes');

console.log('Importando userRoutes...');
const userRoutes = require('./routes/userRoutes');

console.log('Configurando rutas básicas...');
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'Test OK' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

module.exports = app;
