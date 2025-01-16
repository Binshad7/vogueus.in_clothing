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
        ref: 'user',
        required: true,
    },
    isUnlist: {
        type: Boolean,
        default: false
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("subcategory", subcategorySchema);