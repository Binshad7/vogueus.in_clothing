import React, { useState, useEffect } from 'react';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProducts } from '../../../store/middlewares/user/products_handle';
import Spinner from '../../../components/user/Spinner';
import { Link, useNavigate } from 'react-router-dom';

const Shop = () => {
    const dispatch = useDispatch();
    const { AllProducts, loading } = useSelector(state => state.AllProductManageSlice);
    const navigate = useNavigate()
    // Initialize states
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(9); // Show 9 products per page
    const [filters, setFilters] = useState({
        search: '',
        categories: [],
        subCategories: [],
        priceRange: { min: 0, max: 2000 },
        sizes: []
    });

    // Fetch products only once when component mounts
    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    // Update local products state when AllProducts changes
    useEffect(() => {
        if (AllProducts && Array.isArray(AllProducts)) {
            setProducts(AllProducts);
            setCurrentPage(1); // Reset to first page when products update
        }
    }, [AllProducts]);

    // Extract unique values for filters
    const categories = AllProducts ? [...new Set(AllProducts.map(product => product?.category?.categoryName))] : [];
    const subCategories = AllProducts ? [...new Set(AllProducts.map(product => product?.subCategory?.subcategoryName))] : [];
    const allSizes = AllProducts ? [...new Set(AllProducts.flatMap(product =>
        product?.variants?.map(variant => variant?.size)
    ))].filter(Boolean) : [];

    // Apply filters
    useEffect(() => {
        if (!AllProducts) return;

        let filtered = [...AllProducts];

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(product =>
                product?.productName?.toLowerCase().includes(searchLower) ||
                product?.description?.toLowerCase().includes(searchLower)
            );
        }

        if (filters.categories.length > 0) {
            filtered = filtered.filter(product =>
                filters.categories.includes(product?.category?.categoryName)
            );
        }

        if (filters.subCategories.length > 0) {
            filtered = filtered.filter(product =>
                filters.subCategories.includes(product?.subCategory?.subcategoryName)
            );
        }

        if (filters.sizes.length > 0) {
            filtered = filtered.filter(product =>
                product?.variants?.some(variant =>
                    filters.sizes.includes(variant.size) && variant.status === "available"
                )
            );
        }

        filtered = filtered.filter(product => {
            const price = product.currentPrice || product.regularPrice;
            return price >= filters.priceRange.min && price <= filters.priceRange.max;
        });

        setProducts(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [filters, AllProducts]);

    // Pagination calculations
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const updateFilters = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearSearch = () => {
        updateFilters('search', '');
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Search Bar */}
            <div className="w-full bg-white shadow-md p-4 mb-4">
                <div className="max-w-3xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={filters.search}
                        onChange={(e) => updateFilters('search', e.target.value)}
                        className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {filters.search ? (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    ) : (
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    )}
                </div>
            </div>

            <div className="flex">
                {/* Left Sidebar with Filters */}
                <div className="w-64 bg-white p-4 shadow-lg min-h-screen">
                    {/* Categories Filter */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Categories</h3>
                        {categories.map(category => (
                            <label key={category} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(category)}
                                    onChange={(e) => {
                                        const newCategories = e.target.checked
                                            ? [...filters.categories, category]
                                            : filters.categories.filter(c => c !== category);
                                        updateFilters('categories', newCategories);
                                    }}
                                    className="mr-2"
                                />
                                <span className="text-sm capitalize">{category}</span>
                            </label>
                        ))}
                    </div>

                    {/* Subcategories Filter */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Subcategories</h3>
                        {subCategories.map(subCategory => (
                            <label key={subCategory} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={filters.subCategories.includes(subCategory)}
                                    onChange={(e) => {
                                        const newSubCategories = e.target.checked
                                            ? [...filters.subCategories, subCategory]
                                            : filters.subCategories.filter(sc => sc !== subCategory);
                                        updateFilters('subCategories', newSubCategories);
                                    }}
                                    className="mr-2"
                                />
                                <span className="text-sm capitalize">{subCategory}</span>
                            </label>
                        ))}
                    </div>

                    {/* Size Filter */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Sizes</h3>
                        <div className="flex flex-wrap gap-2">
                            {allSizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => {
                                        const newSizes = filters.sizes.includes(size)
                                            ? filters.sizes.filter(s => s !== size)
                                            : [...filters.sizes, size];
                                        updateFilters('sizes', newSizes);
                                    }}
                                    className={`px-3 py-1 border rounded ${filters.sizes.includes(size)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-700'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Price Range</h3>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                value={filters.priceRange.max}
                                onChange={(e) => updateFilters('priceRange', {
                                    ...filters.priceRange,
                                    max: parseInt(e.target.value)
                                })}
                                className="w-full"
                            />
                            <div className="flex justify-between">
                                <input
                                    type="number"
                                    value={filters.priceRange.min}
                                    onChange={(e) => updateFilters('priceRange', {
                                        ...filters.priceRange,
                                        min: parseInt(e.target.value)
                                    })}
                                    className="w-20 p-1 border rounded"
                                />
                                <input
                                    type="number"
                                    value={filters.priceRange.max}
                                    onChange={(e) => updateFilters('priceRange', {
                                        ...filters.priceRange,
                                        max: parseInt(e.target.value)
                                    })}
                                    className="w-20 p-1 border rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6">
                    {/* Debug info */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mb-4 p-2 bg-yellow-100 rounded">
                            <p>Total products: {AllProducts?.length}</p>
                            <p>Filtered products: {products?.length}</p>
                            <p>Current page: {currentPage}</p>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentProducts && currentProducts.length > 0 ? (
                            currentProducts.map(product => (
                                <Link to={`/product/${product?._id}`} >

                                    <div

                                        key={product._id} className="bg-white rounded-lg shadow overflow-hidden">
                                        <div className="relative h-48">
                                            <img
                                                src={product.images[0]}
                                                alt={product.productName}
                                                className="w-full h-full object-cover"
                                            />
                                            {product.currentPrice > 0 && product.currentPrice < product.regularPrice && (
                                                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
                                                    Sale!
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg mb-2">{product.productName}</h3>
                                            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                                            <div className="flex justify-between items-center mb-2">
                                                <div>
                                                    {product.currentPrice > 0 ? (
                                                        <>
                                                            <span className="text-red-600 font-semibold">₹{product.currentPrice}</span>
                                                            <span className="text-gray-400 line-through ml-2">₹{product.regularPrice}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-blue-600 font-semibold">₹{product.regularPrice}</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {product.variants.filter(v => v.status === "available")
                                                        .reduce((total, v) => total + v.stock, 0)} in stock
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {product.variants
                                                    .filter(v => v.status === "available" && v.stock > 0)
                                                    .map(variant => (
                                                        <span
                                                            key={variant.size}
                                                            className="px-2 py-1 bg-gray-100 text-sm rounded"
                                                        >
                                                            {variant.size}
                                                        </span>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                            ))
                        ) : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-gray-500">No products found</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {products.length > 0 && (
                        <div className="mt-8 flex justify-center items-center space-x-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg ${currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                // Show first page, last page, current page, and one page before and after current
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => paginate(pageNumber)}
                                            className={`px-4 py-2 rounded-lg ${currentPage === pageNumber
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                } else if (
                                    pageNumber === currentPage - 2 ||
                                    pageNumber === currentPage + 2
                                ) {
                                    return <span key={pageNumber} className="px-2">...</span>;
                                }
                                return null;
                            })}

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg ${currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <span className="ml-4 text-sm text-gray-500">
                                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} of {products.length} products
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;