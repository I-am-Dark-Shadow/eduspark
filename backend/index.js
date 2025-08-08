import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Import all your routes
import userRoutes from './routes/userRoutes.js';
import examRoutes from './routes/examRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import retakeRoutes from './routes/retakeRequestRoutes.js';
import viewRequestRoutes from './routes/viewRequestRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Express on Vercel!');
});

// Allowable origins from .env
const allowedOrigins = [
  'https://eduspark-one.vercel.app/', 
];

// CORS setup to allow both dev and deployed frontends
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow Postman or curl
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// Routes
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/retakes', retakeRoutes);
app.use('/api/view-requests', viewRequestRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server (for local development)
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export app for Vercel
export default app;
