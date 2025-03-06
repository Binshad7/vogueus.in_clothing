const cron = require('node-cron');
const Product = require('../../models/productSchema');
const subcategory = require('../../models/subcategory');


// Create Offer Controller

const formatDate = (date) => {
    return date.getFullYear() + "/" +
        String(date.getMonth() + 1).padStart(2, '0') + "/" +
        String(date.getDate()).padStart(2, '0');
};
const createOffer = async (req, res) => {
    console.log(req.body);


    try {
        const { title, discount, startDate, expiryDate, subcategoryId, productId } = req.body;

        if (!title || !discount || !startDate || !expiryDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }


        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(expiryDate);

        if (parsedEndDate <= parsedStartDate) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        const offer = {
            title: title.toUpperCase(),
            discount: Number(discount),
            startDate: parsedStartDate,
            endDate: parsedEndDate
        };



        // Determine if this is a scheduled offer or immediate
        const currentDate = new Date();
        const formattedStartDate = formatDate(parsedStartDate);
        const formattedCurrentDate = formatDate(currentDate);
        const isScheduled = formattedStartDate > formattedCurrentDate;

        // Apply the offer based on target (product or subcategoryId)
        if (productId) {
            // Product-specific offer
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Add the offer to the product
            product.offers.push(offer);

            // Update currentPrice if this is an immediate offer
            if (!isScheduled) {
                let val = await updateProductCurrentPrice(product);
            }

            let productAddedOffer = await product.save();
            let offers = productAddedOffer.offers.find(item => item.title === title.toUpperCase())
            return res.status(201).json({
                message: isScheduled ? 'Product offer scheduled successfully' : 'Product offer created and applied successfully',
                offers
            });
        }
        else if (subcategoryId) {

            // subcategoryId offer
            const subcategoryIdDoc = await subcategory.findById(subcategoryId);
            if (!subcategoryIdDoc) {
                return res.status(404).json({ message: 'subcategoryId not found' });
            }

            subcategoryIdDoc.offers.push(offer);

            let categoryOffers = await subcategoryIdDoc.save();
            let offers = categoryOffers.offers.find(item => item.title === title.toUpperCase())

            if (!isScheduled) {
                await applysubcategoryIdOfferToProducts(subcategoryId, offer);
            }

            return res.status(201).json({
                message: isScheduled ? 'subcategoryId offer scheduled successfully' : 'subcategoryId offer created and applied successfully',
                subcategoryId: subcategoryIdDoc,
                offers
            });
        }

        return res.status(400).json({ message: 'Please specify product or subcategoryId for the offer' });

    } catch (error) {
        console.error('Error creating offer:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Helper function to apply subcategoryId offer to all products in that subcategoryId
async function applysubcategoryIdOfferToProducts(subcategoryId, offer) {
    try {
        const products = await Product.find({ subCategory: subcategoryId });

        for (const product of products) {
            // Only apply if this offer is better than existing product offers
            let shouldApply = true;

            // Check if product has its own offers that are better
            if (product.offers && product.offers.length > 0) {
                const currentDate = new Date();
                const activeProductOffers = product?.offers?.filter(
                    productOffer => productOffer?.startDate <= currentDate && productOffer?.endDate > currentDate
                );
                if (activeProductOffers.length > 0) {
                    const bestProductOffer = activeProductOffers.reduce((best, current) =>
                        current.discount > best.discount ? current : best, { discount: 0 });

                    if (bestProductOffer.discount >= offer.discount) {

                        shouldApply = false;
                    }
                }
            }

            if (shouldApply) {
                let discountFactor = offer.discount / 100
                let discountAmount = product.regularPrice * discountFactor
                let finalAmount = product.regularPrice - discountAmount
                finalAmount = Math.round(finalAmount)
                await Product.updateOne({ _id: product._id }, { $set: { currentPrice: finalAmount } })
            }
        }
    } catch (error) {
        console.error('Error applying subcategoryId offer to products:', error);
        throw error;
    }
}

async function updateProductCurrentPrice(product) {
    const currentDate = new Date();
    const activeOffers = product.offers.filter(
        offer => offer.startDate <= currentDate && offer.endDate > currentDate
    );
    if (activeOffers.length > 0) {
        const bestOffer = activeOffers.reduce((prev, current) =>
            (prev.discount > current.discount ? prev : current)
        );
        let discountFactor = bestOffer.discount / 100;
        let discountAmount = product.regularPrice * discountFactor;
        let finalAmount = product.regularPrice - discountAmount;
        product.currentPrice = Math.round(finalAmount);
    } else {

        product.currentPrice = 0;
    }
    return product
}

const setupOfferCronJobs = () => {
    // Run every hour (at minute 0)
    cron.schedule('0 * * * *', async () => {
        console.log('Running scheduled offer processing at:', new Date());
        try {
            const currentDate = new Date();

            // Activate scheduled offers
            await activateScheduledOffers(currentDate);

            // Expire old offers
            await expireOldOffers(currentDate);

            console.log('Scheduled offer processing completed successfully');
        } catch (error) {
            console.error('Error in offer cron job:', error);
        }
    });

    // Run daily cleanup at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily offer cleanup at:', new Date());
        try {
            await cleanupExpiredOffers();
            console.log('Daily offer cleanup completed successfully');
        } catch (error) {
            console.error('Error in daily offer cleanup:', error);
        }
    });
};

async function activateScheduledOffers(currentDate) {
    try {
        const productsToActivate = await Product.find({
            "offers": {
                $elemMatch: {
                    startDate: { $lte: currentDate },
                    endDate: { $gt: currentDate }
                }
            }
        });

        console.log(`Found ${productsToActivate.length} products with offers to activate`);

        for (const product of productsToActivate) {
            let demo = await updateProductCurrentPrice(product);
            await product.save();
        }

        const subcategoriesToActivate = await subcategory.find({
            "offers": {
                $elemMatch: {
                    startDate: { $lte: currentDate },
                    endDate: { $gt: currentDate }
                }
            }
        });

        console.log(`Found ${subcategoriesToActivate.length} subcategories with offers to activate`);

        for (const subcategoryId of subcategoriesToActivate) {
            const activeOffers = subcategoryId.offers.filter(
                offer => offer.startDate <= currentDate && offer.endDate > currentDate
            );

            if (activeOffers.length > 0) {
                const bestOffer = activeOffers.reduce((prev, current) =>
                    (prev.discount > current.discount ? prev : current)
                );

                await applysubcategoryIdOfferToProducts(subcategoryId._id, bestOffer);
            }
        }
    } catch (error) {
        console.error('Error activating scheduled offers:', error);
        throw error;
    }
}

async function expireOldOffers(currentDate) {
    try {
        const productsWithExpiredOffers = await Product.find({
            "offers.endDate": { $lte: currentDate }
        });

        console.log(`Found ${productsWithExpiredOffers.length} products with expired offers`);

        for (const product of productsWithExpiredOffers) {
            const originalOffersCount = product.offers.length;
            product.offers = product.offers.filter(offer => offer.endDate > currentDate);
            console.log(`Removed ${originalOffersCount - product.offers.length} expired offers from product ${product._id}`);

            let product = await updateProductCurrentPrice(product);
            await product.save();
        }

        const subcategoriesWithExpiredOffers = await subcategory.find({
            "offers.endDate": { $lte: currentDate }
        });

        console.log(`Found ${subcategoriesWithExpiredOffers.length} subcategories with expired offers`);

        for (const subcategoryId of subcategoriesWithExpiredOffers) {
            // Remove expired offers
            const originalOffersCount = subcategoryId.offers.length;
            subcategoryId.offers = subcategoryId.offers.filter(offer => offer.endDate > currentDate);
            console.log(`Removed ${originalOffersCount - subcategoryId.offers.length} expired offers from subcategoryId ${subcategoryId._id}`);
            await subcategoryId.save();

            // Get the remaining active offers
            const activeOffers = subcategoryId.offers.filter(
                offer => offer.startDate <= currentDate && offer.endDate > currentDate
            );

            // Get all products in this subcategoryId
            const products = await Product.find({ subcategoryId: subcategoryId._id });

            for (const product of products) {
                // Check if there's a product-specific offer
                let product = await updateProductCurrentPrice(product);

                // If no product offers, apply subcategoryId offer if available
                if (product.currentPrice === 0 && activeOffers.length > 0) {
                    const bestOffer = activeOffers.reduce((prev, current) =>
                        (prev.discount > current.discount ? prev : current)
                    );

                    product.currentPrice = product.regularPrice - (product.regularPrice * bestOffer.discount / 100);
                }

                await product.save();
            }
        }
    } catch (error) {
        console.error('Error expiring old offers:', error);
        throw error;
    }
}

// Completely remove all expired offers (daily cleanup)
async function cleanupExpiredOffers() {
    try {
        const currentDate = new Date();

        // Remove all expired offers from products
        const productUpdateResult = await Product.updateMany(
            { "offers.endDate": { $lt: currentDate } },
            { $pull: { offers: { endDate: { $lt: currentDate } } } }
        );

        console.log(`Cleaned up expired offers from ${productUpdateResult.modifiedCount} products`);

        // Remove all expired offers from subcategories
        const subcategoryIdUpdateResult = await subcategory.updateMany(
            { "offers.endDate": { $lt: currentDate } },
            { $pull: { offers: { endDate: { $lt: currentDate } } } }
        );

        console.log(`Cleaned up expired offers from ${subcategoryIdUpdateResult.modifiedCount} subcategories`);

        // Reset currentPrice for products with no active offers
        const products = await Product.find({});
        let resetCount = 0;

        for (const product of products) {
            const hasActiveProductOffer = product.offers.some(
                offer => offer.startDate <= currentDate && offer.endDate > currentDate
            );

            if (!hasActiveProductOffer) {
                // Check for active subcategoryId offer
                const subcategoryId = await subcategory.findById(product.subcategoryId);
                const hasActivesubcategoryIdOffer = subcategoryId && subcategoryId.offers.some(
                    offer => offer.startDate <= currentDate && offer.endDate > currentDate
                );

                if (!hasActivesubcategoryIdOffer && product.currentPrice !== 0) {
                    product.currentPrice = 0;
                    await product.save();
                    resetCount++;
                }
            }
        }

        console.log(`Reset currentPrice to 0 for ${resetCount} products with no active offers`);
    } catch (error) {
        console.error('Error cleaning up expired offers:', error);
        throw error;
    }
}

// Route to manually trigger offer processing
const manuallyProcessOffers = async (req, res) => {
    try {
        const currentDate = new Date();

        await activateScheduledOffers(currentDate);
        await expireOldOffers(currentDate);

        return res.status(200).json({
            message: 'Manually processed offers successfully',
            timestamp: currentDate
        });
    } catch (error) {
        console.error('Error manually processing offers:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};





// Function to Get All Offers with Product and Category Names
const getAllOffers = async (req, res) => {
    try {
        // Get all offers from products
        const productOffers = await Product.aggregate([
            { $unwind: "$offers" }, // Separate each offer into its own document
            {
                $project: {
                    _id: 1,
                    productName: 1,
                    offerId: "$offers._id",
                    offerTitle: "$offers.title",
                    discount: "$offers.discount",
                    startDate: "$offers.startDate",
                    endDate: "$offers.endDate"
                }
            }
        ]);

        // Get all offers from subcategories
        const subcategoryOffers = await subcategory.aggregate([
            { $unwind: "$offers" },
            {
                $lookup: {
                    from: "categories", // Collection name for parent category
                    localField: "parentCategory",
                    foreignField: "_id",
                    as: "parentCategoryDetails"
                }
            },
            {
                $unwind: "$parentCategoryDetails" // Convert array to object
            },
            {
                $project: {
                    _id: 1,
                    subcategoryName: 1,
                    offerId: "$offers._id",
                    parentCategoryName: "$parentCategoryDetails.categoryName", // Assuming category schema has `categoryName`
                    offerTitle: "$offers.title",
                    discount: "$offers.discount",
                    startDate: "$offers.startDate",
                    endDate: "$offers.endDate"
                }
            }
        ]);

        res.status(200).json({ success: true, productOffers, subcategoryOffers });

    } catch (error) {
        console.error("Error fetching offers:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


// Function to Delete an Offer from Product or Subcategory
const deleteOffer = async (req, res) => {
    console.log("Request body:", req.body);

    try {
        const { productId, subcategoryId, offerId } = req.body;

        if (!offerId) {
            return res.status(400).json({ message: 'Offer ID is required' });
        }

        let message = '';

        if (productId) {
            // Find the product and remove the matching offer
            const product = await Product.findById(productId).lean(false);
            if (!product) return res.status(404).json({ message: 'Product not found' });

            const initialOfferCount = product.offers?.length || 0;
            product.offers = Array.isArray(product.offers) ? product.offers.filter(offer => offer._id.toString() !== offerId) : [];

            if (product.offers.length === initialOfferCount) {
                return res.status(404).json({ message: 'Offer not found in product' });
            }
            let finalAmount = 0
            // Find the best available offer
            let bestOffer = null;
            if (product.offers.length > 0) {
                bestOffer = product.offers.reduce((prev, current) =>
                    prev.discount > current.discount ? prev : current
                );
            }

            // Find the best subcategory-level offer
            if (product.subCategory) {
                const subcategorys = await subcategory.findById(product.subCategory);
                if (subcategorys && subcategorys.offers.length > 0) {
                    const bestSubcategoryOffer = subcategorys.offers.reduce((prev, current) =>
                        prev.discount > current.discount ? prev : current
                    );

                    if (!bestOffer || bestSubcategoryOffer.discount > bestOffer.discount) {
                        bestOffer = bestSubcategoryOffer;
                    }
                }
            }

            // Apply the best offer correctly
            product.currentPrice = bestOffer
                ? Math.round(product.regularPrice - (product.regularPrice * (bestOffer.discount / 100)))
                : product.regularPrice;  // Default to regular price if no offers

            product.markModified('offers'); // Ensure Mongoose detects changes
            // Apply the best offer found
            if (bestOffer) {
                let discountFactor = bestOffer?.discount / 100
                let discoutAmout = product?.regularPrice * discountFactor
                finalAmount = Math.round(product?.regularPrice - discoutAmout)
            }
            

            await product.save();
            await Product.updateOne({_id:product._id},{$set:{currentPrice:finalAmount}})
            message = 'Offer removed from product successfully and best available offer applied';

        } else if (subcategoryId) {
            // Find the subcategory and remove the offer
            const subcategorys = await subcategory.findById(subcategoryId);
            if (!subcategorys) return res.status(404).json({ message: 'Subcategory not found' });

            console.log("Before filtering, subcategory offers:", subcategorys.offers);
            const initialOfferCount = subcategorys.offers.length;
            subcategorys.offers = subcategorys.offers.filter(offer => offer._id.toString() !== offerId);
            console.log("After filtering, subcategory offers:", subcategorys.offers);

            if (initialOfferCount === subcategorys.offers.length) {
                return res.status(404).json({ message: 'Offer not found in subcategory' });
            }

            await subcategorys.save();

            // Find the best remaining subcategory-level offer
            let bestSubcategoryOffer = null;
            if (subcategorys.offers.length > 0) {
                bestSubcategoryOffer = subcategorys.offers.reduce((prev, current) =>
                    prev.discount > current.discount ? prev : current
                );
            }

            // Find all products in the subcategory and update their currentPrice
            const products = await Product.find({ subCategory: subcategoryId });

            if (!products || products.length === 0) {
                return res.status(404).json({ message: 'No products found under this subcategory' });
            }

            for (let product of products) {
                let bestOffer = null;
                let finalAmount = 0;

                // Check if product has its own offer
                if (product.offers.length > 0) {
                    bestOffer = product.offers.reduce((prev, current) =>
                        prev.discount > current.discount ? prev : current
                    );
                }

                // Compare product offer with subcategory offer and apply the best one
                if (!bestOffer || (bestSubcategoryOffer && bestSubcategoryOffer.discount > bestOffer.discount)) {
                    bestOffer = bestSubcategoryOffer;
                }

                // Apply the best offer
                if (bestOffer) {
                    let discountFactor = bestOffer?.discount / 100
                    let discoutAmout = product?.regularPrice * discountFactor
                    finalAmount = Math.round(product?.regularPrice - discoutAmout)
                }
                await Product.updateOne({ _id: product?._id }, { $set: { currentPrice: finalAmount } });
            }

            message = 'Offer removed from subcategory and best available offer applied to related products';

        } else {
            return res.status(400).json({ message: 'Please provide either productId or subcategoryId' });
        }

        res.status(200).json({ message });

    } catch (error) {
        console.error('Error deleting offer:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};






module.exports = {
    createOffer,
    getAllOffers,
    deleteOffer
}
