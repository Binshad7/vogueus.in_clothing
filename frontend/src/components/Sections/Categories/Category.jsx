import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Category = ({ title, AllProducts }) => {
  const scrollContainer = React.useRef(null);
  const [products, setProduct] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProduct(
      AllProducts.filter((item) => item.category.categoryName.toLowerCase() === title.toLowerCase())
    );
  }, [AllProducts, title]);

  const scroll = (direction) => {
    if (scrollContainer.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainer.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryClick = () => {
    navigate(`/category/${title.toLowerCase()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title Section with Category Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 
            className="text-2xl font-bold text-gray-800 hover:text-blue-600 cursor-pointer"
            onClick={handleCategoryClick}
          >
            {title}
          </h2>
          <button 
            onClick={handleCategoryClick}
            className="text-sm text-blue-600 hover:text-blue-800 hidden md:block"
          >
            View All
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Products ScrollView */}
      <div className="relative">
        <div
          ref={scrollContainer}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="flex-none snap-start w-72 group cursor-pointer"
              onClick={() => handleProductClick(product._id)}
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-100">
                {/* Product Image */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.productName}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Discount Badge */}
                {product.currentPrice > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                    {Math.round((1 - product.currentPrice / product.regularPrice) * 100)}% OFF
                  </div>
                )}

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    className="bg-white text-gray-900 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add quick view functionality
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    Quick View
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-4 space-y-2">
                <h3 className="font-medium text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                  {product.productName}
                </h3>
                <div className="flex items-center gap-2">
                  {product.currentPrice > 0 && (
                    <span className="text-lg font-bold">₹{product.currentPrice}</span>
                  )}
                  {product.currentPrice > 0 ? (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.regularPrice}
                    </span>
                  ) : (
                    <span className="text-lg font-bold">₹{product.regularPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Category);