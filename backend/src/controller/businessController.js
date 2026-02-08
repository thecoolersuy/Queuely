// backend/src/controller/businessController.js
import Business from '../models/Business.js';
import Barber from '../models/Barber.js';
import Service from '../models/Service.js';
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

        res.status(200).json({
            success: true,
            data: {
                business: business.toJSON(),
                barbers,
                services
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
