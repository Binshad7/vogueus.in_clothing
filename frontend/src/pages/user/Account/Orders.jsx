import React, { useState, useEffect } from "react";
import { Calendar, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getOrderItems, cancelOrder, cancelOrderItem } from "../../../store/middlewares/user/orders";
import userAxios from "../../../api/userAxios";

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

const Orders = () => {
  // State Management
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [userOrders, setUserOrders] = useState([]);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancellingItem, setCancellingItem] = useState(null);
  const [returningItem, setReturningItem] = useState(null);
  const [returnMessage, setReturnMessage] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedItemForReturn, setSelectedItemForReturn] = useState(null);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);

  // Redux
  const dispatch = useDispatch();
  const { orderes, loading } = useSelector((state) => state.userOrders);
  const { user } = useSelector((state) => state.user);

  // Initial Load
  useEffect(() => {
    if (user?._id) {
      dispatch(getOrderItems(user._id));
    }
  }, [dispatch, user]);

  // Filter Orders
  useEffect(() => {
    if (orderes && orderes.length > 0) {
      if (selectedFilter === "all") {
        setUserOrders(orderes);
      } else {
        const filteredOrders = orderes.filter(
          (item) => item.orderStatus.toLowerCase() === selectedFilter
        );
        setUserOrders(filteredOrders);
      }
    } else {
      setUserOrders([]);
    }
  }, [selectedFilter, orderes]);

  // Date Formatting
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Order Actions
  const handleOrderCancel = async (orderId) => {
    setCancellingOrder(orderId);
    const result = await dispatch(cancelOrder(orderId));
    if (cancelOrder.fulfilled.match(result)) {
      setCancellingOrder(null);
    }
  };

  const handleItemCancel = async (orderId, itemId) => {
    setCancellingItem(itemId);
    dispatch(cancelOrderItem({ orderId, itemId }));
  };

  const handleReturnRequest = async () => {
    if (selectedItemForReturn && selectedOrderForReturn && returnMessage) {
      try {
        // Add your return request API call here
        setShowReturnModal(false);
        setReturnMessage("");
        setSelectedItemForReturn(null);
        setSelectedOrderForReturn(null);
      } catch (error) {
        console.error("Error submitting return request:", error);
      }
    }
    setReturningItem(null);
  };

  // Condition Checks
  const canCancelOrder = (order) => {
    return ['processing', 'pending'].includes(order.orderStatus.toLowerCase());
  };

  const canCancelItem = (item) => {
    return ['processing', 'pending'].includes(item.itemStatus.toLowerCase());
  };

  const canReturnItem = (item, order) => {
    return (
      item.itemStatus.toLowerCase() === 'delivered' &&
      !item.returnRequest?.requestStatus &&
      order.orderStatus.toLowerCase() === 'delivered'
    );
  };

  // Return Modal Component
  const ReturnModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Submit Return Request</h3>
        <textarea
          value={returnMessage}
          onChange={(e) => setReturnMessage(e.target.value)}
          placeholder="Please provide a reason for return..."
          className="w-full h-32 border rounded-md p-2 mb-4 resize-none"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setShowReturnModal(false);
              setReturnMessage("");
              setSelectedItemForReturn(null);
              setSelectedOrderForReturn(null);
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleReturnRequest}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header and Filter */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="border rounded-md px-3 py-2 bg-white"
        >
          <option value="all">All</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : userOrders.length > 0 ? (
        userOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4"
          >
            <div className="p-6">
              {/* Order Header */}
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
                  {canCancelOrder(order) && (
                    <button
                      onClick={() => handleOrderCancel(order._id)}
                      disabled={cancellingOrder === order._id}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
                    >
                      {cancellingOrder === order._id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>

              {/* Order Date */}
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Ordered on {formatDate(order.orderedAt)}
                </span>
              </div>

              {/* Details Toggle Button */}
              <button
                onClick={() =>
                  setSelectedOrder(selectedOrder === order._id ? "" : order._id)
                }
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                {selectedOrder === order._id ? (
                  <>
                    Hide Details <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    View Details <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Order Items */}
              {selectedOrder === order._id && (
                <div className="mt-4 border-t pt-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 mb-4 border-b pb-4 last:border-b-0"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{item.productName}</h3>
                          <div className="flex gap-2">
                            {canCancelItem(item) && (
                              <button
                                onClick={() => handleItemCancel(order._id, item.ItemId)}
                                disabled={cancellingItem === item._id}
                                className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm disabled:bg-red-50 disabled:text-red-300"
                              >
                                {cancellingItem === item._id ? "Cancelling..." : "Cancel Item"}
                              </button>
                            )}
                            {canReturnItem(item, order) && (
                              <button
                                onClick={() => {
                                  setSelectedItemForReturn(item);
                                  setSelectedOrderForReturn(order._id);
                                  setShowReturnModal(true);
                                }}
                                className="px-3 py-1 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 text-sm"
                              >
                                Return Item
                              </button>
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
        ))
      ) : (
        <div className="text-center py-8">No orders found</div>
      )}

      {/* Return Modal */}
      {showReturnModal && <ReturnModal />}
    </div>
  );
};

export default Orders;