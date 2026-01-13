import express from 'express';
import { getProfile } from '../controller/userController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);

export default router;