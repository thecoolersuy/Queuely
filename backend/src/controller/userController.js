
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