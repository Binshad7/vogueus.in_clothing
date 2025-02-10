const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    transactions: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            type: { type: String, enum: ["credit", "debit", "refund"], required: true },
            amount: { type: Number, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Wallet", walletSchema);
