const productSchema = require('../models/productSchema')
async function getProducts() {

    try {
        const products = await productSchema.find()
        .populate({
            path: 'category',
            select: 'categoryName isUnlist'
        })
        .populate({
            path: 'subCategory', // Changed from 'subcategory' to 'subCategory' to match schema
            select: 'subcategories isUnlist subcategoryName' // Updated to match subcategory schema fields
        })
        .lean();
            
        return  products;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}
module.exports = {
    getProducts
}