const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    regularPrice: { type: Number, required: true },
    currentPrice: { type: Number }, // Auto-calculated from offers
    description: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true }, // Change to 'user' if necessary
    category: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'category' },
    subCategory: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'subcategory' },
    images: { type: [String] },
    isBlocked: { type: Boolean, default: false },

    // Offers Field
    offers: [
        {
            title: { type: String, required: true },
            discount: { type: Number, required: true, min: 0 }, // % or fixed amount
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true },
            isActive: { type: Boolean, default: true }
        }
    ],

    // Variants with Stock Management
    variants: [
        {
            size: { type: String, required: true },
            stock: { type: Number, required: true, min: 0, default: 0 },
            status: {
                type: String,
                required: true,
                enum: ['available', 'out of stock', 'discontinued'],
                default: 'available',
            },
            isBlocked: { type: Boolean, default: false }
        }
    ],
}, { timestamps: true });

// Middleware: Automatically update `currentPrice` based on the best offer
productSchema.pre('save', function (next) {
    if (this.offers.length > 0) {
        const activeOffers = this.offers.filter(offer => offer.isActive && offer.endDate > new Date());
        if (activeOffers.length > 0) {
            const bestOffer = activeOffers.reduce((prev, current) => (prev.discount > current.discount ? prev : current));
            this.currentPrice = this.regularPrice - (this.regularPrice * bestOffer.discount / 100);
        }
    } else {
        this.currentPrice = this.regularPrice;
    }

    // Automatically update variant status based on stock
    this.variants.forEach(variant => {
        variant.status = variant.stock === 0 ? 'out of stock' : 'available';
    });

    next();
});

// Middleware: Ensure `endDate` is always greater than `startDate`
productSchema.pre('validate', function (next) {
    this.offers.forEach(offer => {
        if (offer.endDate <= offer.startDate) {
            return next(new Error('End date must be greater than start date.'));
        }
    });
    next();
});

// Middleware: Update stock status on `findOneAndUpdate`
productSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    if (update.$set && update.$set.variants) {
        update.$set.variants.forEach(variant => {
            variant.status = variant.stock === 0 ? 'out of stock' : 'available';
        });
    }

    next();
});

// Virtual Property: Get Variant Status
productSchema.virtual('variantStatus').get(function () {
    return this.variants.map(variant => ({
        size: variant.size,
        status: variant.stock === 0 ? 'out of stock' : 'available'
    }));
});

module.exports = mongoose.model('products', productSchema);
