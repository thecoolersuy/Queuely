import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import * as reviewController from '../controller/reviewController.js';

jest.mock('../models/Review.js', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        findOne: jest.fn(),
    }
}));

jest.mock('../models/Booking.js', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
    }
}));

jest.mock('../models/Notification.js', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
    }
}));

describe('Review Controller', () => {
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

    describe('createReview', () => {
        it('should create review successfully', async () => {
            req.body = {
                booking_id: 1,
                rating: 5,
                comment: 'Great service!'
            };

            const mockBooking = {
                booking_id: 1,
                business_id: 101,
                user_id: 1,
                status: 'COMPLETED'
            };

            const mockReview = {
                review_id: 1,
                booking_id: 1,
                user_id: 1,
                business_id: 101,
                rating: 5,
                comment: 'Great service!'
            };

            Booking.findOne.mockResolvedValue(mockBooking); // Mock booking found
            Review.findOne.mockResolvedValue(null); // Mock no existing review
            Review.create.mockResolvedValue(mockReview);

            await reviewController.createReview(req, res);

            expect(Booking.findOne).toHaveBeenCalledWith({ where: { booking_id: 1, user_id: 1 } });
            expect(Review.findOne).toHaveBeenCalledWith({ where: { booking_id: 1 } });
            expect(Review.create).toHaveBeenCalledWith({
                booking_id: 1,
                business_id: 101,
                user_id: 1,
                rating: 5,
                comment: 'Great service!'
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Review submitted successfully',
                data: mockReview
            });
        });

        it('should fail if booking not found', async () => {
            req.body = { booking_id: 999 };
            Booking.findOne.mockResolvedValue(null);

            await reviewController.createReview(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Booking not found' });
        });

        it('should fail if booking is not completed', async () => {
            req.body = { booking_id: 1 };
            const mockBooking = {
                booking_id: 1,
                status: 'PENDING'
            };
            Booking.findOne.mockResolvedValue(mockBooking);

            await reviewController.createReview(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'You can only review completed bookings' });
        });

        it('should fail if already reviewed', async () => {
             req.body = { booking_id: 1 };
             const mockBooking = {
                 booking_id: 1,
                 status: 'COMPLETED'
             };
             Booking.findOne.mockResolvedValue(mockBooking);
             Review.findOne.mockResolvedValue({ review_id: 1 }); // Existing review

             await reviewController.createReview(req, res);

             expect(res.status).toHaveBeenCalledWith(400);
             expect(res.json).toHaveBeenCalledWith({ success: false, message: 'You have already reviewed this booking' });
        });
    });
});
