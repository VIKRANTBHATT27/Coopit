import 'dotenv/config';

import path from "path";
import cors from 'cors';
import express from 'express';
import script from './script.js';
import { connectMongoDb } from "./config/mongoose-connection.js";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";

connectMongoDb();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = process.env.PORT;
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

app.use('/api', script);


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.send('Backend is running 🚀');
});


app.use(errorHandler);