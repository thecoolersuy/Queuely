import Business from '../models/Business.js';
import Review from '../models/Review.js';
import { sequelize } from '../database/index.js';

// Define associations for aggregation
Business.hasMany(Review, { foreignKey: 'business_id' });
Review.belongsTo(Business, { foreignKey: 'business_id' });

export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.findAll({
      attributes: [
        'business_id',
        'shopName',
        'country',
        'profileImage',
        'firstName',
        'lastName',
        [sequelize.fn('AVG', sequelize.col('Reviews.rating')), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col('Reviews.review_id')), 'reviewCount']
      ],
      include: [{
        model: Review,
        attributes: [],
        required: false // LEFT JOIN to include businesses with no reviews
      }],
      group: ['Business.business_id']
    });

    res.status(200).json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};