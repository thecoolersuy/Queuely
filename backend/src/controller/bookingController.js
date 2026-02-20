import Booking from '../models/Booking.js';
import Business from '../models/Business.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Review from '../models/Review.js';

export const createBooking = async (req, res) => {
    try {
        const { business_id, service, barber, date, time, amount } = req.body;
        const user_id = req.user.userId;

        // Get user info to fill customer_name and customer_email
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const newBooking = await Booking.create({
            business_id,
            user_id,
            customer_name: user.name,
            customer_email: user.email,
            service,
            barber,
            date,
            time,
            amount,
            status: 'PENDING'
        });

        // Create notification for the user
        await Notification.create({
            user_id,
            title: 'Booking Pending',
            message: `Your appointment request for ${service} has been sent and is currently pending.`,
            type: 'BOOKING_PENDING'
        });

        res.status(201).json({

            success: true,
            message: 'Booking request sent successfully',
            data: newBooking
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get User Bookings
export const getUserBookings = async (req, res) => {
    try {
        const user_id = req.user.userId;

        // Ensure association is defined
        Booking.hasOne(Review, { foreignKey: 'booking_id' });
        Review.belongsTo(Booking, { foreignKey: 'booking_id' });

        const bookings = await Booking.findAll({
            where: { user_id },
            include: [{
                model: Review,
                attributes: ['review_id', 'rating', 'comment'],
                required: false // LEFT JOIN
            }],
            order: [['date', 'DESC'], ['time', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
