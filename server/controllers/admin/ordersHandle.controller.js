const orderSchema = require('../../models/orderSchema');
const { getAllOrders } = require('../../utils/getOrderItems');


const getAllordersToAdmin = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = '', status = '' } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const { orders, totalOrders } = await getAllOrders(page, limit, search, status);
        console.log(totalOrders)
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

    try {
        const existOrder = await orderSchema.findById(orderId);
        if (!existOrder) {
            return res.status(404).json({ success: false, message: 'Order Not Found' });
        }

        const existItem = existOrder.items.find(item => item._id.toString() === itemId);
        if (!existItem) {
            return res.status(404).json({ success: false, message: "Item Not Found" });
        }

        if (!existItem.returnRequest?.requestStatus && newStatus === 'returned') {
            return res.status(400).json({ success: false, message: 'User has not requested a return' });
        }

        let updateFields = { 'items.$.itemStatus': newStatus };
        if (newStatus === 'paid') {
            updateFields.paymentStatus = 'paid';
            updateFields.orderStatus = 'paid';
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
        if (orderStatusCheck) {
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
module.exports = {
    getAllordersToAdmin,
    updateOrderItemStatus
};
