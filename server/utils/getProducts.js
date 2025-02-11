const productSchema = require('../models/productSchema')
async function getProducts() {

    try {
        const products = await productSchema.find()
            .populate({
                path: 'category',
                select: 'categoryName isUnlist'
            })
            .populate({
                path: 'subCategory',
                select: 'subcategories isUnlist subcategoryName'
            })
            .lean();

        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}
module.exports = {
    getProducts
}