import express from 'express';
import {
    createBarber,
    getBarbers,
    updateBarber,
    deleteBarber
} from '../controller/barberController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/', authenticateToken, createBarber);
router.get('/', authenticateToken, getBarbers);
router.put('/:barber_id', authenticateToken, updateBarber);
router.delete('/:barber_id', authenticateToken, deleteBarber);

export default router;