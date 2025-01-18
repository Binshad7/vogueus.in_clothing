const { getProducts } = require('../utils/getProducts');


const getAllProducts = async (req, res) => {
    try {

        const products = await getProducts();

        const filterBlockProduct = products.filter(item =>
            !item.isBlocked &&
            !item.subCategory?.isUnlist &&
            !item.category?.isUnlist
        );
        console.log(filterBlockProduct.length);
        const filterBlockedVariants = filterBlockProduct.map(item => {
            const filteredVariants = item.variants.filter(variant => !variant.isBlocked);
            return { ...item, variants: filteredVariants };
        });

        res.status(200).json({ success: true, message: 'product Success fully completed', products: filterBlockedVariants })

    } catch (error) {
        console.log('error in userProduct Controllers : ', error.message)
        res.status(500).json({ success: false, message: `An error occurred: ${error.message}` });
    }
}

module.exports = {
    getAllProducts
}