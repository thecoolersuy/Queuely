// backend/src/controller/barberController.js
import Barber from '../models/Barber.js';

// Create a new barber
export const createBarber = async (req, res) => {
    try {
        const business_id = req.user.userId; // From JWT token
        const { name, email, phone, specialization, experience } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        // Create barber
        const barber = await Barber.create({
            business_id,
            name,
            email: email || null,
            phone: phone || null,
            specialization: specialization || null,
            experience: experience || null,
            status: 'ACTIVE'
        });

        res.status(201).json({
            success: true,
            message: 'Barber added successfully',
            data: barber
        });
    } catch (error) {
        console.error('Create barber error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get all barbers for a business
export const getBarbers = async (req, res) => {
    try {
        const business_id = req.user.userId;

        const barbers = await Barber.findAll({
            where: { business_id },
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: barbers
        });
    } catch (error) {
        console.error('Get barbers error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Update a barber
export const updateBarber = async (req, res) => {
    try {
        const business_id = req.user.userId;
        const { barber_id } = req.params;
        const { name, email, phone, specialization, experience, status } = req.body;

        const barber = await Barber.findOne({
            where: { barber_id, business_id }
        });

        if (!barber) {
            return res.status(404).json({
                success: false,
                message: 'Barber not found'
            });
        }

        // Update fields
        if (name) barber.name = name;
        if (email !== undefined) barber.email = email;
        if (phone !== undefined) barber.phone = phone;
        if (specialization !== undefined) barber.specialization = specialization;
        if (experience !== undefined) barber.experience = experience;
        if (status) barber.status = status;

        await barber.save();

        res.status(200).json({
            success: true,
            message: 'Barber updated successfully',
            data: barber
        });
    } catch (error) {
        console.error('Update barber error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete a barber
export const deleteBarber = async (req, res) => {
    try {
        const business_id = req.user.userId;
        const { barber_id } = req.params;

        const barber = await Barber.findOne({
            where: { barber_id, business_id }
        });

        if (!barber) {
            return res.status(404).json({
                success: false,
                message: 'Barber not found'
            });
        }

        await barber.destroy();

        res.status(200).json({
            success: true,
            message: 'Barber deleted successfully'
        });
    } catch (error) {
        console.error('Delete barber error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};