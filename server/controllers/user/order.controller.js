const orderSchema = require('../../models/orderSchema');
const { GetCartWithProductDetails, GetCart } = require('../../utils/getCart');
const { v4: uuidv4 } = require('uuid');

const createNewOrder = async (req, res) => {
    try {
        const { userId } = req.params;
        if (userId !== req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'Invalid User ID' });
        }

        const { selectedAddressIndex, paymentMethod } = req.body;
        const selectedAddress = req.user.address[selectedAddressIndex];
        if (!selectedAddress) {
            return res.status(400).json({ success: false, message: "Address is required" });
        }

        const userCart = await GetCartWithProductDetails(userId);
        if (!userCart || userCart.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const orderId = 'VOGUEUS' + uuidv4().split('-')[0].toUpperCase();


            let totalAmount = 0;
            const items = userCart.map((item) => {
                const productPrice = item?.productDetails[0]?.currentPrice > 0
                    ? item.productDetails[0].currentPrice
                    : item.productDetails[0].regularPrice;

                totalAmount += productPrice * item.items.quantity;

                return {
                    productId: item.items.productId,
                    quantity: item.items.quantity,
                    productPrice: productPrice,
                    size: item.items.size,
                };
            });

            // Create new order
            const newOrder = new orderSchema({
                userId,
                items,
                totalAmount,
                paymentMethod,
                orderId,
                shippingAddress: selectedAddress, // Fixed address structure
            });

            await newOrder.save(); // Save order
            const UpdateCart = await GetCart(userId);
            UpdateCart.items = [];
            UpdateCart.save();
            res.status(201).json({
                success: true,
                message: "Order placed successfully",
                orderId: newOrder.orderId,
            });
        
    } catch (error) {
        console.error("Error placing order:", error.message);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
};

module.exports = {
    createNewOrder
};
