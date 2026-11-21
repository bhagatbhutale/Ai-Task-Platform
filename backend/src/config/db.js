import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${connection.connection.host}`);
    console.log("MongoDB readyState:", mongoose.connection.readyState);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    throw error;
  }
};

export default connectDB;
