import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGO_URL;
    if (!uri) throw new Error("MongoDB URI is not defined in .env file");

    await mongoose.connect(uri); // No need for extra options

    console.log("🔥 MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectMongoDB;
