const orderSchema = require('../../models/orderSchema');
const productSchema = require('../../models/productSchema');
const { GetCartWithProductDetails, GetCart } = require('../../utils/getCart');
const { v4: uuidv4 } = require('uuid');
const { getOrderItems } = require('../../utils/getOrderItems');
const mongoose = require("mongoose");
const walletSchema = require('../../models/wallet')
const Razorpay = require('razorpay')
const { RAZORPAY_KEY_ID, RAZORPAY_SCRETE } = require('../../config/ENV_VARS')
const couponSchema = require('../../models/coupon')
const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SCRETE
})


const getUserOrderes = async (req, res) => {
    const { userId } = req.params
    if (userId !== req.user._id.toString()) {
        return res.status(400).json({ success: false, message: 'Invalid User ID' });
    }
    try {
        const orderDetails = await getOrderItems(req.user._id);
        res.status(200).json({ success: true, message: 'Order All Fetched', orderdItem: JSON.stringify(orderDetails) })
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
}

const validateCoupon = async (req, res) => {
    const { couponCode, cartTotal } = req.body;

    try {
        // Check if coupon exists
        const isValidCoupon = await couponSchema.findOne({ couponCode });
        if (!isValidCoupon) {
            return res.status(400).json({ success: false, message: 'Coupon is not valid' });
        }

        // Check minimum order amount condition
        if (cartTotal < isValidCoupon.minimumOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `This coupon is applicable for a minimum order amount of ₹${isValidCoupon.minimumOrderAmount}`
            });
        }

        // Calculate Discount Amount
        let discountAmount = (cartTotal * isValidCoupon.discount) / 100;


        // Ensure discount does not exceed maximum limit
        if (discountAmount > isValidCoupon.maximumDiscountAmount) {
            discountAmount = isValidCoupon.maximumDiscountAmount;
        }

        // Response Object
        let coupon = {
            couponCode: isValidCoupon.couponCode,
            discount: discountAmount.toFixed(2),
            couponId: isValidCoupon._id
        };

        res.status(200).json({ success: true, message: 'Coupon is valid', coupon });

    } catch (error) {
        console.error("Error validating coupon:", error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
};


const createNewOrder = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!req.user._id.equals(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid User ID' });
        }

        const { selectedAddressIndex, paymentMethod, appliedCoupon } = req.body;
        console.log(appliedCoupon)
        if (!req.user.address || !req.user.address[selectedAddressIndex]) {
            return res.status(400).json({ success: false, message: "Address is required" });
        }
        const selectedAddress = req.user.address[selectedAddressIndex];

        const userCart = await GetCartWithProductDetails(userId);
        if (!Array.isArray(userCart) || userCart?.length === 0) {
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
        let discout;
        if (appliedCoupon) {

            const isValidCoupon = await couponSchema.findById(appliedCoupon);
            if (!isValidCoupon) {
                return res.status(400).json({ success: false, message: 'Coupon Is Not Valid' })
            }
            if (totalAmount < isValidCoupon.minimumOrderAmount) {
                return res.status(400).json({
                    success: false,
                    message: `This coupon is applicable for a minimum order amount of ₹${isValidCoupon.minimumOrderAmount}`
                });
            }

            let discountAmount = (Number(totalAmount) * isValidCoupon.discount) / 100;
            if (discountAmount > isValidCoupon.maximumDiscountAmount) {
                discountAmount = isValidCoupon.maximumDiscountAmount;
            }
            discout = discountAmount
            totalAmount = totalAmount - discountAmount
        }
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
        if (paymentMethod === 'wallet') {
            productDetails.paymentStatus = 'paid';
        }
        if (appliedCoupon) {
            productDetails.usedcoupon = appliedCoupon
        }
        if (paymentMethod !== 'raozrpay' && appliedCoupon) {
            productDetails.discoutAmout = discout
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

        if (paymentMethod === 'razorpay') {
            const orderDetails = await getOrderItems(req.user._id);
            const lastAddedProduct = orderDetails.find((item) => item.orderId === orderId);
            const razorpayOrder = await razorpay.orders.create({
                amount: totalAmount * 100,
                currency: 'INR',
                receipt: `order_${Date.now()}`,
                partial_payment: 1
            })
            if (!razorpayOrder.id) {
                return res.status(400).json({ success: false, message: "Failed to create Razorpay order" });
            }
            return res.status(201).json({
                success: true,
                message: "Order placed successfully",
                orderdItem: JSON.stringify(lastAddedProduct),
                orderId: razorpayOrder.id
            });
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
        await couponSchema.updateOne({ _id: appliedCoupon }, { $inc: { usageCount: 1 } });
        const orderDetails = await getOrderItems(req.user._id);
        const lastAddedProduct = orderDetails.find((item) => item.orderId === orderId);
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderdItem: JSON.stringify(lastAddedProduct),
        });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
};

// payment success then change the status of 
const razorpayPaymentStatus = async (req, res) => {
    const { orderId } = req.params;

    try {


        const updatePaymentStatus = await orderSchema.findOneAndUpdate({ _id: orderId }, { $set: { paymentStatus: 'paid' } }, { new: true });
        if (!updatePaymentStatus) {
            return res.status(400).json({ success: false, message: 'Order Not Find' })
        }
        if (updatePaymentStatus?.usedcoupon) {
            await couponSchema.updateOne({ _id: updatePaymentStatus.usedcoupon }, { $inc: { usageCount: 1 } })
        }
        const updateCart = await GetCart(updatePaymentStatus.userId);
        if (updateCart) {
            updateCart.items = [];
            await updateCart.save();
        }
        res.status(200).json({ success: true, message: 'Payment Successfuly completed' })
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });

    }
}


