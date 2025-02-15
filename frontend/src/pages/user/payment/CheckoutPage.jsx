// CheckoutPage.jsx
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

    const [lastOrder, setLastOrder] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [applyCoupon, setAppliedCoupon] = useState("");

    // Memoized order summary calculation
    const orderSummary = useMemo(() => {
        if (!cart || cart.length === 0) {
            return {
                subTotal: 0,
                shipping: 0,
                Discount: 0,
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

        const discount = applyCoupon?.trim() === "b1nshad" && subtotal + shipping > 1000 ? 250 : 0;

        return {
            subTotal: subtotal,
            shipping,
            Discount: discount,
            Total: subtotal + shipping - discount,
        };
    }, [cart, applyCoupon]);

    const handleApplyCoupon = useCallback((coupon) => {
        setAppliedCoupon(coupon);
        if (coupon.trim() === "b1nshad") {
            toast.success("Coupon applied!");
        }
    }, []);

    const loadRazorpayScript = useCallback(() => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }, []);

    const handleRazorpayPayment = useCallback(async (totalAmount, orderId, _id, fullName, mobileNumber, email) => {
        const razorpayLoaded = await loadRazorpayScript();
        
        if (!razorpayLoaded) {
            toast.error("Failed to load Razorpay. Please try again.");
            return;
        }

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: totalAmount * 100,
            currency: "INR",
            name: "VOGUEUS",
            description: "Test Transaction",
            order_id: orderId,
            handler: async (response) => {
                try {
                    // First save order to Redux
                    dispatch(createNewOreder(lastOrder));
                    
                    // Then update payment status
                    await userAxios.patch(`/orders/orderPaymentStatus/${_id}`);
                    
                    // Clear cart after successful payment
                    dispatch(clearCartItems());
                    
                    toast.success("✅ Payment Successful!");
                    
                    // Navigate after all operations are complete
                    navigate(`/orderSuccess/${_id}`);
                } catch (error) {
                    toast.error("Payment verification failed!");
                    await userAxios.patch(`/orders/orderPaymentFaild/${_id}`);
                }
            },
            prefill: {
                name: fullName,
                email: mobileNumber,
                contact: email,
            },
            theme: {
                color: "#F37254",
            },
            modal: {
                escape: false,
                ondismiss: async () => {
                    await userAxios.patch(`/orders/orderPaymentFaild/${_id}`);
                    toast.error("Payment was not completed. Order is cancelled!");
                },
            },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
    }, [dispatch, navigate, lastOrder, loadRazorpayScript]);

    const handleOrderConfirm = useCallback(async () => {
        if (!user?._id) {
            toast.error("Please log in to continue");
            return;
        }

        if (selectedPayment === "wallet" && orderSummary.Total > userWallete.balance) {
            toast.error("Insufficient Wallet Balance");
            return;
        }

        try {
            const response = await userAxios.post(`/neworder/${user._id}`, {
                paymentMethod: selectedPayment,
                selectedAddressIndex: selectedAddress,
            });

            let orderItem = JSON.parse(response.data.orderItems);

            if (selectedPayment === "razorpay") {
                setLastOrder(orderItem);
                handleRazorpayPayment(
                    orderItem?.totalAmount,
                    response?.data?.orderId,
                    orderItem?._id,
                    orderItem?.fullName,
                    orderItem?.mobileNumber,
                    orderItem?.email[0]
                );
                return;
            }

            // For non-Razorpay payments
            dispatch(createNewOreder(orderItem));
            dispatch(clearCartItems());
            toast.success(response?.data?.message);
            navigate(`/orderSuccess/${orderItem._id}`);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Order creation failed");
        }
    }, [selectedPayment, orderSummary.Total, userWallete.balance, user?._id, selectedAddress, handleRazorpayPayment, dispatch, navigate]);

    useEffect(() => {
        if (!user?._id) return;
        
        dispatch(getWallete(user._id));
        dispatch(GetCart());
        
        if (cart.length === 0) {
            navigate("/");
        }
    }, [dispatch, navigate, user?._id]);

    if (loading) {
        return <Spinner />;
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
                            walleteBalanceAMout={userWallete.balance}
                            selectedPayment={selectedPayment}
                            onPaymentSelect={setSelectedPayment}
                            handleOrderConfirm={handleOrderConfirm}
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
