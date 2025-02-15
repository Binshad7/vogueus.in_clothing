const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    PORT: process.env.PORT||2001,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL: process.env.EMAIL,
    NODE_ENV : process.env.NODE_ENV,
    FRONTEND_URL:process.env.FRONTEND_URL,
    SECOND_FRONTEND_URL:process.env.SECOND_FRONTEND_URL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    SECRET:process.env.SECRET,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY :process.env.CLOUDINARY_API_KEY,
    RAZORPAY_KEY_ID :process.env.RAZORPAY_KEY_ID,
    RAZORPAY_SCRETE :process.env.RAZORPAY_SCRETE,
}

/* 
if (paymentMethod === 'razorpay') {
            const razorpayOrder = await razorpay.orders.create({
                amount: totalAmount * 100, // Convert to paise (Razorpay expects amount in paise)
                currency: "INR",
                receipt: `order_${Date.now()}`, // Unique identifier
                payment_capture: 1, // Auto-capture
            });

            if (!razorpayOrder.id) {
                return res.status(400).json({ success: false, message: "Failed to create Razorpay order" });
            }
            
            return res.status(201).json({
                success: true,
                message: "Razorpay order created",
                orderId: razorpayOrder.id, // Send Razorpay Order ID to frontend
                amount: totalAmount
            });
        }
*/