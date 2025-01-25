const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
          required: true,
        },
        size: {
          type: String,
          required: true, 
        },
        quantity: {
          type: Number,
          required: true,
          default: 1, 
          min: 1, 
        },
      },
    ]
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Cart', cartSchema);
