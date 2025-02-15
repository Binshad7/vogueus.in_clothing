const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true
    },
    discountType: {
        type: String,
        required: true,
        enum: ["percentage", "fixed"]
    },
    discount: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["active", "expired", "disabled"],
        default: "active",
    },
    expiryDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > Date.now();
            },
            message: "Expiry date must be in the future",
        },
    },
    usageCount: {
        type: Number,
        default: 0,
        min: 0,
    },

}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
