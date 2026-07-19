import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Mount Versioned API Routes
app.use('/api/v1', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), app: 'HostelHub API v1.0.0' });
});

// Centralized Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 HostelHub API Server running on port ${PORT} [http://localhost:${PORT}]`);
});
