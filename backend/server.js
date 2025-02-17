import app from './src/app.js';
import dotenv from 'dotenv';
import connectMongoDB from './src/db/connectMongoDB.js';
import {v2 as cloudinary } from "cloudinary"
dotenv.config();
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});