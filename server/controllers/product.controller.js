const cloudinary = require('../utils/cloudinary');
const Product = require('../models/productSchema');

const addProduct = async (req, res) => {
    try {
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








/*  const multer = require('multer');
const streamifier = require('streamifier');
const productSchema = require('../models/productSchema');
const cloudinary = require('../utils/cloudinary');

// Function to handle product image upload
const addProduct = async (req, res) => {
    try {
        // Files are available in req.files as an array of objects
        console.log('images : ',req.files); 

        // Example: Upload to Cloudinary or process the files
        const uploadPromises = req.files.map(file => {
            // File buffer: file.buffer
            // Original filename: file.originalname
            // MIME type: file.mimetype
            return cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) throw error;
                    return result.url; // Return the uploaded URL
                }
            ).end(file.buffer); // Upload file buffer to Cloudinary
        });

        const uploadedUrls = await Promise.all(uploadPromises);
     console.log(uploadedUrls)
        // Handle product creation with uploaded image URLs
        // const product = await Product.create({
        //     ...req.body,
        //     images: uploadedUrls, // Save image URLs in the product schema
        // });

        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};


module.exports = { addProduct };*/

