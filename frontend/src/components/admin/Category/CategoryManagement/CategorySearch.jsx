import React from 'react'
import { Search, Filter } from 'lucide-react';


const CategorySearch = ({handleSearchChange, searchTerm}) => {
  return (
    <div className="w-64 bg-white border-r border-green-100 p-4 space-y-4 shadow-md">
        <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold text-green-800 flex items-center">
            <Filter size={20} className="mr-2 text-green-700" />
            Category Filters
            </h2>
        </div>

        <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
            <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
        </div>
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-green-700">Filter Options</h3>
            <div className="space-y-1">
                <label className="flex items-center space-x-2">
                    <input 
                        type="checkbox" 
                        className="form-checkbox text-green-600 rounded"
                    />
                    <span className="text-sm text-green-800">With Subcategories</span>
                    </label>
                    <label className="flex items-center space-x-2">
                    <input 
                        type="checkbox" 
                        className="form-checkbox text-green-600 rounded"
                    />
                    <span className="text-sm text-green-800">Empty Categories</span>
                </label>
            </div>
        </div>
    </div>
  )
}

export default CategorySearch
