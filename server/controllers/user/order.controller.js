const orderSchema = require('../../models/orderSchema');
const productSchema = require('../../models/productSchema');
const { GetCartWithProductDetails, GetCart } = require('../../utils/getCart');
const { v4: uuidv4 } = require('uuid');
const { getOrderItems } = require('../../utils/getOrderItems');
const mongoose = require("mongoose");
const walletSchema = require('../../models/wallet')



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
        if (!req.user._id.equals(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid User ID' });
        }

        const { selectedAddressIndex, paymentMethod } = req.body;
        if (!req.user.address || !req.user.address[selectedAddressIndex]) {
            return res.status(400).json({ success: false, message: "Address is required" });
        }
        const selectedAddress = req.user.address[selectedAddressIndex];

        const userCart = await GetCartWithProductDetails(userId);
        if (!Array.isArray(userCart) || userCart.length === 0) {
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

        if (paymentMethod === 'wallet') {
            const walletBalance = await walletSchema.findOne({ userId });
            if (Number(totalAmount) > walletBalance.balance) return res.status(400).json({ succees: false, message: 'Wallet Balance Is Insufficient ' })
        }
        let productDetails = {
            userId,
            items,
            totalAmount,
            paymentMethod,
            orderId,
            shippingAddress: selectedAddress,
        };
        if (['wallet', 'razorpay'].includes(paymentMethod)) {
            productDetails.paymentStatus = 'paid';
        }

        const newOrder = new orderSchema(productDetails);
        const orderedItem = await newOrder.save();
        if (!orderedItem) {
            return res.status(400).json({ success: false, message: "Something went wrong. Try again later." });
        }

        for (const item of orderedItem.items) {
            const updateResult = await productSchema.updateOne(
                { _id: item.productId, "variants.size": item.size },
                { $inc: { "variants.$[elem].stock": -item.quantity } },
                { arrayFilters: [{ "elem.size": item.size }] }
            );

            if (updateResult.modifiedCount === 0) {
                return res.status(400).json({ success: false, message: `Stock update failed for product ${item.productId}` });
            }
        }

        if (paymentMethod === 'wallet') {
            const updateWalletBalance = await walletSchema.updateOne(
                { userId },
                {
                    $inc: { balance: -totalAmount },
                    $push: {
                        transactions: {
                            type: 'debit',
                            amount: totalAmount
                        }
                    }
                }
            );

            if (updateWalletBalance.modifiedCount === 0) {
                await orderSchema.deleteOne({ _id: newOrder._id });
                return res.status(403).json({ success: false, message: "Payment Not Completed" });
            }
        }

        const updateCart = await GetCart(userId);
        if (updateCart) {
            updateCart.items = [];
            await updateCart.save();
        }

        const orderDetails = await getOrderItems(req.user._id);
        const lastAddedProduct = orderDetails.find((item) => item.orderId === orderId);
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
        return res.status(400).json({ success: false, message: 'Order ID is not valid' });
    }

    try {
        const order = await orderSchema.findOneAndUpdate(
            { _id: orderId },
            { $set: { orderStatus: "cancelled" } },
            { new: true }
        );

        if (!order) {
            return res.status(400).json({ success: false, message: "Order not found" });
        }

        // Restock products
        for (const item of order.items) {
            const updateResult = await productSchema.updateOne(
                { _id: item.productId, "variants.size": item.size },
                { $inc: { "variants.$[elem].stock": item.quantity } },
                { arrayFilters: [{ "elem.size": item.size }] }
            );

            if (updateResult.modifiedCount === 0) {
                return res.status(400).json({ success: false, message: `Stock update failed for product ${item.productId}` });
            }
        }

        // Refund if paid through wallet or Razorpay
        if (order.paymentMethod === "wallet" || order.paymentMethod === "razorpay") {
            const wallet = await walletSchema.findOne({ userId: order.userId });

            if (!wallet) {
                return res.status(400).json({ success: false, message: "Wallet not found" });
            }

            // Refund the total order amount
            wallet.balance += order.totalAmount;
            wallet.transactions.push({
                type: "refund",
                amount: order.totalAmount
            });

            await wallet.save();
        }

        res.status(200).json({ success: true, message: 'Order cancelled and refund processed (if applicable)' });

    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
};


const cancelOrderItem = async (req, res) => {
    const { orderId, itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ success: false, message: "Invalid Order or Item ID format" });
    }

    try {
        // Fetch the order
        const existingOrder = await orderSchema.findOne({ _id: orderId });

        if (!existingOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Find the item inside the order
        const item = existingOrder.items.find((i) => i._id.toString() === itemId);

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found in order" });
        }

        // Get the product price for refund
        const productPrice = item.productPrice;

        // Update the item status to 'cancelled' and adjust totalAmount
        const updatedOrder = await orderSchema.findOneAndUpdate(
            { _id: orderId, "items._id": itemId },
            {
                $set: { "items.$.itemStatus": "cancelled" },
                $inc: { totalAmount: -productPrice } // Reduce totalAmount by the product price
            },
            { new: true }
        );

        // Restore product stock
        await productSchema.updateOne(
            { _id: item.productId, "variants.size": item.size },
            { $inc: { "variants.$[elem].stock": item.quantity } },
            { arrayFilters: [{ "elem.size": item.size }] }
        );

        // Refund logic: Check payment method (only refund if Wallet or Razorpay was used)
        if (existingOrder.paymentMethod === "wallet" || existingOrder.paymentMethod === "razorpay") {
            await Wallet.findOneAndUpdate(
                { userId: existingOrder.userId },
                {
                    $inc: { balance: productPrice },
                    $push: {
                        transactions: { type: "refund", amount: productPrice }
                    }
                },
                { new: true }
            );
        }

        // Fetch updated order details
        const orderDetails = await getOrderItems(req.user._id);

        res.status(200).json({
            success: true,
            message: "Order item canceled and amount refunded (if applicable)",
            orderdItem: JSON.stringify(orderDetails),
        });
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

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ success: false, message: "Invalid Order ID format" });
    }

    if (!returnMessage || !returnMessage.trim()) {
        return res.status(400).json({ success: false, message: "Return Message is Required For Returning the Order" });
    }

    try {
        const updateOrder = await orderSchema.findById(orderId);
        if (!updateOrder) {
            return res.status(404).json({ success: false, message: "Order Not Found" });
        }

        updateOrder.returnRequest.requestStatus = true;
        updateOrder.returnRequest.requestMessage = returnMessage;
        updateOrder.returnRequest.adminStatus = "pending";

    
        updateOrder.items = updateOrder.items.map((item) => {
            if (item.returnRequest.requestStatus || item.returnRequest.requestMessage) {
                return item; 
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

            return res.status(200).json({ success: true, message: "Return request sent successfully", orderdItem: JSON.stringify(orderDetails) });
        }

        res.status(400).json({ success: false, message: "Try Again Later" });

    } catch (error) {
        console.error("Error returning order:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};


module.exports = {
    createNewOrder,
    getUserOrderes,
    cancellOrder,
    cancelOrderItem,
    returnOrderItem,
    returnOrder
};
