import React, { useEffect, useState } from "react";
import { Check, Package, Printer, Home } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "./Spinner";
import { getOrderItems } from "../../store/middlewares/user/orders";

const OrderSuccessPage = () => {
    const { orderId } = useParams()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orderes, loading } = useSelector((state) => state.userOrders);
    const { user } = useSelector((state) => state.user);
    const [lastOrder, setLastOrder] = useState(null);

    useEffect(() => {
        dispatch(getOrderItems(user._id));
    }, [dispatch, user._id, orderId]);

    useEffect(() => {
        if (orderes.length !== 0) {
            let lastOrderItem = orderes.find(item => item._id.toString() == orderId);

            setLastOrder(lastOrderItem);
        } else {
            navigate("/");
        }
    }, [orderes, navigate, orderId]);

    if (loading || !lastOrder) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Success Message */}
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                        <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Thank you for your order!
                    </h1>
                    <p className="text-lg text-gray-600">
                        We've received your order and will notify you once it ships.
                    </p>
                </div>

                {/* Order Details Box */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-500">Order Number</p>
                            <p className="font-medium">{lastOrder.orderId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="font-medium">
                                {new Date(lastOrder.orderedAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-medium">${lastOrder.totalAmount}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <p className="font-medium capitalize">{lastOrder.paymentMethod}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Order Status</p>
                            <p className="font-medium capitalize">{lastOrder.orderStatus}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-gray-200 pt-4">
                        <h2 className="text-lg font-medium mb-4">Order Items</h2>
                        {lastOrder.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between py-4 border-b border-gray-200"
                            >
                                {/* Product Image (Replace with actual image URL) */}
                                <img
                                    src={item.productImage || "https://via.placeholder.com/80"}
                                    alt="Product"
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                                <div className="flex flex-col">
                                    <p className="font-medium">Size: {item.size}</p>
                                    <p className="text-sm text-gray-500">
                                        Quantity: {item.quantity}
                                    </p>
                                </div>
                                <p className="font-medium">₹{item.productPrice}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/account-details/orders')}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                        <Package className="h-5 w-5 mr-2" />
                        Track Order
                    </button>
                    <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Printer className="h-5 w-5 mr-2" />
                        Print Receipt
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Home className="h-5 w-5 mr-2" />
                        Continue Shopping
                    </button>
                </div>

                {/* Shipping Updates Note */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>
                        We'll send shipping updates to your email address.
                        <br />
                        You can also track your order status in your account.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
