import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../../store/middlewares/admin/admin_order_handle';
import { useDispatch, useSelector } from 'react-redux';

const OrderListingPage = () => {
    const dispatch = useDispatch();
    const { loading, orders } = useSelector((state) => state.adminOrders);

    // Local state for filtered orders and search/filter values
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);




    useEffect(() => {
        console.log("Fetching orders for page:", currentPage);
        dispatch(getAllOrders({
            page: currentPage,
            limit: ordersPerPage,
            search: searchTerm,
            status: statusFilter !== 'All' ? statusFilter.toLowerCase() : ''
        }));
    }, [dispatch, currentPage, ordersPerPage, searchTerm, statusFilter]);




    // Update filtered orders whenever orders, search term, or status filter changes
    useEffect(() => {
        if (!orders || orders.length === 0) return;

        let result = [...orders];

        if (searchTerm) {
            result = result.filter(order =>
                order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some(item =>
                    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        if (statusFilter !== 'All') {
            result = result.filter(order => order.orderStatus === statusFilter.toLowerCase());
        }

        setFilteredOrders(result);
    }, [orders, searchTerm, statusFilter]);


    // Pagination calculations
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    // Pagination controls
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        console.log(totalPages)
        if (currentPage < totalPages) {

            setCurrentPage(prev => prev + 1);
            dispatch(getAllOrders({
                page: currentPage + 1,
                limit: ordersPerPage,
                search: searchTerm,
                status: statusFilter !== 'All' ? statusFilter.toLowerCase() : ''
            }));
        }
    };


    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'delivered': 'bg-green-100 text-green-800',
            'processing': 'bg-yellow-100 text-yellow-800',
            'cancelled': 'bg-red-100 text-red-800',
            'pending': 'bg-blue-100 text-blue-800',
            'paid': 'bg-green-100 text-green-800',
            'unpaid': 'bg-red-100 text-red-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if end page is maxed out
        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    return (
        <div className="p-6">
            {/* Header and filters - same as before */}
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
                        <option>All</option>
                        <option>Delivered</option>
                        <option>Processing</option>
                        <option>Cancelled</option>
                        <option>Pending</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-4">Loading orders...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        {/* Table header - same as before */}
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
                            {currentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    {/* Table row content - same as before */}
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
                                                        {item.quantity}x ${item.productPrice} - Size: {item.size}
                                                    </div>
                                                    {item.returnRequest?.requestStatus && (
                                                        <div className="text-red-500 text-xs">
                                                            Return Requested: {item.returnRequest.adminStatus}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="p-4 font-medium">${order.totalAmount}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm">{order.paymentMethod}</span>
                                            <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(order.paymentStatus)}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm">{formatDate(order.orderedAt)}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button className="p-2 text-blue-600 hover:text-blue-800">
                                                View
                                            </button>
                                            <button className="p-2 text-gray-600 hover:text-gray-800">
                                                Edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Enhanced pagination controls */}
            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
                </div>

                <div className="flex items-center gap-2">
                    {/* First Page */}
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                    >
                        First
                    </button>

                    {/* Previous Page */}
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                    >
                        Previous
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`px-3 py-1 border rounded hover:bg-gray-50 ${currentPage === number ? 'bg-blue-50 border-blue-500 text-blue-600' : ''
                                }`}
                        >
                            {number}
                        </button>
                    ))}

                    {/* Next Page */}
                    <button
                        onClick={nextPage}
                        // disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                    >
                        Next
                    </button>

                    {/* Last Page */}
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                    >
                        Last
                    </button>
                </div>
            </div>

        </div>
    );
};

export default OrderListingPage;