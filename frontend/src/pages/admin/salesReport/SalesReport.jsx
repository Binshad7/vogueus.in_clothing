import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import adminAxios from '../../../api/adminAxios';
import { 
  Calendar, 
  FileSpreadsheet, 
  FileText , 
  Filter, 
  RefreshCw, 
  DollarSign, 
  PackageCheck, 
  Percent, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

const SalesReport = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [customDateRange, setCustomDateRange] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'orderedAt', direction: 'desc' });

  // For stats
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, dateRange, startDate, endDate, customDateRange]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get('/orders/salesreport');
      setReports(response.data.orders);
      console.log(response.data.orders);
      
      setFilteredReports(response.data.orders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Fallback to mock data for development
      setReports(mockOrders);
      setFilteredReports(mockOrders);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!reports.length) return;

    let filtered = [...reports];
    const currentDate = new Date();

    if (customDateRange) {
      // Custom date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of day

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderedAt);
        return orderDate >= start && orderDate <= end;
      });
    } else {
      // Predefined ranges
      switch (dateRange) {
        case 'daily':
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderedAt);
            return orderDate.toDateString() === currentDate.toDateString();
          });
          break;
        case 'weekly':
          const weekStart = new Date(currentDate);
          weekStart.setDate(currentDate.getDate() - currentDate.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderedAt);
            return orderDate >= weekStart && orderDate <= weekEnd;
          });
          break;
        case 'monthly':
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderedAt);
            return (
              orderDate.getMonth() === currentDate.getMonth() &&
              orderDate.getFullYear() === currentDate.getFullYear()
            );
          });
          break;
        case 'yearly':
          filtered = filtered.filter(order => {
            const orderDate = new Date(order.orderedAt);
            return orderDate.getFullYear() === currentDate.getFullYear();
          });
          break;
        default:
          break;
      }
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredReports(filtered);

    // Calculate stats
    const sales = filtered.reduce((sum, order) => sum + order.totalAmount, 0);
    const discount = filtered.reduce((sum, order) => sum + (order.discoutAmout || 0), 0);

    setTotalSales(sales);
    setTotalOrders(filtered.length);
    setTotalDiscount(discount);
  };

  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setDateRange(value);
    setCustomDateRange(value === 'custom');
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    // Apply the new sorting
    const sortedReports = [...filteredReports].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredReports(sortedReports);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Sales Report', 105, 15, { align: 'center' });

    // Add date range info
    doc.setFontSize(12);
    let dateInfo = '';
    if (customDateRange) {
      dateInfo = `Custom Range: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
    } else {
      dateInfo = `Report Type: ${dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}`;
    }
    doc.text(dateInfo, 105, 25, { align: 'center' });

    // Add summary
    doc.setFontSize(14);
    doc.text('Summary', 20, 40);
    doc.setFontSize(12);
    doc.text(`Total Orders: ${totalOrders}`, 20, 50);
    doc.text(`Total Sales: ₹${totalSales.toFixed(2)}`, 20, 60);
    doc.text(`Total Discount: ₹${totalDiscount.toFixed(2)}`, 20, 70);

    // Add table header
    const tableHeaders = ['Order ID', 'Date', 'Amount', 'Discount', 'Status'];
    let yPos = 90;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Header
    doc.setFillColor(220, 220, 220);
    doc.rect(20, yPos - 10, 170, 10, 'F');
    doc.text(tableHeaders[0], 25, yPos - 2);
    doc.text(tableHeaders[1], 65, yPos - 2);
    doc.text(tableHeaders[2], 105, yPos - 2);
    doc.text(tableHeaders[3], 135, yPos - 2);
    doc.text(tableHeaders[4], 165, yPos - 2);

    // Table rows
    filteredReports.forEach((order, index) => {
      if (yPos > 270) {
        // Add new page if we're near the bottom
        doc.addPage();
        yPos = 20;
      }

      const date = new Date(order.orderedAt).toLocaleDateString();
      doc.text(order.orderId, 25, yPos + 10);
      doc.text(date, 65, yPos + 10);
      doc.text(`₹${order.totalAmount.toFixed(2)}`, 105, yPos + 10);
      doc.text(`₹${(order.discoutAmout || 0).toFixed(2)}`, 135, yPos + 10);
      doc.text(order.orderStatus, 165, yPos + 10);

      yPos += 15;

      // Add light gray background to alternate rows
      if (index % 2 === 0) {
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPos - 5, 170, 15, 'F');
      }
    });

    doc.save('sales-report.pdf');
  };

  const exportToExcel = () => {
    // Prepare data for Excel
    const excelData = filteredReports.map(order => ({
      'Order ID': order.orderId,
      'Date': new Date(order.orderedAt).toLocaleDateString(),
      'Customer ID': order.userId,
      'Payment Method': order.paymentMethod,
      'Payment Status': order.paymentStatus,
      'Order Status': order.orderStatus,
      'Total Amount': order.totalAmount,
      'Discount': order.discoutAmout || 0,
      'Coupon Code': order?.couponCode || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');

    // Add summary sheet
    const summaryData = [
      { 'Metric': 'Total Orders', 'Value': totalOrders },
      { 'Metric': 'Total Sales', 'Value': `₹${totalSales.toFixed(2)}` },
      { 'Metric': 'Total Discount', 'Value': `₹${totalDiscount.toFixed(2)}` }
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Generate file and trigger download
    XLSX.writeFile(workbook, 'sales-report.xlsx');
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const refreshData = () => {
    fetchOrders();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Sales Report</h1>
          <button
            onClick={refreshData}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <PackageCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <h3 className="text-2xl font-bold text-gray-900">{totalOrders}</h3>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 px-5 py-2">
              <p className="text-xs text-blue-600 font-medium">
                {dateRange === 'custom' 
                  ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                  : `${dateRange.charAt(0).toUpperCase() + dateRange.slice(1)} Report`}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Sales</p>
                  <h3 className="text-2xl font-bold text-gray-900">₹{totalSales.toFixed(2)}</h3>
                </div>
              </div>
            </div>
            <div className="bg-green-50 px-5 py-2">
              <p className="text-xs text-green-600 font-medium">
                {filteredReports.length > 0 ? `Avg. ₹${(totalSales/totalOrders).toFixed(2)}/order` : 'No data available'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <Percent className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Discounts</p>
                  <h3 className="text-2xl font-bold text-gray-900">₹{totalDiscount.toFixed(2)}</h3>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 px-5 py-2">
              <p className="text-xs text-purple-600 font-medium">
                {totalSales > 0 ? `${((totalDiscount / (totalSales + totalDiscount)) * 100).toFixed(1)}% of gross sales` : 'No data available'}
              </p>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div 
            className="px-6 py-4 flex justify-between items-center cursor-pointer"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-gray-500" />
              <h3 className="font-medium text-gray-700">Filter Options</h3>
            </div>
            {isFiltersOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>

          {isFiltersOpen && (
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="relative">
                    <select
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      value={dateRange}
                      onChange={handleDateRangeChange}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="custom">Custom Range</option>
                    </select>
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {customDateRange && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        min={startDate}
                      />
                    </div>
                  </>
                )}

                <div className="flex items-end">
                  <button
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    onClick={applyFilters}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4 sm:mb-0">
            {filteredReports.length} {filteredReports.length === 1 ? 'order' : 'orders'} found
          </h3>
          <div className="flex space-x-3">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              onClick={exportToExcel}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export to Excel
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              onClick={exportToPDF}
            >
              <FileText  className="h-4 w-4 mr-2" />
              Export to PDF
            </button>
          </div>
        </div>

        {/* Data table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <p className="text-gray-600">Loading sales data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('orderId')}
                    >
                      <div className="flex items-center">
                        Order ID
                        {sortConfig.key === 'orderId' && (
                          sortConfig.direction === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('orderedAt')}
                    >
                      <div className="flex items-center">
                        Date
                        {sortConfig.key === 'orderedAt' && (
                          sortConfig.direction === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('totalAmount')}
                    >
                      <div className="flex items-center">
                        Amount
                        {sortConfig.key === 'totalAmount' && (
                          sortConfig.direction === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('discoutAmout')}
                    >
                      <div className="flex items-center">
                        Discount
                        {sortConfig.key === 'discoutAmout' && (
                          sortConfig.direction === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coupon
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('orderStatus')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortConfig.key === 'orderStatus' && (
                          sortConfig.direction === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <Calendar className="h-10 w-10 text-gray-400 mb-3" />
                          <p className="text-lg font-medium">No orders found</p>
                          <p className="text-sm text-gray-500 mt-1">Try changing your filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((order, index) => (
                      <tr key={order._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.orderedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="capitalize">{order.paymentMethod}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(order.discoutAmout || 0) > 0 ? (
                            <span className="text-green-600">-₹{(order.discoutAmout || 0).toFixed(2)}</span>
                          ) : (
                            <span>₹0.00</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.couponCode ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 font-medium">
                              {order.couponCode || order?.couponCode}
                            </span>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.orderStatus)}`}>
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;