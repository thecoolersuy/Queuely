import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../security/jwt-utils.js';

jest.mock('../models/User.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
    }
}));
jest.mock('bcrypt');
jest.mock('../security/jwt-utils.js');
jest.mock('../utils/emailService.js');

describe('Auth Router Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should return 201 on successful registration', async () => {
            const mockUser = { user_id: 1, name: 'Test', email: 'test@example.com' };
            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed');
            User.create.mockResolvedValue(mockUser);
            generateToken.mockReturnValue('token');

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test',
                    location: 'Test',
                    email: 'test@example.com',
                    password: 'password'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBe('token');
        });

        it('should return 400 if email exists', async () => {
            User.findOne.mockResolvedValue({ id: 1 });

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test',
                    location: 'Test',
                    email: 'test@example.com',
                    password: 'password'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email already registered');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return 200 on successful login', async () => {
            const mockUser = { user_id: 1, email: 'test@example.com', password: 'hashed' };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            generateToken.mockReturnValue('token');

            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password' });

            expect(response.status).toBe(200);
            expect(response.body.token).toBe('token');
        });

        it('should return 401 on invalid credentials', async () => {
            User.findOne.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/auth/login')
                .send({ email: 'wrong@example.com', password: 'password' });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('No account found');
        });
    });
});
