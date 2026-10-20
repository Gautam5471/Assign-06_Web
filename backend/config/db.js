const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected to MongoDB Atlas successfully");
    } catch (error) {
        console.error("Atlas connection failed:", error.message);
        if (process.env.LOCAL_MONGO_URI) {
            console.log("Attempting fallback to local MongoDB...");
            try {
                await mongoose.connect(process.env.LOCAL_MONGO_URI);
                console.log("Connected to local MongoDB successfully");
                return;
            } catch (localErr) {
                console.error("Local MongoDB connection also failed:", localErr.message);
            }
        }
        process.exit(1);
    }
};

module.exports = connectDB;
