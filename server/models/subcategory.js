const mongoose = require('mongoose');       

const subcategorySchema = new mongoose.Schema({

    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'category',
    },
    subcategoryName: {
        type: String,
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
    descriptions:{ 
        type: String,
        required: true,
    }
},{timestamps: true});

module.exports = mongoose.model("subcategory", subcategorySchema);