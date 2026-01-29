// backend/src/route/businessRouter.js
import express from 'express';
import { getBusinessDetails } from '../controller/businessController.js';

const router = express.Router();

// Public route to get business details (no authentication required)
router.get('/:business_id', getBusinessDetails);

export default router;