// when payment fail then order canceld
const paymentCaneled = async (req, res) => {
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
        res.status(200).json({ success: true, message: 'Order cancelled and refund processed ' });

    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }

}

const cancellOrder = async (req, res) => {
    const { orderId } = req.params;
    if (!orderId) {
        return res.status(400).json({ success: false, message: 'Order ID is not valid' });
    }

    try {
        const existingOrder = await orderSchema.findOne({ _id: orderId });
        let checkStatusMatch = existingOrder.items.every(item => item.itemStatus === 'processing');
        if (!checkStatusMatch) {
            return res.status(400).json({ success: false, message: "Order Can't fuly Cancell Each Product Can Do" });
        }
        const order = await orderSchema.findOneAndUpdate(
            { _id: orderId },
            { $set: { orderStatus: "cancelled", "items.$[].itemStatus": "cancelled" } },
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
        const orderDetails = await getOrderItems(req.user._id);
        res.status(200).json({ success: true, message: 'Order cancelled and Refund Amount Credited To wallet ', orderdItem: JSON.stringify(orderDetails) });

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

        if (existingOrder.orderStatus === 'cancelled') {
            return res.status(400).json({ success: false, message: "Order already cancelled" });
        }

        // Find the item inside the order
        const item = existingOrder.items.find((i) => i._id.toString() === itemId);

        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found in order" });
        }

        if (item.itemStatus === 'cancelled') {
            return res.status(400).json({ success: false, message: "Product already cancelled" });
        }

        // Get the product price for refund
        let refundAmount = item.productPrice;

        // Ensure original total amount is used for discount calculations
        let originalTotalAmount = existingOrder.totalAmount;

        if (existingOrder.usedcoupon) {
            let discountFactor = originalTotalAmount / (originalTotalAmount + existingOrder.discoutAmout);
            refundAmount = Math.round((refundAmount * item.quantity) * discountFactor); // Using Math.round() to avoid excessive reduction
        }
        // 3797  coupon 500  3297   2*1798 1548

        // Update the item status to 'cancelled'


        // If it's the last item in the order, cancel the entire order
        let updateDetails = {
            "items.$.itemStatus": "cancelled"
        };
       
        const filterItems = existingOrder.items.filter(item => item._id.toString() !== itemId);
        const statusMatch = filterItems?.every(item => item.itemStatus === 'cancelled')

        if (statusMatch) {
            updateDetails.orderStatus = 'cancelled';
            updateDetails.paymentStatus = 'refunded'
        }
        // If it's the last item in the order, cancel the entire order
        if (existingOrder.items.length === 1) {
            updateDetails.orderStatus = 'cancelled';
             updateDetails.paymentStatus = 'refunded'
        }
        // Update the order in the database
        const updatedOrder = await orderSchema.findOneAndUpdate(
            { _id: orderId, "items._id": itemId },
            {
                $set: updateDetails,
            },
            { new: true }
        );

        // Restore product stock
        await productSchema.updateOne(
            { _id: item.productId, "variants.size": item.size },
            { $inc: { "variants.$[elem].stock": item.quantity } },
            { arrayFilters: [{ "elem.size": item.size }] }
        );

        // Refund logic: Process refund only if payment was via wallet or Razorpay
        //existingOrder.paymentMethod === "wallet" || existingOrder.paymentMethod === "razorpay"
        if (['wallet','razorpay'].includes(existingOrder.paymentMethod)) {
            await walletSchema.findOneAndUpdate(
                { userId: existingOrder.userId },
                {
                    $inc: { balance: refundAmount },
                    $push: {
                        transactions: { type: "refund", amount: refundAmount }
                    }
                },
                { new: true }
            );
        }

        // Fetch updated order details
        const orderDetails = await getOrderItems(req.user._id);

        res.status(200).json({
            success: true,
            message: "Order item cancelled successfully",
            refundedAmount: refundAmount,
            updatedOrder: JSON.stringify(orderDetails),
        });
    } catch (error) {
        console.error("Error cancelling order:", error);
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
    returnOrder,
    razorpayPaymentStatus,
    paymentCaneled,
    validateCoupon
};


/* 
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.VITE_RAZORPAY_KEY_ID,
    key_secret: process.env.VITE_RAZORPAY_SCRETE
});

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

        // ✅ **Create order in Razorpay**
        if (paymentMethod === 'razorpay') {
            const razorpayOrder = await razorpay.orders.create({
                amount: totalAmount * 100, // Convert to paise (Razorpay expects amount in paise)
                currency: "INR",
                receipt: `order_${Date.now()}`, // Unique identifier
                payment_capture: 1, // Auto-capture
            });

            if (!razorpayOrder.id) {
                return res.status(400).json({ success: false, message: "Failed to create Razorpay order" });
            }
            
            return res.status(201).json({
                success: true,
                message: "Razorpay order created",
                orderId: razorpayOrder.id, // Send Razorpay Order ID to frontend
                amount: totalAmount
            });
        }

        // ✅ **Proceed with wallet payments**
        if (paymentMethod === 'wallet') {
            const walletBalance = await walletSchema.findOne({ userId });
            if (Number(totalAmount) > walletBalance.balance) {
                return res.status(400).json({ success: false, message: 'Wallet Balance Is Insufficient' });
            }

            let productDetails = {
                userId,
                items,
                totalAmount,
                paymentMethod,
                orderId: `VOG-${uuidv4().split('-')[0].toUpperCase()}`,
                shippingAddress: selectedAddress,
                paymentStatus: 'paid'
            };

            const newOrder = new orderSchema(productDetails);
            const orderedItem = await newOrder.save();

            if (!orderedItem) {
                return res.status(400).json({ success: false, message: "Something went wrong. Try again later." });
            }

            await walletSchema.updateOne(
                { userId },
                {
                    $inc: { balance: -totalAmount },
                    $push: { transactions: { type: 'debit', amount: totalAmount } }
                }
            );

            return res.status(201).json({
                success: true,
                message: "Order placed successfully using wallet",
                orderItems: orderedItem,
            });
        }

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: 'Server error, please try again later' });
    }
};

*/