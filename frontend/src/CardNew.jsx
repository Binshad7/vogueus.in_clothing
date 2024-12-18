import React, { useState } from 'react';
import { Heart, ShoppingCart, CreditCard } from 'lucide-react';

const ProductCard = ({ 
  imageUrl, 
  productName, 
  price, 
  originalPrice, 
  rating 
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="relative w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      {/* Product Image */}
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={productName} 
          className="w-full h-64 object-cover"
        />
        {/* Discount Badge */}
        <span className="absolute top-4 left-4 bg-black text-white text-xs font-medium px-2.5 py-0.5 rounded">
          {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
        </span>
        
        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-white/70 text-gray-600 hover:bg-white/90'
          } transition-colors`}
        >
          <Heart 
            size={20} 
            fill={isWishlisted ? 'currentColor' : 'none'}
            strokeWidth={isWishlisted ? 0 : 1.5}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="px-5 pb-5 pt-3">
        {/* Product Name */}
        <h3 className="text-xl font-semibold tracking-tight text-gray-900 mb-2">
          {productName}
        </h3>

        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-4">
          {/* Pricing */}
          <div>
            <span className="text-2xl font-bold text-gray-900 mr-2">${price}</span>
            <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <svg 
                key={index} 
                className={`w-5 h-5 ${
                  index < Math.floor(rating) 
                    ? 'text-yellow-300' 
                    : 'text-gray-300'
                }`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs font-medium ml-2 text-gray-600">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {/* Add to Cart Button */}
          <button 
            className="flex-1 bg-slate-900 text-white py-2.5 rounded-md hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <ShoppingCart className="mr-2" size={20} />
            Add to Cart
          </button>

          {/* Buy Now Button */}
          <button 
            className="flex-1 bg-green-500 text-white py-2.5 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
          >
            <CreditCard className="mr-2" size={20} />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;