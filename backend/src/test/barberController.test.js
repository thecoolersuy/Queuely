import Barber from '../models/Barber';
import * as barberController from '../controller/barberController';

jest.mock('../models/Barber', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    }
}));

describe('Barber Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            user: { userId: 1 },
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('createBarber', () => {
        it('should create a new barber successfully', async () => {
            req.body = {
                name: 'John Doe',
                email: 'johndoe@gmail.com',
                phone: '1234567890',
                specialization: 'Haircut',
                experience: 5
            };

            const mockBarber = {
                barber_id: 1,
                business_id: 1,
                ...req.body,
                status: 'ACTIVE'
            };

            Barber.create.mockResolvedValue(mockBarber);

            await barberController.createBarber(req, res);

            expect(Barber.create).toHaveBeenCalledWith({
                business_id: 1,
                name: 'John Doe',
                email: 'johndoe@gmail.com',
                phone: '1234567890',
                specialization: 'Haircut',
                experience: 5,
                status: 'ACTIVE'
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Barber added successfully',
                data: mockBarber
            });
        });

        it('should return 400 if name is missing', async () => {
            req.body = {
                email: 'johndoe@gmail.com'
            };

            await barberController.createBarber(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Name is required'
            });
            expect(Barber.create).not.toHaveBeenCalled();
        });
    });
})

