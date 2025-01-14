const cloudinary = require('../utils/cloudinary');
const Product = require('../models/productSchema');

const addProduct = async (req, res) => {
    try {
        console.log(req.body)
        // Array to hold the promises for image uploads
        const uploadPromises = req.files.map(file => {
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
        // Create the product and store the image URLs
        const product = await Product.create({
            ...req.body,
            images: uploadedUrls, // Save image URLs in the product schema
        });

        // Send success response
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

module.exports = { addProduct };

/* 
 // controllers/productController.js

const { uploadImages, deleteImages } = require('../utils/cloudinaryUtils');
const Product = require('../models/productSchema');

const addProduct = async (req, res) => {
    let uploadedUrls = [];
    
    try {
        // Validate request
        if (!req.body.name || !req.body.price) {
            return res.status(400).json({
                success: false,
                message: 'Name and price are required'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please upload at least one image'
            });
        }

        // Upload images using utility function
        uploadedUrls = await uploadImages(req.files);
        console.log('Uploaded URLs:', uploadedUrls);

        // Create product in database
        const productData = {
            ...req.body,
            images: uploadedUrls,
            createdAt: new Date(),
            status: 'active'
        };

        const product = await Product.create(productData);

        res.status(201).json({ 
            success: true,
            message: 'Product added successfully', 
            product 
        });

    } catch (error) {
        console.error('Error in addProduct:', error);

        // Clean up uploaded images if database save failed
        if (uploadedUrls.length > 0) {
            try {
                await deleteImages(uploadedUrls);
            } catch (cleanupError) {
                console.error('Error cleaning up images:', cleanupError);
            }
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product data',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({ 
            success: false,
            message: 'Failed to add product', 
            error: error.message 
        });
    }
};

module.exports = { addProduct };
*/


// 

/* 
  // utils/cloudinaryUtils.js

const cloudinary = require('../utils/cloudinary');

// Function to upload single image
const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                resource_type: 'image',
                folder: 'products',
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        uploadStream.end(file.buffer);
    });
};

// Function to upload multiple images
const uploadImages = async (files) => {
    try {
        const uploadPromises = files.map(file => uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        return uploadedUrls;
    } catch (error) {
        throw new Error(`Image upload failed: ${error.message}`);
    }
};

// Function to delete images from Cloudinary
const deleteImages = async (urls) => {
    try {
        const publicIds = urls.map(url => {
            const parts = url.split('/');
            const filename = parts[parts.length - 1];
            return 'products/' + filename.split('.')[0];
        });

        const deletePromises = publicIds.map(publicId => 
            cloudinary.uploader.destroy(publicId)
        );
        
        await Promise.all(deletePromises);
    } catch (error) {
        throw new Error(`Failed to delete images: ${error.message}`);
    }
};

module.exports = {
    uploadImage,
    uploadImages,
    deleteImages
};
*/