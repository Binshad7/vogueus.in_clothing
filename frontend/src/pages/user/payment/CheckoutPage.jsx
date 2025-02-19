import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Address from "../../../components/user/payment/AddressSession/Address";
import PaymentOptions from "../../../components/user/payment/payment/PaymentOptions";
import OrderSummary from "../../../components/user/payment/orderSummary/OrderSummary";
import Spinner from "../../../components/user/Spinner";
import { GetCart } from "../../../store/middlewares/user/cart";
import { createNewOreder } from "../../../store/reducers/user/userOrders";
import { clearCartItems } from "../../../store/reducers/user/cart";
import { getWallete } from "../../../store/middlewares/user/wallete";
import userAxios from "../../../api/userAxios";
import { RAZORPAY_KEY_ID } from "../../../constant/screte";

function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cart } = useSelector((state) => state.Cart);
    const user = useSelector((state) => state.user.user);
    const { userWallete, loading } = useSelector((state) => state.userWalleteDetails);

    const [selectedAddress, setSelectedAddress] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCouponDetails, setAppliedCouponDetails] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);

    const orderSummary = useMemo(() => {
        if (!cart || cart.length === 0) {
            return {
                subTotal: 0,
                shipping: 0,
                couponDiscount: 0,
                Total: 0,
            };
        }

        const subtotal = cart.reduce((total, item) => {
            const price = item.productDetails.currentPrice > 0
                ? item.productDetails.currentPrice
                : item.productDetails.regularPrice;
            return total + (price * item.itemDetails.quantity);
        }, 0);

        const shipping = cart.reduce((total, item) => {
            const price = item.productDetails.currentPrice > 0
                ? item.productDetails.currentPrice
                : item.productDetails.regularPrice;
            return total + (price > 500 ? 0 : 10);
        }, 0);

        return {
            subTotal: subtotal,
            shipping,
            couponDiscount,
            Total: subtotal + shipping - couponDiscount,
        };
    }, [cart, couponDiscount]);

    const handleApplyCoupon = async (couponCode) => {
        try {
            if (!couponCode) {
                setCouponDiscount(0);
                setAppliedCouponDetails(null);
                return null;
            }

            const response = await userAxios.post('/coupon/validate_coupon', {
                couponCode,
                cartTotal: orderSummary.subTotal
            });

            if (response.data.coupon) {
                const discount = response.data.coupon.discount;
                setCouponDiscount(discount);
                const couponDetails = {
                    status: true,
                    couponId: response?.data?.coupon?.couponId,
                    code: couponCode,
                    discount: discount,
                    coupon: response.data.coupon,
                    message: 'Coupon Applied Successfully'
                };
                setAppliedCouponDetails(couponDetails);
                return couponDetails;
            }

            return {
                status: false,
                message: response.data.message
            };
        } catch (error) {
            setCouponDiscount(0);
            setAppliedCouponDetails(null);
            throw new Error(error.response?.data?.message || 'Failed to apply coupon');
        }
    };

    const handleRazorpayPayment = useCallback(async (orderData) => {
        const {
            totalAmount,
            orderId,
            _id,
            fullName,
            mobileNumber,
            email
        } = orderData;

        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";

            script.onerror = () => {
                reject(new Error("Failed to load Razorpay"));
            };

            script.onload = () => {
                const options = {
                    key: RAZORPAY_KEY_ID,
                    amount: (totalAmount - couponDiscount) * 100,
                    currency: "INR",
                    name: "VOGUEUS",
                    description: "Payment for Order",
                    order_id: orderId,
                    handler: async (response) => {
                        try {
                            await userAxios.patch(`/orders/orderPaymentStatus/${_id}`, {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature
                            });

                            dispatch(createNewOreder(orderData));
                            dispatch(clearCartItems());
                            resolve({ success: true, orderId: _id });
                        } catch (error) {
                            await userAxios.patch(`/orders/orderPaymentFaild/${_id}`);
                            reject(new Error("Payment verification failed"));
                        }
                    },
                    prefill: {
                        name: fullName,
                        email: email[0],
                        contact: mobileNumber,
                    },
                    theme: {
                        color: "#F37254",
                    },
                    modal: {
                        escape: false,
                        ondismiss: async () => {
                            await userAxios.patch(`/orders/orderPaymentFaild/${_id}`);
                            reject(new Error("Payment cancelled"));
                        },
                    },
                };

                const razorpayInstance = new window.Razorpay(options);
                razorpayInstance.open();
            };

            document.body.appendChild(script);
        });
    }, [dispatch, couponDiscount]);

    const handleOrderConfirm = useCallback(async () => {
        if (!user?._id) {
            toast.error("Please log in to continue");
            return;
        }

        if (selectedPayment === "wallet" && orderSummary.Total > userWallete.balance) {
            toast.error("Insufficient Wallet Balance");
            return;
        }

        if (processingPayment) {
            return;
        }

        setProcessingPayment(true);

        try {
            const response = await userAxios.post(`/neworder/${user._id}`, {
                paymentMethod: selectedPayment,
                selectedAddressIndex: selectedAddress,
                appliedCoupon: appliedCouponDetails?.couponId
            });

            const orderItem = JSON.parse(response.data.orderItems);
            dispatch(createNewOreder(orderItem));
            if (selectedPayment === "razorpay") {
                try {
                    const result = await handleRazorpayPayment({
                        totalAmount: orderItem.totalAmount,
                        orderId: response.data.orderId,
                        _id: orderItem._id,
                        fullName: orderItem.fullName,
                        mobileNumber: orderItem.mobileNumber,
                        email: orderItem.email
                    });

                    if (result.success) {
                        toast.success("Payment Successful!");
                        navigate(`/orderSuccess/${result.orderId}`);
                    }
                } catch (error) {
                    toast.error(error.message);
                }
            } else {
                dispatch(createNewOreder(orderItem));
                dispatch(clearCartItems());
                toast.success(response?.data?.message);
                navigate(`/orderSuccess/${orderItem._id}`);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Order creation failed");
        } finally {
            setProcessingPayment(false);
        }
    }, [
        user?._id,
        selectedPayment,
        selectedAddress,
        orderSummary.Total,
        userWallete.balance,
        appliedCouponDetails,
        processingPayment,
        handleRazorpayPayment,
        dispatch,
        navigate
    ]);

    useEffect(() => {
        if (!user?._id) return;

        dispatch(getWallete(user._id));
        dispatch(GetCart());

        if (cart.length === 0) {
            navigate("/");
        }
    }, [dispatch, navigate, user?._id, cart.length]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Address
                            addresses={user.address}
                            selectedAddress={selectedAddress}
                            onAddressSelect={setSelectedAddress}
                        />
                        <PaymentOptions
                            walleteBalanceAmount={userWallete.balance}
                            selectedPayment={selectedPayment}
                            onPaymentSelect={setSelectedPayment}
                            handleOrderConfirm={handleOrderConfirm}
                            disabled={processingPayment}
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
    );
}

export default React.memo(CheckoutPage);