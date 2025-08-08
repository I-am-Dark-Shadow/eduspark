import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import path from 'path';

// Import Routes
import userRoutes from './routes/userRoutes.js';
import examRoutes from './routes/examRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import retakeRoutes from './routes/retakeRequestRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import viewRequestRoutes from './routes/viewRequestRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'https://eduspark-pi.vercel.app',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// API Routes
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/retakes', retakeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/view-requests', viewRequestRoutes);
app.use('/api/dashboard', dashboardRoutes);

// --- Deployment Setup ---
// if (process.env.NODE_ENV === 'production') {
//     const __dirname = path.resolve();
//     // Make the 'uploads' folder static
//     app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
//     // Serve the frontend build files
//     app.use(express.static(path.join(__dirname, '/frontend/dist')));
//     // For any other route, serve the index.html
//     app.get('*', (req, res) =>
//         res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
//     );
// } else {
//     // In development, provide a simple welcome message
//     app.get('/', (req, res) => {
//         res.send('API is running...');
//     });
// }
// --- End Deployment Setup ---

// Custom Error Handling
app.use(notFound);
app.use(errorHandler);


export default app;