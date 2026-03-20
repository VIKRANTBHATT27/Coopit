import path from "path";
import cors from 'cors';
import express from 'express';
import script from './script.js';
import { configDotenv } from 'dotenv';
import { connectMongoDb } from "./connection.js";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
configDotenv();
connectMongoDb();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const PORT = process.env.PORT;
const app = express();


app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.resolve("./public")));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

app.use('/api', script);



app.listen(PORT, () => console.log(`\nServer running on port ${PORT}`));