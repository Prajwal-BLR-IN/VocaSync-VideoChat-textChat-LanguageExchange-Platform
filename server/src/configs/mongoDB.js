import mongoose from 'mongoose'

const ConnectToDB = async() => {
    try {
        const mongoDB_URI = process.env.MONGODB_URI;
        if(!mongoDB_URI) throw new Error('MongoDb_URI is not found in environment file')
        
        await mongoose.connect(`${mongoDB_URI}/vocasync-db`);
        console.log("Database connection successful")
    } catch (error) {
        console.log("Error connecting to DB: ", error);
        process.exit(1);
    }
}

export default ConnectToDB;