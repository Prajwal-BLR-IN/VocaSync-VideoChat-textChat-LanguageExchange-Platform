import FriendRequest from "../models/FriendRequest.js";
import userModel from "../models/User.js";

export const getRecommendedUsers = async (req, res) => {

    try {

        /* 
            ✅ user._id is the real ObjectId.
            ✅ user.id is a virtual string version of _id.
            ❌ res.user.id only works if you're working with a Mongoose document.
            ✅ Prefer _id for queries and comparisons.
            ✅ Prefer id for display, logs, frontend usage, or sending in responses.
        */

        const currentUserID = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await userModel.find({
            $and: [
                { _id: { $ne: currentUserID } }, // exclude current user
                { _id: { $nin: currentUser.friends } }, // exclude current user's friends
                { isOnboarded: true } // only those who have completed onboarding
            ]
        });

        return res.status(200).json(recommendedUsers);

    } catch (error) {
        console.log("Error getting recommended users: ", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }

}

export const getMyFriends = async (req, res) => {
    try {

        const user = await userModel.findById(req.user.id).select("friends").populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        return res.status(200).json(user.friends);

    } catch (error) {
        console.log("Error user's friend lists: ", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const sendFriendRequest = async (req, res) => {
    try {

        const myID = req.user.id;
        const { id: recipientID } = req.params;

        //prevent sending request to yourself
        if (myID === recipientID) return res.status(400).json({ message: "You can't send friend request to yourself" });

        //check if he exists or not
        const recipient = await userModel.findById(recipientID);
        if (!recipient) return res.status(400).json({ message: "Recipient not found" });

        //prevent sending request to who already friend
        if (recipient.friends.includes(myID)) return res.status(400).json({ message: "You are already friend with this user" });


        //check is friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myID, recipient: recipientID },
                { sender: recipientID, recipient: myID },
            ]
        })

        if (existingRequest) return res.status(400).json({ message: "A Friend request already exists between you and this user" });

        const friendResquest = await FriendRequest.create({
            sender: myID,
            recipient: recipientID
        })

        return res.status(201).json(friendResquest);

    } catch (error) {
        console.log("Error user's friend lists: ", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" })

    }
}

export const acceptFriendRequest = async (req, res) => {
    try {

        const { id: requestID } = req.params;

        const friendResquest = await FriendRequest.findById(requestID);

        if (!friendResquest) return res.status(404).json({ message: "Friend request not found" });

        // verify the current user is the recipient
        if (friendResquest.recipient.toString() !== req.user.id) return res.status(403).json({ message: "You are not authorized to accept this request" });

        friendResquest.status = "accepted";
        await friendResquest.save();

        // add each user to the other's friends array
        await userModel.findByIdAndUpdate(friendResquest.sender, {
            $addToSet: { friends: friendResquest.recipient }
        });

        await userModel.findByIdAndUpdate(friendResquest.recipient, {
            $addToSet: { friends: friendResquest.sender }
        });

        return res.status(200).json({ message: "friend request accepted" });

    } catch (error) {
        console.log("Error accepting friend request: ", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getFriendRequests = async (req, res) => {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted"
        }).populate("recipient", "fullName profilePic");

        res.status(200).json({ incomingReqs, acceptedReqs })

    } catch (error) {
        console.log("Error in getFriendRequests controller function ", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getOutgoingFriendReqs = async (req, res) => {
    try {
        
        const outgoingFriendReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");


        res.status(200).json(outgoingFriendReqs)

    } catch (error) {
        console.log("Error in getOutgoingFriendReqs controller function ", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}