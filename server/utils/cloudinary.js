const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const {CLOUDINARY_API_KEY,CLOUDINARY_NAME,CLOUDINARY_SECRET} = require('../config/ENV_VARS');
const multer = require('multer');

cloudinary.config({
    cloud_name:CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET
})


const storage = multer.memoryStorage();
module.exports.upload = multer({storage});