const { default: mongoose } = require('mongoose');
const orderSchema = require('../../models/orderSchema');
const { getAllOrders } = require('../../utils/getOrderItems');
const walletSchema = require('../../models/wallet');
const returnOrder = require('../user/order.controller');


const getAllordersToAdmin = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = '', status = '' } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const { orders, totalOrders } = await getAllOrders(page, limit, search, status);
        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            orders: JSON.stringify(orders),
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders
        });
    } catch (error) {
        console.error("Error returning order:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};

const updateOrderItemStatus = async (req, res) => {
    const { orderId, itemId } = req.params;
    const { newStatus } = req.body;
    console.log(newStatus)
    try {
        const existOrder = await orderSchema.findById(orderId);
        if (!existOrder) {
            return res.status(404).json({ success: false, message: 'Order Not Found' });
        }

        const existItem = existOrder.items.find(item => item._id.toString() === itemId);
        if (!existItem) {
            return res.status(404).json({ success: false, message: "Item Not Found" });
        }


        if (existItem.itemStatus === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Product is cancelled' });
        }
        if (!existItem.returnRequest?.requestStatus && newStatus === 'returned') {
            return res.status(400).json({ success: false, message: 'User has Not Requested a Return' });
        }
        if (newStatus === 'returned' && existItem.returnRequest?.adminStatus !== 'approved') {
            return res.status(400).json({ success: false, message: 'Returend Requeste Not Approved' });
        }


        const updateProductStatus = await orderSchema.updateOne(
            { _id: orderId, "items._id": itemId },
            { $set: { "items.$.itemStatus": newStatus } }
        );

        if (updateProductStatus.modifiedCount === 0) {
            return res.status(400).json({ success: false, message: 'Update failed' });
        }
        const updatedOrder = await orderSchema.findById(orderId);

        const orderStatusCheck = updatedOrder.items.every(item => item.itemStatus === newStatus);
        const orderStatusCheckIsDelvered = updatedOrder.items.every(item => item.itemStatus === 'delivered');
        if (orderStatusCheckIsDelvered) {
            await orderSchema.updateOne(
                { _id: orderId },
                { $set: { orderStatus: 'delivered', paymentStatus: 'paid', deliveredAt: Date.now() } }
            );
        }
        else if (orderStatusCheck) {
            await orderSchema.updateOne(
                { _id: orderId },
                { $set: { orderStatus: newStatus } }
            );
        }


        const { orders } = await getAllOrders();

        const updatedOrderToUser = await orders.find((order) => order?._id.toString() === orderId);
        res.status(200).json({ success: true, message: 'OrderStatus Updated ', order: updatedOrderToUser });

    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};

const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params
    const { orderStatus } = req.body
    try {
        const updateOrder = await orderSchema.findOne({ _id: orderId });
        if (!updateOrder) {
            return res.status(400).json({ success: false, message: "Product not find " })
        }
        if (updateOrder.orderStatus === 'cancelled') {
            return res.status(400).json({ success: false, message: 'Order As bin cancelled' })
        }
        const orderStatusIsReturned = updateOrder.items.every(item => item.itemStatus === 'returned')
        if (orderStatus === 'returned' && !orderStatusIsReturned) {
            return res.status(400).json({ success: false, message: "Can't Change  Order Not Fuly Returend " })
        }
        let updatedData = {
            orderStatus: orderStatus
        }
        if (updateOrder.items.length === 1) {
            updatedData['items.0.itemStatus'] = orderStatus;
            // updatedData['items.$[].itemStatus'] = orderStatus;

        }
        if (updateOrder.items.length === 1 && orderStatus == 'delivered') {
            updatedData.paymentStatus = 'paid'
        }

        const updated = await orderSchema.updateOne({ _id: orderId }, { $set: updatedData });
        if (updated.modifiedCount === 0) {
            return res.status(400).json({ success: false, message: 'Update failed' });
        }
        const { orders } = await getAllOrders();
        const updatedOrderToUser = await orders.find((order) => order?._id.toString() === orderId);
        res.status(200).json({ success: true, message: 'OrderStatus Updated ', order: updatedOrderToUser });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
}
const orderItemReturnStatus = async (req, res) => {
    const { orderId, itemId } = req.params;
    const { returnStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ success: false, message: 'OrderId Is Not Valid' });
    }
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ success: false, message: 'ItemId Is Not Valid' });
    }
    if (!['approve', 'reject'].includes(returnStatus)) {
        return res.status(400).json({ success: false, message: "Return Status Not Match" });
    }

    try {
        const returnOrderItem = await orderSchema.findById(orderId);
        if (!returnOrderItem) {
            return res.status(400).json({ success: false, message: 'Order Not Found' });
        }

        const returnItem = returnOrderItem.items.find(item => item._id.toString() === itemId);
        if (!returnItem) {
            return res.status(400).json({ success: false, message: 'Item Not Found' });
        }

        let updatingDetail = { 'items.$.returnRequest.adminStatus': returnStatus };

        if (returnStatus === 'approve') {
            updatingDetail['items.$.paymentStatus'] = 'refunded';
            updatingDetail['items.$.itemStatus'] = 'returned';
            // updatingDetail.totalAmount = returnOrderItem.totalAmount - returnItem.productPrice;
        }

        const orderStatusIsReturned = returnOrderItem.items.every(item => {
            if (returnItem._id !== item._id) return item.itemStatus === 'returned'
            return true
        }
        );
        console.log(orderStatusIsReturned)
        if (orderStatusIsReturned) {
            updatingDetail.orderStatus = 'returned';
        }

        const updatedOrder = await orderSchema.findOneAndUpdate(
            { _id: orderId, 'items._id': itemId },
            { $set: updatingDetail },
            { new: true }
        );

        const { orders } = await getAllOrders();
        const updatedOrderItem = await orders.find((order) => order?._id.toString() === orderId);
        if (!updatedOrder) {
            return res.status(400).json({ success: false, message: 'Order or Item Not Found for Update' });
        }

        if (returnStatus === 'reject') {
            return res.status(200).json({ success: true, message: 'Return Status Changed', order: updatedOrderItem });
        }

        const userWallet = await walletSchema.findOneAndUpdate(
            { userId: returnOrderItem.userId },
            {
                $inc: { balance: returnItem.productPrice },
                $push: { transactions: { type: 'refund', amount: returnItem.productPrice } }
            },
            { new: true, upsert: true }
        );



        res.status(200).json({ success: true, message: 'Return Status Changed', order: updatedOrderItem });

    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};


module.exports = {
    getAllordersToAdmin,
    updateOrderItemStatus,
    updateOrderStatus,
    orderItemReturnStatus
};
