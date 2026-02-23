import bcrypt from 'bcrypt';
import User from '../models/User.js';
import * as authController from '../controller/authController.js';
import { generateToken } from '../security/jwt-utils.js';
import { sendOtpEmail } from '../utils/emailService.js';

jest.mock('bcrypt');
jest.mock('../models/User.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
    }
}));
jest.mock('../security/jwt-utils.js');
jest.mock('../utils/emailService.js');

describe('Auth Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            req.body = {
                name: 'Test User',
                location: 'Test Location',
                email: 'test@example.com',
                password: 'password123'
            };

            const mockUser = {
                user_id: 1,
                name: 'Test User',
                location: 'Test Location',
                email: 'test@example.com',
            };

            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.create.mockResolvedValue(mockUser);
            generateToken.mockReturnValue('mockToken');

            await authController.register(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(User.create).toHaveBeenCalledWith({
                name: 'Test User',
                location: 'Test Location',
                email: 'test@example.com',
                password: 'hashedPassword'
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Registration successful',
                token: 'mockToken',
                user: {
                    userId: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    location: 'Test Location',
                    role: 'customer',
                }
            });
        });

        it('should return 400 if email is already registered', async () => {
            req.body = {
                name: 'Test User',
                location: 'Test Location',
                email: 'test@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue({ id: 1 });

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Email already registered'
            });
        });

        it('should return 400 if fields are missing', async () => {
            req.body = { email: 'test@example.com' };

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'All fields are required'
            });
        });
    });

    describe('login', () => {
        it('should login successfully', async () => {
            req.body = { email: 'test@example.com', password: 'password123' };
            const mockUser = {
                user_id: 1,
                email: 'test@example.com',
                password: 'hashedPassword',
                name: 'Test User',
                location: 'Test Location'
            };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            generateToken.mockReturnValue('mockToken');

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Login successful',
                token: 'mockToken',
                user: {
                    userId: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    location: 'Test Location',
                    role: 'customer',
                }
            });
        });

        it('should return 401 if user not found', async () => {
            req.body = { email: 'test@example.com', password: 'password123' };
            User.findOne.mockResolvedValue(null);

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'No account found'
            });
        });

        it('should return 401 if password is incorrect', async () => {
            req.body = { email: 'test@example.com', password: 'wrongpassword' };
            User.findOne.mockResolvedValue({ password: 'hashedPassword' });
            bcrypt.compare.mockResolvedValue(false);

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Password not correct'
            });
        });
    });

    describe('forgotPassword', () => {
        it('should send OTP email if user exists', async () => {
            req.body = { email: 'test@example.com' };
            const mockUser = {
                email: 'test@example.com',
                update: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValue(mockUser);

            await authController.forgotPassword(req, res);

            expect(mockUser.update).toHaveBeenCalled();
            expect(sendOtpEmail).toHaveBeenCalledWith('test@example.com', expect.any(String), 'customer');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'OTP sent to your email successfully.'
            });
        });

        it('should return 200 even if user not found (security requirement)', async () => {
            req.body = { email: 'nonexistent@example.com' };
            User.findOne.mockResolvedValue(null);

            await authController.forgotPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'If this email exists, an OTP has been sent.'
            });
        });
    });

    describe('verifyOtp', () => {
        it('should verify OTP successfully', async () => {
            req.body = { email: 'test@example.com', otp: '123456' };
            const mockUser = {
                resetOtp: '123456',
                resetOtpExpiry: new Date(Date.now() + 10000),
                update: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValue(mockUser);

            await authController.verifyOtp(req, res);

            expect(mockUser.update).toHaveBeenCalledWith({ resetOtpVerified: true });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'OTP verified successfully.'
            });
        });

        it('should return 400 if OTP is expired', async () => {
            req.body = { email: 'test@example.com', otp: '123456' };
            const mockUser = {
                resetOtp: '123456',
                resetOtpExpiry: new Date(Date.now() - 10000),
                update: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValue(mockUser);

            await authController.verifyOtp(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'OTP has expired. Please request a new one.'
            });
        });
    });

    describe('resetPassword', () => {
        it('should reset password successfully', async () => {
            req.body = { email: 'test@example.com', newPassword: 'newPassword123' };
            const mockUser = {
                resetOtpVerified: true,
                update: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.hash.mockResolvedValue('newHashedPassword');

            await authController.resetPassword(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
            expect(mockUser.update).toHaveBeenCalledWith({
                password: 'newHashedPassword',
                resetOtp: null,
                resetOtpExpiry: null,
                resetOtpVerified: false,
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Password reset successfully. You can now log in.'
            });
        });

        it('should return 400 if OTP not verified', async () => {
            req.body = { email: 'test@example.com', newPassword: 'newPassword123' };
            const mockUser = {
                resetOtpVerified: false
            };

            User.findOne.mockResolvedValue(mockUser);

            await authController.resetPassword(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'OTP not verified. Please complete verification first.'
            });
        });
    });
});
