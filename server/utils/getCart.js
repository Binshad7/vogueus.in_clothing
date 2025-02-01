const cartSchema = require('../models/cart');
const mongoose = require('mongoose');

const GetCart = async (userId) => {
    try {
        const CartsItems = await cartSchema.findOne({ userId });
        return CartsItems
    } catch (error) {
        throw new Error('Something went wrong while fetching the cart');
    }

}
const GetCartWithProductDetails = async (userId) => {
    try {
        const userCart = await cartSchema.aggregate(
            [
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                { $unwind: "$items" },
                {
                    $lookup: {
                        from: 'products',
                        localField: "items.productId",
                        foreignField: "_id",
                        as: "productDetails",
                    }
                }
            ]
        );
        return userCart
    } catch (error) {
        throw new Error('Something went wrong while fetching the cart')
    }

}
const fetchCartWithProductDetails = async (userId) => {
    try {
        const userCart = await cartSchema.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Ensure userId is an ObjectId
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" },
            {
                $lookup: {
                    from: "categories",
                    localField: "productDetails.category",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            { $unwind: "$categoryDetails" },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "productDetails.subCategory",
                    foreignField: "_id",
                    as: "subCategoryDetails",
                },
            },
            { $unwind: "$subCategoryDetails" },
            {
                $addFields: {
                    "productDetails.variants": {
                        $filter: {
                            input: "$productDetails.variants",
                            as: "variant",
                            cond: { $eq: ["$$variant.size", "$items.size"] },
                        },
                    },
                },
            },
            {
                $match: {
                    "productDetails.variants": { $ne: [] },
                    "productDetails.isBlocked": false,
                    "categoryDetails.isUnlist": false,
                    "subCategoryDetails.isUnlist": false,
                },
            },
            {
                $project: {
                    _id: 1,
                    "items.size": 1,
                    "items.quantity": 1,
                    "items._id": 1,
                    "productDetails._id": 1,
                    "productDetails.productName": 1,
                    "productDetails.currentPrice": 1,
                    "productDetails.regularPrice": 1,
                    "productDetails.images": 1,
                    "productDetails.variants": 1,
                },
            },
        ]);

        // Transform the data to fit the required structure
        const userCartModify = userCart.map((item) => ({
            itemDetails: {
                _id: item._id,
                size: item.items.size,
                quantity: item.items.quantity,
                cartItemsId: item.items._id
            },
            productDetails: {
                productId: item.productDetails._id,
                productName: item.productDetails.productName,
                regularPrice: item.productDetails.regularPrice,
                currentPrice: item.productDetails.currentPrice,
                image: item.productDetails.images[0],
                size: item.productDetails.variants[0]?.size,
                stock: item.productDetails.variants[0]?.stock,
            },
        }));
        return userCartModify;
    } catch (error) {
        console.error(`Error fetching cart details for user ${userId}: ${error.message}`);
        throw new Error(`Server-side error: ${error.message}`);
    }
};

module.exports = { GetCart, fetchCartWithProductDetails,GetCartWithProductDetails }



