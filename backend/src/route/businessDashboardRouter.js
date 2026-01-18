import express from 'express';
import {
    getDashboardStats,
    getRecentBookings,
    updateBookingStatus
} from '../controller/businessDashboardController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

// Protected routes - require authentication
router.get('/stats', authenticateToken, getDashboardStats);
router.get('/bookings', authenticateToken, getRecentBookings);
router.patch('/bookings/:booking_id/status', authenticateToken, updateBookingStatus);

export default router;