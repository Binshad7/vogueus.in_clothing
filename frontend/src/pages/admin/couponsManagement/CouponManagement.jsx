import React, { useState } from 'react';

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([
        {
            id: 1,
            code: 'SUMMER2025',
            discountType: 'percentage',
            discount: 20,
            expiryDate: '2025-08-31',
            status: 'active',
            usageCount: 145,
            description: 'Summer season special discount'
        },
        {
            id: 2,
            code: 'WELCOME50',
            discountType: 'fixed',
            discount: 500,
            expiryDate: '2025-12-31',
            status: 'active',
            usageCount: 89,
            description: 'New customer welcome offer'
        }
    ]);

    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discountType: 'percentage',
        discount: '',
        expiryDate: '',
        status: 'active',
        description: ''
    });

    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('all');
    const [validationErrors, setValidationErrors] = useState({});

    // Get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const validateCoupon = () => {
        const errors = {};

        if (!newCoupon.code.trim()) {
            errors.code = 'Coupon code is required';
        }

        if (!newCoupon.discount) {
            errors.discount = 'Discount value is required';
        } else if (newCoupon.discountType === 'percentage' && (newCoupon.discount < 1 || newCoupon.discount > 100)) {
            errors.discount = 'Percentage discount must be between 1 and 100';
        } else if (newCoupon.discountType === 'fixed' && newCoupon.discount < 1) {
            errors.discount = 'Fixed discount must be greater than 0';
        }

        if (!newCoupon.expiryDate) {
            errors.expiryDate = 'Expiry date is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddCoupon = (e) => {
        e.preventDefault();
        if (!validateCoupon()) return;

        setCoupons([...coupons, { ...newCoupon, id: Date.now(), usageCount: 0 }]);
        setNewCoupon({
            code: '',
            discountType: 'percentage',
            discount: '',
            expiryDate: '',
            status: 'active',
            description: ''
        });
        setValidationErrors({});
        setIsAdding(false);
    };

    const handleDeleteCoupon = (id) => {
        setCoupons(coupons.filter(coupon => coupon.id !== id));
    };

    const toggleStatus = (id) => {
        setCoupons(coupons.map(coupon =>
            coupon.id === id
                ? { ...coupon, status: coupon.status === 'active' ? 'inactive' : 'active' }
                : coupon
        ));
    };

    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
        if (selectedTab === 'all') return matchesSearch;
        return matchesSearch && coupon.status === selectedTab;
    });

    const formatDiscount = (coupon) => {
        return coupon.discountType === 'percentage'
            ? `${coupon.discount}%`
            : `₹${coupon.discount}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Coupon Management</h1>
                        <p className="text-gray-600">Manage your promotional campaigns and discounts</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                    >
                        <span className="text-lg">+</span>
                        <span>Create Coupon</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search coupons..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                {['all', 'active', 'inactive'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedTab(tab)}
                                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${selectedTab === tab
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Code</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Discount</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Usage</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Expiry</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCoupons.map(coupon => (
                                    <tr key={coupon.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{coupon.code}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-lg font-semibold text-blue-600">
                                                {formatDiscount(coupon)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-600 max-w-xs truncate">{coupon.description}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-600">{coupon.usageCount} uses</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-600">
                                                {new Date(coupon.expiryDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full ${coupon.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {coupon.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => toggleStatus(coupon.id)}
                                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                                >
                                                    {coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCoupon(coupon.id)}
                                                    className="text-gray-600 hover:text-red-600 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isAdding && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Coupon</h2>
                            <form onSubmit={handleAddCoupon} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., SUMMER2025"
                                            value={newCoupon.code}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                                            className={`w-full px-4 py-2 rounded-lg border-2 ${validationErrors.code
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                                                } transition-all duration-200`}
                                        />
                                        {validationErrors.code && (
                                            <p className="mt-1 text-sm text-red-600">{validationErrors.code}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                                        <select
                                            value={newCoupon.discountType}
                                            onChange={(e) => setNewCoupon({
                                                ...newCoupon,
                                                discountType: e.target.value,
                                                discount: '' // Reset discount when type changes
                                            })}
                                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (₹)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Discount {newCoupon.discountType === 'percentage' ? '(%)' : '(₹)'}
                                        </label>
                                        <input
                                            type="number"
                                            placeholder={newCoupon.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 500'}
                                            value={newCoupon.discount}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                                            min={1}
                                            max={newCoupon.discountType === 'percentage' ? 100 : undefined}
                                            className={`w-full px-4 py-2 rounded-lg border-2 ${validationErrors.discount
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                                                } transition-all duration-200`}
                                        />
                                        {validationErrors.discount && (
                                            <p className="mt-1 text-sm text-red-600">{validationErrors.discount}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <input
                                            type="text"
                                            placeholder="Enter coupon description"
                                            value={newCoupon.description}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                        <input
                                            type="date"
                                            value={newCoupon.expiryDate}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                                            min={getCurrentDate()}
                                            className={`w-full px-4 py-2 rounded-lg border-2 ${validationErrors.expiryDate
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                                                } transition-all duration-200`}
                                        />
                                        {validationErrors.expiryDate && (
                                            <p className="mt-1 text-sm text-red-600">{validationErrors.expiryDate}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAdding(false);
                                            setValidationErrors({});
                                        }}
                                        className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                                    >
                                        Create Coupon
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponManagement;