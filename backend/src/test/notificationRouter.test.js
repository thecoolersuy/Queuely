import request from 'supertest';
import app from '../app.js';
import Notification from '../models/Notification.js';
import { verifyToken } from '../security/jwt-utils.js';

jest.mock('../models/Notification.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
    }
}));

jest.mock('../security/jwt-utils.js', () => ({
    verifyToken: jest.fn(),
}));

const VALID_USER = { userId: 1, role: 'user' };

describe('Notification Router Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ─── GET /api/notifications ──────────────────────────────────────────────
    describe('GET /api/notifications', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).get('/api/notifications');
            expect(response.status).toBe(401);
        });

        it('should return 401 if token is invalid', async () => {
            verifyToken.mockReturnValue(null);
            const response = await request(app)
                .get('/api/notifications')
                .set('Authorization', 'Bearer bad-token');
            expect(response.status).toBe(401);
        });

        it('should return 200 with notifications when authenticated', async () => {
            verifyToken.mockReturnValue(VALID_USER);
            Notification.findAll.mockResolvedValue([
                { notification_id: 1, title: 'Test', message: 'Hello', is_read: false },
            ]);

            const response = await request(app)
                .get('/api/notifications')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    // ─── PATCH /api/notifications/:notification_id/read ─────────────────────
    describe('PATCH /api/notifications/:notification_id/read', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).patch('/api/notifications/1/read');
            expect(response.status).toBe(401);
        });

        it('should return 404 if notification not found', async () => {
            verifyToken.mockReturnValue(VALID_USER);
            Notification.findOne.mockResolvedValue(null);

            const response = await request(app)
                .patch('/api/notifications/999/read')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Notification not found');
        });

        it('should return 200 and mark notification as read', async () => {
            verifyToken.mockReturnValue(VALID_USER);
            const mockNotification = { notification_id: 1, is_read: false, save: jest.fn().mockResolvedValue(true) };
            Notification.findOne.mockResolvedValue(mockNotification);

            const response = await request(app)
                .patch('/api/notifications/1/read')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Notification marked as read');
        });
    });

    // ─── PATCH /api/notifications/read-all ──────────────────────────────────
    describe('PATCH /api/notifications/read-all', () => {
        it('should return 401 if no token', async () => {
            const response = await request(app).patch('/api/notifications/read-all');
            expect(response.status).toBe(401);
        });

        it('should return 200 and mark all notifications as read', async () => {
            verifyToken.mockReturnValue(VALID_USER);
            Notification.update.mockResolvedValue([1]);

            const response = await request(app)
                .patch('/api/notifications/read-all')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('All notifications marked as read');
        });
    });
});
