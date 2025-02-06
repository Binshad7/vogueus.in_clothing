const orderSchema = require('../../models/orderSchema');
const productSchema = require('../../models/productSchema');
const { GetCartWithProductDetails, GetCart } = require('../../utils/getCart');
const { v4: uuidv4 } = require('uuid');
const { getOrderItems } = require('../../utils/getOrderItems');
const mongoose = require("mongoose");




const getUserOrderes = async (req, res) => {
    const { userId } = req.params
    if (userId !== req.user._id.toString()) {
        return res.status(400).json({ success: false, message: 'Invalid User ID' });
    }
    try {
        const orderDetails = await getOrderItems(req.user._id);
        res.status(200).json({ success: true, message: 'Order All Fetched', orderItems: JSON.stringify(orderDetails) })
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
}

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

        const orderId = 'VOG-' + uuidv4().split('-')[0].toUpperCase();

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
            shippingAddress: selectedAddress,
        });

        const orderdItem = await newOrder.save();
        if (!orderdItem) {
            return res.status(400).json({ success: false, message: "Something went wrong. Try again later." });
        }

        for (const item of orderdItem.items) {
            const updateResult = await productSchema.updateOne(
                { _id: item.productId, "variants.size": item.size },
                { $inc: { "variants.$[elem].stock": -item.quantity } },
                { arrayFilters: [{ "elem.size": item.size }] }
            );

            if (updateResult.modifiedCount === 0) {
                return res.status(400).json({ success: false, message: `Stock update failed for product ${item.productId}` });
            }
        }

        const UpdateCart = await GetCart(userId);
        UpdateCart.items = [];
        await UpdateCart.save();
        const orderDetails = await getOrderItems(req.user._id)
        console.log(orderDetails[0])
        const lastAddedProduct = orderDetails.find((item) => item.orderId == orderId);
        console.log('filet one ', lastAddedProduct)
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderItems: JSON.stringify(lastAddedProduct),
        });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
};

const cancellOrder = async (req, res) => {
    const { orderId } = req.params;
    if (!orderId) {
        return res.status(400).json({ success: false, message: 'Order Id In Not Valid' })
    }
    try {
        const CancelOrder = await orderSchema.findOneAndUpdate({ _id: orderId }, { $set: { orderStatus: "cancelled" } }, { new: true });
        if (!CancelOrder) {
            return res.status(400).json({ success: false, message: "Order Can't find" })
        }
        for (const item of CancelOrder.items) {
            const updateResult = await productSchema.updateOne(
                { _id: item.productId, "variants.size": item.size },
                { $inc: { "variants.$[elem].stock": item.quantity } },
                { arrayFilters: [{ "elem.size": item.size }] }
            );

            if (updateResult.modifiedCount === 0) {
                return res.status(400).json({ success: false, message: `Stock update failed for product ${item.productId}` });
            }
        }
        const orderDetails = await getOrderItems(req.user._id);

        res.status(200).json({ success: true, message: 'Order Canceld', orderdItem: JSON.stringify(orderDetails) })
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
}

const cancelOrderItem = async (req, res) => {
    const { orderId, itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ success: false, message: "Invalid Order ID format" });
    }
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ success: false, message: "Invalid Item ID format" });
    }

    try {
        const ExistingProductWithId = await orderSchema.findOne({ _id: orderId });

        if (!ExistingProductWithId) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const item = ExistingProductWithId.items.find((i) => i._id.toString() === itemId);

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        const productPrice = item.productPrice;

        const updatedOrder = await orderSchema.findOneAndUpdate(
            { _id: orderId, "items._id": itemId },
            {
                $set: { "items.$.itemStatus": "cancelled" },
                $inc: { totalAmount: -productPrice }
            },
            { new: true }
        );

        await productSchema.updateOne(
            { _id: item.productId, "variants.size": item.size },
            { $inc: { "variants.$[elem].stock": item.quantity } },
            { arrayFilters: [{ "elem.size": item.size }] }
        );

        if (!ExistingProductWithId) {
            return res.status(404).json({ success: false, message: "Order or Item not found" });
        }
        const orderDetails = await getOrderItems(req.user._id);

        res.status(200).json({ success: true, message: "Order item canceled", orderdItem: JSON.stringify(orderDetails) });
    } catch (error) {
        console.error("Error canceling order:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};


const returnOrderItem = async (req, res) => {
    const { orderId } = req.params;
    const { returnMessage, itemId } = req.body
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ success: false, message: "Invalid Order ID format" });
    }
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ success: false, message: "Invalid Item ID format" });
    }
    if (!returnMessage.trim()) {
        return res.status(400).json({ success: false, message: "Return Message is Required For Return  Order " });
    }
    try {
        const UpdatedItem = await orderSchema.updateOne({
            _id: orderId,
            "items._id": itemId
        },
            {
                $set: { 
                    "items.$.returnRequest.requestStatus": true,
                    "items.$.returnRequest.requestMessage": returnMessage
                }
            }
        )
        if (UpdatedItem.modifiedCount == 0) {
            return res.status(400).json({ success: false, message: "Product Not Found" })
        }
        const orderDetails = await getOrderItems(req.user._id);
        res.status(200).json({ success: true, message: 'Requsted To Return Product ', orderdItem: JSON.stringify(orderDetails) })
    } catch (error) {
        console.error("Error canceling A item order:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
}


const returnOrder = async (req, res) => {
    const { orderId } = req.params;
    const { returnMessage } = req.body;

    // Validate order ID format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ success: false, message: "Invalid Order ID format" });
    }

    // Ensure returnMessage is provided
    if (!returnMessage || !returnMessage.trim()) {
        return res.status(400).json({ success: false, message: "Return Message is Required For Returning the Order" });
    }

    try {
        // Fetch the order
        const updateOrder = await orderSchema.findById(orderId);
        if (!updateOrder) {
            return res.status(404).json({ success: false, message: "Order Not Found" });
        }

        // Update order-level return request
        updateOrder.returnRequest.requestStatus = true;
        updateOrder.returnRequest.requestMessage = returnMessage;
        updateOrder.returnRequest.adminStatus = "pending";

        // Update item-level return requests only if they are empty
        updateOrder.items = updateOrder.items.map((item) => {
            if (item.returnRequest.requestStatus || item.returnRequest.requestMessage) {
                return item; // Keep existing return requests
            }
            return {
                ...item,
                returnRequest: {
                    requestStatus: true,
                    requestMessage: returnMessage,
                    adminStatus: "pending",
                },
            };
        });

        // Save the updated order
        const updateResult = await orderSchema.updateOne(
            { _id: orderId },
            {
                $set: {
                    returnRequest: updateOrder.returnRequest,
                    items: updateOrder.items,
                },
            }
        );

        if (updateResult.modifiedCount > 0) {
            const orderDetails = await getOrderItems(req.user._id);

            return res.status(200).json({ success: true, message: "Return request sent successfully" ,orderdItem: JSON.stringify(orderDetails)});
        }

        res.status(400).json({ success: false, message: "Try Again Later" });

    } catch (error) {
        console.error("Error returning order:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};

module.exports = returnOrder;

module.exports = {
    createNewOrder,
    getUserOrderes,
    cancellOrder,
    cancelOrderItem,
    returnOrderItem,
    returnOrder
};
