import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

export const connectMongoDb = async () => {
   try {
     await mongoose.connect(process.env.MONGO_DB_URI, { dbName: process.env.DB_NAME })
     console.log("CONNECTION SUCCESSFUL");
   } catch (error) {
     console.log("Database connection failed!", error);
     process.exit(1);
   }
}
