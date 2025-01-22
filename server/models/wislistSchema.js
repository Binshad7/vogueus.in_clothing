const mongoose = require('mongoose');
const wishlistSchama = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        }
    ],
}, { timestamps: true });


module.exports = mongoose.model('wishlist ',wishlistSchama)