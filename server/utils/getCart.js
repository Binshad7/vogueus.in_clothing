const cartSchema = require('../models/cart');
const mongoose = require('mongoose');
const Product = require('../models/productSchema'); // Replace with the correct path
const Category = require('../models/category'); // Replace with the correct path

const GetCart = async (userId) => {
    try {
        const CartsItems = await cartSchema.findOne({ userId });
        return CartsItems
    } catch (error) {
        throw new Error('Something went wrong while fetching the cart');
    }

}






const fetchCartWithProductDetails = async (userId) => {
    try {
        const userCart = await cartSchema.aggregate([
            {
                $match: {
                    userId: userId
                }
            },
            {
                $unwind: "$items"
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
                $unwind: "$productDetails"
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "productDetails.category",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: "$categoryDetails"
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "productDetails.subCategory",
                    foreignField: "_id",
                    as: "subCategoryDetails"
                }
            },
            {
                $unwind: "$subCategoryDetails"
            },
            {
                $addFields: {
                    "productDetails.variants": {
                        $filter: {
                            input: "$productDetails.variants",
                            as: "variant",
                            cond: { $eq: ["$$variant.size", "$items.size"] }
                        }
                    }
                }
            },
            {
                $match: {
                    "productDetails.variants": { $ne: [] },
                    "productDetails.isBlocked": false,
                    "categoryDetails.isUnlist": false,
                    "subCategoryDetails.isUnlist": false
                }
            },
            {
                $project: {
                    "items.size": 1,
                    "items.quantity": 1,
                    "productDetails.productName": 1,
                    "productDetails.currentPrice": 1,
                    "productDetails.regularPrice": 1,
                    "productDetails.images": 1,
                    "productDetails.variants": 1,
                    _id: 0
                }
            }
        ]);
        return userCart;
    } catch (error) {
        console.error(`Error in fetchCartWithProductDetails: ${error.message}`);
        throw new Error(`Server-side error: ${error.message}`);
    }
};


module.exports = { GetCart, fetchCartWithProductDetails }



