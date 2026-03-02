import request from 'supertest';
import app from '../app.js';
import Service from '../models/Service.js';
import { verifyToken } from '../security/jwt-utils.js';

jest.mock('../models/Service.js', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
    }
}));

jest.mock('../security/jwt-utils.js', () => ({
    verifyToken: jest.fn(),
}));

const VALID_BIZ = { userId: 10, role: 'business' };

describe('Service Router Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ─── POST /api/services ──────────────────────────────────────────────────
    describe('POST /api/services', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).post('/api/services');
            expect(response.status).toBe(401);
        });

        it('should return 400 if required fields are missing', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            const response = await request(app)
                .post('/api/services')
                .set('Authorization', 'Bearer valid-token')
                .send({ name: 'Haircut' }); // missing price and duration
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Name, price, and duration are required');
        });

        it('should return 201 on successful service creation', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            const mockService = { service_id: 1, name: 'Haircut', price: 20, duration: 30 };
            Service.create.mockResolvedValue(mockService);

            const response = await request(app)
                .post('/api/services')
                .set('Authorization', 'Bearer valid-token')
                .send({ name: 'Haircut', price: 20, duration: 30 });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Service created successfully');
        });
    });

    // ─── GET /api/services ───────────────────────────────────────────────────
    describe('GET /api/services', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).get('/api/services');
            expect(response.status).toBe(401);
        });

        it('should return 200 with list of services', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            Service.findAll.mockResolvedValue([{ service_id: 1, name: 'Haircut' }]);

            const response = await request(app)
                .get('/api/services')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    // ─── PUT /api/services/:service_id ───────────────────────────────────────
    describe('PUT /api/services/:service_id', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).put('/api/services/1');
            expect(response.status).toBe(401);
        });

        it('should return 404 if service not found', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            Service.findOne.mockResolvedValue(null);

            const response = await request(app)
                .put('/api/services/999')
                .set('Authorization', 'Bearer valid-token')
                .send({ name: 'New Name' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Service not found');
        });

        it('should return 200 on successful update', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            const mockService = { service_id: 1, name: 'Old', save: jest.fn().mockResolvedValue(true) };
            Service.findOne.mockResolvedValue(mockService);

            const response = await request(app)
                .put('/api/services/1')
                .set('Authorization', 'Bearer valid-token')
                .send({ name: 'Updated Haircut' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Service updated successfully');
        });
    });

    // ─── DELETE /api/services/:service_id ────────────────────────────────────
    describe('DELETE /api/services/:service_id', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).delete('/api/services/1');
            expect(response.status).toBe(401);
        });

        it('should return 404 if service not found', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            Service.findOne.mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/services/999')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Service not found');
        });

        it('should return 200 on successful deletion', async () => {
            verifyToken.mockReturnValue(VALID_BIZ);
            const mockService = { service_id: 1, destroy: jest.fn().mockResolvedValue(true) };
            Service.findOne.mockResolvedValue(mockService);

            const response = await request(app)
                .delete('/api/services/1')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Service deleted successfully');
        });
    });
});
