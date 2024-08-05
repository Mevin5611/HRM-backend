import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import hrsRoutes from './routes/hrsRoutes.js';
import userRoutes from './routes/userRoutes.js';





// express app
const app = express();

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(express.json());



// Routes
app.use(cors());

app.use('/api/hrs/', hrsRoutes);
app.use('/api/user/', userRoutes);


// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});


// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("DB connected & running on PORT", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
