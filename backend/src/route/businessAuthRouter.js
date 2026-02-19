import express from 'express';
import {
    registerBusiness,
    loginBusiness,
    forgotPasswordBusiness,
    verifyOtpBusiness,
    resetPasswordBusiness,
} from '../controller/businessAuthController.js';

const router = express.Router();

router.post('/register', registerBusiness);
router.post('/login', loginBusiness);
router.post('/forgot-password', forgotPasswordBusiness);
router.post('/verify-otp', verifyOtpBusiness);
router.post('/reset-password', resetPasswordBusiness);

export default router;