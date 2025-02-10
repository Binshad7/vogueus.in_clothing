import React, { useState } from 'react';
import { Boxes, Search, ArrowLeft, Package, AlertCircle } from 'lucide-react';

const StockManagement = () => {
  // Demo data
  const initialProducts = [
    {
      _id: '1',
      productName: 'Classic T-Shirt',
      regularPrice: 29.99,
      currentPrice: 24.99,
      description: 'Cotton basic t-shirt',
      category: { _id: 'cat1', name: 'Clothing' },
      subCategory: { _id: 'subcat1', name: 'T-Shirts' },
      images: ['tshirt1.jpg'],
      isBlocked: false,
      variants: [
        { size: 'S', stock: 25, status: 'available', isBlocked: false },
        { size: 'M', stock: 5, status: 'low_stock', isBlocked: false },
        { size: 'L', stock: 0, status: 'out of stock', isBlocked: false }
      ]
    },
    {
      _id: '2',
      productName: 'Slim Fit Jeans',
      regularPrice: 79.99,
      currentPrice: 69.99,
      description: 'Comfortable slim fit jeans',
      category: { _id: 'cat1', name: 'Clothing' },
      subCategory: { _id: 'subcat2', name: 'Jeans' },
      images: ['jeans1.jpg'],
      isBlocked: false,
      variants: [
        { size: '30', stock: 15, status: 'available', isBlocked: false },
        { size: '32', stock: 20, status: 'available', isBlocked: false },
        { size: '34', stock: 0, status: 'discontinued', isBlocked: true }
      ]
    }
  ];

  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getTotalStock = (variants) => {
    return variants.reduce((total, variant) => total + variant.stock, 0);
  };

  const getStockStatus = (variants) => {
    const totalStock = getTotalStock(variants);
    if (totalStock === 0) return 'Out of Stock';
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

  const updateVariant = (variantIndex, field, value) => {
    setSelectedProduct(prev => {
      const updatedVariants = [...prev.variants];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        [field]: value
      };
      
      // Update the main products array too
      setProducts(products.map(p => 
        p._id === prev._id ? {...prev, variants: updatedVariants} : p
      ));

      return {...prev, variants: updatedVariants};
    });
  };

  const ProductList = () => (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products
            .filter(product => product.productName.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full object-cover" src={`/api/placeholder/40/40`} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                      <div className="text-sm text-gray-500">${product.currentPrice}</div>
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
            <div key={index} className="border rounded-lg p-4">
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
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {!selectedProduct && (
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
        )}
      </div>

      {selectedProduct ? <ProductDetail /> : <ProductList />}
    </div>
  );
};

export default StockManagement;