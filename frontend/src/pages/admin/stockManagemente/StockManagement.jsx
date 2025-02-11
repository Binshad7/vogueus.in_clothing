import React, { useEffect, useState } from 'react';
import { Boxes, Search, ArrowLeft, Package, Filter } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProduct } from '../../../store/middlewares/admin/ProductRelate';
import Spinner from '../../../components/user/Spinner';
import { toast } from 'react-toastify';
import { updateStocks } from '../../../store/middlewares/admin/ProductRelate';

const StockManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Products, loading } = useSelector(state => state.AllProducts);
  const [products, setProducts] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchProduct());
  }, []);
  
  useEffect(() => {
    setProducts(Products);
  }, [Products]);

  const getTotalStock = (variants) => {
    return variants.reduce((total, variant) => total + variant.stock, 0);
  };

  const getStockStatus = (variants) => {
    const hasZeroStock = variants.some(variant => variant.stock === 0);
    if (hasZeroStock) return 'Out of Stock';
    
    const totalStock = getTotalStock(variants);
    if (totalStock < 10) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
      case 'in stock':
        return 'text-green-600 bg-green-50';
      case 'out of stock':
        return 'text-red-600 bg-red-50';
      case 'discontinued':
        return 'text-gray-600 bg-gray-50';
      case 'low stock':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getVariantStockColor = (stock) => {
    if (stock === 0) return 'text-red-600 font-medium';
    if (stock < 5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const updateVariant = (variantIndex, field, value) => {
    setSelectedProduct(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        [field]: value
      };

      setProducts(products.map(p =>
        p._id === prev._id ? { ...prev, variants: updatedVariants } : p
      ));

      return { ...prev, variants: updatedVariants };
    });
  };

  const updateStock = async () => {
    const stockUpdate = selectedProduct.variants.every(item => item.stock == 0);
    const stockStatus = selectedProduct.variants.every(item => item.isBlocked === true);
    
    if (stockUpdate) {
      toast.error('At least one size must have stock greater than 0');
      return;
    }
    if (stockStatus) {
      toast.error('At least one size must be available');
      return;
    }
    
    const result = await dispatch(updateStocks({ 
      productId: selectedProduct._id, 
      variants: selectedProduct.variants 
    }));
    
    if (updateStocks.fulfilled.match(result)) {
      setSelectedProduct(null);
    }
  };

  const filterProducts = (products) => {
    if (!products) return [];
    
    return products
      .filter(product => {
        // Text search filter
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Category filter
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        
        // Stock status filter
        let matchesStatus = true;
        const status = getStockStatus(product.variants);
        
        switch (filterStatus) {
          case 'out_of_stock':
            matchesStatus = status === 'Out of Stock';
            break;
          case 'low_stock':
            matchesStatus = status === 'Low Stock';
            break;
          case 'in_stock':
            matchesStatus = status === 'In Stock';
            break;
          case 'discontinued':
            matchesStatus = product.variants.some(v => v.status === 'discontinued');
            break;
          default:
            matchesStatus = true;
        }
        
        return matchesSearch && matchesCategory && matchesStatus;
      });
  };

  if (loading) {
    return <Spinner />;
  }

  const FilterBar = () => (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Stock Status</option>
        <option value="in_stock">In Stock</option>
        <option value="low_stock">Low Stock</option>
        <option value="out_of_stock">Out of Stock</option>
        <option value="discontinued">Discontinued</option>
      </select>
      
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-gray-400" />
        <span className="text-sm text-gray-600">
          {filterProducts(products)?.length} products
        </span>
      </div>
    </div>
  );

  const ProductList = () => (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variants Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filterProducts(products)?.map((product) => (
            <tr key={product._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt="" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{getTotalStock(product.variants)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(getStockStatus(product.variants))}`}>
                  {getStockStatus(product.variants)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm flex gap-3">
                  {product.variants.map(variant => (
                    <span 
                      key={variant.size} 
                      className={`px-2 py-1 rounded-md border ${getVariantStockColor(variant.stock)}`}
                    >
                      {variant.size}: {variant.stock}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Manage Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ProductDetail = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold">{selectedProduct.productName}</h2>
            <p className="text-gray-500">Stock Management</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedProduct.variants.map((variant, index) => (
            <div key={index} className={`border rounded-lg p-4 ${variant.stock === 0 ? 'border-red-200 bg-red-50' : ''}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Size: {variant.size}</h3>
                <select
                  value={variant.isBlocked ? 'unlisted' : 'listed'}
                  onChange={(e) => updateVariant(index, 'isBlocked', e.target.value === 'unlisted')}
                  className="text-sm rounded-lg border px-2 py-1"
                >
                  <option value="listed">Listed</option>
                  <option value="unlisted">Unlisted</option>
                </select>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      variant.stock === 0 ? 'border-red-300' : ''
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={variant.status}
                    onChange={(e) => updateVariant(index, 'status', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${getStatusColor(variant.status)}`}
                  >
                    <option value="available">Available</option>
                    <option value="out of stock">Out of Stock</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={updateStock}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md active:transform active:scale-95"
          >
            <Package className="h-5 w-5" />
            Update Stock
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Boxes className="h-6 w-6" />
          Stock Management
        </h1>
      </div>

      {!selectedProduct && <FilterBar />}
      {selectedProduct ? <ProductDetail /> : <ProductList />}
    </div>
  );
};

export default StockManagement;