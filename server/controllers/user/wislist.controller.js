const wislist = require('../../models/wislistSchema');


const productAddToWislist = async (req, res) => {
    const { productId, userId } = req.body;
    try {

        const userWishlist = await wislist.findOne({ userId });
        if (!userWishlist) {
            const newWsilist = new wislist({ userId, products: [productId] });
            await newWsilist.save()
            return res.status(200).json({ success: true, message: "New wishlist created and product added." })
        }
        if (!userWishlist.products.includes(productId)) {
            userWishlist.products.push(productId);
            await userWishlist.save();
            return res.status(200).json({ success: true, message: 'Added to your Wishlist' })
        }

        const filterExistProducstId = userWishlist.products.filter((item) => item !== productId);
        userWishlist.products(filterExistProducstId)
        await userWishlist.save();
        return res.status(200).json({ success: true, message: "Removed from your Wishlist" })


    } catch (error) {
        console.log(`error in adding product to wislist wislist ${error.message}`);
        res.status(500).json({ success: false, message: `server side error error is ${error.message} you can report this error ` })
    }
}

const removeProductFromWislist = async (req, res) => {
    const {userId,productId} = req.body
    try {
        
       
    } catch (error) {
        console.log(`error in wislist remove time ${error.message}`);
        res.status(500).json({ success: false, message: `server side error error is ${error.message} you can report this error ` })
    }
}

module.exports = {
    productAddToWislist,
    removeProductFromWislist
}