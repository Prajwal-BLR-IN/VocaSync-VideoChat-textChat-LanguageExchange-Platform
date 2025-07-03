import jwt from 'jsonwebtoken';
import userModel from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized. Please signin again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) return res.status(401).json({success: false, message: "Unauthorized - Invalid token"});
    
    const user = await userModel.findById(decoded.id).select('-password -verifyOTP -verifyOTPExpireAt -ResetOTP -ResetOTPExpireAt');

    if(!user) return res.status(401).json({success: false, message: "Unauthorized - User not found"});

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;
