import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllCoupons } from "../../../store/middlewares/admin/coupon";
const Coupons = () => {
    const [copied, setCopied] = useState(null);
    const dispatch = useDispatch()
    // Example coupons data
    //   const coupons = [
    //     { id: 1, code: "SAVE20", discount: "20% OFF", expiry: "2025-03-15" },
    //     { id: 2, code: "FREESHIP", discount: "Free Shipping", expiry: "2025-04-01" },
    //     { id: 3, code: "DISCOUNT50", discount: "₹50 OFF", expiry: "2025-05-10" },
    //   ];

    useEffect(() => {
        dispatch(getAllCoupons())
    }, [])
    const { coupons, loading } = useSelector(state => state.couponHandling)

    // Copy to clipboard function
    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 1500);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">🎟 Your Coupons</h1>

            <div className="space-y-6">
                {coupons.map((coupon) => (
                    <div
                        key={coupon.id}
                        className="relative bg-white bg-opacity-80 border border-gray-300 rounded-xl p-5 flex justify-between items-center shadow-md backdrop-blur-md transition hover:shadow-lg"
                    >
                        {/* Left Section */}
                        <div>
                            <span className="text-xs uppercase font-bold text-gray-600">Coupon Code</span>
                            <p className="text-xl font-bold text-gray-900">{coupon.couponCode}</p>
                            <span className="inline-block mt-1 px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-md">
                                {
                                    coupon.discountType === 'percentage' ? `${coupon.discount}%` : `₹  ${coupon.discount}`
                                }
                            </span>
                            <p className="text-sm text-gray-500 mt-2">Expires on: {formatDate(coupon.expiryDate)}</p>
                        </div>

                        {/* Right Section (Copy Button) */}

                        <button
                            className="relative bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                            onClick={() => handleCopy(coupon.couponCode)}
                        >
                            {copied === coupon.couponCode ? "Copied!" : "Copy Code"}
                        </button>

                        {/* Dotted Border on Right Side */}
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-16 bg-gray-200 rounded-l-full border-l border-gray-300"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Coupons;


