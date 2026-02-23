import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Review from '../models/Review.js';
import * as bookingController from '../controller/bookingController.js';

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
        belongsTo: jest.fn(),
    }
}));

describe('Booking Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { userId: 1 },
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe('createBooking', () => {
        it('should create a booking successfully', async () => {
            req.body = {
                business_id: 1,
                service: 'Haircut',
                barber: 'John',
                date: '2023-10-10',
                time: '10:00 AM',
                amount: 20
            };

            User.findByPk.mockResolvedValue({ id: 1, name: 'Test User', email: 'test@example.com' });
            Booking.create.mockResolvedValue({ id: 100, ...req.body, status: 'PENDING' });

            await bookingController.createBooking(req, res);

            expect(User.findByPk).toHaveBeenCalledWith(1);
            expect(Booking.create).toHaveBeenCalled();
            expect(Notification.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Booking request sent successfully',
                data: expect.objectContaining({ status: 'PENDING' })
            });
        });

        it('should return 404 if user not found', async () => {
            User.findByPk.mockResolvedValue(null);

            await bookingController.createBooking(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'User not found'
            });
        });
    });

    describe('getUserBookings', () => {
        it('should return list of user bookings', async () => {
            const mockBookings = [{ id: 1, service: 'Haircut' }];
            Booking.findAll.mockResolvedValue(mockBookings);

            await bookingController.getUserBookings(req, res);

            expect(Booking.findAll).toHaveBeenCalledWith(expect.objectContaining({
                where: { user_id: 1 }
            }));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockBookings
            });
        });
    });
});
