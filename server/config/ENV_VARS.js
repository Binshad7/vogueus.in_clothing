const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    PORT: process.env.PORT||2001,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    SECRET:process.env.SECRET,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_SECRET:process.env.CLOUDINARY_SECRET,
    CLOUDINARY_NAME:process.env.CLOUDINARY_NAME
}