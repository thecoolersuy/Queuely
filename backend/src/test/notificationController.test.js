import Notification from '../models/Notification.js';
import * as notificationController from '../controller/notificationController.js';

jest.mock('../models/Notification.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findOne: jest.fn(),
    }
}));

describe('Notification Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { userId: 1 },
            params: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe('getNotifications', () => {
        it('should return user notifications', async () => {
            const mockNotifications = [
                { notification_id: 1, title: 'New Booking', read: false },
                { notification_id: 2, title: 'Booking Cancelled', read: true }
            ];

            Notification.findAll.mockResolvedValue(mockNotifications);

            await notificationController.getNotifications(req, res);

            expect(Notification.findAll).toHaveBeenCalledWith({
                where: { user_id: 1 },
                order: [['createdAt', 'DESC']]
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockNotifications });
        });
    });

    describe('markAsRead', () => {
        it('should mark notification as read', async () => {
            req.params.notification_id = 1;
            const mockNotification = {
                notification_id: 1,
                user_id: 1,
                is_read: false,
                save: jest.fn().mockResolvedValue(true)
            };

            Notification.findOne.mockResolvedValue(mockNotification);

            await notificationController.markAsRead(req, res);

            expect(Notification.findOne).toHaveBeenCalledWith({ where: { notification_id: 1, user_id: 1 } });
            expect(mockNotification.is_read).toBe(true);
            expect(mockNotification.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Notification marked as read' });
        });

        it('should return 404 if notification not found', async () => {
            req.params.notification_id = 999;
            Notification.findOne.mockResolvedValue(null);

            await notificationController.markAsRead(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Notification not found' });
        });
    });
});
