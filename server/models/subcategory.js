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
    },
    // Offers Field
    offers: [
        {
            title: { type: String, required: true },
            discount: { type: Number, required: true, min: 0 }, // % or fixed amount
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true },
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model("subcategory", subcategorySchema);