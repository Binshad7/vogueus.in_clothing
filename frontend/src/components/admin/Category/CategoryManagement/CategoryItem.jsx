
import { 
    ChevronRight, 
    Edit, 
    FolderPlus, 
  } from 'lucide-react';
import { useState } from 'react'; 
// Category Item Component with Expanded View and Actions
const CategoryItem = ({ category, level = 0, onEdit, onAddSub }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.subCategories && category.subCategories.length > 0;

  return (
    <div className="select-none">
      <div 
        className={`
          group flex items-center p-3 rounded-lg mb-1
          transition-all duration-300 ease-out
          hover:bg-green-100
          ${level === 0 ? 'bg-green-50 shadow-sm' : 'bg-green-100 shadow-md'}
        `}
      >
        {/* Chevron for Expanding */}
        <div 
          className={`
            mr-2 transition-transform duration-300 cursor-pointer
            ${hasChildren ? 'visible' : 'invisible'}
            ${isExpanded ? 'rotate-90' : 'rotate-0'}
          `}
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        >
          <ChevronRight size={16} className="text-green-700" />
        </div>
        
        {/* Category Details */}
        <div className="flex-1" onClick={() => hasChildren && setIsExpanded(!isExpanded)}>
          <span className="font-medium text-green-700">{category.name}</span>
          {category.description && (
            <p className="text-sm text-green-600 mt-1">{category.description}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(category)}
            className="p-1 hover:bg-green-200 rounded-md transition-colors"
            title="Edit Category"
          >
            <Edit size={16} className="text-green-700" />
          </button>
          <button
            onClick={() => onAddSub(category)}
            className="p-1 hover:bg-green-200 rounded-md transition-colors"
            title="Add Subcategory"
          >
            <FolderPlus size={16} className="text-green-700" />
          </button>
        </div>
        
        {/* Subcategory Count */}
        {hasChildren && (
          <span className="text-sm text-green-600 ml-2">
            {category.subCategories.length} items
          </span>
        )}
      </div>

      {/* Nested Subcategories (Now limited to one level) */}
      {hasChildren && (
        <div 
          className={`
            ml-6 pl-4 border-l border-green-200
            transition-all duration-300 ease-out origin-top
            ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
          `}
        >
          {category.subCategories.map((subCategory, index) => (
            <div 
              key={subCategory.id || index} 
              className="flex items-center p-2 rounded-lg hover:bg-green-50"
            >
              <span className="flex-1 text-green-700">{subCategory.name}</span>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(subCategory)}
                  className="p-1 hover:bg-green-200 rounded-md transition-colors"
                  title="Edit Subcategory"
                >
                  <Edit size={14} className="text-green-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryItem