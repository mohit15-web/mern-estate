import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected");
  } catch (error) {
    console.log("error in db", error);
  }
};
