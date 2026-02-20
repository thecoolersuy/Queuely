import express from 'express';
import { createBooking, getUserBookings } from '../controller/bookingController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/create', authenticateToken, createBooking);
router.get('/user', authenticateToken, getUserBookings);

export default router;
