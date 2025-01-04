import React, { useState } from 'react';

const PriceFilter = () => {
  const [range, setRange] = useState([10, 250]);

  const handleChange = (index, value) => {
    const newRange = [...range];
    newRange[index] = Number(value);
    setRange(newRange);
  };

  return (
    <div className="flex flex-col mb-4">
      <p className="text-[16px] text-black mt-5 mb-5">Price</p>
      <div className="relative w-full">
        {/* Range for Min */}
        <input
          type="range"
          min="0"
          max="500"
          value={range[0]}
          onChange={(e) => handleChange(0, e.target.value)}
          className="absolute w-full h-2 bg-gray-300 rounded-lg appearance-none accent-black pointer-events-auto"
          style={{
            zIndex: 2,
          }}
        />
        {/* Range for Max */}
        <input
          type="range"
          min="0"
          max="500"
          value={range[1]}
          onChange={(e) => handleChange(1, e.target.value)}
          className="absolute w-full h-2 bg-gray-300 rounded-lg appearance-none accent-black pointer-events-auto"
          style={{
            zIndex: 1,
          }}
        />
      </div>
      <div className="flex justify-between mt-4">
        <div className="border rounded-lg h-8 max-w-[50%] w-[40%] flex items-center">
          <p className="pl-4 text-gray-600">$</p>
          <input
            type="number"
            value={range[0]}
            onChange={(e) => handleChange(0, e.target.value)}
            className="outline-none px-4 text-gray-600"
            min="0"
            max="499"
          />
        </div>
        <div className="border rounded-lg h-8 max-w-[50%] w-[40%] flex items-center">
          <p className="pl-4 text-gray-600">$</p>
          <input
            type="number"
            value={range[1]}
            onChange={(e) => handleChange(1, e.target.value)}
            className="outline-none px-4 text-gray-600"
            min="0"
            max="500"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
