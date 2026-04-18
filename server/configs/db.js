import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "vkstudiomovie"
    });

    console.log("Database connected");
  } catch (error) {
    console.log("MongoDB connection error:", error.message);
  }
};

export default connectDB;