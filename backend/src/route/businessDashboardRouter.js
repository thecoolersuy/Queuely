import express from 'express';
import {
    getDashboardStats,
    getRecentBookings,
    getAllBookings,
    updateBookingStatus,
    getBusinessProfile,
    updateBusinessProfile
} from '../controller/businessDashboardController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Protected routes - require authentication
router.get('/stats', authenticateToken, getDashboardStats);
router.get('/bookings', authenticateToken, getRecentBookings);
router.get('/all-bookings', authenticateToken, getAllBookings);
router.patch('/bookings/:booking_id/status', authenticateToken, updateBookingStatus);
router.get('/profile', authenticateToken, getBusinessProfile);
router.put('/profile', authenticateToken, upload.single('profileImage'), updateBusinessProfile);

export default router;