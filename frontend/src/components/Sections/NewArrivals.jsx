
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../user/ProductCard';

const NewArrivals = ({AllProducts}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef(null);
  



  const scroll = (direction) => {
    const container = containerRef.current;
    console.log(container.offsetWidth)
    if (container) {
      const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };



  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">New Arrivals</h2>
          <p className="mt-1 text-sm text-gray-500">Check out our latest collection</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory"
      >
        {AllProducts.map((product) => (
          <div key={product._id} className="flex-none snap-start">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;