import { StreamChat } from 'stream-chat';
import 'dotenv/config';

const streamAPIKey = process.env.STREAM_API_KEY;
const streamAPISecrete = process.env.STREAM_API_SECRETE;

if (!streamAPIKey || !streamAPISecrete) {
    console.error("❌ Stream API key or Secret is missing from environment variables.");
    process.exit(1);
}

// Create a StreamChat client instance using the API key and secret
// This must only be used in backend/server-side code
const streamClient = StreamChat.getInstance(streamAPIKey, streamAPISecrete);

/**
 * Creates or updates a user in Stream Chat.
 * This function uses server-side permissions to register users.
 *
 * @param {Object} userData - The user data object (must include at least an `id`)
 * @returns {Object|undefined} - Returns the same user data if successful, otherwise undefined
 */
export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]); // Add or update the user
        return userData; // Return back the data for confirmation/logging
    } catch (error) {
        console.error("⚠️ Error upserting Stream user:", error);
    }
}

/**
 * Generates a Stream user token for frontend authentication.
 * This token allows the frontend to connect to Stream as the given user.
 *
 * @param {string} userId - The unique ID of the user (must match what's in upsert)
 * @returns {string} - JWT token string that can be passed to the frontend
 */
export const generateStreamToken = (userId) => {
    if (!userId) {
        console.error("❌ User ID is required to generate a token.");
        return null;
    }

    try {
        const token = streamClient.createToken(userId); // Create token with backend privilege
        return token;
    } catch (error) {
        console.error("⚠️ Error generating token:", error);
        return null;
    }
}
