import Business from '../models/Business.js';

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
      attributes: ['business_id', 'shopName', 'country', 'profileImage', 'firstName', 'lastName'],
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