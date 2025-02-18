import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { toast } from 'react-toastify';

const OrderSummary = ({ items, onApplyCoupon, orderSummary }) => {
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState('');

    const handleApplyCoupon = async () => {

        if (!couponCode.trim()) {
            setError('Please enter a coupon code');
            return;
        }

        try {
            setIsApplying(true);
            setError('');

            const couponResult = await onApplyCoupon(couponCode.trim());

            if (couponResult.status) {
                setAppliedCoupon(couponResult);
                setCouponCode('');
                toast.success('Coupon applied successfully!');
            } else {
                toast.error(couponResult.message)
            }
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        } finally {
            setIsApplying(false);
        }
    };

    const removeCoupon = async () => {
        try {
            await onApplyCoupon('');
            setAppliedCoupon(null);
            setError('');
            toast.success('Coupon removed successfully');
        } catch (error) {
            toast.error('Failed to remove coupon');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
            </div>

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
                                <h3 className="font-medium text-gray-800">
                                    {item?.productDetails?.productName}
                                </h3>
                                <div className="mt-1 text-sm text-gray-500">
                                    <span>Size: {item?.itemDetails?.size}</span>
                                </div>
                                <div className="mt-1 flex justify-between">
                                    <span className="text-sm text-gray-500">
                                        Qty: {item?.itemDetails?.quantity}
                                    </span>
                                    <span className="font-medium">
                                        ₹{(
                                            (item.productDetails.currentPrice > 0
                                                ? item.productDetails.currentPrice
                                                : item.productDetails.regularPrice) *
                                            item.itemDetails.quantity
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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
                                onClick={handleApplyCoupon}
                                disabled={!couponCode.trim() || isApplying}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors
                                    ${!couponCode.trim() || isApplying
                                        ? 'bg-gray-100 text-gray-400'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {isApplying ? 'Applying...' : 'Apply'}
                            </button>
                        </div>
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
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

            <div className="p-4 space-y-3 border-b">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{orderSummary?.subTotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₹{orderSummary?.shipping}</span>
                </div>
                {orderSummary?.couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                        <span>Coupon Discount</span>
                        <span>- ₹{orderSummary?.couponDiscount}</span>
                    </div>
                )}
            </div>

            <div className="p-4 bg-gray-50 rounded-b-lg">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-xl font-semibold text-gray-800">
                        ₹{orderSummary?.Total?.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="p-4 border-t">
                <div className="text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                        <span>Estimated Delivery</span>
                        <span className="font-medium text-gray-800">3-5 Business Days</span>
                    </div>
                    {orderSummary?.shipping > 0 && (
                        <p className="mt-2 text-xs">
                            Free shipping on orders above ₹500
                        </p>
                    )}
                </div>
            </div>

            {/* Additional Info Section */}
            <div className="p-4 border-t bg-gray-50">
                <div className="text-xs text-gray-500 space-y-2">
                    <p>• Prices and delivery charges are inclusive of taxes</p>
                    <p>• Order confirmation will be sent to your registered email</p>
                    {appliedCoupon && (
                        <p>• Coupon discount will be applied to the final amount</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;