import mongoose from "mongoose";
import configKeys from "../../config";

const connectDb = async () => {
  try {
    console.log("MongoDB URI:", process.env.MONGO_URI); // Log the MongoDB URI
    await mongoose.connect(configKeys.MONGO_DB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDb;
