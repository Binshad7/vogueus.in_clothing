import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const OrderSummary = ({ items, onApplyCoupon, orderSummary }) => {
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [isApplying, setIsApplying] = useState(false);

    const handleCouponCodeApplay = () => {
        setIsApplying(true)
        onApplyCoupon(couponCode)
        console.log(couponCode)
        setTimeout(() => {
            setIsApplying(false)
        }, 2000)
    }
    const handleApplyCoupon = () => {
        setIsApplying(true);
        setCouponError('');
        // onApplyCoupon(couponCode)
        // Simulate coupon validation
        setTimeout(() => {
            // Mock coupon validation logic
            if (couponCode.toLowerCase() === 'save10') {
                setAppliedCoupon({
                    code: couponCode,
                    discount: 100,
                    type: 'Fixed'
                });
                setCouponCode('');
            } else {
                setCouponError('Invalid coupon code');
            }
            setIsApplying(false);
        }, 800);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponError('');
    };

    return (
        <div className="bg-white rounded-lg shadow">
            {/* Header */}
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
            </div>

            {/* Order Items */}
            <div className="p-4 border-b">
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item?.itemDetails?.cartItemsId} className="flex space-x-4">
                            <img
                                src={item?.productDetails?.image}
                                alt={item?.productDetails?.productName}
                                className="w-20 h-20 rounded-md object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-800">{item?.productDetails?.productName}</h3>
                                <div className="mt-1 text-sm text-gray-500">
                                    <span>Size: {item?.itemDetails?.size}</span>
                                </div>
                                <div className="mt-1 flex justify-between">
                                    <span className="text-sm text-gray-500">Qty: {item?.itemDetails?.quantity}</span>
                                    <span className="font-medium">₹   {(
                                        (item.productDetails.currentPrice > 0
                                            ? item.productDetails.currentPrice
                                            : item.productDetails.regularPrice) * item.itemDetails.quantity
                                    ).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coupon Section */}
            <div className="p-4 border-b">
                {!appliedCoupon ? (
                    <div className="space-y-2">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Enter coupon code"
                                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleCouponCodeApplay}
                                disabled={!couponCode || isApplying}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors
                  ${!couponCode || isApplying
                                        ? 'bg-gray-100 text-gray-400'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {isApplying ? 'Applying...' : 'Apply'}
                            </button>
                        </div>
                        {couponError && (
                            <p className="text-sm text-red-500">{couponError}</p>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-2" />
                            <div>
                                <p className="font-medium text-gray-800">
                                    Coupon Applied: {appliedCoupon.code}
                                </p>
                                <p className="text-sm text-gray-600">
                                    You saved ₹{appliedCoupon.discount}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={removeCoupon}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Price Breakdown */}
            <div className="p-4 space-y-3 border-b">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{orderSummary?.subTotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₹{orderSummary?.shipping}</span>
                </div>
                <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- ₹{orderSummary.Discount}</span>
                </div>
                {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                        <span>Coupon Discount ({appliedCoupon.code})</span>
                        <span>- ₹{appliedCoupon.discount}</span>
                    </div>
                )}
            </div>

            {/* Total */}
            <div className="p-4 bg-gray-50 rounded-b-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-lg font-semibold text-gray-800">Total</span>
                    </div>
                    <span className="text-xl font-semibold text-gray-800">
                        ₹{orderSummary?.Total?.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Estimated Delivery */}
            <div className="p-4 border-t">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estimated Delivery</span>
                    <span className="font-medium text-gray-800">3-5 Business Days</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;