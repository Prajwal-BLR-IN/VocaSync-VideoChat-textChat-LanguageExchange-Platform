import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getStreamToken } from '../controllers/chat.controller.js';


const chatRouter = express.Router();

chatRouter.get('/token', authMiddleware, getStreamToken)

export default chatRouter;