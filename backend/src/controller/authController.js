import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateToken } from '../security/jwt-utils.js';

export const register = async (req, res) => {
  try {
    const { name, location, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (!name || !location || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      location,
      email,
      password: hashedPassword,
      role: role || 'customer',
    });

    const token = generateToken(user.user_id, user.email, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        location: user.location,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
};

export const login =async(req,res)=>{
    try{
      const {email, password} = req.body;

      if (!email || !password) {
       return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
       });
      }

      const user = await User.findOne({where:{email}});
      if(!user){
         return res.status(401).json({
            success:false,
            message: "No account found"
         });
      }

      const isPasswordValid = await bcrypt.compare(password,user.password);
      if(!isPasswordValid){
        return res.status(401).json({
            success:false,
            message : "Password not correct"
        })
      }
      const token = generateToken(user.userId , user.email,user.role);

      res.status(200).json({
        success : true,
        message : 'Login successful',
        token,
        user:{
          userId: user.user_id,
          name : user.name,
          email : user.email,
          location : user.location,
          role:user.role,
        },
      });
    }catch(error){
      console.error('Login error:', error);
      res.status(500).json({
        success:false,
        message : 'Server error during login'
      });
    }

};


