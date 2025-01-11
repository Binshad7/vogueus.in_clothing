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
        required: true,
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
    category:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'category',
    },
    Subcategory:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'subcategory',
    },
    variations:[
        {
            color:{
                type: String,
                required: true,
            },
            image:{
                type: [String],
                default:[]
            },
            stock:{
                type: Number,
                required: true,
            },
        }
    
    ]
},{timestamps: true});

module.exports = mongoose.model('products', productSchema);