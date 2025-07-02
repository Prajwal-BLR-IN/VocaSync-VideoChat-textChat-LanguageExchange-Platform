import express from 'express';
import { login, logout, signup, verifyAccount } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/verify-account', authMiddleware, verifyAccount);


export default authRouter;