import express from 'express';
import { createReview, getReviews } from '../controller/reviewController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/', authenticateToken, createReview);
router.get('/', authenticateToken, getReviews);

export default router;
