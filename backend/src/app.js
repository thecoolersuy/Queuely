import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './route/authRouter.js';
import businessAuthRouter from './route/businessAuthRouter.js';
import businessDashboardRouter from './route/businessDashboardRouter.js';
import serviceRouter from './route/serviceRouter.js';
import barberRouter from './route/barberRouter.js';
import userRouter from './route/userRouter.js';
import businessRouter from './route/businessRouter.js';
import bookingRouter from './route/bookingRouter.js';
import notificationRouter from './route/notificationRouter.js';
import reviewRouter from './route/reviewRouter.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Queuely API is running!' });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/business-auth', businessAuthRouter);
app.use('/api/business-dashboard', businessDashboardRouter);
app.use('/api/services', serviceRouter);
app.use('/api/barbers', barberRouter);
app.use('/api/user', userRouter);
app.use('/api/business', businessRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/reviews', reviewRouter);

export default app;
