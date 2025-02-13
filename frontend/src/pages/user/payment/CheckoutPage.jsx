import React, { useEffect, useState } from "react";
import Address from "../../../components/user/payment/AddressSession/Address";
import PaymentOptions from "../../../components/user/payment/payment/PaymentOptions";
import { useSelector, useDispatch } from "react-redux";
import OrderSummary from "../../../components/user/payment/orderSummary/OrderSummary";
import { GetCart } from "../../../store/middlewares/user/cart";
import Spinner from "../../../components/user/Spinner";
import { toast } from "react-toastify";
import { createNewOreder } from "../../../store/reducers/user/userOrders";
import { clearCartItems } from "../../../store/reducers/user/cart";
import { useNavigate } from "react-router-dom";
import userAxios from "../../../api/userAxios";
import { getWallete } from "../../../store/middlewares/user/wallete";
import { RAZORPAY_KEY_ID } from "../../../constant/screte";

function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cart } = useSelector((state) => state.Cart);
    const user = useSelector((state) => state.user.user);
    const { userWallete, loading } = useSelector((state) => state.userWalleteDetails);

    useEffect(() => {
        dispatch(getWallete(user._id));
        if (cart.length === 0) {
            navigate("/");
        }
    }, []);

    const [selectedAddress, setSelectedAddress] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [applyCoupon, setAppliedCoupon] = useState("");
    const [orderSummary, setOrderSummary] = useState({
        subTotal: 0,
        shipping: 0,
        Discount: 0,
        Total: 0,
    });

    const calculateOrderSummary = () => {
        let subtotal = 0;
        let shipping = 0;
        let Discount = 0;
        cart.forEach((item) => {
            const price =
                item.productDetails.currentPrice > 0
                    ? item.productDetails.currentPrice
                    : item.productDetails.regularPrice;

            subtotal += price * item.itemDetails.quantity;
            shipping += price > 500 ? 0 : 10;
        });
        Discount = applyCoupon?.trim() === "b1nshad" && subtotal + shipping > 1000 ? 250 : 0;
        setOrderSummary({
            subTotal: subtotal,
            shipping: shipping,
            Discount: Discount,
            Total: subtotal + shipping - Discount,
        });
    };

    useEffect(() => {
        if (cart.length > 0) {
            calculateOrderSummary();
        }
    }, [cart, applyCoupon]);

    useEffect(() => {
        dispatch(GetCart());
    }, [dispatch]);

    useEffect(() => {
        calculateOrderSummary();
    }, [applyCoupon]);

    const handleApplyCoupon = (coupon) => {
        setAppliedCoupon(coupon);
        if (coupon.trim() !== "b1nshad") return;
        toast.success("Coupon applied!");
        calculateOrderSummary();
    };

    const loadRazorpayScript = async () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRazorpayPayment = async (totalAmount, orderId, _id, name, email, phone) => {
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
                console.log("Payment Successful", response);
                toast.success("✅ Payment Successful!");

                // API call to confirm payment
                try {
                    await userAxios.post(`/confirmPayment/${_id}`, response);
                    navigate(`/orderSuccess/${_id}`);
                } catch (error) {
                    toast.error("Payment verification failed!");
                }
            },
            prefill: {
                name: name,
                email: email,
                contact: phone,
            },
            theme: {
                color: "#F37254",
            },
            modal: {
                escape: false,
                ondismiss: () => {
                    console.log("Payment window closed!");
                    toast.error("Payment was not completed!");
                },
            },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
    };

    const handleOrderConfirm = async () => {
        if (selectedPayment === "wallet" && orderSummary.Total > userWallete.balance) {
            return toast.error("Insufficient Wallet Balance");
        }

        try {
            const response = await userAxios.post(`/neworder/${user._id}`, {
                paymentMethod: selectedPayment,
                selectedAddressIndex: selectedAddress,
            });

            let orderItem = JSON.parse(response.data.orderItems);
            if (selectedPayment === "razorpay") {
                console.log("Initiating Razorpay payment...");
                handleRazorpayPayment(
                    orderItem?.totalAmount,
                    orderItem?.orderId,
                    orderItem?._id,
                    orderItem?.fullName,
                    orderItem?.mobileNumber,
                    orderItem?.email[0]
                );
                return;
            }

            dispatch(clearCartItems());
            dispatch(createNewOreder(orderItem));
            toast.success(response?.data?.message);
            navigate(`/orderSuccess/${orderItem._id}`);
            return;
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

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
                        <OrderSummary items={cart} onApplyCoupon={handleApplyCoupon} orderSummary={orderSummary} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
