const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    ProductName: {
        type: String,
        required: true,
    },
    description:{
        type:String,
        required:true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
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
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'subcategory',
    },
    variantions: [
        {
            color: {
                type: String,
                required: true,
            },
            image: {
                type: [String],
                default: []
            },
            stock: {
                type: Number,
                required: true,
            },
            productPrice:{
                type:Number,
                required:true
            },
            offerPrice:{
                type:Number,
            }
        }

    ]
}, { timestamps: true });

module.exports = mongoose.model('products', productSchema);