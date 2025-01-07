import React, { useState, useEffect } from 'react';
import { validateCategory } from './validation';
import toast from "react-hot-toast"

const AddCategoryModal = ({ isOpen, onClose, parentName, child }) => {
  console.log(child, parentName)
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [error, setError] = useState({
    name: null,
    description: null
  })

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    let isError = validateCategory(formData);

    if(isError.name || isError.description){
      return setError(isError)
    };
         

    console.log('category Name: ',formData.name,',  desciption   :',formData.description)


  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center p-4
        ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'} ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
    >
      <div 
        className={`bg-white rounded-lg max-w-md w-full p-6 transform transition-all duration-300
          ${isAnimating ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}
          animate-[wave_0.5s_ease-in-out]`}
        style={{
          animation: isAnimating ? 'wave 0.5s ease-in-out' : 'none'
        }}
      >
        <style jsx>{`
          @keyframes wave {
            0% {
              transform: scale(0.95) translateY(10px) rotateX(-10deg);
              opacity: 0;
            }
            50% {
              transform: scale(1.02) translateY(-5px) rotateX(5deg);
            }
            100% {
              transform: scale(1) translateY(0) rotateX(0);
              opacity: 1;
            }
          }
        `}</style>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-green-700">
            Add New{child && " Sub"} Category
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className='text-red-700'>{error.name && error.name}</div>
            <label 
              htmlFor="name" 
              className="block text-green-700 font-medium"
            >
              Category Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter category name"
              required
            />  
          </div>

          <div className="space-y-2">
            <div className='text-red-700'>{error?.description}</div>
            <label 
              htmlFor="description" 
              className="block text-green-700 font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[100px]"
              placeholder="Enter category description"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-green-200 rounded-md text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-200 rounded-md text-green-700 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;