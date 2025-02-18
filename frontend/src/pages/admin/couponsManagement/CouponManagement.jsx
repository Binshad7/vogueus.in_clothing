







import React, { useEffect, useState } from 'react';
import { addCoupon, getAllCoupons, editCoupon, updateBlockStatus, deleteCoupon } from '../../../store/middlewares/admin/coupon';
import { useDispatch, useSelector } from 'react-redux';

const CouponManagement = () => {
    const dispatch = useDispatch();
    const { coupons } = useSelector(state => state.couponHandling);

    useEffect(() => {
        dispatch(getAllCoupons());
    }, [dispatch]);

    const [newCoupon, setNewCoupon] = useState({
        couponCode: '',
        discountType: 'percentage',
        discount: '',
        minimumOrderAmount: '',
        maximumDiscountAmount: '',
        expiryDate: '',
        description: '',
    });

    const [filters, setFilters] = useState({
        status: 'all',
        discountType: 'all',
        search: '',
        dateRange: {
            start: '',
            end: ''
        }
    });

    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [couponId, setCouponId] = useState(null);
    const [editingCoupon, setEditingCoupon] = useState({
        couponCode: '',
        discountType: '',
        discount: '',
        minimumOrderAmount: '',
        maximumDiscountAmount: '',
        expiryDate: '',
        status: '',
        description: '',
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [deleteModal, setDeleteModal] = useState({ show: false, couponId: null });
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const validateCoupon = (coupon) => {
        const errors = {};

        if (!coupon.couponCode?.trim()) {
            errors.couponCode = 'Coupon code is required';
        } else if (!/^[A-Z0-9]{4,16}$/.test(coupon.couponCode)) {
            errors.couponCode = 'Coupon code must be 4-16 characters long and contain only uppercase letters and numbers';
        }

        if (!coupon.discount) {
            errors.discount = 'Discount value is required';
        } else if (coupon.discountType === 'percentage' && (coupon.discount < 1 || coupon.discount > 100)) {
            errors.discount = 'Percentage discount must be between 1 and 100';
        } else if (coupon.discountType === 'fixed' && coupon.discount < 1) {
            errors.discount = 'Fixed discount must be greater than 0';
        }

        if (!coupon.minimumOrderAmount || coupon.minimumOrderAmount < 0) {
            errors.minimumOrderAmount = 'Minimum order value must be 0 or greater';
        }

        if (!coupon.maximumDiscountAmount || coupon.maximumDiscountAmount < 1) {
            errors.maximumDiscountAmount = 'Maximum discount amount must be greater than 0';
        }

        if (!coupon.expiryDate) {
            errors.expiryDate = 'Expiry date is required';
        } else if (new Date(coupon.expiryDate) <= new Date()) {
            errors.expiryDate = 'Expiry date must be in the future';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddCoupon = async (e) => {
        e.preventDefault();
        setValidationErrors({});
        if (!validateCoupon(newCoupon)) return;
        const result = await dispatch(addCoupon(newCoupon));
        if (addCoupon.fulfilled.match(result)) {
            setIsAdding(false);
            resetCouponForm();
        }
    };

    const resetCouponForm = () => {
        setNewCoupon({
            couponCode: '',
            discountType: 'percentage',
            discount: '',
            minimumOrderAmount: '',
            maximumDiscountAmount: '',
            expiryDate: '',
            description: '',
        });
        setValidationErrors({});
    };

    const handleEditClick = (coupon) => {
        setCouponId(coupon._id);
        setEditingCoupon({
            ...coupon,
            expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0]
        });
        setIsEditing(true);
        setValidationErrors({});
    };

    const handleDeleteClick = (id) => {
        setDeleteModal({ show: true, couponId: id });
    };

    const handleDeleteConfirm = async () => {
        await dispatch(deleteCoupon(deleteModal.couponId));
        setDeleteModal({ show: false, couponId: null });
    };

    const toggleStatus = async (id) => {
        await dispatch(updateBlockStatus(id));
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const handleUpdateCouponConfirm = async () => {
        if (!validateCoupon(editingCoupon)) return;
        const result = await dispatch(editCoupon({ editingCoupon, couponId }));
        if (editCoupon.fulfilled.match(result)) {
            setCouponId(null);
            setIsEditing(false);
            setEditingCoupon(null);
        }
    };

    const filteredAndSortedCoupons = coupons
        ?.filter(coupon => {
            const matchesSearch = coupon.couponCode.toLowerCase().includes(filters.search.toLowerCase()) ||
                coupon.description.toLowerCase().includes(filters.search.toLowerCase());
            const matchesStatus = filters.status === 'all' || coupon.status === filters.status;
            const matchesType = filters.discountType === 'all' || coupon.discountType === filters.discountType;

            let matchesDate = true;
            if (filters.dateRange.start && filters.dateRange.end) {
                const couponDate = new Date(coupon.expiryDate);
                const startDate = new Date(filters.dateRange.start);
                const endDate = new Date(filters.dateRange.end);
                matchesDate = couponDate >= startDate && couponDate <= endDate;
            }

            return matchesSearch && matchesStatus && matchesType && matchesDate;
        })
        .sort((a, b) => {
            const direction = sortConfig.direction === 'asc' ? 1 : -1;

            switch (sortConfig.key) {
                case 'couponCode':
                    return direction * a.couponCode.localeCompare(b.couponCode);
                case 'discount':
                    return direction * (a.discount - b.discount);
                case 'usageCount':
                    return direction * (a.usageCount - b.usageCount);
                case 'expiryDate':
                    return direction * (new Date(a.expiryDate) - new Date(b.expiryDate));
                default:
                    return 0;
            }
        });

    const FormModal = ({ isOpen, onClose, title, onSubmit, mode }) => {
        if (!isOpen) return null;

        const currentCoupon = mode === 'edit' ? editingCoupon : newCoupon;
        const setCurrentCoupon = mode === 'edit' ? setEditingCoupon : setNewCoupon;

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            let processedValue = value;

            // Handle coupon code separately to maintain focus
            if (name === 'couponCode') {
                processedValue = value.toUpperCase();
            } else {
                switch (name) {
                    case 'discount':
                        processedValue = Math.min(
                            currentCoupon.discountType === "percentage" ? 100 : 1000000,
                            Math.max(0, Number(value))
                        );
                        break;
                    case 'minimumOrderAmount':
                        processedValue = Math.max(0, Number(value));
                        break;
                    case 'maximumDiscountAmount':
                        processedValue = Math.max(1, Number(value));
                        break;
                    default:
                        break;
                }
            }

            setCurrentCoupon(prev => ({
                ...prev,
                [name]: processedValue
            }));
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

                        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-1">
                                        Coupon Code
                                    </label>
                                    <input
                                        id="couponCode"
                                        name="couponCode"
                                        type="text"
                                        placeholder="e.g., SUMMER2025"
                                        value={currentCoupon?.couponCode || ''}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 rounded-lg border-2 ${validationErrors.couponCode
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                                            } transition-all duration-200`}
                                    />
                                    {validationErrors.couponCode && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.couponCode}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-1">
                                        Discount Type
                                    </label>
                                    <select
                                        id="discountType"
                                        name="discountType"
                                        value={currentCoupon?.discountType || 'percentage'}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                                        Discount {currentCoupon?.discountType === "percentage" ? "(%)" : "(₹)"}
                                    </label>
                                    <input
                                        id="discount"
                                        name="discount"
                                        type="number"
                                        placeholder={currentCoupon?.discountType === "percentage" ? "e.g., 20" : "e.g., 500"}
                                        value={currentCoupon?.discount || ''}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 rounded-lg border-2 ${validationErrors.discount
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                                            } transition-all duration-200`}
                                    />
                                    {validationErrors.discount && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.discount}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="minimumOrderAmount" className="block text-sm font-medium text-gray-700 mb-1">
                                        Minimum Order Value (₹)
                                    </label>
                                    <input
                                        id="minimumOrderAmount"
                                        name="minimumOrderAmount"
                                        type="number"
                                        placeholder="e.g., 1000"
                                        value={currentCoupon?.minimumOrderAmount || ''}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 rounded-lg border-2 ${validationErrors.minimumOrderAmount
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                                            } transition-all duration-200`}
                                    />
                                    {validationErrors.minimumOrderAmount && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.minimumOrderAmount}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="maximumDiscountAmount" className="block text-sm font-medium text-gray-700 mb-1">
                                        Maximum Discount Amount (₹)
                                    </label>
                                    <input
                                        id="maximumDiscountAmount"
                                        name="maximumDiscountAmount"
                                        type="number"
                                        placeholder="e.g., 1000"
                                        value={currentCoupon?.maximumDiscountAmount || ''}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 rounded-lg border-2 ${validationErrors.maximumDiscountAmount
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                                            } transition-all duration-200`}
                                    />
                                    {validationErrors.maximumDiscountAmount && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.maximumDiscountAmount}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <input
                                        id="description"
                                        name="description"
                                        type="text"
                                        placeholder="Enter coupon description"
                                        value={currentCoupon?.description || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Expiry Date
                                    </label>
                                    <input
                                        id="expiryDate"
                                        name="expiryDate"
                                        type="date"
                                        value={currentCoupon?.expiryDate || ''}
                                        onChange={handleInputChange}
                                        min={getCurrentDate()}
                                        className={`w-full px-4 py-2 rounded-lg border-2 ${validationErrors.expiryDate
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                                : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
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
                                        onClose();
                                        setValidationErrors({});
                                    }}
                                    className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                {mode === "edit" ? (
                                    <button
                                        onClick={handleUpdateCouponConfirm}
                                        type="button"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                                    >
                                        Update Coupon
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleAddCoupon}
                                        type="button"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                                    >
                                        Create Coupon
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };

    const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Coupon</h3>
                    <p className="text-gray-600 mb-6">Are you sure you want to delete this coupon? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
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
                        onClick={() => {
                            setIsAdding(true);
                            resetCouponForm();
                        }}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                    >
                        <span className="text-lg">+</span>
                        <span>Create Coupon</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search coupons..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full px-6 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>
                            </div>

                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <select
                                value={filters.discountType}
                                onChange={(e) => handleFilterChange('discountType', e.target.value)}
                                className="px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            >
                                <option value="all">All Types</option>
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>

                            <div className="flex space-x-2">
                                <input
                                    type="date"
                                    value={filters.dateRange.start}
                                    onChange={(e) => handleFilterChange('dateRange', {
                                        ...filters.dateRange,
                                        start: e.target.value
                                    })}
                                    className="w-1/2 px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                />
                                <input
                                    type="date"
                                    value={filters.dateRange.end}
                                    onChange={(e) => handleFilterChange('dateRange', {
                                        ...filters.dateRange,
                                        end: e.target.value
                                    })}
                                    className="w-1/2 px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:text-blue-600"
                                            onClick={() => handleSort('couponCode')}
                                        >
                                            Code {sortConfig.key === 'couponCode' && (
                                                sortConfig.direction === 'asc' ? '↑' : '↓'
                                            )}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                                        <th
                                            className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:text-blue-600"
                                            onClick={() => handleSort('discount')}
                                        >
                                            Discount {sortConfig.key === 'discount' && (
                                                sortConfig.direction === 'asc' ? '↑' : '↓'
                                            )}
                                        </th>
                                        <th
                                            className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:text-blue-600"
                                            onClick={() => handleSort('usageCount')}
                                        >
                                            Usage {sortConfig.key === 'usageCount' && (
                                                sortConfig.direction === 'asc' ? '↑' : '↓'
                                            )}
                                        </th>
                                        <th
                                            className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:text-blue-600"
                                            onClick={() => handleSort('expiryDate')}
                                        >
                                            Expiry {sortConfig.key === 'expiryDate' && (
                                                sortConfig.direction === 'asc' ? '↑' : '↓'
                                            )}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAndSortedCoupons.map(coupon => (
                                        <tr key={coupon._id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{coupon.couponCode}</div>
                                                <div className="text-sm text-gray-500">{coupon.description}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-600 capitalize">{coupon.discountType}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-lg font-semibold text-blue-600">
                                                    {coupon.discountType === 'percentage'
                                                        ? `${coupon.discount}%`
                                                        : formatCurrency(coupon.discount)
                                                    }
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Max: {formatCurrency(coupon.maximumDiscountAmount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-600">{coupon.usageCount}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-600">
                                                    {new Date(coupon.expiryDate).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(coupon.expiryDate) < new Date() ? 'Expired' : 'Valid'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${coupon.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {coupon.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditClick(coupon)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => toggleStatus(coupon._id)}
                                                        className={`${coupon.isBlock === true
                                                                ? 'text-red-600 hover:text-red-800'
                                                                : 'text-green-600 hover:text-green-800'
                                                            }`}
                                                    >
                                                        {coupon.isBlock === true ? 'Activate' : 'Deactivate'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(coupon._id)}
                                                        className="text-red-600 hover:text-red-800"
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
            </div>

            <FormModal
                isOpen={isAdding}
                onClose={() => {
                    setIsAdding(false);
                    resetCouponForm();
                }}
                title="Create New Coupon"
                onSubmit={handleAddCoupon}
                mode="add"
            />

            <FormModal
                isOpen={isEditing}
                onClose={() => {
                    setIsEditing(false);
                    setEditingCoupon(null);
                }}
                title="Edit Coupon"
                onSubmit={handleUpdateCouponConfirm}
                mode="edit"
            />

            <DeleteModal
                isOpen={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, couponId: null })}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};

export default CouponManagement;