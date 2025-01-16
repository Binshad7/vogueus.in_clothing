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
                    if (error) return reject(new Error(`Image upload failed: ${error.message}`));
                    resolve(result.secure_url);
                }
            );
            uploadStream.end(file.buffer);
        });
    });

    try {
        // Wait for all uploads to complete
        const imgUrls = await Promise.all(uploadPromises);

        return imgUrls
    } catch (error) {
        console.log('image urls', error.message);

        throw new Error(`Failed to upload one or more images: ${error.message}`);
    }
};

module.exports = { imageUploadToCloudinary }