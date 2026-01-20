import express from 'express';
import { getProfile, getBusinesses } from '../controller/userController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.get('/businesses', authenticateToken, getBusinesses);

export default router;