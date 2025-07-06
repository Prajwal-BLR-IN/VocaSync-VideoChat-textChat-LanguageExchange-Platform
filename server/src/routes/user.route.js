import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js';
import { acceptFriendRequest, getMyFriends, getRecommendedUsers, sendFriendRequest } from '../controllers/user.controller.js';

const userRouter = express.Router();

// make all routes in userRouter to get authMiddleware ran before hitting controller function
userRouter.use(authMiddleware);

userRouter.get('/', getRecommendedUsers);
userRouter.get('/friends', getMyFriends);

userRouter.post('/friend-request/:id', sendFriendRequest);
userRouter.put('/friend-request/:id/accept', acceptFriendRequest);

export default userRouter;