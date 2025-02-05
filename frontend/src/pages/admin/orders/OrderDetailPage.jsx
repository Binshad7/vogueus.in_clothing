import { useState } from "react";

const demoOrderData = {
  orderId: "VOG-4EBB7494",
  userInfo: { name: "vogue us", email: "vogueus5@gmail.com" },
  totalAmount: 1499,
  paymentMethod: "cod",
  paymentStatus: "paid",
  orderStatus: "delivered",
  orderedAt: "2025-02-03T08:32:42.160Z",
  shippingAddress: {
    fullName: "Sajjad P",
    mobileNumber: "7736433905",
    pinCode: "670692",
    country: "India",
    address: "Mutharipeedika",
    cityDistrictTown: "Thallersherry",
    state: "Kannur",
    landMark: "Oravampuram school near",
  },
  items: [
    {
      productName: "Floral Summer Dress",
      productImage: "https://res.cloudinary.com/dabvawrd0/image/upload/v1737052800/d2kqiq88aksrengtrruw.png",
      description: "Bright and airy floral dress designed for warm sunny days",
      quantity: 1,
      productPrice: 1499,
      size: "XXL",
      itemStatus: "delivered",
      returnRequest: {
        requestStatus: true,
        adminStatus: "pending",
        requestMessage: "This product has some issues like a button suddenly breaking",
      },
    },
  ],
};

const OrderDetails = ({ orderData = demoOrderData }) => {
  const [order, setOrder] = useState(orderData);

  const updateOrderStatus = (newStatus) => {
    setOrder((prev) => ({ ...prev, orderStatus: newStatus }));
  };

  const updateItemStatus = (index, newStatus) => {
    const updatedItems = [...order.items];
    updatedItems[index].itemStatus = newStatus;
    setOrder((prev) => ({ ...prev, items: updatedItems }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold">Order Details</h2>
      <p className="mt-2 text-gray-600">Order ID: {order.orderId}</p>
      <p className="text-gray-600">Customer: {order.userInfo.name} ({order.userInfo.email})</p>
      <p className="text-gray-600">Total Amount: ₹{order.totalAmount}</p>
      <p className="text-gray-600">Payment: {order.paymentMethod} ({order.paymentStatus})</p>
      <p className="text-gray-600">Ordered At: {new Date(order.orderedAt).toLocaleString()}</p>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">Shipping Address</h3>
        <p>{order.shippingAddress.address}, {order.shippingAddress.cityDistrictTown}, {order.shippingAddress.state}, {order.shippingAddress.country} - {order.shippingAddress.pinCode}</p>
        <p>Landmark: {order.shippingAddress.landMark}</p>
        <p>Mobile: {order.shippingAddress.mobileNumber}</p>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">Order Status</h3>
        <select
          className="mt-2 p-2 border rounded"
          value={order.orderStatus}
          onChange={(e) => updateOrderStatus(e.target.value)}
        >
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold">Products</h3>
        {order.items.map((item, index) => (
          <div key={index} className="border p-4 mt-2 rounded">
            <img src={item.productImage} alt={item.productName} className="w-20 h-20 object-cover rounded" />
            <p className="text-gray-800 font-semibold">{item.productName} (Size: {item.size})</p>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-gray-600">Price: ₹{item.productPrice}</p>
            <p className="text-gray-600">Quantity: {item.quantity}</p>
            <div className="mt-2">
              <h4 className="text-lg font-semibold">Product Status</h4>
              <select
                className="mt-1 p-2 border rounded"
                value={item.itemStatus}
                onChange={(e) => updateItemStatus(index, e.target.value)}
              >
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="returned">Returned</option>
              </select>
            </div>
            {item.itemStatus === "delivered" && item.returnRequest?.requestStatus && (
              <div className="mt-2 text-red-500">
                <p>Return Requested: {item.returnRequest.requestMessage}</p>
                <p>Admin Status: {item.returnRequest.adminStatus}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
