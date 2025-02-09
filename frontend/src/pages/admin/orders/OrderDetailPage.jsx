import React, { act, useEffect, useState } from "react";
import {
  Package,
  User,
  Info,
  AlertCircle,
  Home
} from 'lucide-react';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateOrderItemStatus, updateOrderStatus, itemStatusReturn } from "../../../store/middlewares/admin/admin_order_handle";
import Spinner from "../../../components/user/Spinner";

const StatusBadge = ({ status, type }) => {
  const statusColors = {
    processing: "bg-yellow-100 text-yellow-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    returned: "bg-red-100 text-red-800",
    return_requested: "bg-orange-100 text-orange-800",
    return_approved: "bg-green-100 text-green-800",
    return_rejected: "bg-red-100 text-red-800",
    pending: "bg-orange-100 text-orange-800",
    in_review: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    paid: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium 
      ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status}
    </span>
  );
};

const OrderDetails = () => {
  const { orders } = useSelector((state) => state.adminOrders);
  const { orderId } = useParams();
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReturnAction, setSelectedReturnAction] = useState({});
  const [isUpdatingAllItems, setIsUpdatingAllItems] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    if (orders.length == 0) navigate(-1);
    let currentItem = orders?.find((item) => item._id == orderId);
    setOrder(currentItem);
    setLoading(false);
  }, [orderId, orders]);


  const orderStatusUpdate = async (newStatus) => {
    dispatch(updateOrderStatus({ orderId, orderStatus: newStatus }))
  };

  const updateItemStatus = (itemId, newStatus) => {
    dispatch(updateOrderItemStatus({ itemId, orderId, newStatus }));
  };

  const updateReturnStatus = (item, action) => {
    dispatch(itemStatusReturn({ orderId, itemId: item._id, returnStatus: action }))
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Order Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Package className="mr-2" /> Order Details
              </h2>
              <p className="mt-1 text-sm">Order ID: {order?.orderId}</p>
              <p className="mt-1 text-sm">Payment Method: {order?.paymentMethod?.toUpperCase()}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <StatusBadge status={order?.orderStatus} />
              <div className="flex items-center space-x-2">
                <select
                  className="p-2 text-sm border rounded-md bg-white text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                  value={order?.orderStatus}
                  onChange={(e) => orderStatusUpdate(e.target.value.toLowerCase())}
                  disabled={order?.orderStatus === 'cancelled'}
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="returned">Returned</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {isUpdatingAllItems && (
                  <div className="text-white text-xs">Updating...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same... */}
        {/* User Details Section */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="mr-2" /> User Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">UserName</p>
                <p className="font-medium">{order?.userInfo?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">User Email</p>
                <p className="font-medium">{order?.userInfo?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Home className="mr-2" /> Shipping Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{order?.shippingAddress?.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mobile Number</p>
                <p className="font-medium">{order?.shippingAddress?.mobileNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{order?.shippingAddress?.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Landmark</p>
                <p className="font-medium">{order?.shippingAddress?.landMark || 'Not provided'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">City/District/Town</p>
                <p className="font-medium">{order?.shippingAddress?.cityDistrictTown}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">State</p>
                <p className="font-medium">{order?.shippingAddress?.state}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Country</p>
                <p className="font-medium">{order?.shippingAddress?.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pin Code</p>
                <p className="font-medium">{order?.shippingAddress?.pinCode}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Ordered At</p>
              <p className="font-medium">{formatDate(order?.orderedAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivered At</p>
              <p className="font-medium">{formatDate(order?.deliveredAt)}</p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="p-6 border-t">
          <h3 className="text-xl font-semibold mb-4">Products</h3>
          {order?.items?.map((item, index) => (
            <div key={index} className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex items-start space-x-4">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold">{item.productName}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-600 mt-1">Size: {item.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.productPrice}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Status</label>
                      <select
                        className="block w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={item.itemStatus}
                        onChange={(e) => updateItemStatus(item._id, e.target.value.toLowerCase())}
                        disabled={order?.orderStatus === 'cancelled'}
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="returned">Returned</option>
                      </select>
                    </div>
                    <div className="ml-4">
                      <StatusBadge status={item.itemStatus} />
                    </div>
                  </div>

                  {item.itemStatus === "delivered" && item.returnRequest?.requestStatus && (
                    <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="text-red-500" size={18} />
                          <p className="text-sm text-red-700 font-medium">Return Requested</p>
                        </div>
                        <StatusBadge status={item.returnRequest.adminStatus} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Reason:</p>
                          <p className="text-sm">{item.returnRequest.requestMessage || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Refund Amount:</p>
                          <p className="text-sm">₹{item.productPrice || 'N/A'}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        <Info className="inline mr-1" size={16} />
                        {item.returnRequest.requestMessage}
                      </p>

                      {item.returnRequest.adminStatus === 'pending' && (
                        <div className="mt-2 space-y-2">
                          {!selectedReturnAction[index] ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setSelectedReturnAction(prev => ({ ...prev, [index]: 'approve' }))}
                                className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => setSelectedReturnAction(prev => ({ ...prev, [index]: 'reject' }))}
                                className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600 text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="bg-gray-100 p-2 rounded">
                              <p className="text-sm mb-2">Confirm {selectedReturnAction[index]} action?</p>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => updateReturnStatus(item, selectedReturnAction[index])}
                                  className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 text-sm"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setSelectedReturnAction(prev => ({ ...prev, [index]: null }))}
                                  className="flex-1 bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {item.returnRequest.adminComments && (
                        <div className="mt-2 bg-gray-100 p-2 rounded">
                          <p className="text-xs text-gray-600 font-medium">Admin Comments:</p>
                          <p className="text-sm">{item.returnRequest.adminComments}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Section */}
        <div className="p-6 bg-gray-50 border-t">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₹{order?.items?.reduce((acc, item) => acc + (item.productPrice * item.quantity), 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">₹{order?.shippingPrice || 0}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">₹{
                (order?.items?.reduce((acc, item) => acc + (item.productPrice * item.quantity), 0) + (order?.shippingPrice || 0))
              }</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;