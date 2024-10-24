import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
    console.log('Trying to connect to db server!')
    try {
        await mongoose.connect(mongoURI);
    } catch (error) {
        console.error(error);
    }
}

export default connectDB