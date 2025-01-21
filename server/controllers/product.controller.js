const {imageUploadToCloudinary} = require('../utils/cloudinary')
const productSchema = require('../models/productSchema'); 
const {getProducts} = require('../utils/getProducts')


  // addProduct
  const addProduct = async (req, res) => {
    const { productName, regularPrice, currentPrice, category, subCategory, description, variants } = req.body;
    const imageFiles = req.files;
     
    // Validation checks
    if (!productName.trim()) {
        return res.status(400).json({ success: false, message: 'ProductName is Required' });
    }
    if (!regularPrice.trim() || regularPrice <= 0) {
        return res.status(400).json({ success: false, message: 'RegularPrice must be greater than 0' });
    }    
    if (parseFloat(currentPrice) > 0 && parseFloat(regularPrice)<parseFloat(currentPrice)) {
        return res.status(400).json({ success: false, message: 'CurrentPrice must be less than RegularPrice' });
    }
    if (!category.trim() || !subCategory.trim()) {
        return res.status(400).json({ success: false, message: 'Category and SubCategory are both required' });
    }
    if (!description.trim()) {
        return res.status(400).json({ success: false, message: 'Description is required' });
    }
    const convertToObject = JSON.parse(variants);
    if (Object.keys(convertToObject).length === 0) {
        return res.status(400).json({ success: false, message: 'At least 1 variant is required' });
    }
    if (!imageFiles || imageFiles.length === 0) {
        return res.status(400).json({ success: false, message: 'At least 3 images are required' });
    }

    const existProduct = await productSchema.findOne({ productName });
    if (existProduct) {
        return res.status(400).json({ success: false, message: 'This Product Name already exists' });
    }

    let uploadImgUrls;
    try {
        // Attempt to upload images
        uploadImgUrls = await imageUploadToCloudinary(imageFiles);
         
    } catch (error) {
        console.log(error.message);
        
        return res.status(500).json({ success: false, message: 'Image upload failed', error: error.message });
    }

    try {
        const productData = productSchema({
            productName,
            regularPrice,
            currentPrice,
            category,
            subCategory,
            description,
            variants: convertToObject,
            updatedBy: req.user._id,
            addedBy: req.user._id,
            images: uploadImgUrls,
        });

        const newProduct = await productData.save();
        if (!newProduct) {
            return res.status(400).json({ success: false, message: "Something went wrong. Product can't be added. Please try again later." });
        }

        const allProducts = await getProducts();
        res.status(201).json({ success: true, message: 'Product added successfully', products: allProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: `An error occurred: ${error.message}` });
    }
};

//fetch all products
const fetchProduct = async (req,res)=>{
    try {
     const AllProduct = await getProducts();
     res.status(200).json({success:true,message:'Product success fully fetch',product:AllProduct})
    }catch(error){
        res.status(500).json({ success:false,message: `An error occurred  ${error.message} `, error: error.message });
    }
}

 // products is blocked
const updateProductStatus =async (req,res)=>{
    const {proId} = req.params;
    try{
      const Exist_Product = await productSchema.findOne({_id:proId});
      
      if(!Exist_Product){
        return res.status(400).json({success:false,message:'Product Not Found'})
      }
      
      const updatedProduct = await productSchema.updateOne({_id:proId},{$set:{isBlocked:!Exist_Product.isBlocked}});
      console.log(updatedProduct);
      if(updatedProduct.modifiedCount==0){
        return res.status(400).json({success:false,message:'some thing wrong in update Product'})
      }
      const AllProduct = await getProducts();

      res.status(200).json({success:true,message:'success fully updated status',product:AllProduct})
    }catch(error){
        res.status(500).json({ success:false,message: `An error occurred  ${error.message} `, error: error.message });
    }
}
   // edit Product

   const editProduct =  async (req,res)=>{
    try{

    }catch(error){
        console.log(`server side error  ${error.message}`);
        res.status(500).json({success:false,message:`server side error. you can report this issues   ${error.message}`})
    }
   }
 
    // update Product
    const updateProduct = async (req,res)=>{
        try {
             const {proId} = req.params;;
             const { productName, regularPrice, currentPrice, category, subCategory, description, variants,updatedImagesPosstion } = req.body;
             const updatedImgIndex = JSON.parse(updatedImagesPosstion);
              console.log(updatedImgIndex.length<=0);
             console.log(updatedImgIndex);
// console.log(productName, regularPrice, currentPrice, category, subCategory, description, JSON.parse(variants)); 

        } catch(error){
            console.log(`server side error  ${error.message}`);
            res.status(500).json({success:false,message:`server side error. you can report this issues   ${error.message}`})
        }
    }

module.exports = { 
    addProduct,
    fetchProduct,
    updateProductStatus,
    updateProduct
};

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