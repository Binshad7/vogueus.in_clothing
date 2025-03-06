const mongoose = require('mongoose');



const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            productPrice: {
                type: Number,
                required: true,
            },
            size: {
                type: String,
                required: true,
            },
            itemStatus: {
                type: String,
                enum: ['processing', 'shipped', 'delivered', 'cancelled', 'returned'],
                default: 'processing',
            },
            returnRequest: {
                requestStatus: { type: Boolean, default: false },
                requestMessage: { type: String },
                adminStatus: {
                    type: String,
                    enum: ['approved', 'reject', 'pending'],
                    default: 'pending',
                },
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['wallet', 'razorpay', 'cod'],
        required: true,
    },
    usedcoupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coupons'
    },
    discoutAmout: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    orderStatus: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'processing',
    },
    orderId: {
        type: String,
        required: true,
    },
    coupon: {
        code: { type: String },
        discountApplied: { type: Number }
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        mobileNumber: { type: String, required: true },
        pinCode: { type: String, required: true },
        country: { type: String },
        address: { type: String, required: true },
        houseNumber: { type: String },
        cityDistrictTown: { type: String },
        state: { type: String, required: true },
        landMark: { type: String, required: true },
    },
    orderedAt: {
        type: Date,
        default: Date.now,
    },
    deliveredAt: {
        type: Date,
    },
    returnRequest: {
        requestStatus: { type: Boolean, default: false },
        requestMessage: { type: String },
        adminStatus: {
            type: String,
            enum: ['approved', 'rejectd', 'pending'],
            default: 'pending',
        },
    },
    statusHistory: [
        {
            status: {
                type: String,
                enum: ['processing', 'shipped', 'delivered', 'cancelled', 'returned'],
                required: true,
            },
            updatedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Orders', orderSchema);