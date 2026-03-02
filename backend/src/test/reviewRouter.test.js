import request from 'supertest';
import app from '../app.js';
import Business from '../models/Business.js';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import { verifyToken } from '../security/jwt-utils.js';

jest.mock('../models/Business.js', () => ({
    __esModule: true,
    default: {
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
        findOne: jest.fn(),
    }
}));

jest.mock('../models/Review.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
        belongsTo: jest.fn(),
        hasMany: jest.fn(),
    }
}));

jest.mock('../models/Booking.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        hasOne: jest.fn(),
        hasMany: jest.fn(),
    }
}));

jest.mock('../models/Notification.js', () => ({
    __esModule: true,
    default: { create: jest.fn() }
}));

jest.mock('../security/jwt-utils.js', () => ({
    verifyToken: jest.fn(),
}));

const VALID_USER = { userId: 1, role: 'user' };

describe('Review Router Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ─── POST /api/reviews ───────────────────────────────────────────────────
    describe('POST /api/reviews', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).post('/api/reviews');
            expect(response.status).toBe(401);
        });

        it('should return 401 if token is invalid', async () => {
            verifyToken.mockReturnValue(null);
            const response = await request(app)
                .post('/api/reviews')
                .set('Authorization', 'Bearer bad-token');
            expect(response.status).toBe(401);
        });

        it('should return 404 if booking not found', async () => {
            verifyToken.mockReturnValue(VALID_USER);
            Booking.findOne.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/reviews')
                .set('Authorization', 'Bearer valid-token')
                .send({ booking_id: 999, rating: 5, comment: 'Great' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Booking not found');
        });

        it('should return 400 if booking is not completed', async () => {
            verifyToken.mockReturnValue(VALID_USER);
            Booking.findOne.mockResolvedValue({ booking_id: 1, status: 'PENDING', business_id: 10 });

            const response = await request(app)
                .post('/api/reviews')
                .set('Authorization', 'Bearer valid-token')
                .send({ booking_id: 1, rating: 5, comment: 'Nice' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('You can only review completed bookings');
        });

        it('should return 400 if review already exists', async () => {
            verifyToken.mockReturnValue(VALID_USER);
            Booking.findOne.mockResolvedValue({ booking_id: 1, status: 'COMPLETED', business_id: 10 });
            Review.findOne.mockResolvedValue({ review_id: 5 });

            const response = await request(app)
                .post('/api/reviews')
                .set('Authorization', 'Bearer valid-token')
                .send({ booking_id: 1, rating: 4, comment: 'Good' });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('You have already reviewed this booking');
        });

        it('should return 201 on successful review creation', async () => {
            verifyToken.mockReturnValue(VALID_USER);
            Booking.findOne.mockResolvedValue({ booking_id: 1, status: 'COMPLETED', business_id: 10 });
            Review.findOne.mockResolvedValue(null);
            Review.create.mockResolvedValue({ review_id: 1, rating: 5 });
            Notification.create.mockResolvedValue({});

            const response = await request(app)
                .post('/api/reviews')
                .set('Authorization', 'Bearer valid-token')
                .send({ booking_id: 1, rating: 5, comment: 'Excellent!' });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Review submitted successfully');
        });
    });
});
