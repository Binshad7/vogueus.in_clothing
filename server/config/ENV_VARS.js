const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    PORT: process.env.PORT||2001,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    SECRET:process.env.SECRET
}