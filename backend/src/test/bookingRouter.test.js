import request from 'supertest';
import app from '../app.js';
import Business from '../models/Business.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Review from '../models/Review.js';
import { verifyToken } from '../security/jwt-utils.js';

jest.mock('../models/Business.js', () => ({
    __esModule: true,
    default: {
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
    }
}));

jest.mock('../models/Booking.js', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        findAll: jest.fn(),
        hasOne: jest.fn(),
    }
}));

jest.mock('../models/User.js', () => ({
    __esModule: true,
    default: {
        findByPk: jest.fn(),
    }
}));

jest.mock('../models/Notification.js', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
    }
}));

jest.mock('../models/Review.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        belongsTo: jest.fn(),
    }
}));

jest.mock('../security/jwt-utils.js', () => ({
    verifyToken: jest.fn(),
}));

const VALID_USER = { userId: 1, role: 'user' };

describe('Booking Router Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ─── POST /api/bookings/create ───────────────────────────────────────────
    describe('POST /api/bookings/create', () => {
        it('should return 401 if no token is provided', async () => {
            const response = await request(app).post('/api/bookings/create');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Access denied. No token provided.');
        });

        it('should return 401 if token is invalid', async () => {
            verifyToken.mockReturnValue(null);
            const response = await request(app)
                .post('/api/bookings/create')
                .set('Authorization', 'Bearer bad-token');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid or expired token');
        });

        it('should return 404 if user is not found', async () => {
            verifyToken.mockReturnValue(VALID_USER);
            User.findByPk.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/bookings/create')
                .set('Authorization', 'Bearer valid-token')
                .send({ business_id: 1, service: 'Haircut', barber: 'John', date: '2026-03-10', time: '10:00', amount: 20 });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found');
        });

        it('should return 201 on successful booking creation', async () => {
            verifyToken.mockReturnValue(VALID_USER);
            User.findByPk.mockResolvedValue({ name: 'Alice', email: 'alice@example.com' });
            const mockBooking = { booking_id: 1, service: 'Haircut', status: 'PENDING' };
            Booking.create.mockResolvedValue(mockBooking);
            Notification.create.mockResolvedValue({});

            const response = await request(app)
                .post('/api/bookings/create')
                .set('Authorization', 'Bearer valid-token')
                .send({ business_id: 1, service: 'Haircut', barber: 'John', date: '2026-03-10', time: '10:00', amount: 20 });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Booking request sent successfully');
        });
    });

    // ─── GET /api/bookings/user ──────────────────────────────────────────────
    describe('GET /api/bookings/user', () => {
        it('should return 401 if no token is provided', async () => {
            const response = await request(app).get('/api/bookings/user');
            expect(response.status).toBe(401);
        });

        it('should return 200 with user bookings when authenticated', async () => {
            verifyToken.mockReturnValue(VALID_USER);
            Booking.hasOne.mockReturnValue(undefined);
            Review.belongsTo.mockReturnValue(undefined);
            Booking.findAll.mockResolvedValue([{ booking_id: 1, service: 'Haircut', status: 'PENDING' }]);

            const response = await request(app)
                .get('/api/bookings/user')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });
});
