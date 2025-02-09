import React, { useState, useEffect } from "react";
import { Calendar, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getOrderItems, cancelOrder, cancelOrderItem, returnOrderItem, returnOrder } from "../../../store/middlewares/user/orders";
import ReturnModal from "./modal/ReturnModal";

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

// Action Button Component
const ActionButton = ({ onClick, disabled, bgColor, hoverBgColor, disabledBgColor, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1 ${bgColor} rounded-md ${hoverBgColor} text-sm ${disabledBgColor} transition-colors duration-200`}
  >
    {children}
  </button>
);

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

  // Redux
  const dispatch = useDispatch();
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
    } else {
      setUserOrders([]);
    }
  }, [selectedFilter, orderes]);

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
    console.log("itemss")
    console.log(cancelOrder.fulfilled.match(result));
    
    if (cancelOrder.fulfilled.match(result)) {
      setCancellingOrder(null);
      console.log('order updated')
    }
  };

  const handleItemCancel = async (orderId, itemId) => {
    setCancellingItem(itemId);
    await dispatch(cancelOrderItem({ orderId, itemId }));
    setCancellingItem(null);
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
    const returnRequest = order.items.some((item) => item.itemStatus === 'delivered' && item.returnRequest.requestStatus);
    
    return {
      canCancel: orderStatus === 'processing', // Only show cancel for processing status
      canReturn: orderStatus === 'delivered' && order.items[0].itemStatus === 'delivered' && !returnRequest,
      canReorder: ['delivered', 'cancelled', 'returned'].includes(orderStatus),
      canTrack: ['shipped'].includes(orderStatus),
      canRequestRefund: paymentStatus === 'paid' && ['cancelled', 'returned'].includes(orderStatus),
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
        userOrders.map((order) => (
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
                    {getOrderActions(order).canCancel && (
                      <ActionButton
                        onClick={() => handleOrderCancel(order._id)}
                        disabled={cancellingOrder === order._id}
                        bgColor="bg-red-100 text-red-600"
                        hoverBgColor="hover:bg-red-200"
                        disabledBgColor="disabled:bg-red-50 disabled:text-red-300"
                      >
                        {cancellingOrder === order._id ? "Cancelling..." : "Cancel Order"}
                      </ActionButton>
                    )}

                    {getOrderActions(order).canReturn && (
                      <ActionButton
                        onClick={() => returnOrderOpenModal(order._id)}
                        bgColor="bg-red-100 text-red-600"
                        hoverBgColor="hover:bg-purple-200"
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
                            {getItemActions(order, item).canCancel && (
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
        ))
      ) : (
        <div className="text-center py-8">No orders found</div>
      )}
    </div>
  );
};

export default Orders;