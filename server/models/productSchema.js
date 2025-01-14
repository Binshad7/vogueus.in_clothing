const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({


    productName: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    offerPrice: {
        type: Number,
    },
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
    images: {
        type: [
            String
        ]
    },
    variant: [
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
          isBlocked:{
            type:Boolean,
            default:false
          }
        },
      ],
}, { timestamps: true });

module.exports = mongoose.model('products', productSchema);