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
        const currentUser = res.user;

        const recommendedUsers = await userModel.find({
            $and: [
                { _id: { $ne: currentUserID } }, // exclude current user
                { $id: { $nin: currentUser.friends } }, // exclude current user's friends
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

        const user = await userModel.findById(res.user.id).select("friends").populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        return res.status(200).json(user.friends);

    } catch (error) {
        console.log("Error user's friend lists: ", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}