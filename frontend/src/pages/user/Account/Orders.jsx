import React, { useState, useEffect } from "react";
import { Calendar, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getOrderItems } from "../../../store/middlewares/user/orders";

const Orders = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [userOrders, setUserOrders] = useState([]);
  const dispatch = useDispatch();
  const { orderes, loading } = useSelector((state) => state.userOrders);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user?._id) {
      dispatch(getOrderItems(user._id));
    }
  }, [dispatch, user]);

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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "returned":
        return "bg-orange-100 text-orange-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="border rounded-md px-3 py-2 bg-white"
        >
          <option value="all">Filter Option</option>
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
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.orderId}</h2>
                  <div className="flex gap-4 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      Order: {order.orderStatus}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Payment Method: {order.paymentMethod.toUpperCase()}
                  </p>
                  <p className="font-semibold mt-1">₹{order.totalAmount}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Ordered on {formatDate(order.orderedAt)}
                </span>
              </div>

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
                        <h3 className="font-medium">{item.productName}</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="text-sm text-gray-500">
                            <p>Size: {item.size}</p>
                            <p>Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            <p>Price: ₹{item.productPrice}</p>
                            <p>Status: {item.itemStatus}</p>
                          </div>
                        </div>
                        {item.returnRequest && (
                          <div className="mt-2">
                            <span
                              className={`text-xs ${getStatusColor(
                                item.returnRequest.adminStatus
                              )}`}
                            >
                              Return Status: {item.returnRequest.adminStatus}
                            </span>
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
