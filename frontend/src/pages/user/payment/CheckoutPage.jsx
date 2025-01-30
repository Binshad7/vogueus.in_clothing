import React, { useState } from 'react'
import Address from '../../../components/user/payment/AddressSession/Address'
import { useSelector, useDispatch } from 'react-redux'
function CheckoutPage() {

    const user = useSelector((state) => state.user.user);
    const [selectedAddress, setSelectedAddress] = useState(0);
    
    return (
        <div className="min-h-screen bg-gray-100 py-8 relative">
            {/* <CouponPopup onApplyCoupon={handleApplyCoupon} /> */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Address
                            addresses={user.address}
                            selectedAddress={selectedAddress}
                            onAddressSelect={setSelectedAddress}
                        />
                        {/* <PaymentSection
                            selectedPayment={selectedPayment}
                            onPaymentSelect={setSelectedPayment}
                        /> */}
                    </div>
                    <div>
                        {/* <OrderSummary
                            items={orders}
                            onApplyCoupon={handleApplyCoupon}
                            handleCheckout={handleCheckout}
                            refreshData={fetchOrder}
                            onTotalChange={setTotal}
                            total={total}
                            couponAmt={couponAmt}
                            onCouponChange={setCouponAmt}
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage
