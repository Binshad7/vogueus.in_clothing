import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';

const Orders = () => {
  const [selectedFilter, setSelectedFilter] = useState('ACTIVE');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');

  // Sample API response for orders
  const demoOrders = [
    {
      id: '12345',
      orderDate: '2025-01-15T00:00:00.000Z',
      orderStatus: 'PENDING',
      totalAmount: 99.99,
      orderItemList: [
        {
          id: 'a1',
          quantity: 2,
          product: {
            name: 'Wireless Mouse',
            price: 25.0,
            slug: 'wireless-mouse',
            resources: [
              {
                url: 'https://via.placeholder.com/120',
              },
            ],
          },
        },
        {
          id: 'a2',
          quantity: 1,
          product: {
            name: 'Gaming Keyboard',
            price: 49.99,
            slug: 'gaming-keyboard',
            resources: [
              {
                url: 'https://via.placeholder.com/120',
              },
            ],
          },
        },
      ],
    },
    {
      id: '67890',
      orderDate: '2025-01-20T00:00:00.000Z',
      orderStatus: 'DELIVERED',
      totalAmount: 150.0,
      orderItemList: [
        {
          id: 'b1',
          quantity: 1,
          product: {
            name: 'Bluetooth Speaker',
            price: 75.0,
            slug: 'bluetooth-speaker',
            resources: [
              {
                url: 'https://via.placeholder.com/120',
              },
            ],
          },
        },
        {
          id: 'b2',
          quantity: 3,
          product: {
            name: 'HDMI Cable',
            price: 25.0,
            slug: 'hdmi-cable',
            resources: [
              {
                url: 'https://via.placeholder.com/120',
              },
            ],
          },
        },
      ],
    },
  ];

  useEffect(() => {
    const displayOrders = demoOrders.map((order) => ({
      id: order.id,
      orderDate: order.orderDate,
      orderStatus: order.orderStatus,
      status:
        order.orderStatus === 'PENDING' ||
        order.orderStatus === 'IN_PROGRESS' ||
        order.orderStatus === 'SHIPPED'
          ? 'ACTIVE'
          : order.orderStatus === 'DELIVERED'
          ? 'COMPLETED'
          : order.orderStatus,
      items: order.orderItemList.map((orderItem) => ({
        id: orderItem.id,
        name: orderItem.product.name,
        price: orderItem.product.price,
        quantity: orderItem.quantity,
        url: orderItem.product.resources[0]?.url,
        slug: orderItem.product.slug,
      })),
      totalAmount: order.totalAmount,
    }));
    setOrders(displayOrders);
  }, []);

  const handleOnChange = useCallback((evt) => {
    const value = evt.target.value;
    setSelectedFilter(value);
  }, []);

  return (
    <div>
      {orders.length > 0 && (
        <div className="md:w-[70%] w-full">
          <div className="flex justify-between">
            <h1 className="text-2xl mb-4">My Orders</h1>
            <select
              className="border-2 rounded-lg mb-4 p-2"
              value={selectedFilter}
              onChange={handleOnChange}
            >
              <option value={"ACTIVE"}>Active</option>
              <option value={"CANCELLED"}>Cancelled</option>
              <option value={"COMPLETED"}>Completed</option>
            </select>
          </div>
          {orders.map((order, index) => {
            return (
              order.status === selectedFilter && (
                <div key={index}>
                  <div className="bg-gray-200 p-4 mb-8">
                    <p className="text-lg font-bold">Order no. #{order.id}</p>
                    <div className="flex justify-between mt-2">
                      <div className="flex flex-col text-gray-500 text-sm">
                        <p>
                          Order Date : {moment(order.orderDate).format('MMMM DD YYYY')}
                        </p>
                        <p>
                          Expected Delivery Date: {moment(order.orderDate)
                            .add(3, 'days')
                            .format('MMMM DD YYYY')}
                        </p>
                      </div>
                      <div className="flex flex-col text-gray-500 text-sm">
                        <p>Order Status : {order.orderStatus}</p>
                        <button
                          onClick={() => setSelectedOrder(order.id)}
                          className="text-blue-900 text-right rounded underline cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedOrder === order.id && (
                    <div>
                      {order.items.map((orderItem, index) => (
                        <div key={index} className="flex gap-4">
                          <img
                            src={orderItem.url}
                            alt={orderItem.name}
                            className="w-[120px] h-[120px] object-cover m-2 rounded"
                          />
                          <div className="flex flex-col text-sm py-2 text-gray-600">
                            <p>{orderItem.name || 'Name'}</p>
                            <p>Quantity {orderItem.quantity}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between">
                        <p>Total : ${order.totalAmount}</p>
                        <button
                          onClick={() => setSelectedOrder('')}
                          className="text-blue-900 text-right rounded underline cursor-pointer"
                        >
                          Hide Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
