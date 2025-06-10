const express = require('express');
const app = express();

// Test básico para identificar el problema
app.get('/', (req, res) => {
  res.json({ message: 'Test OK' });
});

// Test de parámetros
app.get('/test/:id', (req, res) => {
  res.json({ id: req.params.id });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
