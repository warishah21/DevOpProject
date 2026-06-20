import './loadEnv.js';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import clinicRoutes from './routes/clinics.js';
import appointmentRoutes from './routes/appointments.js';
import queueRoutes from './routes/queue.js';
import ratingRoutes from './routes/ratings.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://database//host.docker.internal:27017/doctor-patient-portal';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');

// Create HTTP server and attach Socket.io
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Join room based on clinic ID
  socket.on('joinClinic', (clinicId) => {
    socket.join(`clinic:${clinicId}`);
  });
  
  // Leave room
  socket.on('leaveClinic', (clinicId) => {
    socket.leave(`clinic:${clinicId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Global Socket.io for controllers
global.io = io;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/ratings', ratingRoutes);

// Production / Docker: Vite build served by Express (same origin as API)
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'), (err) => (err ? next(err) : undefined));
  });
}

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  res.status(404).type('text').send('Not found');
});

// Error handler middleware
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = () => {
  if (!httpServer.listening) {
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
};

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('Connected to MongoDB');
    startServer();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    startServer();
  });

// Export for testing
export default app;