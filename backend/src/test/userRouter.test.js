import request from 'supertest';
import app from '../app.js';
import Business from '../models/Business.js';
import Review from '../models/Review.js';
import { verifyToken } from '../security/jwt-utils.js';

jest.mock('../models/Business.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
    }
}));

jest.mock('../models/Review.js', () => ({
    __esModule: true,
    default: {
        belongsTo: jest.fn(),
        hasMany: jest.fn(),
    }
}));

jest.mock('../database/index.js', () => ({
    sequelize: {
        fn: jest.fn(),
        col: jest.fn(),
        define: jest.fn(() => ({
            belongsTo: jest.fn(),
            hasMany: jest.fn(),
            hasOne: jest.fn(),
        })),
    }
}));

jest.mock('../security/jwt-utils.js', () => ({
    verifyToken: jest.fn(),
}));

const VALID_USER = { userId: 1, role: 'user' };

describe('User Router Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ─── GET /api/user/profile ───────────────────────────────────────────────
    describe('GET /api/user/profile', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).get('/api/user/profile');
            expect(response.status).toBe(401);
        });

        it('should return 401 if token is invalid', async () => {
            verifyToken.mockReturnValue(null);
            const response = await request(app)
                .get('/api/user/profile')
                .set('Authorization', 'Bearer bad-token');
            expect(response.status).toBe(401);
        });

        it('should return 200 with user profile when authenticated', async () => {
            verifyToken.mockReturnValue(VALID_USER);
            const response = await request(app)
                .get('/api/user/profile')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.user).toBeDefined();
            expect(response.body.user.userId).toBe(1);
        });
    });

    // ─── GET /api/user/businesses ────────────────────────────────────────────
    describe('GET /api/user/businesses', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).get('/api/user/businesses');
            expect(response.status).toBe(401);
        });

        it('should return 401 if token is invalid', async () => {
            verifyToken.mockReturnValue(null);
            const response = await request(app)
                .get('/api/user/businesses')
                .set('Authorization', 'Bearer bad-token');
            expect(response.status).toBe(401);
        });

        it('should return 200 with list of businesses', async () => {
            verifyToken.mockReturnValue(VALID_USER);
            Business.findAll.mockResolvedValue([
                { business_id: 1, shopName: 'ShopA', avgRating: '4.5', reviewCount: '10' },
            ]);

            const response = await request(app)
                .get('/api/user/businesses')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });
});
