import Service from '../models/Service.js';
import * as serviceController from '../controller/serviceController.js';

jest.mock('../models/Service.js', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        findAll: jest.fn(),
    }
}));

describe('Service Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            user: { userId: 1 },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe('createService', () => {
        it('should create a service successfully', async () => {
            req.body = {
                name: 'Haircut',
                price: 20,
                duration: 30,
                description: 'Basic haircut'
            };

            const mockService = {
                service_id: 1,
                business_id: 1,
                name: 'Haircut',
                price: 20,
                duration: 30,
                description: 'Basic haircut'
            };

            Service.create.mockResolvedValue(mockService);

            await serviceController.createService(req, res);

            expect(Service.create).toHaveBeenCalledWith({
                business_id: 1,
                name: 'Haircut',
                price: 20,
                duration: 30,
                description: 'Basic haircut'
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Service created successfully',
                data: mockService
            });
        });

        it('should return 400 if required fields are missing', async () => {
             req.body = { name: 'Haircut' }; // Missing price and duration

             await serviceController.createService(req, res);

             expect(res.status).toHaveBeenCalledWith(400);
             expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Name, price, and duration are required' });
        });
    });

    describe('getServices', () => {
        it('should return all services for a business', async () => {
            const mockServices = [
                { service_id: 1, name: 'Haircut', price: 20 },
                { service_id: 2, name: 'Shave', price: 15 }
            ];

            Service.findAll.mockResolvedValue(mockServices);

            await serviceController.getServices(req, res);

            expect(Service.findAll).toHaveBeenCalledWith({
                where: { business_id: 1 },
                order: [['createdAt', 'DESC']]
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockServices });
        });
    });
});
