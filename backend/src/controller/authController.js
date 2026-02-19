import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateToken } from '../security/jwt-utils.js';
import { sendOtpEmail } from '../utils/emailService.js';

// ─── REGISTER ────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, location, email, password } = req.body;

    if (!name || !location || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, location, email, password: hashedPassword });
    const token = generateToken(user.user_id, user.email, 'customer');

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        location: user.location,
        role: 'customer',
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Password not correct' });
    }

    const token = generateToken(user.user_id, user.email, 'customer');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        location: user.location,
        role: 'customer',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ─── FORGOT PASSWORD: STEP 1 — SEND OTP ──────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Security: don't reveal if email exists
      return res.status(200).json({ success: true, message: 'If this email exists, an OTP has been sent.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.update({ resetOtp: otp, resetOtpExpiry: otpExpiry, resetOtpVerified: false });
    await sendOtpEmail(email, otp, 'customer');

    res.status(200).json({ success: true, message: 'OTP sent to your email successfully.' });
  } catch (error) {
    console.error('Forgot password error FULL DETAILS:', error);
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};

// ─── FORGOT PASSWORD: STEP 2 — VERIFY OTP ─────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.resetOtp) {
      return res.status(400).json({ success: false, message: 'Invalid request. Please request a new OTP.' });
    }

    if (new Date() > new Date(user.resetOtpExpiry)) {
      await user.update({ resetOtp: null, resetOtpExpiry: null, resetOtpVerified: false });
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    await user.update({ resetOtpVerified: true });
    res.status(200).json({ success: true, message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error verifying OTP' });
  }
};

// ─── FORGOT PASSWORD: STEP 3 — RESET PASSWORD ─────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and new password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.resetOtpVerified) {
      return res.status(400).json({ success: false, message: 'OTP not verified. Please complete verification first.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password: hashedPassword,
      resetOtp: null,
      resetOtpExpiry: null,
      resetOtpVerified: false,
    });

    res.status(200).json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error resetting password' });
  }
};
