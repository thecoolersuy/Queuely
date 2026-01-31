import express from 'express';
import { createBooking } from '../controller/bookingController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/create', authenticateToken, createBooking);

export default router;
