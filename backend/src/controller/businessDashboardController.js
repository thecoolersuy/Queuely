import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Barber from '../models/Barber.js';
import Business from '../models/Business.js';
import Notification from '../models/Notification.js';
import { Op } from 'sequelize';

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const business_id = req.user.userId; // From JWT token

        // Total Service Revenue
        const totalRevenue = await Booking.sum('amount', {
            where: {
                business_id,
                status: { [Op.in]: ['ACCEPTED', 'COMPLETED'] }
            }
        }) || 0;

        // Total Bookings
        const totalBookings = await Booking.count({
            where: { business_id }
        });

        // Total Services
        const totalServices = await Service.count({
            where: { business_id }
        });

        // Total Barbers
        const totalBarbers = await Barber.count({
            where: { business_id }
        });

        // Total Net Sales (completed bookings)
        const totalNetSales = await Booking.sum('amount', {
            where: {
                business_id,
                status: 'COMPLETED'
            }
        }) || 0;

        res.status(200).json({
            success: true,
            data: {
                serviceRevenue: parseFloat(totalRevenue).toFixed(2),
                totalBookings,
                totalServices,
                totalBarbers,
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get Recent Bookings
export const getRecentBookings = async (req, res) => {
    try {
        const business_id = req.user.userId;

        const bookings = await Booking.findAll({
            where: { business_id },
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Get recent bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get All Bookings
export const getAllBookings = async (req, res) => {
    try {
        const business_id = req.user.userId;

        const bookings = await Booking.findAll({
            where: { business_id },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update Booking Status (Accept/Decline)
export const updateBookingStatus = async (req, res) => {
    try {
        const { booking_id } = req.params;
        const { status } = req.body; // 'ACCEPTED' or 'DECLINED'
        const business_id = req.user.userId;

        if (!['ACCEPTED', 'DECLINED'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const booking = await Booking.findOne({
            where: { booking_id, business_id }
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        booking.status = status;
        await booking.save();

        // Create notification for the user
        const notificationTitle = status === 'ACCEPTED' ? 'Booking Accepted' : 'Booking Declined';
        const notificationMessage = status === 'ACCEPTED'
            ? `Good news! Your booking for ${booking.service} has been accepted.`
            : `Sorry, your booking for ${booking.service} has been declined.`;
        const notificationType = status === 'ACCEPTED' ? 'BOOKING_ACCEPTED' : 'BOOKING_DECLINED';

        await Notification.create({
            user_id: booking.user_id,
            title: notificationTitle,
            message: notificationMessage,
            type: notificationType
        });

        res.status(200).json({
            success: true,
            message: `Booking ${status.toLowerCase()} successfully`,
            data: booking
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get Business Profile
export const getBusinessProfile = async (req, res) => {
    try {
        const business_id = req.user.userId;
        const business = await Business.findByPk(business_id, {
            attributes: { exclude: ['password'] }
        });

        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Business not found'
            });
        }

        res.status(200).json({
            success: true,
            data: business
        });
    } catch (error) {
        console.error('Get business profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update Business Profile
export const updateBusinessProfile = async (req, res) => {
    try {
        const business_id = req.user.userId;
        const { shopName, firstName, lastName, phoneNumber, country, localLocation } = req.body;
        const profileImage = req.file ? req.file.path : undefined;

        const business = await Business.findByPk(business_id);

        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Business not found'
            });
        }

        // Update fields
        if (shopName) business.shopName = shopName;
        if (firstName) business.firstName = firstName;
        if (lastName) business.lastName = lastName;
        if (phoneNumber) business.phoneNumber = phoneNumber;
        if (country) business.country = country;
        if (localLocation !== undefined) business.localLocation = localLocation;
        if (req.body.businessFocus) {
            try {
                // If it's a string (from FormData), parse it
                business.businessFocus = typeof req.body.businessFocus === 'string'
                    ? JSON.parse(req.body.businessFocus)
                    : req.body.businessFocus;
            } catch (e) {
                console.error('Error parsing businessFocus:', e);
            }
        }

        if (profileImage) {
            // Store relative path for frontend access
            business.profileImage = profileImage.replace(/\\/g, '/');
        }

        await business.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: business
        });
    } catch (error) {
        console.error('Update business profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};