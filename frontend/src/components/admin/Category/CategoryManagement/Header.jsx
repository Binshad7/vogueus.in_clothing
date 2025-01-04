import {  
    Search, 
    Plus, 
    Tag, 
    List 
  } from 'lucide-react';
// Header Component with Brand and Add Category Button
const Header = ({ onAddCategory }) => (
  <div className="bg-white border-b border-green-100 py-4">
    <div className="max-w-6xl mx-auto px-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Tag size={24} className="text-green-700" />
          <h1 className="text-2xl font-bold text-green-800">Category Management</h1>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-100 rounded-md text-blue-700 hover:bg-blue-200 transition-colors">
            <List size={20} className="mr-2" />
            View All
          </button>
          <button
            onClick={onAddCategory}
            className="flex items-center px-4 py-2 bg-green-200 rounded-md text-green-700 hover:bg-green-300 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Category
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Header