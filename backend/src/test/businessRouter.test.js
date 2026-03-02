import request from 'supertest';
import app from '../app.js';
import Business from '../models/Business.js';
import Barber from '../models/Barber.js';
import Service from '../models/Service.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

jest.mock('../models/Business.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
    }
}));

jest.mock('../models/Barber.js', () => ({
    __esModule: true,
    default: { findAll: jest.fn() }
}));

jest.mock('../models/Service.js', () => ({
    __esModule: true,
    default: { findAll: jest.fn() }
}));

jest.mock('../models/Review.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        belongsTo: jest.fn(),
        hasMany: jest.fn(),
    }
}));

jest.mock('../models/User.js', () => ({
    __esModule: true,
    default: { findAll: jest.fn() }
}));

jest.mock('../database/index.js', () => ({
    sequelize: { 
        fn: jest.fn(), 
        col: jest.fn(), 
        literal: jest.fn(),
        define: jest.fn(() => ({
            belongsTo: jest.fn(),
            hasMany: jest.fn(),
            hasOne: jest.fn(),
        })),
    }
}));

describe('Business Router Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ─── GET /api/business/:business_id ─────────────────────────────────────
    describe('GET /api/business/:business_id', () => {
        it('should return 404 if business not found', async () => {
            Business.findOne.mockResolvedValue(null);
            const response = await request(app).get('/api/business/999');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Business not found');
        });

        it('should return 200 with business details', async () => {
            const mockBusiness = {
                business_id: 1,
                shopName: 'TestShop',
                toJSON: jest.fn().mockReturnValue({ business_id: 1, shopName: 'TestShop' }),
            };
            Business.findOne.mockResolvedValue(mockBusiness);
            Barber.findAll.mockResolvedValue([{ barber_id: 1, name: 'Bob' }]);
            Service.findAll.mockResolvedValue([{ service_id: 1, name: 'Haircut' }]);
            const mockReview = { review_id: 1, rating: 5, user_id: 2, toJSON: jest.fn().mockReturnValue({ review_id: 1, rating: 5, user_id: 2 }) };
            Review.findAll.mockResolvedValue([mockReview]);
            User.findAll.mockResolvedValue([{ user_id: 2, name: 'Alice' }]);

            const response = await request(app).get('/api/business/1');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('business');
            expect(response.body.data).toHaveProperty('barbers');
            expect(response.body.data).toHaveProperty('services');
            expect(response.body.data).toHaveProperty('reviews');
        });
    });
});
