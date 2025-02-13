import React, { useEffect, useState, useRef } from "react";
import { Check, Package, Home, Download } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "./Spinner";
import { getOrderItems } from "../../store/middlewares/user/orders";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const OrderSuccessPage = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orderes, loading } = useSelector((state) => state.userOrders);
    const { user } = useSelector((state) => state.user);
    const [lastOrder, setLastOrder] = useState(null);
    const pdfRef = useRef();

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

    const generatePDF = async () => {
        if (pdfRef.current) {
            try {
                // Create a canvas from the component
                const canvas = await html2canvas(pdfRef.current, {
                    scale: 2, // Higher scale for better quality
                    logging: false,
                    useCORS: true // This is important for images,
                });

                // Calculate dimensions
                const imgWidth = 210; // A4 width in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                // Create PDF
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgData = canvas.toDataURL('image/png');

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save(`order-${lastOrder.orderId}.pdf`);
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        }
    };

    if (loading || !lastOrder) {
        return <Spinner />;
    }

    // Rest of the component remains the same...
    return (
       
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* PDF Content Container */}
                <div ref={pdfRef} className="bg-white p-8 rounded-lg shadow-sm mb-6">
                    {/* Company Logo/Header */}
                    <div className="text-center mb-8 border-b pb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Order Confirmation</h1>
                        <p className="text-gray-600 mt-1">Your order has been successfully placed</p>
                    </div>

                    {/* Success Message */}
                    <div className="text-center mb-8">
                        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
                            <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Thank you for your order!
                        </h2>
                        <p className="text-gray-600">
                            We've received your order and will notify you once it ships.
                        </p>
                    </div>

                    {/* Order Details */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
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
                                <p className="font-medium">₹{lastOrder.totalAmount}</p>
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
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {lastOrder.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-4 border-b border-gray-200"
                                >
                                    <img
                                        src={item.productImage || "https://via.placeholder.com/80"}
                                        alt="Product"
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                    <div className="flex-1 ml-4">
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

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-500 border-t pt-4">
                        <p>Thank you for shopping with us!</p>
                        <p>For any queries, please contact our support team.</p>
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
                    <button 
                        onClick={generatePDF}
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Download className="h-5 w-5 mr-2" />
                        Download PDF
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