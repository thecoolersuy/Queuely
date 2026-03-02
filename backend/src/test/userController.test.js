import Business from '../models/Business.js';
import Review from '../models/Review.js';
import * as userController from '../controller/userController.js';
import { sequelize } from '../database/index.js';

jest.mock('../models/Business.js', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        hasMany: jest.fn(),
    }
}));

jest.mock('../models/Review.js', () => ({
    __esModule: true,
    default: {
        belongsTo: jest.fn(),
    }
}));

jest.mock('../database/index.js', () => ({
    sequelize: {
        fn: jest.fn(),
        col: jest.fn(),
    }
}));

describe('User Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { userId: 1 },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
            const mockUser = {
                userId: 1,
                name: 'John Doe',
                email: 'john@example.com'
            };
            req.user = mockUser;

            await userController.getProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, user: mockUser });
        });
    });

    describe('getBusinesses', () => {
        it('should return all businesses', async () => {
            const mockBusinesses = [
                { business_id: 1, shopName: 'Shop A' },
                { business_id: 2, shopName: 'Shop B' }
            ];

            Business.findAll.mockResolvedValue(mockBusinesses);

            await userController.getBusinesses(req, res);

            expect(Business.findAll).toHaveBeenCalledWith({
                attributes: expect.any(Array),
                include: expect.any(Array),
                group: ['Business.business_id']
            });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockBusinesses });
        });
    });
});
