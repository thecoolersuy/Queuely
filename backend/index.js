import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './src/database/index.js';
import User from './src/models/User.js'
import authRouter from './src/route/authRouter.js'
import userRouter from './src/route/userRouter.js'

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

db();


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});