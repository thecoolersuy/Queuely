import express from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controller/notificationController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/', authenticateToken, getNotifications);
router.patch('/:notification_id/read', authenticateToken, markAsRead);
router.patch('/read-all', authenticateToken, markAllAsRead);

export default router;
