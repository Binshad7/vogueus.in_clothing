import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders } from '../../../store/middlewares/admin/admin_order_handle';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
const OrderListingPage = () => {
    const dispatch = useDispatch();
    const { 
        loading, 
        orders, 
        totalPages, 
        currentPage: serverCurrentPage,
        totalOrders 
    } = useSelector((state) => state.adminOrders);
    const navigate = useNavigate()
    // Local states
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    // Debounced search function
    const debouncedSearch = debounce((term, status, page) => {
        dispatch(getAllOrders({ 
            page, 
            limit: ordersPerPage,
            search: term,
            status: status === 'All' ? undefined : status.toLowerCase()
        }));
    }, 500);

    // Fetch orders when filters or pagination changes
    useEffect(() => {
        debouncedSearch(searchTerm, statusFilter, currentPage);
        return () => debouncedSearch.cancel();
    }, [searchTerm, statusFilter, currentPage]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const getStatusColor = (order) => {
        // Check if order has return request approved
        if (order.returnRequest?.adminStatus === 'approved') {
            return 'bg-purple-100 text-purple-800';
        }

        // Count items with return requests
        const totalItems = order.items.length;
        const returnedItems = order.items.filter(item => 
            item.itemStatus === 'returned' || 
            item.returnRequest?.adminStatus === 'approved'
        ).length;

        if (returnedItems === totalItems) {
            return 'bg-purple-100 text-purple-800';
        } else if (returnedItems > 0) {
            return 'bg-orange-100 text-orange-800';
        }

        const statusColors = {
            'delivered': 'bg-green-100 text-green-800',
            'processing': 'bg-yellow-100 text-yellow-800',
            'cancelled': 'bg-red-100 text-red-800',
            'pending': 'bg-blue-100 text-blue-800',
            'shipped': 'bg-indigo-100 text-indigo-800'
        };
        return statusColors[order.orderStatus.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const getOrderStatus = (order) => {
        if (order.returnRequest?.adminStatus === 'approved') {
            return 'Fully Returned';
        }

        const returnedItems = order.items.filter(item => 
            item.itemStatus === 'returned' || 
            item.returnRequest?.adminStatus === 'approved'
        ).length;
        
        if (returnedItems === order.items.length) {
            return 'All Items Returned';
        } else if (returnedItems > 0) {
            return `Partially Returned (${returnedItems}/${order.items.length})`;
        }
        
        return order.orderStatus;
    };

    // Pagination functions
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleString();

    return (
        <div className="p-6">
            {/* Header and Filters */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Order Management</h1>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="p-2 border rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="p-2 border rounded"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        {/* <option value="fully_returned">Fully Returned</option>
                        <option value="partially_returned">Partially Returned</option> */}
                        <option value="return_requested">Return Requested</option>
                    </select>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-4">Loading orders...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left font-medium text-gray-500">Order ID</th>
                                <th className="p-4 text-left font-medium text-gray-500">Products</th>
                                <th className="p-4 text-left font-medium text-gray-500">Total</th>
                                <th className="p-4 text-left font-medium text-gray-500">Order Status</th>
                                <th className="p-4 text-left font-medium text-gray-500">Payment</th>
                                <th className="p-4 text-left font-medium text-gray-500">Date</th>
                                <th className="p-4 text-left font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="p-4">{order.orderId}</td>
                                    <td className="p-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center gap-2 mb-2">
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                                <div className="text-sm">
                                                    <div className="font-medium">{item.productName}</div>
                                                    <div className="text-gray-500">
                                                        {item.quantity}x ₹{item.productPrice} - Size: {item.size}
                                                    </div>
                                                    {item.returnRequest?.requestStatus && (
                                                        <div className="text-xs text-orange-600">
                                                            Return {item.returnRequest.adminStatus}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="p-4 font-medium">₹{order.totalAmount}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(order)}`}>
                                                {getOrderStatus(order)}
                                            </span>
                                            {order.returnRequest?.requestStatus && order.returnRequest.adminStatus === 'pending' && (
                                                <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded">
                                                    Return Requested
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">{order.paymentMethod}</td>
                                    <td className="p-4 text-sm">{formatDate(order.orderedAt)}</td>
                                    <td className="p-4">
                                        <button className="p-2 text-blue-600 hover:text-blue-800" onClick={()=>navigate(`/admin/orders/detailspage/${order._id}`)}>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, totalOrders)} of {totalOrders} orders
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={prevPage} 
                        disabled={currentPage === 1} 
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {getPageNumbers().map(number => (
                        <button 
                            key={number} 
                            onClick={() => setCurrentPage(number)}
                            className={`px-3 py-1 border rounded hover:bg-gray-50 ${
                                currentPage === number ? 'bg-blue-50 border-blue-500 text-blue-600' : ''
                            }`}
                        >
                            {number}
                        </button>
                    ))}
                    <button 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages} 
                        className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderListingPage;