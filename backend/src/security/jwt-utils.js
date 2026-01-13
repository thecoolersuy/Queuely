import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (userId, email,role)=>{
    return jwt.sign(
       { userId,email,role },
       JWT_SECRET,
       {expiresIn :'7d'}
    );
};

export const verifyToken = (token) =>{
    try{
        return jwt.verify(token, JWT_SECRET);
    }catch(error){
        return null;
    }
};