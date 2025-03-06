import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Plus, Filter, Search, ChevronDown, Edit, Trash2,
    Calendar, Tag, Percent, AlertCircle, X, Save,
    PackageOpen
} from 'lucide-react';
import { addProductListCategory } from '../../../store/middlewares/admin/categoryHandle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../../../store/middlewares/admin/ProductRelate';
import { addOffer, getAllOffers, deleteOffer } from '../../../store/middlewares/admin/offerHandle';

const ManageOffers = () => {
    const [activeTab, setActiveTab] = useState('category');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [currentOffer, setCurrentOffer] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [minDate, setMinDate] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [productId, setProductId] = useState(null);
    const [subcategoryId, setSubCategoryId] = useState(null);
    const [errors, setErrors] = useState({});
    const [items, setItems] = useState([]);
    const [render, setRender] = useState(false)
    // Filter states
    const [dateFilter, setDateFilter] = useState('');
    const [minDiscount, setMinDiscount] = useState('');
    const [maxDiscount, setMaxDiscount] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        discount: '',
        startDate: '',
        expiryDate: '',
        category: '',
        subcategory: '',
        productName: '',
    });

    const { Products } = useSelector((state) => state.AllProducts);
    const { addProductListingCategory } = useSelector((state) => state.category);
    const { loading, productOffers, subcategoryOffers } = useSelector(state => state.offerHandling);
    const dispatch = useDispatch();

    // Initial data fetching
    useEffect(() => {
        dispatch(getAllOffers());
        dispatch(addProductListCategory());
        dispatch(fetchProduct());
    }, [dispatch, render]);

    // Category setup
    useEffect(() => {
        if (addProductListingCategory?.length > 0) {
            const initialCategory = addProductListingCategory[0];
            setSelectedCategory(initialCategory?.categoryName || '');
            setSubcategories(initialCategory?.subcategories || []);
            setCategoryId(initialCategory?._id);
            setSubCategoryId(initialCategory?.subcategories[0]?._id);

            setFormData(prev => ({
                ...prev,
                category: initialCategory?.categoryName || '',
                subcategory: initialCategory?.subcategories[0]?.subcategoryName || ''
            }));
        }
    }, [addProductListingCategory]);

    // Set initial items based on default activeTab
    useEffect(() => {
        if (subcategoryOffers?.length > 0 && activeTab === 'category') {
            setItems(subcategoryOffers);
        } else if (productOffers?.length > 0 && activeTab === 'product') {
            setItems(productOffers);
        }
    }, [subcategoryOffers, productOffers, activeTab]);

    // Product setup
    useEffect(() => {
        setProductId(Products[0]?._id);
    }, [Products]);

    // Set minimum date to today
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        setMinDate(`${year}-${month}-${day}`);
    }, []);

    // Handle category change
    const handleCategoryChange = useCallback((e) => {
        const categoryName = e.target.value;
        const category = addProductListingCategory.find(cat => cat.categoryName === categoryName);

        if (category) {
            setCategoryId(category._id);
            setSelectedCategory(categoryName);
            setSubcategories(category.subcategories || []);
            setSubCategoryId(category.subcategories[0]?._id);

            setFormData(prev => ({
                ...prev,
                category: categoryName,
                subcategory: category.subcategories[0]?.subcategoryName || ''
            }));
        }
    }, [addProductListingCategory]);

    // Handle search
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Apply filters
    const applyFilters = () => {
        let filteredData = activeTab === 'category' ? [...subcategoryOffers] : [...productOffers];

        // Apply date filter
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filteredData = filteredData.filter(offer => {
                const startDate = new Date(offer.startDate);
                const endDate = new Date(offer.endDate || offer.expiryDate);
                return startDate <= filterDate && filterDate <= endDate;
            });
        }

        // Apply discount range filters
        if (minDiscount) {
            filteredData = filteredData.filter(offer =>
                parseFloat(offer.discount) >= parseFloat(minDiscount)
            );
        }

        if (maxDiscount) {
            filteredData = filteredData.filter(offer =>
                parseFloat(offer.discount) <= parseFloat(maxDiscount)
            );
        }

        setItems(filteredData);
        setFilterOpen(false);
    };

    // Reset filters
    const resetFilters = () => {
        setDateFilter('');
        setMinDiscount('');
        setMaxDiscount('');
        setItems(activeTab === 'category' ? subcategoryOffers : productOffers);
        setFilterOpen(false);
    };

    // Modal handlers
    const handleOpenModal = (type, offer = null) => {
        setModalType(type);

        if (offer) {
            // Edit mode - populate form with offer data
            setCurrentOffer(offer);
            setFormData({
                title: offer.offerTitle,
                discount: offer.discount,
                startDate: offer.startDate,
                expiryDate: offer.endDate || offer.expiryDate,
                category: offer.parentCategoryName || selectedCategory,
                subcategory: offer.subcategoryName || formData.subcategory,
                productName: offer.productName || '',
            });
        } else {
            // Add mode - reset form
            setCurrentOffer(null);
            setFormData({
                title: '',
                discount: '',
                startDate: minDate,
                expiryDate: '',
                category: selectedCategory,
                subcategory: subcategories[0]?.subcategoryName || '',
                productName: type === 'product' ? Products[0]?.productName || '' : '',
            });
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowDeleteConfirm(false);
        setErrors({});
    };

    // Form input change
    const handleInputChange = useCallback((e) => {
        let { name, value } = e.target;

        if (name === 'subcategory') {
            const category = addProductListingCategory.find(cat => cat.categoryName === selectedCategory);
            const subcategory = category?.subcategories?.find(
                subCat => subCat.subcategoryName === value
            );

            setSubCategoryId(subcategory?._id);
        }

        if (name === 'productName') {
            let product = Products.find(item => item?.productName === value);
            if (product) {
                setProductId(product._id);
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, [selectedCategory, addProductListingCategory, Products]);

    // Form validation
    const validateForm = () => {
        let newErrors = {};

        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.discount) newErrors.discount = "Discount is required";
        else if (isNaN(formData.discount) || formData.discount < 0) newErrors.discount = "Invalid discount";

        if (!formData.startDate) newErrors.startDate = "Start date is required";
        if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
        else if (new Date(formData.expiryDate) <= new Date(formData.startDate))
            newErrors.expiryDate = "Expiry date must be after start date";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form submission
    // Fix for handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        if (modalType === 'product') {
            setSubCategoryId(() => null);
        } else {
            setProductId(() => null);
        }

        try {
            const result = await dispatch(addOffer({
                title: formData.title,
                discount: formData.discount,
                startDate: formData.startDate,
                expiryDate: formData.expiryDate,
                subcategoryId: modalType === 'product' ? null : subcategoryId,
                productId: modalType !== 'product' ? null : productId
            }));

            if (result.meta.requestStatus === 'fulfilled') {
                handleCloseModal();
                setRender(!render)
                // Update the items list based on the active tab
                setItems(activeTab === 'category' ? subcategoryOffers : productOffers);
            }
        } catch (error) {
            console.error("Error adding offer:", error);
        }
    };

    // Fix for confirmDelete function
    const confirmDelete = async () => {
        let productId;
        let subcategoryId;

        if (currentOffer?.subcategoryName) {
            productId = null;
            subcategoryId = currentOffer?._id;
        } else {
            productId = currentOffer?._id;
            subcategoryId = null;
        }

        try {
            const result = await dispatch(deleteOffer({
                offerTitle: currentOffer?.offerTitle,
                productId,
                subcategoryId,
                offerId: currentOffer?.offerId
            }));

            setShowDeleteConfirm(false);

            if (deleteOffer.fulfilled.match(result)) {
                setRender(!render)
                // Update the items list based on the active tab
                setItems(activeTab === 'category' ? subcategoryOffers : productOffers);
            }
        } catch (error) {
            console.error("Error deleting offer:", error);
        }
    };

    // Delete handlers
    const handleDelete = (offer) => {
        setCurrentOffer(offer);
        setShowDeleteConfirm(true);
    };



    // Date formatting
    const formatDateDisplay = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);

        if (isNaN(date.getTime())) return 'Invalid Date';

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
    };

    // Filter data based on search term
    const filterData = (data) => {
        if (!searchTerm) return data;

        return data.filter(offer => {
            const searchFields = [
                offer.offerTitle,
                offer.discount?.toString(),
                offer.productName,
                offer.subcategoryName,
                offer.parentCategoryName
            ];

            return searchFields.some(field =>
                field && field.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    };

    // Handle tab switching and update items accordingly
    const handleListingData = (type) => {
        setActiveTab(type);

        if (type === 'category') {
            setItems(subcategoryOffers || []);
        } else {
            setItems(productOffers || []);
        }
    };

    // Get filtered data based on current search term
    const getFilteredData = () => {
        return filterData(items || []);
    };

    const filteredData = getFilteredData();

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Manage Offers</h1>
                <p className="text-gray-600 mt-1">Create and manage promotional offers for products and categories</p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 w-full md:w-96">
                    <Search size={18} className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search offers..."
                        className="bg-transparent outline-none w-full"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 ${filterOpen ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-700'
                            }`}
                    >
                        <Filter size={16} />
                        Filters
                        <ChevronDown size={16} className={filterOpen ? 'transform rotate-180' : ''} />
                    </button>

                    <button
                        onClick={() => handleOpenModal('category')}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                    >
                        <Plus size={16} />
                        Category Offer
                    </button>

                    <button
                        onClick={() => handleOpenModal('product')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
                    >
                        <Plus size={16} />
                        Product Offer
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {filterOpen && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Range</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Min %"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={minDiscount}
                                    onChange={(e) => setMinDiscount(e.target.value)}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max %"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    value={maxDiscount}
                                    onChange={(e) => setMaxDiscount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <div className="flex gap-2 w-full">
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 flex-1"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 flex-1"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs - Styled as pills for better visibility */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => handleListingData('category')}
                    className={`py-2 px-4 font-medium rounded-md transition-all ${activeTab === 'category'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-200'
                        }`}
                >
                    <span className="flex items-center gap-1">
                        <Tag size={16} />
                        Category Offers
                    </span>
                </button>
                <button
                    onClick={() => handleListingData('product')}
                    className={`py-2 px-4 font-medium rounded-md transition-all ${activeTab === 'product'
                        ? 'bg-slate-600 text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-200'
                        }`}
                >
                    <span className="flex items-center gap-1">
                        <PackageOpen size={16} />
                        Product Offers
                    </span>
                </button>
            </div>

            {/* Status bar for search/filter */}
            {(searchTerm || minDiscount || maxDiscount || dateFilter) && (
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <span>Filtered by:</span>
                    {searchTerm && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1">
                            Search: "{searchTerm}"
                            <button onClick={() => setSearchTerm('')} className="text-blue-500 hover:text-blue-700">
                                <X size={14} />
                            </button>
                        </span>
                    )}
                    {(minDiscount || maxDiscount) && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center gap-1">
                            Discount: {minDiscount || '0'}% - {maxDiscount || '100'}%
                            <button onClick={() => { setMinDiscount(''); setMaxDiscount(''); }} className="text-purple-500 hover:text-purple-700">
                                <X size={14} />
                            </button>
                        </span>
                    )}
                    {dateFilter && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center gap-1">
                            Date: {dateFilter}
                            <button onClick={() => setDateFilter('')} className="text-yellow-500 hover:text-yellow-700">
                                <X size={14} />
                            </button>
                        </span>
                    )}
                </div>
            )}

            {/* Offers Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">#</th>
                            <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Title</th>
                            <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Discount</th>
                            <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Date Range</th>
                            {activeTab === 'category' && (
                                <>
                                    <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">
                                        Parent Category
                                    </th>
                                    <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">
                                        Subcategory
                                    </th>
                                </>
                            )}
                            {activeTab === 'product' && (
                                <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">
                                    Product
                                </th>
                            )}
                            <th className="py-3 px-4 text-left font-medium text-gray-500 uppercase tracking-wider text-xs">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredData.length > 0 ? (
                            filteredData.map((offer, index) => (

                                <tr key={offer?.offerId || index} className="hover:bg-gray-50">
                                    <td className="py-4 px-4 whitespace-nowrap">{index + 1}</td>
                                    {/* <td className="py-4 px-4 whitespace-nowrap">{offer?._id}</td> */}

                                    <td className="py-4 px-4 whitespace-nowrap font-medium">{offer.offerTitle}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Percent size={16} className="text-orange-500 mr-1" />
                                            <span className="font-semibold">{offer.discount}%</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Calendar size={16} className="text-blue-500 mr-1" />
                                            {formatDateDisplay(offer.startDate)} - {formatDateDisplay(offer.endDate || offer.expiryDate)}
                                        </div>
                                    </td>

                                    {activeTab === 'category' ? (
                                        <>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Tag size={16} className="text-purple-500 mr-1" />
                                                    {offer.parentCategoryName}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Tag size={16} className="text-green-500 mr-1" />
                                                    {offer.subcategoryName}
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <PackageOpen size={16} className="text-purple-500 mr-1" />
                                                {offer.productName}
                                            </div>
                                        </td>
                                    )}

                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                onClick={() => handleOpenModal(activeTab === 'category' ? 'category' : 'product', offer)}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                onClick={() => handleDelete(offer)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={activeTab === 'category' ? 8 : 7} className="py-4 px-4 text-center text-gray-500">
                                    <div className="flex flex-col items-center py-6">
                                        <AlertCircle size={24} className="text-gray-400 mb-2" />
                                        <p>No {activeTab} offers found</p>
                                        {searchTerm && <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>}
                                        <button
                                            onClick={() => handleOpenModal(activeTab)}
                                            className={`mt-2 ${activeTab === 'category' ? 'text-emerald-600' : 'text-slate-600'} hover:underline`}
                                        >
                                            Create your first {activeTab} offer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination - Simple version */}
            {filteredData.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">
                            {filteredData.length}
                        </span> of <span className="font-medium">
                            {filteredData.length}
                        </span> results
                    </div>

                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
                            Previous
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-medium">
                                {currentOffer ? 'Edit' : 'Add New'} {modalType === 'category' ? 'Category' : 'Product'} Offer
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Enter offer title..."
                                    />
                                    {errors?.title && <p className='text-red-700 text-sm mt-1'>{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            name="discount"
                                            min={0}
                                            max={100}
                                            value={formData.discount}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="10"
                                        />
                                        <span className="ml-2 text-gray-500">%</span>
                                    </div>
                                    {errors?.discount && <p className='text-red-700 text-sm mt-1'>{errors.discount}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        min={minDate}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                    {errors?.startDate && <p className='text-red-700 text-sm mt-1'>{errors.startDate}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                    <input
                                        type="date"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleInputChange}
                                        min={formData.startDate || minDate}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                    {errors?.expiryDate && <p className='text-red-700 text-sm mt-1'>{errors.expiryDate}</p>}
                                </div>

                                {modalType === 'category' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleCategoryChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            >
                                                {addProductListingCategory?.map(option => (
                                                    <option key={option._id} value={option.categoryName}>
                                                        {option.categoryName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                                            <select
                                                name="subcategory"
                                                value={formData.subcategory}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            >
                                                {subcategories.map(option => (
                                                    <option key={option._id} value={option.subcategoryName}>
                                                        {option.subcategoryName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                        <select
                                            name="productName"
                                            value={formData.productName}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        >
                                            {Products?.map(product => (
                                                <option key={product._id} value={product.productName}>
                                                    {product.productName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className={`px-4 py-2 rounded-md text-white flex items-center ${modalType === 'category'
                                        ? 'bg-emerald-500 hover:bg-emerald-600'
                                        : 'bg-slate-600 hover:bg-slate-700'
                                        }`}
                                >
                                    <Save size={18} className="mr-1" />
                                    {currentOffer ? 'Update' : 'Create'} Offer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <div className="text-center">
                            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Delete</h3>
                            <p className="text-gray-500 mb-6">
                                Are you sure you want to delete this offer? This action cannot be undone.
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageOffers;