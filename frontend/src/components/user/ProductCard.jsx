import React, { useState } from 'react';
import {  Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const ProductCard = React.memo(({ _id,images, productName, currentPrice, regularPrice }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()


  const  addToWishlist = (productID)=>{
    console.log('Product Added TO wislist',productID)
  }
  return (
    <div 
      className="relative group w-64 mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        <img 
          src={images[0]} 
          alt={productName}
          className={`w-full h-80 object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* Quick Actions */}
        <div className={`absolute top-4 right-4 transition-transform duration-300 ${
          isHovered ? 'translate-x-0' : 'translate-x-12'
        }`}>
          <button
           onClick={()=>addToWishlist(_id)}
           className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
            <Heart size={20} className="text-gray-600" />
          </button>
        </div>
        
        {/* Quick View Button */}
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <button 
          onClick={()=>navigate(`/product/${_id}`)}
          className="px-6 py-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Quick View
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{productName}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-900">₹{currentPrice || regularPrice}</span>
          {currentPrice !== regularPrice && regularPrice && (
            <span className="text-sm text-gray-500 line-through">₹{regularPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
});
export default ProductCard