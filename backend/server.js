import { configDotenv } from 'dotenv';
import express from 'express';
import cors from 'cors';
import script from './script.js';
import { connectMongoDb } from "./connection.js";

configDotenv();

const PORT = process.env.PORT;
const app = express();

connectMongoDb();

app.use(cors({ 
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({extended: false}));
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

app.use('/api', script);


app.listen(PORT, () => console.log(`\nServer running on port ${PORT}`));