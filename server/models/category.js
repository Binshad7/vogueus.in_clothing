const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    categoryName: {
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
    isUnlist:{
      type:Boolean,
      default:false
    },
    subcategories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subcategory',
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("category", categorySchema);