import express from 'express';
import { 
  createService, 
  getServices, 
  updateService, 
  deleteService 
} from '../controller/serviceController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.post('/', authenticateToken, createService);
router.get('/', authenticateToken, getServices);
router.put('/:service_id', authenticateToken, updateService);
router.delete('/:service_id', authenticateToken, deleteService);

export default router;