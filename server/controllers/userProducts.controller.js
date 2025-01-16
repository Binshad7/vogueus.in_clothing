const productSchema = require('../models/productSchema');
const { getProducts } = require('../utils/getProducts');


const getAllProducts = async (req, res) => {
    try {
        console.log('hit getAllProducts')
        const products = await getProducts();
        const filterBlockProduct = products.filter((item) => item.isBlocked === false);
        res.status(200).json({ success: true, message: 'product Success fully completed', products: filterBlockProduct })

    } catch (error) {
        res.status(500).json({ success: false, message: `An error occurred: ${error.message}` });
    }
}

module.exports = {
    getAllProducts
}