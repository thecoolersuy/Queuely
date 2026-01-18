import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './src/database/index.js';
import authRouter from './src/route/authRouter.js'
import businessAuthRouter from './src/route/businessAuthRouter.js'
import businessDashboardRouter from './src/route/businessDashboardRouter.js'
import serviceRouter from './src/route/serviceRouter.js';
import barberRouter from './src/route/barberRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Queuely API is running!' });
});

app.use('/api/auth', authRouter);
app.use('/api/business-auth', businessAuthRouter);
app.use('/api/business-dashboard', businessDashboardRouter);
app.use('/api/services', serviceRouter); 
app.use('/api/barbers', barberRouter); 

db();


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});