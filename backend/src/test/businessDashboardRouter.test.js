import request from 'supertest';
import app from '../app.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Barber from '../models/Barber.js';
import Business from '../models/Business.js';
import Notification from '../models/Notification.js';
import { verifyToken } from '../security/jwt-utils.js';

jest.mock('../models/Booking.js', () => ({
    __esModule: true,
    default: {
        sum: jest.fn(),
        count: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
    }
}));

jest.mock('../models/Service.js', () => ({
    __esModule: true,
    default: { count: jest.fn() }
}));

jest.mock('../models/Barber.js', () => ({
    __esModule: true,
    default: { count: jest.fn() }
}));

jest.mock('../models/Business.js', () => ({
    __esModule: true,
    default: {
        findByPk: jest.fn(),
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
    }
}));

jest.mock('../models/Notification.js', () => ({
    __esModule: true,
    default: { create: jest.fn() }
}));

jest.mock('../models/Review.js', () => ({
    __esModule: true,
    default: {
        belongsTo: jest.fn(),
        hasMany: jest.fn(),
    }
}));

jest.mock('../middleware/uploadMiddleware.js', () => ({
    upload: { single: jest.fn(() => (req, res, next) => next()) }
}));

jest.mock('../security/jwt-utils.js', () => ({
    verifyToken: jest.fn(),
}));

const VALID_BIZ = { userId: 10, role: 'business' };

describe('Business Dashboard Router Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ─── GET /api/business-dashboard/stats ──────────────────────────────────
    describe('GET /api/business-dashboard/stats', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).get('/api/business-dashboard/stats');
            expect(response.status).toBe(401);
        });

        it('should return 200 with dashboard stats', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            Booking.sum.mockResolvedValue(500);
            Booking.count.mockResolvedValue(10);
            Service.count.mockResolvedValue(5);
            Barber.count.mockResolvedValue(3);

            const response = await request(app)
                .get('/api/business-dashboard/stats')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('totalBookings');
        });
    });

    // ─── GET /api/business-dashboard/bookings ───────────────────────────────
    describe('GET /api/business-dashboard/bookings', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).get('/api/business-dashboard/bookings');
            expect(response.status).toBe(401);
        });

        it('should return 200 with recent bookings', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            Booking.findAll.mockResolvedValue([{ booking_id: 1, service: 'Haircut' }]);

            const response = await request(app)
                .get('/api/business-dashboard/bookings')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    // ─── GET /api/business-dashboard/all-bookings ───────────────────────────
    describe('GET /api/business-dashboard/all-bookings', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).get('/api/business-dashboard/all-bookings');
            expect(response.status).toBe(401);
        });

        it('should return 200 with all bookings', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            Booking.findAll.mockResolvedValue([{ booking_id: 2, service: 'Shave' }]);

            const response = await request(app)
                .get('/api/business-dashboard/all-bookings')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    // ─── PATCH /api/business-dashboard/bookings/:booking_id/status ──────────
    describe('PATCH /api/business-dashboard/bookings/:booking_id/status', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).patch('/api/business-dashboard/bookings/1/status');
            expect(response.status).toBe(401);
        });

        it('should return 400 for invalid status', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            const response = await request(app)
                .patch('/api/business-dashboard/bookings/1/status')
                .set('Authorization', 'Bearer valid-token')
                .send({ status: 'INVALID' });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid status');
        });

        it('should return 404 if booking not found', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            Booking.findOne.mockResolvedValue(null);
            const response = await request(app)
                .patch('/api/business-dashboard/bookings/999/status')
                .set('Authorization', 'Bearer valid-token')
                .send({ status: 'ACCEPTED' });
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Booking not found');
        });

        it('should return 200 and update booking status', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            const mockBooking = {
                booking_id: 1,
                service: 'Haircut',
                user_id: 5,
                status: 'PENDING',
                save: jest.fn().mockResolvedValue(true),
            };
            Booking.findOne.mockResolvedValue(mockBooking);
            Notification.create.mockResolvedValue({});

            const response = await request(app)
                .patch('/api/business-dashboard/bookings/1/status')
                .set('Authorization', 'Bearer valid-token')
                .send({ status: 'ACCEPTED' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    // ─── GET /api/business-dashboard/profile ────────────────────────────────
    describe('GET /api/business-dashboard/profile', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).get('/api/business-dashboard/profile');
            expect(response.status).toBe(401);
        });

        it('should return 404 if business not found', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            Business.findByPk.mockResolvedValue(null);
            const response = await request(app)
                .get('/api/business-dashboard/profile')
                .set('Authorization', 'Bearer valid-token');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Business not found');
        });

        it('should return 200 with business profile', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            Business.findByPk.mockResolvedValue({ business_id: 10, shopName: 'TestShop' });
            const response = await request(app)
                .get('/api/business-dashboard/profile')
                .set('Authorization', 'Bearer valid-token');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    // ─── PUT /api/business-dashboard/profile ─────────────────────────────────
    describe('PUT /api/business-dashboard/profile', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).put('/api/business-dashboard/profile');
            expect(response.status).toBe(401);
        });

        it('should return 404 if business not found', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            Business.findByPk.mockResolvedValue(null);
            const response = await request(app)
                .put('/api/business-dashboard/profile')
                .set('Authorization', 'Bearer valid-token')
                .send({ shopName: 'NewName' });
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Business not found');
        });

        it('should return 200 on successful profile update', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            const mockBusiness = { shopName: 'Old', save: jest.fn().mockResolvedValue(true) };
            Business.findByPk.mockResolvedValue(mockBusiness);
            const response = await request(app)
                .put('/api/business-dashboard/profile')
                .set('Authorization', 'Bearer valid-token')
                .send({ shopName: 'Updated Shop' });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
});
