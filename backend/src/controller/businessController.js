// backend/src/controller/businessController.js
import Business from '../models/Business.js';
import Barber from '../models/Barber.js';
import Service from '../models/Service.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { sequelize } from '../database/index.js';

// Get public business details with barbers and services
export const getBusinessDetails = async (req, res) => {
    try {
        const { business_id } = req.params;

        // Get business info
        const business = await Business.findOne({
            where: { business_id },
            attributes: ['business_id', 'shopName', 'email', 'phoneNumber', 'country', 'localLocation', 'profileImage', 'businessFocus']
        });

        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Business not found'
            });
        }

        // Get all barbers for this business
        const barbers = await Barber.findAll({
            where: { business_id },
            attributes: ['barber_id', 'name', 'email', 'phone', 'specialization', 'experience', 'status'],
            order: [['createdAt', 'ASC']]
        });

        // Get all services for this business
        const services = await Service.findAll({
            where: { business_id },
            attributes: ['service_id', 'name', 'price', 'duration', 'description'],
            order: [['createdAt', 'ASC']]
        });

        // Get all reviews for this business
        const reviews = await Review.findAll({
            where: { business_id },
            order: [['createdAt', 'DESC']]
        });

        // Get user info for reviews
        const userIds = [...new Set(reviews.map(r => r.user_id))];
        const users = await User.findAll({
            where: {
                user_id: userIds
            },
            attributes: ['user_id', 'name']
        });

        const userMap = {};
        users.forEach(u => {
            userMap[u.user_id] = u.name;
        });

        const reviewsWithUser = reviews.map(r => ({
            ...r.toJSON(),
            user_name: userMap[r.user_id] || 'Anonymous'
        }));

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : '0.0';

        res.status(200).json({
            success: true,
            data: {
                business: business.toJSON(),
                barbers,
                services,
                reviews: reviewsWithUser,
                rating: avgRating,
                reviewCount: reviews.length
            }
        });
    } catch (error) {
        console.error('Get business details error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
