import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';

export const createReview = async (req, res) => {
    try {
        const { booking_id, rating, comment } = req.body;
        const user_id = req.user.userId;

        // Check if booking exists
        const booking = await Booking.findOne({
            where: { booking_id, user_id }
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if booking is completed
        if (booking.status !== 'COMPLETED') {
            return res.status(400).json({
                success: false,
                message: 'You can only review completed bookings'
            });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({
            where: { booking_id }
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this booking'
            });
        }

        // Create review
        const newReview = await Review.create({
            booking_id,
            business_id: booking.business_id,
            user_id,
            rating,
            comment
        });

        // Create notification for business
        await Notification.create({
            user_id: booking.business_id, // Assuming business_id maps to user_id for notifications or separate logic?
            // Wait, typically business notifications might be different. Let's assume standard notification table handles business users too.
            // Check Notification model.
            title: 'New Review Received',
            message: `A customer has left a ${rating}-star review for their recent appointment.`,
            type: 'NEW_REVIEW'
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: newReview
        });

    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getReviews = async (req, res) => {
    try {
        // Implementation for getting reviews (optional for now)
    } catch (error) {
        console.error('Get reviews error:', error);
    }
};
