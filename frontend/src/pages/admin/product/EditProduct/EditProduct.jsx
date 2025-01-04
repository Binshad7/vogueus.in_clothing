import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import axios from 'axios'
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'wL7wUcULdXgc55qs4MC4fj-tCN8';
// Error Message Component
const ErrorMessage = ({ error }) => {
  if (!error) return null;
  return <p className="text-red-500 text-sm mt-1">{error}</p>;
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
  </div>
);

// Stock Manager Component
const StockManager = ({ stock, onChange, error }) => {
  const handleQuantityChange = (index, newQuantity) => {
    const newStock = [...stock];
    newStock[index].quantity = parseInt(newQuantity) || 0;
    onChange(newStock);
  };

  const handleAddSize = () => {
    onChange([...stock, { size: '', quantity: 0 }]);
  };

  const handleRemoveSize = (index) => {
    const newStock = stock.filter((_, i) => i !== index);
    onChange(newStock);
  };

  const handleSizeChange = (index, newSize) => {
    const newStock = [...stock];
    newStock[index].size = newSize;
    onChange(newStock);
  };

  return (
    <div className="space-y-4">
      {stock.map((item, index) => (
        <div key={index} className="flex gap-4 items-center">
          <select
            value={item.size}
            onChange={(e) => handleSizeChange(index, e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Size</option>
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(index, e.target.value)}
            className="p-2 border rounded"
            min="0"
            placeholder="Quantity"
          />
          <button
            onClick={() => handleRemoveSize(index)}
            className="p-2 text-red-500 hover:text-red-700"
            type="button"
          >
            Remove
          </button>
        </div>
      ))}
      <ErrorMessage error={error} />
      <button
        onClick={handleAddSize}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        type="button"
      >
        Add Size
      </button>
    </div>
  );
};
const ImageEditor = ({ image, onSave, onClose }) => {
  const cropperRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCrop = async () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;

    if (cropper) {
      setIsLoading(true);
      try {
        const croppedCanvas = cropper.getCroppedCanvas();
        const blob = await new Promise(resolve => croppedCanvas.toBlob(resolve, 'image/jpeg'));
        
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await axios.post(CLOUDINARY_URL, formData);
        onSave(response.data.secure_url);
      } catch (error) {
        console.error('Image cropping/upload failed:', error);
      } finally {
        setIsLoading(false);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg max-w-4xl w-full relative">
        {isLoading && <LoadingSpinner />}
        <Cropper
          ref={cropperRef}
          src={image}
          className="h-96"
          aspectRatio={1}
          guides={true}
          preview=".preview"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={isLoading}
            type="button"
          >
            Cancel
          </button>
          <button 
            onClick={handleCrop}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
            type="button"
          >
            {isLoading ? 'Processing...' : 'Crop & Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Image Manager Component
const ImageManager = ({ images, onChange, error }) => {
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setShowCropper(true);
    }
    e.target.value = '';
  };

  const handleSaveCroppedImage = (cloudinaryUrl) => {
    const newImages = [...images];
    console.log(newImages,"new images", cloudinaryUrl," cloudinary")
    newImages[editingIndex] = cloudinaryUrl;
    onChange(newImages);
  };

  const handleAddImage = () => {
    if (images.length < 3) {
      setEditingIndex(images.length);
      fileInputRef.current?.click();
    }
  };

  const handleReplaceImage = (index) => {
    setEditingIndex(index);
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img 
              src={image} 
              alt={`Product ${index + 1}`} 
              className="w-full h-40 object-cover rounded"
            />
            {loadingStates[index] && <LoadingSpinner />}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => handleReplaceImage(index)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                type="button"
              >
                Replace
              </button>
              <button
                onClick={() => handleRemoveImage(index)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                type="button"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {images.length < 5 && (
          <button
            onClick={handleAddImage}
            className="h-40 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:border-gray-400 transition-colors"
            type="button"
          >
            <span className="text-gray-500">Add Image</span>
          </button>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />
      
      <ErrorMessage error={error} />
      
      {showCropper && selectedImage && (
        <ImageEditor
          image={selectedImage}
          onSave={handleSaveCroppedImage}
          onClose={() => {
            setShowCropper(false);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
};

// Main Product Editor Modal Component
const ProductEditorModal = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    productName: initialData?.name || '',
    description: initialData?.description || '',
    currentPrice: initialData?.currentPrice || '',
    regularPrice: initialData?.regularPrice || '',
    category: initialData?.category || '',
    subcategory: initialData?.subcategory || '',
    quantity: initialData?.quantity || 0,
    status: initialData?.status || true,
    stock: initialData?.stock || []
  });

  const [images, setImages] = useState(initialData?.images || [
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300'
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (formData, images) => {
    const newErrors = {};

    if (!formData.productName || formData.productName.length < 3) {
      newErrors.productName = 'Product name must be at least 3 characters long';
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.regularPrice || parseFloat(formData.regularPrice) <= 0) {
      newErrors.regularPrice = 'Regular price must be greater than 0';
    }

    if (formData.currentPrice && parseFloat(formData.currentPrice) >= parseFloat(formData.regularPrice)) {
      newErrors.currentPrice = 'Current price must be less than regular price';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData, images);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        onClose();
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to save product. Please try again.'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto relative">
        {isSubmitting && (
          <div className="absolute inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-2">Saving changes...</span>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({...formData, productName: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Enter product name"
            />
            <ErrorMessage error={errors.productName} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="Enter product description"
            />
            <ErrorMessage error={errors.description} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Regular Price</label>
              <input
                type="number"
                value={formData.regularPrice}
                onChange={(e) => setFormData({...formData, regularPrice: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              <ErrorMessage error={errors.regularPrice} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Current Price (Optional)</label>
              <input
                type="number"
                value={formData.currentPrice}
                onChange={(e) => setFormData({...formData, currentPrice: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              <ErrorMessage error={errors.currentPrice} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stock Management</label>
            <StockManager
              stock={formData.stock}
              onChange={(newStock) => setFormData({...formData, stock: newStock})}
              error={errors.stock}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product Images</label>
            <ImageManager
              images={images}
              onChange={setImages}
              error={errors.images}
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditorModal;