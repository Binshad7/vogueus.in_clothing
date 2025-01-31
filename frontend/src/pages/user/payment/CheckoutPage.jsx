import React, { useEffect, useMemo, useState } from 'react'
import Address from '../../../components/user/payment/AddressSession/Address'
import PaymentOptions from '../../../components/user/payment/payment/PaymentOptions';
import { useSelector, useDispatch } from 'react-redux'
import OrderSummary from '../../../components/user/payment/orderSummary/OrderSummary';
import { GetCart } from '../../../store/middlewares/user/cart';
import Spinner from '../../../components/user/Spinner';
function CheckoutPage() {

    const { cart, loading } = useSelector((state) => state.Cart);
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.user);
    const [selectedAddress, setSelectedAddress] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [applyCoupon, setAppliedCoupon] = useState('');
    const [orderSummary, setOrderSummary] = useState({
        subTotal: 0,
        shipping: 0,
        Discount: 0,
        Total: 0
    });
    useEffect(() => {
        dispatch(GetCart())
    }, [dispatch])
    const calculateOrderSummary = () => {
        let subtotal = 0;
        let shipping = 0;
        let Discount = 0
        cart.forEach((item) => {
            const price =
                item.productDetails.currentPrice > 0
                    ? item.productDetails.currentPrice
                    : item.productDetails.regularPrice;

            subtotal += price * item.itemDetails.quantity;
            shipping += price > 500 ? 0 : 5;
        });
        Discount = applyCoupon?.trim() == 'b1nshad' && (subtotal + shipping) > 1000 ? 250 : 0;
        setOrderSummary({
            subtotal,
            shipping,
            Discount,
            total: (subtotal + shipping) - Discount
        });
    };
    const handleApplyCoupon = useMemo((coupon) => {
        setAppliedCoupon(coupon);
        calculateOrderSummary()
    }, [applyCoupon])

    if (loading) {
        return <Spinner />
    }
    return (
        <div className="min-h-screen bg-gray-100 py-8 relative">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Address
                            addresses={user.address}
                            selectedAddress={selectedAddress}
                            onAddressSelect={setSelectedAddress}
                        />
                        <PaymentOptions
                            selectedPayment={selectedPayment}
                            onPaymentSelect={setSelectedPayment}
                        />
                    </div>
                    <div>
                        <OrderSummary
                            items={cart}
                            onApplyCoupon={handleApplyCoupon}
                            orderSummary={orderSummary}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage
