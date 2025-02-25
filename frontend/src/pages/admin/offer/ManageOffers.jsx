import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus, Filter, Search, ChevronDown, Edit, Trash2,
    Calendar, Tag, Percent, Clock, AlertCircle, X, Save,
    Check, ToggleLeft, ToggleRight
} from 'lucide-react';
import { addProductListCategory } from '../../../store/middlewares/admin/categoryHandle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../../../store/middlewares/admin/ProductRelate';
import { addOffer } from '../../../store/middlewares/admin/offerHandle';
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
    const [errors, seterrors] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        discount: '',
        startDate: '',
        expiryDate: '',
        category: '',
        subcategory: '',
        productName: '',
    });
    const { Products, loading } = useSelector((state) => state.AllProducts);
    const { addProductListingCategory } = useSelector((state) => state.category);
    const dispatch = useDispatch();
    // const navigate = useNavigate()
    useEffect(() => {
        dispatch(addProductListCategory());
    }, [dispatch]);
    useEffect(() => {
        dispatch(fetchProduct());
    }, [dispatch]);
    // category 
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
            console.log('Category', initialCategory?._id)
            console.log('subCategory', initialCategory?.subcategories[0]?._id)
        }
    }, [addProductListingCategory]);

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

    // Set minimum date to today in YYYY-MM-DD format
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        setMinDate(`${year}-${month}-${day}`);
    }, []);

    // Sample data
    const [categoryOffers, setCategoryOffers] = useState([
        { id: 1, title: '10 perc', discount: 10, startDate: '2025-02-24', expiryDate: '2025-02-27', applyTo: 'categories', parentCategory: 'Men', categoryName: 'shirt', createdAt: '24/2/2025' },
        { id: 2, title: 'Spring Sale', discount: 15, startDate: '2025-03-01', expiryDate: '2025-03-15', applyTo: 'categories', parentCategory: 'Women', categoryName: 'pants', createdAt: '20/2/2025' },
        { id: 3, title: 'Clearance', discount: 25, startDate: '2025-02-10', expiryDate: '2025-02-28', applyTo: 'categories', parentCategory: 'Kids', categoryName: 'accessories', createdAt: '08/2/2025' }
    ]);

    const [productOffers, setProductOffers] = useState([
        { id: 1, title: 'Flash Sale', discount: 20, startDate: '2025-02-25', expiryDate: '2025-02-26', applyTo: 'products', productName: 'T-shirt Blue XL', createdAt: '23/2/2025' },
        { id: 2, title: 'New Arrival', discount: 5, startDate: '2025-03-05', expiryDate: '2025-03-20', applyTo: 'products', productName: 'Slim Jeans', createdAt: '22/2/2025' }
    ]);



    const handleOpenModal = (type, offer = null) => {
        setModalType(type);

        if (offer) {
            // Edit mode - populate form with offer data
            setCurrentOffer(offer);
            setFormData({
                title: offer.title,
                discount: offer.discount,
                startDate: offer.startDate,
                expiryDate: offer.expiryDate,
                category: offer.parentCategory || selectedCategory,
                subcategory: offer.categoryName || subcategories,
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
                subcategory: subcategories,
                productName: type === 'product' ? products[0] : '',
            });
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowDeleteConfirm(false);
    };

    const handleInputChange = useCallback((e) => {
        let { name, value } = e.target
        if (name === 'subcategory') {
            const category = addProductListingCategory.find(cat => cat.categoryName === selectedCategory);
            const subcategory = category?.subcategories?.find(
                subCat => subCat.subcategoryName === value
            );

            setSubCategoryId(subcategory?._id);
        }
        if (name === 'productName') {
            let product = Products.find(item => item?.productName === value);
            setProductId(product?._id)
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, [selectedCategory, addProductListingCategory]);

    const validateForm = () => {
        let errors = {};

        if (!formData.title.trim()) errors.title = "Title is required";
        if (!formData.discount) errors.discount = "Discount is required";
        else if (isNaN(formData.discount) || formData.discount < 0) errors.discount = "Invalid discount";

        if (!formData.startDate) errors.startDate = "Start date is required";
        if (!formData.expiryDate) errors.expiryDate = "Expiry date is required";
        else if (new Date(formData.expiryDate) <= new Date(formData.startDate))
            errors.expiryDate = "Expiry date must be after start date";

        // if (!formData.category) errors.category = "Category is required";
        // if (!formData.subcategory) errors.subcategory = "Subcategory is required";
        // if (!formData.productName) errors.productName = "Product name is required";

        seterrors(errors);

        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(errors)
        console.log(validateForm())
        if (!validateForm()) return

        const result = await dispatch(addOffer({ title: formData.title, discount: formData.discount, startDate: formData.startDate, expiryDate: formData.expiryDate, subcategoryId, productId }))
        if (addOffer.fulfilled.match(result)) {
            handleCloseModal()
        }
    }

    const handleDelete = (offer) => {
        setCurrentOffer(offer);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (activeTab === 'category') {
            setCategoryOffers(categoryOffers.filter(offer => offer.id !== currentOffer.id));
        } else {
            setProductOffers(productOffers.filter(offer => offer.id !== currentOffer.id));
        }
        setShowDeleteConfirm(false);
    };


    // Format date for display
    const formatDateDisplay = (dateString) => {
        if (!dateString) return '';

        // If the date is already in DD/MM/YYYY format, return as is
        if (dateString.includes('/')) return dateString;

        // Convert from YYYY-MM-DD to DD/MM/YYYY
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

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
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        <Filter size={16} />
                        Filters
                        <ChevronDown size={16} />
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

            {/* Filter Panel - hidden by default */}
            {filterOpen && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                            <input type="date" className="w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Range</label>
                            <div className="flex items-center gap-2">
                                <input type="number" placeholder="Min %" className="w-full p-2 border border-gray-300 rounded-md" />
                                <span>-</span>
                                <input type="number" placeholder="Max %" className="w-full p-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">Apply Filters</button>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button
                    onClick={() => setActiveTab('category')}
                    className={`py-2 px-4 font-medium ${activeTab === 'category' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500'}`}
                >
                    Category Offers
                </button>
                <button
                    onClick={() => setActiveTab('product')}
                    className={`py-2 px-4 font-medium ${activeTab === 'product' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500'}`}
                >
                    Product Offers
                </button>
            </div>

            {/* Offers Table */}
            <div className="overflow-x-auto">
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
                        {activeTab === 'category' ? (
                            categoryOffers.length > 0 ? (
                                categoryOffers.map((offer, index) => (
                                    <tr key={offer.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-4 whitespace-nowrap">{index + 1}</td>
                                        <td className="py-4 px-4 whitespace-nowrap font-medium">{offer.title}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Percent size={16} className="text-orange-500 mr-1" />
                                                {offer.discount}%
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Calendar size={16} className="text-blue-500 mr-1" />
                                                {formatDateDisplay(offer.startDate)} - {formatDateDisplay(offer.expiryDate)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Tag size={16} className="text-purple-500 mr-1" />
                                                {offer.parentCategory}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Tag size={16} className="text-green-500 mr-1" />
                                                {offer.categoryName}
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    onClick={() => handleOpenModal('category', offer)}
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
                                    <td colSpan="8" className="py-4 px-4 text-center text-gray-500">
                                        <div className="flex flex-col items-center py-6">
                                            <AlertCircle size={24} className="text-gray-400 mb-2" />
                                            <p>No category offers found</p>
                                            <button
                                                onClick={() => handleOpenModal('category')}
                                                className="mt-2 text-emerald-600 hover:underline"
                                            >
                                                Create your first category offer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        ) : (
                            productOffers.length > 0 ? (
                                productOffers.map((offer, index) => (
                                    <tr key={offer.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-4 whitespace-nowrap">{index + 1}</td>
                                        <td className="py-4 px-4 whitespace-nowrap font-medium">{offer.title}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Percent size={16} className="text-orange-500 mr-1" />
                                                {offer.discount}%
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Calendar size={16} className="text-blue-500 mr-1" />
                                                {formatDateDisplay(offer.startDate)} - {formatDateDisplay(offer.expiryDate)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Tag size={16} className="text-purple-500 mr-1" />
                                                {offer.productName}
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    onClick={() => handleOpenModal('product', offer)}
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
                                    <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                                        <div className="flex flex-col items-center py-6">
                                            <AlertCircle size={24} className="text-gray-400 mb-2" />
                                            <p>No product offers found</p>
                                            <button
                                                onClick={() => handleOpenModal('product')}
                                                className="mt-2 text-slate-600 hover:underline"
                                            >
                                                Create your first product offer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">
                        {activeTab === 'category' ? categoryOffers.length : productOffers.length}
                    </span> of <span className="font-medium">
                        {activeTab === 'category' ? categoryOffers.length : productOffers.length}
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
                                    {errors?.title && <p className='text-red-700 text-lg'>{errors?.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            name="discount"
                                            min={0}
                                            value={formData.discount}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="10"
                                        />
                                        <span className="ml-2 text-gray-500">%</span>
                                        {errors?.discount && <p className='text-red-700 text-lg'>{errors?.discount}</p>}
                                    </div>
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
                                    {errors?.startDate && <p className='text-red-700 text-lg'>{errors?.startDate}</p>}
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
                                    {errors?.expiryDate && <p className='text-red-700 text-lg'>{errors?.expiryDate}</p>}
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
                                                {addProductListingCategory.map(option => (
                                                    <option key={option._id} value={option.categoryName}>
                                                        {option.categoryName}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors?.category && <p className='text-red-700 text-lg'>{errors?.category}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                                            <select
                                                name="subcategory"
                                                value={formData.subcategory}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            >
                                                {subcategories?.map(option => (
                                                    <option key={option._id} value={option.subcategoryName}>
                                                        {option.subcategoryName}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors?.subcategory && <p className='text-red-700 text-lg'>{errors?.subcategory}</p>}
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
                                            {Products?.map(prod => (
                                                <option key={prod?._id} value={prod?.productName}>{prod?.productName} </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-end gap-2">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            {
                                currentOffer === 'Update' ?
                                    <button
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 flex items-center gap-1"
                                    >
                                        <Save size={16} />
                                        Update Offer
                                    </button> :
                                    <button
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 flex items-center gap-1"
                                    >
                                        <Save size={16} />
                                        Save  Offer
                                    </button>

                            }
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-center text-red-500 mb-4">
                                <AlertCircle size={48} />
                            </div>
                            <h3 className="text-lg font-medium text-center mb-2">Confirm Delete</h3>
                            <p className="text-gray-600 text-center mb-6">
                                Are you sure you want to delete the offer "{currentOffer?.title}"? This action cannot be undone.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-1"
                                >
                                    <Trash2 size={16} />
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