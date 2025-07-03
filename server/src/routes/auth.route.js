import express from 'express';
import { login, logout, onboarding, signup, verifyAccount } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/verify-account', authMiddleware, verifyAccount);
authRouter.post('/onboarding',authMiddleware, onboarding );

// checks if user logged in or not
authRouter.get('/me',authMiddleware, (req, res) => {
    return res.status(200).json({success: true, user: req.user})
} );


export default authRouter;