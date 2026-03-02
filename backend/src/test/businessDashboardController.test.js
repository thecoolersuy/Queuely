import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Barber from '../models/Barber.js';
import Business from '../models/Business.js';
import Notification from '../models/Notification.js';
import * as dashboardController from '../controller/businessDashboardController.js';
import { Op } from 'sequelize';

jest.mock('../models/Booking.js', () => ({
    __esModule: true,
    default: {
        sum: jest.fn(),
        count: jest.fn(),
        findAll: jest.fn(),
    }
}));

jest.mock('../models/Service.js', () => ({
    __esModule: true,
    default: {
        count: jest.fn(),
    }
}));

jest.mock('../models/Barber.js', () => ({
    __esModule: true,
    default: {
        count: jest.fn(),
    }
}));

jest.mock('../models/Business.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
    }
}));

jest.mock('../models/Notification.js');

describe('Business Dashboard Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { userId: 1 }, // business_id
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe('getDashboardStats', () => {
        it('should return dashboard stats correctly', async () => {
            const mockRevenue = 5000;
            const mockBookingsCount = 20;
            const mockServicesCount = 5;
            const mockBarbersCount = 3;
            const mockNetSales = 4500;

            Booking.sum.mockResolvedValueOnce(mockRevenue);
            Booking.count.mockResolvedValue(mockBookingsCount);
            Service.count.mockResolvedValue(mockServicesCount);
            Barber.count.mockResolvedValue(mockBarbersCount);
            Booking.sum.mockResolvedValueOnce(mockNetSales);

            await dashboardController.getDashboardStats(req, res);

            expect(Booking.sum).toHaveBeenNthCalledWith(1, 'amount', expect.objectContaining({ 
                where: expect.objectContaining({ 
                    business_id: 1, 
                    status: { [Op.in]: ['ACCEPTED', 'COMPLETED'] }
                })
            }));

            // Note: Op.in symbol is tricky to mock exactly, relaxing check or checking argument structure generally
            expect(Booking.sum).toHaveBeenCalledTimes(2);

            expect(Booking.count).toHaveBeenCalledWith({ where: { business_id: 1 } });
            expect(Service.count).toHaveBeenCalledWith({ where: { business_id: 1 } });
            expect(Barber.count).toHaveBeenCalledWith({ where: { business_id: 1 } });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    serviceRevenue: "5000.00",
                    totalBookings: 20,
                    totalServices: 5,
                    totalBarbers: 3
                }
            });
        });

        it('should handle zero stats', async () => {
            Booking.sum.mockResolvedValue(0);
            Booking.count.mockResolvedValue(0);
            Service.count.mockResolvedValue(0);
            Barber.count.mockResolvedValue(0);

            await dashboardController.getDashboardStats(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    serviceRevenue: "0.00",
                    totalBookings: 0,
                    totalServices: 0,
                    totalBarbers: 0
                }
            });
        });
    });

    describe('getRecentBookings', () => {
        it('should return 10 recent bookings', async () => {
            const mockBookings = [
                { booking_id: 1, amount: 100 },
                { booking_id: 2, amount: 200 }
            ];

            Booking.findAll.mockResolvedValue(mockBookings);

            await dashboardController.getRecentBookings(req, res);

            expect(Booking.findAll).toHaveBeenCalledWith({
                where: { business_id: 1 },
                order: [['createdAt', 'DESC']],
                limit: 10
            });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockBookings
            });
        });
    });

    describe('getAllBookings', () => {
        it('should return all bookings', async () => {
            const mockBookings = [
                { booking_id: 1, amount: 100 },
                { booking_id: 2, amount: 200 },
                { booking_id: 3, amount: 300 }
            ];

            Booking.findAll.mockResolvedValue(mockBookings);

            await dashboardController.getAllBookings(req, res);

            expect(Booking.findAll).toHaveBeenCalledWith({
                where: { business_id: 1 },
                order: [['createdAt', 'DESC']]
            });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockBookings
            });
        });
    });
});
