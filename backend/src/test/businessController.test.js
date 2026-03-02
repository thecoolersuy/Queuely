import Business from '../models/Business.js';
import Barber from '../models/Barber.js';
import Service from '../models/Service.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import * as businessController from '../controller/businessController.js';
import { sequelize } from '../database/index.js';

jest.mock('../models/Business.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
    }
}));

jest.mock('../models/Barber.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
    }
}));

jest.mock('../models/Service.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
    }
}));

jest.mock('../models/Review.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
    }
}));

jest.mock('../models/User.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
    }
}));

jest.mock('../database/index.js', () => ({
    sequelize: {
        fn: jest.fn(),
        col: jest.fn(),
    }
}));

describe('Business Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe('getBusinessDetails', () => {
        it('should return business details successfully', async () => {
            req.params.business_id = 1;

            const mockBusiness = {
                business_id: 1,
                shopName: 'Test Shop',
                email: 'test@example.com',
                phoneNumber: '1234567890',
                country: 'US',
                localLocation: 'NY',
                profileImage: 'img.jpg',
                businessFocus: 'Barber',
                toJSON: jest.fn().mockReturnValue({ business_id: 1, shopName: 'Test Shop' })
            };

            const mockBarbers = [{ barber_id: 1, name: 'Barber 1' }];
            const mockServices = [{ service_id: 1, name: 'Service 1' }];
            const mockReviews = [
                { review_id: 1, user_id: 101, rating: 5, toJSON: jest.fn().mockReturnValue({ review_id: 1, rating: 5 }) }
            ];
            const mockUsers = [{ user_id: 101, name: 'User 1' }];

            Business.findOne.mockResolvedValue(mockBusiness);
            Barber.findAll.mockResolvedValue(mockBarbers);
            Service.findAll.mockResolvedValue(mockServices);
            Review.findAll.mockResolvedValue(mockReviews);
            User.findAll.mockResolvedValue(mockUsers);

            await businessController.getBusinessDetails(req, res);

            expect(Business.findOne).toHaveBeenCalledWith({
                where: { business_id: 1 },
                attributes: expect.any(Array)
            });
            expect(Barber.findAll).toHaveBeenCalledWith({ where: { business_id: 1 }, attributes: expect.any(Array), order: expect.any(Array) });
            expect(Service.findAll).toHaveBeenCalledWith({ where: { business_id: 1 }, attributes: expect.any(Array), order: expect.any(Array) });
            expect(Review.findAll).toHaveBeenCalledWith({ where: { business_id: 1 }, order: expect.any(Array) });
            expect(User.findAll).toHaveBeenCalledWith({ where: { user_id: [101] }, attributes: expect.any(Array) });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                data: expect.objectContaining({
                    business: { business_id: 1, shopName: 'Test Shop' },
                    barbers: mockBarbers,
                    services: mockServices,
                    reviews: expect.any(Array),
                    rating: '5.0',
                    reviewCount: 1
                })
            }));
        });

        it('should return 404 if business not found', async () => {
            req.params.business_id = 999;
            Business.findOne.mockResolvedValue(null);

            await businessController.getBusinessDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Business not found' });
        });
    });
});
