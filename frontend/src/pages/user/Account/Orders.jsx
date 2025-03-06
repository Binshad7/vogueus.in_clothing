import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Truck, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getOrderItems, cancelOrder, cancelOrderItem, returnOrderItem, returnOrder } from "../../../store/middlewares/user/orders";
import ReturnModal from "./modal/ReturnModal";
import { RAZORPAY_KEY_ID } from "../../../constant/screte";
import userAxios from "../../../api/userAxios";
import { toast } from "react-toastify";
import { clearCartItems } from "../../../store/reducers/user/cart";
import { useNavigate } from "react-router-dom";


// Status Badge Component
const StatusBadge = ({ type, status }) => {
  const getStatusColor = (status, type) => {
    if (!status) return "bg-gray-100 text-gray-800";

    const statusColors = {
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      returned: "bg-orange-100 text-orange-800",
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      unpaid: "bg-red-100 text-red-800"
    };

    return statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(status, type)}`}>
      {type && `${type}: `}{status}
    </span>
  );
};

const ActionButton = ({ onClick, disabled, bgColor, hoverBgColor, disabledBgColor, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1 ${bgColor} rounded-md ${hoverBgColor} text-sm ${disabledBgColor} transition-colors duration-200`}
  >
    {children}
  </button>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  // Calculate page range to display (show at most 5 page numbers)
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center mt-6 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 mx-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 mx-1 rounded-md border border-gray-300"
          >
            1
          </button>
          {startPage > 2 && <span className="mx-1">...</span>}
        </>
      )}

      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 mx-1 rounded-md ${currentPage === number
            ? "bg-blue-600 text-white"
            : "border border-gray-300"
            }`}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="mx-1">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 mx-1 rounded-md border border-gray-300"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 mx-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const Orders = () => {
  // State Management
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [userOrders, setUserOrders] = useState([]);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancellingItem, setCancellingItem] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnMessage, setReturnMessage] = useState("");
  const [selectedItemForReturn, setSelectedItemForReturn] = useState(null);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [returnAOrder, setReturnOrder] = useState();
  const [processingPayment, setProcessingPayment] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  // Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderes, loading } = useSelector((state) => state.userOrders);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user?._id) {
      dispatch(getOrderItems(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (orderes?.length > 0) {
      setUserOrders(
        selectedFilter === "all"
          ? orderes
          : orderes.filter(item => item.orderStatus.toLowerCase() === selectedFilter)
      );
      setCurrentPage(1); // Reset to first page when filter changes
    } else {
      setUserOrders([]);
    }
  }, [selectedFilter, orderes]);




  const handleRazorpayPayment = async (order) => {

    const orders = await userAxios.get(`/order/repayment/${order?._id}`);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onerror = () => {
      reject(new Error("Failed to load Razorpay"));
    };

    script.onload = () => {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order?.totalAmount * 100,
        currency: "INR",
        name: "VOGUEUS",
        description: "Payment for Order",
        order_id: orders?.data?.orderId,
        handler: async (response) => {
          try {
            await userAxios.patch(`/orders/orderPaymentStatus/${order?._id}`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            dispatch(clearCartItems());
            dispatch(getOrderItems(user._id));
            navigate(`/orderSuccess/${order?._id}`);
          } catch (error) {
            console.log(error.message)
            toast.error('Payment Faild Try Again')
            // await userAxios.patch(`/orders/orderPaymentFaild/${_id}`);
          }
        },
        prefill: {
          name: order?.fullName,
          email: order?.email[0],
          contact: order?.mobileNumber,
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          escape: false,
          ondismiss: async () => {
            await userAxios.patch(`/orders/orderPaymentFaild/${order?._id}`);
            toast.error('Order Is Canceld')
            setTimeout(() => {
              navigate('/account-details/orders')
            }, 500)
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    };

    document.body.appendChild(script);
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleOrderCancel = async (orderId) => {
    setCancellingOrder(orderId);

    const result = await dispatch(cancelOrder(orderId));
    if (cancelOrder.fulfilled.match(result) || cancelOrder.rejected.match(result)) {
      setCancellingOrder(null);
    }
  };

  const handleItemCancel = async (orderId, itemId) => {
    setCancellingItem(itemId);
    const result = await dispatch(cancelOrderItem({ orderId, itemId }));
    if (setCancellingItem.fulfilled.match(result)) {
      setCancellingItem(null);
    }
  };

  const handleReturnRequest = async () => {
    if (selectedItemForReturn && selectedOrderForReturn && returnMessage) {
      try {
        const updateDetails = {
          returnMessage,
          itemId: selectedItemForReturn?.ItemId
        };
        await dispatch(returnOrderItem({
          orderId: selectedOrderForReturn,
          updateDetails
        }));
        closeModal();
      } catch (error) {
        console.error("Error submitting return request:", error);
      }
    }
  };

  // Function to handle repayment for orders with pending payment
  const handleRepayment = async (orderId) => {
    setProcessingPayment(orderId);
    setTimeout(() => {
      setProcessingPayment(null)
    }, 1000)
  };

  const closeModal = () => {
    setShowReturnModal(false);
    setReturnMessage("");
    setSelectedItemForReturn(null);
    setSelectedOrderForReturn(null);
    setReturnOrder(null);
  };

  const returnOrderOpenModal = (orderId) => {
    setShowReturnModal(true);
    setReturnOrder(orderId);
  };

  const returnOrderConfirm = () => {
    dispatch(returnOrder({ orderId: returnAOrder, returnMessage }));
    setShowReturnModal(false);
  };

  // Updated order actions to only show cancel button for processing status
  const getOrderActions = (order) => {
    const orderStatus = order.orderStatus.toLowerCase();
    const paymentStatus = order.paymentStatus.toLowerCase();
    const paymentMethod = order.paymentMethod.toLowerCase();
    const returnRequest = order.items.some((item) => item.itemStatus === 'delivered' && item.returnRequest.requestStatus);

    return {
      canCancel: orderStatus === 'processing',
      canReturn: orderStatus === 'delivered' && order.items[0].itemStatus === 'delivered' && !returnRequest,
      canReorder: ['delivered', 'cancelled', 'returned'].includes(orderStatus),
      canTrack: ['shipped'].includes(orderStatus),
      canRequestRefund: paymentStatus === 'paid' && ['cancelled', 'returned'].includes(orderStatus),
      // Add condition for Razorpay repayment button
      canRepay: paymentStatus === 'pending' && paymentMethod === 'razorpay'
    };
  };

  // Updated item actions to only show cancel button for processing status
  const getItemActions = (order, item) => {
    if (!item) return {};

    const orderStatus = order.orderStatus.toLowerCase();
    const itemStatus = item.itemStatus.toLowerCase();

    return {
      canCancel: itemStatus === 'processing', // Only show cancel for processing status
      canReturn: itemStatus === 'delivered' && orderStatus === 'delivered' && !item?.returnRequest?.requestStatus,
    };
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = userOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(userOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Close any expanded order details when changing pages
    setSelectedOrder("");
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {showReturnModal && (
        <ReturnModal
          returnOrderId={returnAOrder}
          returnOrder={returnOrderConfirm}
          value={returnMessage}
          handleOnChangeReturnMsg={(e) => setReturnMessage(e)}
          handleReturnRequest={handleReturnRequest}
          closeModal={closeModal}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="border rounded-md px-3 py-2 bg-white"
        >
          <option value="all">All Orders</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : userOrders.length > 0 ? (
        <>
          {currentOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Order #{order.orderId}</h2>
                    <div className="flex gap-4 mt-1">
                      <StatusBadge type="Payment" status={order.paymentStatus} />
                      <StatusBadge type="Order" status={order.orderStatus} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Payment Method: {order.paymentMethod.toUpperCase()}
                    </p>
                    <p className="font-semibold mt-1">₹{order.totalAmount}</p>

                    <div className="flex gap-2 mt-2 justify-end">

                      {/* repayment and cacled button  */}
                      {
                        order.orderStatus === 'processing' && order.paymentMethod === 'razorpay' && order.paymentStatus === 'pending' ?
                          <ActionButton
                            onClick={() => handleRazorpayPayment(order)}
                            disabled={processingPayment === order._id}
                            bgColor="bg-green-100 text-green-600"
                            hoverBgColor="hover:bg-green-200"
                            disabledBgColor="disabled:bg-green-50 disabled:text-green-300"
                          >
                            {processingPayment === order._id ? "Processing..." : "Pay Now"}
                          </ActionButton>
                          :
                          getOrderActions(order).canCancel && (
                            <ActionButton
                              onClick={() => handleOrderCancel(order._id)}
                              disabled={cancellingOrder === order._id}
                              bgColor="bg-red-100 text-red-600"
                              hoverBgColor="hover:bg-red-200"
                              disabledBgColor="disabled:bg-red-50 disabled:text-red-300"
                            >
                              {cancellingOrder === order._id ? "Cancelling..." : "Cancel Order"}
                            </ActionButton>
                          )

                      }

                      {getOrderActions(order).canReturn && (
                        <ActionButton
                          onClick={() => returnOrderOpenModal(order._id)}
                          bgColor="bg-red-100 text-red-600"
                          hoverBgColor="hover:bg-red-200"
                        >
                          Return Order
                        </ActionButton>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Ordered on {formatDate(order.orderedAt)}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedOrder(selectedOrder === order._id ? "" : order._id)}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {selectedOrder === order._id ? (
                    <>Hide Details <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>View Details <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>

                {selectedOrder === order._id && (
                  <div className="mt-4 border-t pt-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4 mb-4 border-b pb-4 last:border-b-0">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{item.productName}</h3>
                            <div className="flex gap-2">
                              {
                                order.orderStatus === 'processing' && order.paymentMethod === 'razorpay' && order.paymentStatus === 'pending' ? '' :

                                  getItemActions(order, item).canCancel && (
                                    <ActionButton
                                      onClick={() => handleItemCancel(order._id, item.ItemId)}
                                      disabled={cancellingItem === item.ItemId}
                                      bgColor="bg-red-100 text-red-600"
                                      hoverBgColor="hover:bg-red-200"
                                      disabledBgColor="disabled:bg-red-50 disabled:text-red-300"
                                    >
                                      {cancellingItem === item.ItemId ? "Cancelling..." : "Cancel Item"}
                                    </ActionButton>
                                  )}
                              {getItemActions(order, item).canReturn && (
                                <ActionButton
                                  onClick={() => {
                                    setSelectedItemForReturn(item);
                                    setSelectedOrderForReturn(order._id);
                                    setShowReturnModal(true);
                                    setReturnMessage('');
                                  }}
                                  bgColor="bg-orange-100 text-orange-600"
                                  hoverBgColor="hover:bg-orange-200"
                                >
                                  Return Item
                                </ActionButton>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="text-sm text-gray-500">
                              <p>Size: {item.size}</p>
                              <p>Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                              <p>Price: ₹{item.productPrice}</p>
                              <StatusBadge type="Status" status={item.itemStatus} />
                            </div>
                          </div>
                          {item.returnRequest?.requestStatus && (
                            <div className="mt-2">
                              <StatusBadge
                                type="Return Status"
                                status={item.returnRequest.adminStatus}
                              />
                              {item.returnRequest.requestMessage && (
                                <p className="text-sm text-gray-500 mt-1">
                                  Reason: {item.returnRequest.requestMessage}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-8">No orders found</div>
      )}

      {/* Display page info */}
      {userOrders.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, userOrders.length)} of {userOrders.length} orders
        </div>
      )}
    </div>
  );
};

export default Orders;