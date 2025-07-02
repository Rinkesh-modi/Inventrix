import mongoose from "mongoose";

export const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to the database successfully");
  } catch (error) {
    process.exit(1);
    console.error("Error connecting to the database:", error);
  }
};
