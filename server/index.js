import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
function initDB() {
  // Database initialization will be implemented in a later task
  console.log('Database initialized');
}

initDB();

// Routes
app.get('/api/questions', (req, res) => {
  res.json({ questions: [] });
});

app.post('/api/submit', (req, res) => {
  const { answers } = req.body;
  res.json({ type: 'unknown', description: '待实现' });
});

app.get('/api/result/:id', (req, res) => {
  res.json({ type: 'unknown', description: '待实现' });
});

app.get('/api/stats', (req, res) => {
  res.json({ stats: {} });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
