const express = require('express');
const cors = require('cors');
const app = express();

// Middleware básico
app.use(cors());
app.use(express.json());

// Rutas sin autenticación para probar
app.get('/', (req, res) => {
  res.json({ message: 'EduMetrics Test' });
});

app.get('/test/:id', (req, res) => {
  res.json({ id: req.params.id });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

module.exports = app;
