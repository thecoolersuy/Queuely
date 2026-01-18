// backend/src/controller/serviceController.js
import Service from '../models/Service.js';

// Create a new service
export const createService = async (req, res) => {
    try {
        const business_id = req.user.userId; // From JWT token
        const { name, price, duration, description } = req.body;

        // Validation
        if (!name || !price || !duration) {
            return res.status(400).json({
                success: false,
                message: 'Name, price, and duration are required'
            });
        }

        // Create service
        const service = await Service.create({
            business_id,
            name,
            price,
            duration,
            description: description || ''
        });

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: service
        });
    } catch (error) {
        console.error('Create service error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get all services for a business
export const getServices = async (req, res) => {
    try {
        const business_id = req.user.userId;

        const services = await Service.findAll({
            where: { business_id },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: services
        });
    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update a service
export const updateService = async (req, res) => {
    try {
        const business_id = req.user.userId;
        const { service_id } = req.params;
        const { name, price, duration, description } = req.body;

        const service = await Service.findOne({
            where: { service_id, business_id }
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Update fields
        if (name) service.name = name;
        if (price) service.price = price;
        if (duration) service.duration = duration;
        if (description !== undefined) service.description = description;

        await service.save();

        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            data: service
        });
    } catch (error) {
        console.error('Update service error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete a service
export const deleteService = async (req, res) => {
    try {
        const business_id = req.user.userId;
        const { service_id } = req.params;

        const service = await Service.findOne({
            where: { service_id, business_id }
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        await service.destroy();

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        console.error('Delete service error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};