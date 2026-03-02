import request from 'supertest';
import app from '../app.js';
import Business from '../models/Business.js';
import Review from '../models/Review.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../security/jwt-utils.js';

jest.mock('../models/Review.js', () => ({
    __esModule: true,
    default: {
        belongsTo: jest.fn(),
        hasMany: jest.fn(),
    }
}));

jest.mock('../models/Business.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
    }
}));

jest.mock('bcrypt');
jest.mock('../security/jwt-utils.js');
jest.mock('../utils/emailService.js');

describe('Business Auth Router Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ─── POST /api/business-auth/register ───────────────────────────────────
    describe('POST /api/business-auth/register', () => {
        const validPayload = {
            shopName: 'TestShop', firstName: 'John', lastName: 'Doe',
            email: 'biz@example.com', phoneNumber: '9999999', password: 'secret', country: 'NP',
        };

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/api/business-auth/register')
                .send({ shopName: 'OnlyName' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('All fields are required');
        });

        it('should return 400 if email already registered', async () => {
            Business.findOne.mockResolvedValue({ business_id: 1 });
            const response = await request(app)
                .post('/api/business-auth/register')
                .send(validPayload);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email already registered');
        });

        it('should return 201 on successful registration', async () => {
            Business.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed');
            Business.create.mockResolvedValue({ business_id: 1, ...validPayload });
            generateToken.mockReturnValue('biz-token');

            const response = await request(app)
                .post('/api/business-auth/register')
                .send(validPayload);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBe('biz-token');
        });
    });

    // ─── POST /api/business-auth/login ──────────────────────────────────────
    describe('POST /api/business-auth/login', () => {
        it('should return 400 if email or password missing', async () => {
            const response = await request(app)
                .post('/api/business-auth/login')
                .send({ email: 'biz@example.com' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email and password are required');
        });

        it('should return 401 if business not found', async () => {
            Business.findOne.mockResolvedValue(null);
            const response = await request(app)
                .post('/api/business-auth/login')
                .send({ email: 'nope@example.com', password: 'pass' });
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('No business account found with this email');
        });

        it('should return 401 if password is invalid', async () => {
            Business.findOne.mockResolvedValue({ business_id: 1, password: 'hashed' });
            bcrypt.compare.mockResolvedValue(false);
            const response = await request(app)
                .post('/api/business-auth/login')
                .send({ email: 'biz@example.com', password: 'wrongpass' });
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid password');
        });

        it('should return 200 on successful login', async () => {
            Business.findOne.mockResolvedValue({ business_id: 1, password: 'hashed', email: 'biz@example.com' });
            bcrypt.compare.mockResolvedValue(true);
            generateToken.mockReturnValue('biz-token');

            const response = await request(app)
                .post('/api/business-auth/login')
                .send({ email: 'biz@example.com', password: 'secret' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBe('biz-token');
        });
    });

    // ─── POST /api/business-auth/forgot-password ────────────────────────────
    describe('POST /api/business-auth/forgot-password', () => {
        it('should return 400 if email not provided', async () => {
            const response = await request(app)
                .post('/api/business-auth/forgot-password')
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email is required');
        });

        it('should return 200 even if email not found (security)', async () => {
            Business.findOne.mockResolvedValue(null);
            const response = await request(app)
                .post('/api/business-auth/forgot-password')
                .send({ email: 'ghost@example.com' });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should return 200 and send OTP when business found', async () => {
            const mockBusiness = { update: jest.fn().mockResolvedValue(true) };
            Business.findOne.mockResolvedValue(mockBusiness);

            const { sendOtpEmail } = await import('../utils/emailService.js');
            sendOtpEmail.mockResolvedValue(true);

            const response = await request(app)
                .post('/api/business-auth/forgot-password')
                .send({ email: 'biz@example.com' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    // ─── POST /api/business-auth/verify-otp ─────────────────────────────────
    describe('POST /api/business-auth/verify-otp', () => {
        it('should return 400 if email or otp missing', async () => {
            const response = await request(app)
                .post('/api/business-auth/verify-otp')
                .send({ email: 'biz@example.com' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email and OTP are required');
        });

        it('should return 400 if business not found or no resetOtp', async () => {
            Business.findOne.mockResolvedValue(null);
            const response = await request(app)
                .post('/api/business-auth/verify-otp')
                .send({ email: 'biz@example.com', otp: '123456' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid request. Please request a new OTP.');
        });

        it('should return 400 if OTP has expired', async () => {
            Business.findOne.mockResolvedValue({
                resetOtp: '123456',
                resetOtpExpiry: new Date(Date.now() - 1000),
                update: jest.fn().mockResolvedValue(true),
            });
            const response = await request(app)
                .post('/api/business-auth/verify-otp')
                .send({ email: 'biz@example.com', otp: '123456' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('OTP has expired. Please request a new one.');
        });

        it('should return 400 if OTP is wrong', async () => {
            Business.findOne.mockResolvedValue({
                resetOtp: '999999',
                resetOtpExpiry: new Date(Date.now() + 60000),
                update: jest.fn(),
            });
            const response = await request(app)
                .post('/api/business-auth/verify-otp')
                .send({ email: 'biz@example.com', otp: '123456' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid OTP. Please try again.');
        });

        it('should return 200 on valid OTP', async () => {
            Business.findOne.mockResolvedValue({
                resetOtp: '123456',
                resetOtpExpiry: new Date(Date.now() + 60000),
                update: jest.fn().mockResolvedValue(true),
            });
            const response = await request(app)
                .post('/api/business-auth/verify-otp')
                .send({ email: 'biz@example.com', otp: '123456' });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    // ─── POST /api/business-auth/reset-password ──────────────────────────────
    describe('POST /api/business-auth/reset-password', () => {
        it('should return 400 if email or newPassword missing', async () => {
            const response = await request(app)
                .post('/api/business-auth/reset-password')
                .send({ email: 'biz@example.com' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email and new password are required');
        });

        it('should return 400 if OTP not verified', async () => {
            Business.findOne.mockResolvedValue({ resetOtpVerified: false });
            const response = await request(app)
                .post('/api/business-auth/reset-password')
                .send({ email: 'biz@example.com', newPassword: 'newpass' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('OTP not verified. Please complete verification first.');
        });

        it('should return 400 if password is too short', async () => {
            Business.findOne.mockResolvedValue({ resetOtpVerified: true });
            const response = await request(app)
                .post('/api/business-auth/reset-password')
                .send({ email: 'biz@example.com', newPassword: 'abc' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Password must be at least 6 characters');
        });

        it('should return 200 on successful password reset', async () => {
            Business.findOne.mockResolvedValue({ resetOtpVerified: true, update: jest.fn().mockResolvedValue(true) });
            bcrypt.hash.mockResolvedValue('newHashed');

            const response = await request(app)
                .post('/api/business-auth/reset-password')
                .send({ email: 'biz@example.com', newPassword: 'newpassword' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Password reset successfully. You can now log in.');
        });
    });
});
