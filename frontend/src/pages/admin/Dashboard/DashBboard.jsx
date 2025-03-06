import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  RefreshCw,
} from 'lucide-react';
import adminAxios from '../../../api/adminAxios'
import { Link } from 'react-router-dom';

// Utility function to generate color based on category
const generateCategoryColors = (categories) => {
  const baseColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#4CAF50', '#2196F3'
  ];

  return categories.map((category, index) => ({
    ...category,
    color: baseColors[index % baseColors.length]
  }));
};

const AdminDashboard = () => {

  const [timeFrame, setTimeFrame] = useState('monthly');
  const [salesData, setSalesData] = useState({
    daily: [],
    weekly: [],
    monthly: [],
    yearly: []
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [bestSellingCategories, setBestSellingCategories] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      let response = await adminAxios.get('/dashboard');
      console.log(response.data);

      // Generate colors for categories
      const categoriesWithColors = generateCategoryColors(response?.data?.bestSellingCategoriesData || []);

      setRecentOrders(response?.data?.recentOrders || []);
      setBestSellingProducts(response?.data?.bestSellingProductsData || []);

      // Ensure salesData has the correct structure
      setSalesData(prevData => ({
        ...prevData,
        ...(response?.data?.salesData || {})
      }));

      setSummaryStats(response?.data?.summaryStats || {
        totalSales: 0,
        totalOrders: 0,
        totalCustomers: 0,
        averageOrderValue: 0
      });

      setBestSellingCategories(categoriesWithColors);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const handleTimeFrameChange = (frame) => {
    setTimeFrame(frame);
  };

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Sales',
      value: `₹${(summaryStats?.totalSales / 1000).toFixed(1)}k`,
      icon: <DollarSign size={24} />,
      change: '+12.5%',
      positive: true,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Total Orders',
      value: summaryStats?.totalOrders,
      icon: <ShoppingBag size={24} />,
      change: '+8.2%',
      positive: true,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Customers',
      value: summaryStats?.totalCustomers,
      icon: <Users size={24} />,
      change: '+5.7%',
      positive: true,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Avg. Order Value',
      value: `₹${summaryStats?.averageOrderValue?.toFixed(0)}`,
      icon: <TrendingUp size={24} />,
      change: '-2.1%',
      positive: false,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    }
  ];

  // Status color mapping
  const getStatusStyles = (status) => {
    const statusStyles = {
      delivered: { bg: 'bg-green-100', text: 'text-green-700' },
      shipped: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
      processing: { bg: 'bg-amber-100', text: 'text-amber-700' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
      returned: { bg: 'bg-red-50', text: 'text-red-500' }
    };
    return statusStyles[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  // Get category color
  const getCategoryColor = (category) => {
    const matchedCategory = bestSellingCategories.find(cat =>
      cat.name.toLowerCase() === category.toLowerCase()
    );
    return matchedCategory ? matchedCategory.color : '#CCCCCC';
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Dashboard Header */}
          <div className="col-span-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <button
                className="flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                onClick={() => {
                  setLoading(true);
                  fetchData();
                }}
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh Data
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                      <h2 className="text-2xl font-bold my-1">{stat.value}</h2>
                      <div className="flex items-center">
                        {stat.positive ?
                          <ArrowUpRight size={16} className="text-green-500" /> :
                          <ArrowDownRight size={16} className="text-red-500" />
                        }
                        <span className={`text-xs ml-1 ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.change} from previous period
                        </span>
                      </div>
                    </div>
                    <div className={`${stat.bgColor} ${stat.textColor} p-3 rounded-full`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-5 py-4 flex justify-between items-center border-b">
                <h2 className="font-bold text-gray-800">Sales Overview</h2>
                <div className="flex">
                  {['daily', 'weekly', 'monthly', 'yearly'].map((frame) => (
                    <button
                      key={frame}
                      onClick={() => handleTimeFrameChange(frame)}
                      className={`px-3 py-1 text-sm rounded-md mr-1 ${timeFrame === frame
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {frame.charAt(0).toUpperCase() + frame.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-5 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData[timeFrame] || []}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280' }}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value.toLocaleString()}`, 'Sales']}
                      labelFormatter={(label) => `${label} (${timeFrame.slice(0, -2)})`}
                      contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#6366f1"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b">
                <h2 className="font-bold text-gray-800">Recent Orders</h2>
              </div>
              <div className="divide-y">
                {recentOrders.map((order) => (
                  <div key={order._id} className="p-4">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full ${getStatusStyles(order.orderStatus).bg} ${getStatusStyles(order.orderStatus).text} mr-3`}>
                        <ShoppingBag size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{order.orderId}</span>
                          <span className="text-sm font-bold text-gray-900">₹{order.totalAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">
                            {order?.userId?.userName} • {order.items.length} items
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyles(order.orderStatus).bg} ${getStatusStyles(order.orderStatus).text} capitalize`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 text-center">
                <button
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                
                >
                  <Link to={'/admin/orders'}>
                  View All Orders
                  </Link>
                </button>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Best Selling Products Table */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-5 py-4 flex justify-between items-center border-b">
                <h2 className="font-bold text-gray-800">Best Selling Products (Top 5)</h2>
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreVertical size={18} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bestSellingProducts.map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover rounded-full"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/path/to/default/image.png'; // Fallback image
                                  }}
                                />
                              ) : (
                                <div className="text-gray-400">No Image</div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <span
                              className="inline-block w-3 h-3 mr-2 rounded-full"
                              style={{ backgroundColor: getCategoryColor(product.category) }}
                            ></span>
                            {product.category || 'Uncategorized'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                          ₹{product?.currentPrice > 0 ? product?.currentPrice : (product?.regularPrice || 'N/A')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                          {product.sales?.toLocaleString() || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Best Selling Categories */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b">
                <h2 className="font-bold text-gray-800">Best Selling Categories</h2>
              </div>
              <div className="p-5">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bestSellingCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="sales"
                      >
                        {bestSellingCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} sales`, 'Total']}
                        contentStyle={{
                          background: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.375rem'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {bestSellingCategories.map((category) => (
                    <div key={category._id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {category.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sales by Category Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h2 className="font-bold text-gray-800">Sales by Category</h2>
            </div>
            <div className="p-5 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bestSellingCategories}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis
                    yAxisId="revenue"
                    orientation="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280' }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                    label={{ value: 'Total Revenue', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis
                    yAxisId="percentage"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280' }}
                    tickFormatter={(value) => `${value}%`}
                    label={{ value: 'Sales Percentage', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip
                    formatter={(value, name, props) => {
                      if (name === 'totalRevenue') {
                        return [`₹${value.toLocaleString()}`, 'Total Revenue'];
                      }
                      return [`${value.toFixed(2)}%`, 'Sales Percentage'];
                    }}
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Bar
                    yAxisId="revenue"
                    dataKey="totalRevenue"
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="percentage"
                    dataKey="percentage"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="px-5 pb-5">
              <div className="grid grid-cols-2 gap-4">
                {bestSellingCategories.map((category) => (
                  <div
                    key={category._id}
                    className="bg-gray-50 p-3 rounded-lg flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm text-gray-700 capitalize">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{category.totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {category.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default AdminDashboard;