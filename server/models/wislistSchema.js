const mongoose = require('mongoose');
const wislistSchama = new mongoose.Schema({
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


module.exports = mongoose.model('wislist',wislistSchama)