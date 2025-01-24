const Wishlist = require('../models/wislistSchema');
const Product = require('../models/productSchema');
const fetchWishlistProducts = async (userId) => {
    try {
        const userWishlist = await Wishlist.findOne({ userId });

        if (!userWishlist) {
            return { success: false, message: 'Wishlist not found for this user.' };
        }

        const products = await Product.find({
            _id: { $in: userWishlist.products }
        })
            .select('productName regularPrice currentPrice description images isBlocked _id subCategory category')
            .populate({
                path: 'category',
                select: 'isUnlist',
                match: { isUnlist: false }
            })
            .populate({
                path: 'subCategory',
                select: 'isUnlist',
                match: { isUnlist: false }
            });

      
        const filteredProducts = products.filter(
            (product) =>
                !product.isBlocked &&
                product.category !== null &&
                product.subCategory !== null
        );

        return { success: true, products: filteredProducts };
    } catch (error) {
        console.error(`Error fetching wishlist products: ${error.message}`);
        return { success: false, message: `Error: ${error.message}` };
    }
};

module.exports = fetchWishlistProducts;

