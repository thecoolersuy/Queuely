import bcrypt from 'bcrypt';
import Business from '../models/Business.js';
import * as businessAuthController from '../controller/businessAuthController.js';
import { generateToken } from '../security/jwt-utils.js';
import { sendOtpEmail } from '../utils/emailService.js';

jest.mock('bcrypt');
jest.mock('../models/Business.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
    }
}));
jest.mock('../security/jwt-utils.js');
jest.mock('../utils/emailService.js');

describe('Business Auth Controller', () => {
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

    describe('registerBusiness', () => {
        it('should register a new business successfully', async () => {
            req.body = {
                shopName: 'Test Shop',
                firstName: 'John',
                lastName: 'Doe',
                email: 'business@example.com',
                phoneNumber: '1234567890',
                password: 'password123',
                country: 'US'
            };

            const mockBusiness = {
                business_id: 1,
                shopName: 'Test Shop',
                firstName: 'John',
                lastName: 'Doe',
                email: 'business@example.com',
                phoneNumber: '1234567890',
                country: 'US'
            };

            Business.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            Business.create.mockResolvedValue(mockBusiness);
            generateToken.mockReturnValue('mockToken');

            await businessAuthController.registerBusiness(req, res);

            expect(Business.findOne).toHaveBeenCalledWith({ where: { email: 'business@example.com' } });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(Business.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Business registration successful',
                token: 'mockToken',
                user: expect.objectContaining({
                    userId: 1,
                    shopName: 'Test Shop',
                    email: 'business@example.com'
                })
            });
        });

        it('should return 400 if fields are missing', async () => {
            req.body = { shopName: 'Test Shop' }; // Missing other fields

            await businessAuthController.registerBusiness(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'All fields are required' });
        });

        it('should return 400 if email already registered', async () => {
            req.body = {
                shopName: 'Test Shop',
                firstName: 'John',
                lastName: 'Doe',
                email: 'existing@example.com',
                phoneNumber: '1234567890',
                password: 'password123',
                country: 'US'
            };

            Business.findOne.mockResolvedValue({ business_id: 1 });

            await businessAuthController.registerBusiness(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Email already registered' });
        });
    });

    describe('loginBusiness', () => {
        it('should login successfully with correct credentials', async () => {
            req.body = {
                email: 'business@example.com',
                password: 'password123'
            };

            const mockBusiness = {
                business_id: 1,
                email: 'business@example.com',
                password: 'hashedPassword',
                shopName: 'Test Shop',
                firstName: 'John',
                lastName: 'Doe',
                phoneNumber: '1234567890',
                country: 'US'
            };

            Business.findOne.mockResolvedValue(mockBusiness);
            bcrypt.compare.mockResolvedValue(true);
            generateToken.mockReturnValue('mockToken');

            await businessAuthController.loginBusiness(req, res);

            expect(Business.findOne).toHaveBeenCalledWith({ where: { email: 'business@example.com' } });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                token: 'mockToken'
            }));
        });

        it('should return 401 for incorrect password', async () => {
            req.body = {
                email: 'business@example.com',
                password: 'wrongpassword'
            };

            const mockBusiness = {
                business_id: 1,
                email: 'business@example.com',
                password: 'hashedPassword'
            };

            Business.findOne.mockResolvedValue(mockBusiness);
            bcrypt.compare.mockResolvedValue(false);

            await businessAuthController.loginBusiness(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid password' });
        });

        it('should return 401 if business not found', async () => {
            req.body = {
                email: 'nonexistent@example.com',
                password: 'password123'
            };

            Business.findOne.mockResolvedValue(null);

            await businessAuthController.loginBusiness(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'No business account found with this email' });
        });
    });

    describe('forgotPasswordBusiness', () => {
        it('should send OTP if email exists', async () => {
            req.body = { email: 'business@example.com' };
            
            const mockBusiness = {
                business_id: 1,
                email: 'business@example.com',
                update: jest.fn().mockResolvedValue(true)
            };

            Business.findOne.mockResolvedValue(mockBusiness);
            sendOtpEmail.mockResolvedValue(true);

            await businessAuthController.forgotPasswordBusiness(req, res);

            expect(Business.findOne).toHaveBeenCalledWith({ where: { email: 'business@example.com' } });
            expect(mockBusiness.update).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'OTP sent to your email successfully.' });
        });

        it('should return 200 (secure response) if email not found', async () => {
             req.body = { email: 'nonexistent@example.com' };
             Business.findOne.mockResolvedValue(null);

             await businessAuthController.forgotPasswordBusiness(req, res);

             expect(res.status).toHaveBeenCalledWith(200);
             expect(res.json).toHaveBeenCalledWith({ success: true, message: 'If this email exists, an OTP has been sent.' });
        });
    });
});
