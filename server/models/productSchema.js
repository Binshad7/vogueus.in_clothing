const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    regularPrice: {
        type: Number,
        required: true,
    },
    currentPrice: {
        type: Number,
    },
    description: {
        type: String,
        required: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'category',
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'subcategory',
    },
    images: {
        type: [String],
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    variants: [
        {
            size: {
                type: String,
                required: true,
            },
            stock: {
                type: Number,
                required: true,
                min: 0,
            },
            status: {
                type: String,
                required: true,
                enum: ['available', 'out of stock', 'discontinued'],
                default: 'available',
            },
            isBlocked: {
                type: Boolean,
                default: false
            }
        },
    ],
}, { timestamps: true });


// Middleware: Automatically update status when stock changes
productSchema.pre('save', function (next) {
    this.variants.forEach(variant => {
        if (variant.stock === 0) {
            variant.status = 'out of stock';
        } else {
            variant.status = 'available';
        }
    });
    next();
});

// Middleware: Ensure status updates when stock is modified
productSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.variants) {
        update.variants.forEach(variant => {
            if (variant.stock === 0) {
                variant.status = 'out of stock';
            } else {
                variant.status = 'available';
            }
        });
    }
    next();
});

// Virtual Property: Dynamically check stock status
productSchema.virtual('variantStatus').get(function () {
    return this.variants.map(variant => ({
        size: variant.size,
        status: variant.stock === 0 ? 'out of stock' : 'available'
    }));
});

module.exports = mongoose.model('products', productSchema);
