const cloudinary = require('cloudinary').v2;
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } = require('../config/ENV_VARS');
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});


const imageUploadToCloudinary = async (images) => {
    const uploadPromises = images.map(file => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) return reject(error); // Reject if an error occurs
                    resolve(result.secure_url); // Resolve the URL when upload is successful
                }
            );
            uploadStream.end(file.buffer); // Upload file buffer to Cloudinary
        });
    });

    // Wait for all uploads to complete
    const uploadedUrls = await Promise.all(uploadPromises);
    console.log(uploadedUrls)
}

module.exports = { cloudinary, imageUploadToCloudinary };
