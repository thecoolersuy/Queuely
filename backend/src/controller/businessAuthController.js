import bcrypt from 'bcrypt';
import Business from '../models/Business.js';
import { generateToken } from '../security/jwt-utils.js';
import { sendOtpEmail } from '../utils/emailService.js';

// ─── REGISTER ────────────────────────────────────────────────────────────────
export const registerBusiness = async (req, res) => {
    try {
        const { shopName, firstName, lastName, email, phoneNumber, password, country, localLocation, businessFocus } = req.body;

        if (!shopName || !firstName || !lastName || !email || !phoneNumber || !password || !country) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingBusiness = await Business.findOne({ where: { email } });
        if (existingBusiness) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const business = await Business.create({
            shopName, firstName, lastName, email, phoneNumber,
            password: hashedPassword, country,
            localLocation: localLocation || null,
            businessFocus: businessFocus || null,
        });

        const token = generateToken(business.business_id, business.email, 'business');

        res.status(201).json({
            success: true,
            message: 'Business registration successful',
            token,
            user: {
                userId: business.business_id,
                firstName: business.firstName,
                lastName: business.lastName,
                shopName: business.shopName,
                email: business.email,
                phoneNumber: business.phoneNumber,
                country: business.country,
                role: 'business',
            },
        });
    } catch (error) {
        console.error('Business register error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const loginBusiness = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const business = await Business.findOne({ where: { email } });
        if (!business) {
            return res.status(401).json({ success: false, message: 'No business account found with this email' });
        }

        const isPasswordValid = await bcrypt.compare(password, business.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        const token = generateToken(business.business_id, business.email, 'business');

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                userId: business.business_id,
                firstName: business.firstName,
                lastName: business.lastName,
                shopName: business.shopName,
                email: business.email,
                phoneNumber: business.phoneNumber,
                country: business.country,
                role: 'business',
            },
        });
    } catch (error) {
        console.error('Business login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

// ─── FORGOT PASSWORD: STEP 1 — SEND OTP ──────────────────────────────────────
export const forgotPasswordBusiness = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const business = await Business.findOne({ where: { email } });
        if (!business) {
            // Security: don't reveal if email exists
            return res.status(200).json({ success: true, message: 'If this email exists, an OTP has been sent.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await business.update({ resetOtp: otp, resetOtpExpiry: otpExpiry, resetOtpVerified: false });
        await sendOtpEmail(email, otp, 'business');

        res.status(200).json({ success: true, message: 'OTP sent to your email successfully.' });
    } catch (error) {
        console.error('Business forgot password error:', error);
        res.status(500).json({ success: false, message: 'Server error sending OTP' });
    }
};

// ─── FORGOT PASSWORD: STEP 2 — VERIFY OTP ─────────────────────────────────────
export const verifyOtpBusiness = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const business = await Business.findOne({ where: { email } });
        if (!business || !business.resetOtp) {
            return res.status(400).json({ success: false, message: 'Invalid request. Please request a new OTP.' });
        }

        if (new Date() > new Date(business.resetOtpExpiry)) {
            await business.update({ resetOtp: null, resetOtpExpiry: null, resetOtpVerified: false });
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        if (business.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
        }

        await business.update({ resetOtpVerified: true });
        res.status(200).json({ success: true, message: 'OTP verified successfully.' });
    } catch (error) {
        console.error('Business verify OTP error:', error);
        res.status(500).json({ success: false, message: 'Server error verifying OTP' });
    }
};

// ─── FORGOT PASSWORD: STEP 3 — RESET PASSWORD ─────────────────────────────────
export const resetPasswordBusiness = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ success: false, message: 'Email and new password are required' });
        }

        const business = await Business.findOne({ where: { email } });
        if (!business || !business.resetOtpVerified) {
            return res.status(400).json({ success: false, message: 'OTP not verified. Please complete verification first.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await business.update({
            password: hashedPassword,
            resetOtp: null,
            resetOtpExpiry: null,
            resetOtpVerified: false,
        });

        res.status(200).json({ success: true, message: 'Password reset successfully. You can now log in.' });
    } catch (error) {
        console.error('Business reset password error:', error);
        res.status(500).json({ success: false, message: 'Server error resetting password' });
    }
};