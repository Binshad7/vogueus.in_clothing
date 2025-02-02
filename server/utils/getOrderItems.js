const orderSchema = require('../models/orderSchema')
async function getOrderItems(userId) {
    try {
        const orderDetails = await orderSchema.aggregate([
            { $match: { userId: userId } },
            {
                $unwind: "$items" // Flatten the items array to get each product separately
            },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails" // Flatten the productDetails array
            },
            {
                $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    totalAmount: { $first: "$totalAmount" },
                    paymentMethod: { $first: "$paymentMethod" },
                    paymentStatus: { $first: "$paymentStatus" },
                    orderStatus: { $first: "$orderStatus" },
                    orderId: { $first: "$orderId" },
                    orderedAt: { $first: "$orderedAt" },
                    items: { 
                        $push: {
                            quantity: "$items.quantity",
                            productPrice: "$items.productPrice",
                            size: "$items.size",
                            itemStatus: "$items.itemStatus",
                            returnRequest: "$items.returnRequest",
                            productName: "$productDetails.productName",
                            productImage: { $arrayElemAt: ["$productDetails.images", 0] }
                        }
                    }
                }
            }
        ]);

        return orderDetails;
    } catch (error) {
        console.log(error)
        throw new Error('Something went wrong while fetching order items');
    }
}

module.exports = {
    getOrderItems
}