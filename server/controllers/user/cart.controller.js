const cartSchema = require('../../models/cart');
const { GetCart, fetchCartWithProductDetails } = require('../../utils/getCart');

const listCart = async (req, res) => {
    const userId = req.user._id;
    try {
        const Exist_cart = await GetCart(userId);
        if (!Exist_cart) {
            return res.status(200).json({ success: false, message: 'Cart is Empty', })
        }
        const CartItems = await fetchCartWithProductDetails(userId)
        res.status(200).json({ success: true, message: 'Cart items Fetched',CartItems:JSON.stringify(CartItems)})
    } catch (error) {
        console.log(`error in addToCart  ${error}`);
        res.status(500).json({ success: false, message: `server side error error is ${error.message}  you can Report this Error` })
    }
}
const addToCart = async (req, res) => {
    const userId = req.user._id;
    const { productId, size, quantity } = req.body.productDetails
    try {

        const Exist_cart = await GetCart(userId)
        if (!Exist_cart) {
            const newCart = new cartSchema({ userId, items: [{ productId, size, quantity }] })
            newCart.save();
            const CartItems = await fetchCartWithProductDetails(userId)
            return res.status(200).json({ success: true, message: "New Cart created", CartItems:JSON.stringify(CartItems)  })
        }
        const Exist_productWithId = Exist_cart?.items?.filter((item) => item.productId.toString() == productId);
        const ExistSizeWithSameProductId = Exist_productWithId.some((item) => item.size == size);
        if (ExistSizeWithSameProductId) {
            return res.status(400).json({ success: false, message: 'This Product  Already in Cart ' })
        }

        Exist_cart?.items?.push({ productId, size, quantity });
        Exist_cart?.save();
        const CartItems = await fetchCartWithProductDetails(userId)
        console.log(CartItems.length)
        return res.status(200).json({ success: true, message: 'product Added To Cart', CartItems:JSON.stringify(CartItems)  })

    } catch (error) {
        console.log(`error in addToCart  ${error.message}`);
        res.status(500).json({ success: false, message: `server side error error is ${error.message}  you can Report this Error` })
    }
}

const deleteItemFromCart = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params
    try {
        const Exist_cart = await GetCart(userId)
        if (!Exist_cart) {
            return res.status(400).json({ success: false, message: "User Cart Not Find " })
        }
       
        const filterProduct = Exist_cart.items.filter((item) => item._id.toString() !== productId);
        Exist_cart.items = filterProduct;
        await Exist_cart.save()
        const CartItems = await fetchCartWithProductDetails(userId)
        return res.status(200).json({ success: true, message: 'Product is successfuly Removed', CartItems:JSON.stringify(CartItems)  })
    } catch (error) {
        console.log(`error in addToCart  ${error.message}`);
        res.status(500).json({ success: false, message: `server side error error is ${error.message}  you can Report this Error` })
    }
}
module.exports = {
    addToCart,
    deleteItemFromCart,
    listCart
}