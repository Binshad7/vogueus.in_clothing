const couponSchema = require('../../models/coupon');

const getAllCoupons = async (req, res) => {
    try {
        const coupon = await couponSchema.find()
        res.status(201).json({ success: true, message: 'Coupons fetched', coupon });
    } catch (error) {
        console.log(`Error in getAllCoupons: ${error.message}`);
        res.status(500).json({ success: false, message: `Server error. You can report this issue: ${error.message}` });
    }
}



const addCoupon = async (req, res) => {
    try {
        const { couponCode, discountType, discount, expiryDate, description, minimumOrderAmount, maximumDiscountAmount } = req.body;

        if (!couponCode || !couponCode.trim()) {
            return res.status(400).json({ success: false, message: 'Coupon Code is required' });
        }
        if (couponCode.length < 3 || couponCode.length > 20) {
            return res.status(400).json({ success: false, message: 'Coupon Code must be between 3 to 20 characters' });
        }

        if (!discountType || !["percentage", "fixed"].includes(discountType)) {
            return res.status(400).json({ success: false, message: 'Discount Type must be "percentage" or "fixed"' });
        }

        if (!discount || isNaN(discount) || discount <= 0) {
            return res.status(400).json({ success: false, message: 'Discount must be a positive number' });
        }

        if (!description || !description.trim()) {
            return res.status(400).json({ success: false, message: 'Description is required' });
        }
        if (description.length < 5 || description.length > 100) {
            return res.status(400).json({ success: false, message: 'Description must be between 5 to 100 characters' });
        }

        if (!expiryDate || isNaN(Date.parse(expiryDate))) {
            return res.status(400).json({ success: false, message: 'Expiry Date is required and must be a valid date' });
        }
        if (new Date(expiryDate) <= new Date()) {
            return res.status(400).json({ success: false, message: 'Expiry Date must be in the future' });
        }

        if (minimumOrderAmount === undefined || isNaN(minimumOrderAmount) || minimumOrderAmount < 0) {
            return res.status(400).json({ success: false, message: 'Minimum Order Amount must be a non-negative number' });
        }

        if (!maximumDiscountAmount || isNaN(maximumDiscountAmount) || maximumDiscountAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Maximum Discount Amount must be a positive number' });
        }
        const existCouponCode = await couponSchema.findOne({ couponCode })
        if (existCouponCode) {
            return res.status(400).json({ success: false, message: "Coupon Code Is Already Exist" })
        }
        const newCoupon = new couponSchema({
            couponCode,
            discountType,
            discount,
            description,
            expiryDate: new Date(expiryDate),
            minimumOrderAmount,
            maximumDiscountAmount
        });

        const addedCoupon = await newCoupon.save();
        console.log(addedCoupon)
        res.status(200).json({ success: true, message: 'Coupon Created', coupon: addedCoupon.toObject() });

    } catch (error) {
        console.error(`Error in addCoupon: ${error.message}`);
        res.status(500).json({
            success: false,
            message: `Server error. Please report this issue: ${error.message}`
        });
    }
};


const updateBlockStatus = async (req, res) => {
    const { couponId } = req.params;

    try {
        const existingCoupon = await couponSchema.findById(couponId);
        if (!existingCoupon) {
            return res.status(400).json({ success: false, message: 'Coupon Not Found' });
        }

        let updateData = { isBlock: !existingCoupon.isBlock };

        if (new Date(existingCoupon.expiryDate) < Date.now()) {
            updateData.status = 'expired';
        }

        const updated = await couponSchema.findOneAndUpdate({ _id: couponId }, { $set: updateData }, { new: true });

        if (!updated) {
            return res.status(400).json({ success: false, message: 'Coupon update failed' });
        }

        res.status(200).json({ success: true, message: 'Successfully updated', coupon: updated });

    } catch (error) {
        console.log(`Error in updateBlockStatus: ${error.message}`);
        res.status(500).json({ success: false, message: `Server error. You can report this issue: ${error.message}` });
    }
};

const editCoupon = async (req, res) => {
    const { couponId } = req.params;
    const { couponCode, discountType, discount, expiryDate, description } = req.body;

    try {
        const existingCoupon = await couponSchema.findById(couponId);
        if (!existingCoupon) {
            return res.status(404).json({ success: false, message: 'Coupon Not Found' });
        }

        if (existingCoupon.couponCode !== couponCode) {
            const availableCoupon = await couponSchema.findOne({ couponCode });
            if (availableCoupon) {
                return res.status(400).json({ scuccss: false, message: 'CouponCode Alredy Exist' })
            }
        }

        if (couponCode && !couponCode.trim()) {
            return res.status(400).json({ success: false, message: 'CouponCode is required' });
        }
        if (discountType && !discountType.trim()) {
            return res.status(400).json({ success: false, message: 'Discount Type is required' });
        }
        if (discount !== undefined && (isNaN(discount) || discount < 0)) {
            return res.status(400).json({ success: false, message: 'Discount must be a valid number' });
        }
        if (description && !description.trim()) {
            return res.status(400).json({ success: false, message: 'Description is required' });
        }
        if (expiryDate && new Date(expiryDate) < Date.now()) {
            return res.status(400).json({ success: false, message: 'Expiry Date must be in the future' });
        }


        const updatedCoupon = await couponSchema.findOneAndUpdate({ _id: couponId }, { $set: req.body }, { new: true })
        if (!updatedCoupon) {
            return res.status(400).json({ success: false, message: 'Failed to update coupon' });
        }

        res.status(200).json({ success: true, message: 'Coupon Updated Successfully', coupon: updatedCoupon });

    } catch (error) {
        console.log(`Error in editCoupon: ${error.message}`);
        res.status(500).json({ success: false, message: `Server error. You can report this issue: ${error.message}` });
    }
};



const deleteCoupon = async (req, res) => {
    const { couponId } = req.params
    try {
        const deleteCoupon = await couponSchema.deleteOne({ _id: couponId })
        if (!deleteCoupon) {
            return res.status(400).json({ success: false, message: 'Delete Not Compeleted' })
        }
        res.status(200).json({ success: true, message: 'Coupon Is Permenanly Deleted', couponId })
    } catch (error) {
        console.log(`Error in editCoupon: ${error.message}`);
        res.status(500).json({ success: false, message: `Server error. You can report this issue: ${error.message}` });
    }
}

module.exports = {
    addCoupon,
    updateBlockStatus,
    editCoupon,
    getAllCoupons,
    deleteCoupon
};
