import express from 'express';
import cors from 'cors';
import { initDB } from './models/result.js';
import apiRouter from './routes/api.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Start server (async initDB first)
await initDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
