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
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$productDetails"
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
                    fullName: { $first: '$shippingAddress.fullName' },
                    mobileNumber: { $first: '$shippingAddress.mobileNumber' },
                    email: { $first: '$userDetails.email' },
                    items: {
                        $push: {
                            ItemId: "$items._id",
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


async function getAllOrders(page = 1, limit = 10, search = '', status = '') {
    try {
        const matchStage = {};

        // Add search conditions if search term exists
        if (search) {
            matchStage.$or = [
                { orderId: { $regex: search, $options: 'i' } },
                { "items.productName": { $regex: search, $options: 'i' } }
            ];
        }

        // Handle status filtering including return statuses
        if (status && status.toLowerCase() !== 'all') {
            switch (status.toLowerCase()) {
                case 'fully_returned':
                    matchStage['returnRequest.adminStatus'] = 'approved';
                    break;
                case 'partially_returned':
                    matchStage.$and = [
                        { 'items.returnRequest.adminStatus': 'approved' },
                        { 'returnRequest.adminStatus': { $ne: 'approved' } }
                    ];
                    break;
                case 'return_requested':
                    matchStage.$or = [
                        { 'returnRequest.requestStatus': true, 'returnRequest.adminStatus': 'pending' },
                        { 'items.returnRequest.requestStatus': true, 'items.returnRequest.adminStatus': 'pending' }
                    ];
                    break;
                default:
                    matchStage.orderStatus = status.toLowerCase();
            }
        }

        const pipeline = [
            // Only include match stage if there are conditions
            Object.keys(matchStage).length > 0 ? { $match: matchStage } : null,

            // First lookup user details
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },

            // Then lookup products
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },

            // Unwind the items array
            { $unwind: '$items' },

            // Add product details to each item
            {
                $addFields: {
                    'items.productInfo': {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: '$productDetails',
                                    as: 'product',
                                    cond: { $eq: ['$$product._id', '$items.productId'] }
                                }
                            },
                            0
                        ]
                    }
                }
            },

            // Group back to original structure
            {
                $group: {
                    _id: '$_id',  // This keeps the original MongoDB _id
                    userId: { $first: '$userId' },  // Keep the original userId
                    userInfo: {  // Add selected user details
                        $first: {
                            name: '$userDetails.userName',
                            email: '$userDetails.email'
                        }
                    },
                    items: {
                        $push: {
                            $mergeObjects: [
                                '$items',
                                {
                                    productName: '$items.productInfo.productName',
                                    productImage: { $arrayElemAt: ['$items.productInfo.images', 0] },
                                    description: '$items.productInfo.description'
                                }
                            ]
                        }
                    },
                    totalAmount: { $first: '$totalAmount' },
                    paymentMethod: { $first: '$paymentMethod' },
                    paymentStatus: { $first: '$paymentStatus' },
                    orderStatus: { $first: '$orderStatus' },
                    orderId: { $first: '$orderId' },
                    coupon: { $first: '$coupon' },
                    shippingAddress: { $first: '$shippingAddress' },
                    orderedAt: { $first: '$orderedAt' },
                    deliveredAt: { $first: '$deliveredAt' },
                    returnRequest: { $first: '$returnRequest' },
                    statusHistory: { $first: '$statusHistory' }
                }
            },

            // Rest of your existing pipeline stages for return status...
            {
                $addFields: {
                    returnStatus: {
                        $cond: {
                            if: { $eq: ["$returnRequest.adminStatus", "approved"] },
                            then: "fully_returned",
                            else: {
                                $let: {
                                    vars: {
                                        returnedItemsCount: {
                                            $size: {
                                                $filter: {
                                                    input: "$items",
                                                    as: "item",
                                                    cond: {
                                                        $or: [
                                                            { $eq: ["$$item.itemStatus", "returned"] },
                                                            { $eq: ["$$item.returnRequest.adminStatus", "approved"] }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    in: {
                                        $cond: {
                                            if: { $eq: ["$$returnedItemsCount", { $size: "$items" }] },
                                            then: "all_items_returned",
                                            else: {
                                                $cond: {
                                                    if: { $gt: ["$$returnedItemsCount", 0] },
                                                    then: "partially_returned",
                                                    else: "$orderStatus"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        ].filter(Boolean);

        const totalOrders = await orderSchema.aggregate([
            ...pipeline.slice(0, pipeline.findIndex(stage => stage.$sort)),
            { $count: "total" }
        ]);

        const total = totalOrders[0]?.total || 0;

        // Add pagination stages
        pipeline.push(
            { $skip: (page - 1) * limit },
            { $limit: limit }
        );

        const orders = await orderSchema.aggregate(pipeline);

        return {
            orders,
            totalOrders: total
        };

    } catch (error) {
        console.error(error);
        throw new Error('Something went wrong while fetching order items');
    }
}

module.exports = {
    getOrderItems,
    getAllOrders
}