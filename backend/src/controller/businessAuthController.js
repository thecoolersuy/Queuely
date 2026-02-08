import bcrypt from 'bcrypt';
import Business from '../models/Business.js';
import { generateToken } from '../security/jwt-utils.js';

export const registerBusiness = async (req, res) => {
    try {
        const { shopName, firstName, lastName, email, phoneNumber, password, country, localLocation, businessFocus } = req.body;

        if (!shopName || !firstName || !lastName || !email || !phoneNumber || !password || !country) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const existingBusiness = await Business.findOne({ where: { email } });
        if (existingBusiness) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const business = await Business.create({
            shopName,
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword,
            country,
            localLocation: localLocation || null,
            businessFocus: businessFocus || null,
        });

        const token = generateToken(business.business_id, business.email, 'business');

        res.status(201).json({
            success: true,
            message: 'Business registration successful',
            token,
            user: {
                userId: business.business_id,
                firstName: business.firstName,
                lastName: business.lastName,
                shopName: business.shopName,
                email: business.email,
                phoneNumber: business.phoneNumber,
                country: business.country,
                role: 'business',
            },
        });
    } catch (error) {
        console.error('Business register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

export const loginBusiness = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const business = await Business.findOne({ where: { email } });
        if (!business) {
            return res.status(401).json({
                success: false,
                message: 'No business account found with this email'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, business.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        const token = generateToken(business.business_id, business.email, 'business');

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                userId: business.business_id,
                firstName: business.firstName,
                lastName: business.lastName,
                shopName: business.shopName,
                email: business.email,
                phoneNumber: business.phoneNumber,
                country: business.country,
                role: 'business',
            },
        });
    } catch (error) {
        console.error('Business login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};