const productSchema = require('../models/productSchema');
const {imageUploadToCloudinary} = require('../utils/cloudinary')
const addProduct = async (req, res) => {

    const {productName,regularPrice,currentPrice,category,subCategory,description,variants} = req.body;
    const imageFiles = req.files ;
      
    if(!productName.trim()){
        return res.status(400).json({success:false,message:'ProductName is Required'})
    }

    if(!regularPrice.trim() || regularPrice <= 0 ){
        return res.status(400).json({success:false,message:'RegularPrice is Must be greater than 0'})
    }

    if(currentPrice > 0 && currentPrice > regularPrice ){
        return res.status(400).json({success:false,message:'currentPrice must be  less than RegularPrice '})
    }

    if(!category.trim() || !subCategory.trim()){
        return res.status(400).json({success:false,message:'category and SubCategory both Requred'})
    }

    if(!description.trim()){
        return res.status(400).json({success:false,message:'description is required '})
    }
    const convertToObject = JSON.parse(variants);
    if(Object.keys(convertToObject).length === 0){
        return res.status(400).json({success:false,message:'Atleast 1 Size is required'})
    }
    if(imageFiles.length===0){
        return res.status(400).json({success:false,message:'3 Images Required'})
    }
    
    const Exist_Product = await   productSchema.findOne({productName});
    if(Exist_Product){
        return res.status(400).json({success,message:'This Product Name Alread Exist '})
    }
    try {
        // Send success response
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};


module.exports = { addProduct };

// // Function to delete images from Cloudinary
// const deleteImages = async (urls) => {
//     try {
//         const publicIds = urls.map(url => {
//             const parts = url.split('/');
//             const filename = parts[parts.length - 1];
//             return 'products/' + filename.split('.')[0];
//         });

//         const deletePromises = publicIds.map(publicId => 
//             cloudinary.uploader.destroy(publicId)
//         );
        
//         await Promise.all(deletePromises);
//     } catch (error) {
//         throw new Error(`Failed to delete images: ${error.message}`);
//     }
// };

// module.exports = {
//     uploadImage,
//     uploadImages,
//     deleteImages
// };
// */