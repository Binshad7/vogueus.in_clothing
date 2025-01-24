const wishlist = require('../../models/wislistSchema');
const productSchema = require('../../models/productSchema')
const fetchWishlistProducts = require('../../utils/getWislistProducts');

const fetchWislist = async (req, res) => {
    const userId = req.user._id;
    try {
        const wishlistProducts = await fetchWishlistProducts(userId);
        return res.status(200).json({ success: true, message: "New wishlist created and product added.", wishlistProducts: JSON.stringify(wishlistProducts.products) })
    } catch (error) {
        console.log(`error in wishlist fetchCategory ${error.message}`);
        res.status(500).json({ success: false, message: `server side error error is ${error.message} you can report this error ` });
    }
}

const productAddTowishlist = async (req, res) => {
    const { productId } = req.params
    const userId = req.user._id;
    if (!productId) {
        return res.status(400).json({ success: false, message: "ProductId is requied " })
    }
    try {
        const productValidation = await productSchema.findOne({ _id: productId }).populate({
            path: 'category',
            select: 'categoryName isUnlist'
        })
            .populate({
                path: 'subCategory',
                select: 'subcategories isUnlist subcategoryName'
            })
            .lean();
        console.log(productValidation)
        if (productValidation.isBlocked) {
            return res.status(403).json({ success: false, message: 'This product is blocked and cannot be added or remove to the wishlist.' });
        }
        if (productValidation.category.isUnlist) {
            return res.status(403).json({ success: false, message: 'This product is blocked and cannot be added or remove to the wishlist.' });
        }
        if (productValidation.subCategory.isUnlist) {
            return res.status(403).json({ success: false, message: 'This product is blocked and cannot be added or remove to the wishlist.' });
        }
        const userWishlist = await wishlist.findOne({ userId });
        if (!userWishlist) {
            const newWsilist = new wishlist({ userId, products: [productId] });
            await newWsilist.save()
            const wishlistProducts = await fetchWishlistProducts(userId);
            return res.status(200).json({ success: true, message: "New wishlist created and product added.", wishlistProducts: JSON.stringify(wishlistProducts.products) })
        }
        if (!userWishlist.products.includes(productId)) {
            userWishlist.products.push(productId);
            await userWishlist.save();
            const wishlistProducts = await fetchWishlistProducts(userId);
            return res.status(200).json({ success: true, message: 'Added to your Wishlist', wishlistProducts: JSON.stringify(wishlistProducts.products) })
        }



        const filterExistProducstId = userWishlist.products.filter((proId) => proId.toString() !== productId);
        userWishlist.products = filterExistProducstId
        await userWishlist.save();
        const wishlistProducts = await fetchWishlistProducts(userId);
        return res.status(200).json({ success: true, message: "Removed from your Wishlist", wishlistProducts: JSON.stringify(wishlistProducts.products) })


    } catch (error) {
        console.log(`error in adding product to wishlist  wishlist  ${error}`);
        res.status(500).json({ success: false, message: `server side error error is ${error.message} you can report this error ` })
    }
}

const removeProductFromwishlist = async (req, res) => {
    const { productId } = req.params
    const userId = req.user._id;

    if (!productId) {
        return res.status(400).json({ success: false, message: "ProductId is requied " })
    }
    try {
        const productValidation = await productSchema.findOne({ _id: productId });
        if (productValidation.isBlocked) {
            return res.status(403).json({ success: false, message: 'This product is blocked and cannot be added or remove to the wishlist.' });
        }
        const user_wishlist = await wishlist.findOne({ userId });
        if (!user_wishlist) {
            return res.status(400).json({ success: false, message: " user don't have a wishlist  " });
        }
        const filterProductId = user_wishlist.products.filter((proId) => proId.toString() !== productId);
        user_wishlist.products = filterProductId;
        await user_wishlist.save();
        const wishlistProducts = await fetchWishlistProducts(userId);
        res.status(200).json(({ success: false, message: 'Product Removed from wishlist ', wishlistProducts: JSON.stringify(wishlistProducts.products) }));
    } catch (error) {
        console.log(`error in wishlist  remove time ${error.message}`);
        res.status(500).json({ success: false, message: `server side error error is ${error.message} you can report this error ` });
    }
}

module.exports = {
    productAddTowishlist,
    removeProductFromwishlist,
    fetchWislist
}