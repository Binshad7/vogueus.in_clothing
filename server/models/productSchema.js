const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({


    productName: {
        type: String,
        required: true,
    },
    regularPrice: {
        type: Number,
        required: true,
    },
    currentPrice: {
        type: Number,
    },
    description: {
        type: String,
        required: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'category',
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'subcategory',
    },
    images: {
        type: [
            String
        ]
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    variants: [
        {
            size: {
                type: String,
                required: true,
            },
            stock: {
                type: Number,
                required: true,
                min: 0,
            },
            status: {
                type: String,
                required: true,
                enum: ['available', 'out of stock', 'discontinued'],
                default: 'available',
            },
            isBlocked: {
                type: Boolean,
                default: false
            }
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('products', productSchema);