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
        }).select('productName regularPrice currentPrice description images isBlocked _id');

        const filter = products.filter((item) => !item.isBlocked)

        return { success: true, products: filter };
    } catch (error) {
        console.error(`Error fetching wishlist products: ${error.message}`);
        return { success: false, message: `Error: ${error.message}` };
    }
};

module.exports = fetchWishlistProducts; 
