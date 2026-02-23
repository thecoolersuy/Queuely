import request from 'supertest';
import app from '../app.js';
import Barber from '../models/Barber.js';
import { verifyToken } from '../security/jwt-utils.js';

jest.mock('../models/Barber.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        create: jest.fn(),
    }
}));

jest.mock('../security/jwt-utils.js', () => ({
    verifyToken: jest.fn(),
}));

describe('Barber Router Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/barbers', () => {
        it('should return 401 if no token is provided', async () => {
            const response = await request(app).get('/api/barbers');

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Access denied. No token provided.');
        });

        it('should return 401 if token is invalid', async () => {
            verifyToken.mockReturnValue(null);

            const response = await request(app)
                .get('/api/barbers')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid or expired token');
        });

        it('should return 200 and list of barbers if token is valid', async () => {
            verifyToken.mockReturnValue({ userId: 1, role: 'business' });
            Barber.findAll.mockResolvedValue([{ id: 1, name: 'John' }]);

            const response = await request(app)
                .get('/api/barbers')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(Barber.findAll).toHaveBeenCalled();
        });
    });
});
