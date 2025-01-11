import React, { useEffect, useState } from 'react';
import Input from '../../../components/admin/AddProduct/Input/Input';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import toast from 'react-hot-toast';
import { validate } from './validation';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addProductListCategory } from '../../../store/middlewares/admin/categoryHandle';

const AddProduct = () => {
  const [images, setImages] = useState([null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);
  const [croppingIndex, setCroppingIndex] = useState(null);
  const [cropperRefs, setCropperRefs] = useState([React.createRef(), React.createRef(), React.createRef()]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addProductListingCategory, loading } = useSelector((state) => state.category);

  // Stock state with dynamic sizes
  const [stockItems, setStockItems] = useState([
    { size: 'S', quantity: 0 },
    { size: 'M', quantity: 0 },
    { size: 'L', quantity: 0 },
    { size: 'XL', quantity: 0 }
  ]);

  // State for custom size input
  const [newSize, setNewSize] = useState('');

  const [errors, setErrors] = useState({
    productName: '',
    description: '',
    regularPrice: '',
    stock: '',
    image: ""
  });

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: '',
    subcategory: '',
    quantity: '',
    regularPrice: '',
    currentPrice: '',
    images: [],
    stock: []
  });

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(addProductListCategory());
  }, [dispatch]);

  // Set initial category and subcategory when categories are loaded
  useEffect(() => {
    if (addProductListingCategory && addProductListingCategory.length > 0) {
     
        
        const initialCategory = addProductListingCategory[0]?.categoryName || '';
        const initialSubcategories = addProductListingCategory[0]?.subcategories || [];
       
        setSelectedCategory(initialCategory);
        setSubcategories(initialSubcategories);

        setFormData(prev => ({
          ...prev,
          category: initialCategory,
          subcategory: initialSubcategories[0]?.subcategoryName || ''
        }));
     
    }
  }, [addProductListingCategory]);

  // Handle adding new size
  const handleAddSize = () => {
    if (!newSize.trim()) {
      toast.error('Please enter a size');
      return;
    }

    if (stockItems.some(item => item.size.toLowerCase() === newSize.toLowerCase())) {
      toast.error('This size already exists');
      return;
    }

    setStockItems(prev => [...prev, { size: newSize.toUpperCase(), quantity: 0 }]);
    setNewSize('');
  };

  // Handle removing size
  const handleRemoveSize = (sizeToRemove) => {
    setStockItems(prev => prev.filter(item => item.size !== sizeToRemove));
  };

  // Handle stock quantity changes
  const handleStockChange = (index, value) => {
    const newStockItems = [...stockItems];
    newStockItems[index].quantity = parseInt(value) || 0;
    setStockItems(newStockItems);

    const totalQuantity = newStockItems.reduce((sum, item) => sum + item.quantity, 0);
    setFormData(prev => ({
      ...prev,
      quantity: totalQuantity.toString(),
      stock: newStockItems
    }));
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategoryName = e.target.value;
    const selectedCategoryData = addProductListingCategory.find(cat => cat.categoryName === selectedCategoryName);

    setSelectedCategory(selectedCategoryName);
    setSubcategories(selectedCategoryData?.subcategories || []);

    setFormData(prev => ({
      ...prev,
      category: selectedCategoryName,
      subcategory: selectedCategoryData?.subcategories[0]?.subcategories || ''
    }));
  };

  // Handle input changes for other fields
  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Image handling functions
  const handleImageChange = (e, index) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreviews(prev => {
          const newPreviews = [...prev];
          newPreviews[index] = reader.result;
          return newPreviews;
        });
        setCroppingIndex(index);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    const cropper = cropperRefs[croppingIndex]?.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      const croppedImage = croppedCanvas.toDataURL();

      setImages(prev => {
        const newImages = [...prev];
        newImages[croppingIndex] = croppedImage;
        return newImages;
      });

      setImagePreviews(prev => {
        const newPreviews = [...prev];
        newPreviews[croppingIndex] = croppedImage;
        return newPreviews;
      });

      setCroppingIndex(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValidate = validate(formData, imagePreviews, setErrors);
    if (!isValidate) return;
     


    // Check if at least one size has stock
    const hasStock = stockItems.some(item => item.quantity > 0);
    if (!hasStock) {
      setErrors(prev => ({
        ...prev,
        stock: 'At least one size must have stock quantity'
      }));
      return;
    }

    const newFormData = new FormData();
    newFormData.append('name', formData.productName);
    newFormData.append('category', formData.subcategory);
    newFormData.append('description', formData.description);
    newFormData.append('currentPrice', formData.currentPrice);
    newFormData.append('quantity', formData.quantity);
    newFormData.append('regularPrice', formData.regularPrice);
    newFormData.append('stock', JSON.stringify(stockItems));

    imagePreviews.forEach((img, i) => {
      if (img) {
        const newImgFile = base64ToFile(img, `image${i}.jpg`);
        newFormData.append("images", newImgFile);
      }
    });

    console.log('With all values : = ',newFormData)

    try {
      // Add your API call here to save the product
      console.log('Form submitted successfully');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data || error.message);
      console.error(error);
    }
  };

  // Helper function to convert base64 to file
  const base64ToFile = (base64String, filename) => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Add Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Product Name"
          value={formData.productName}
          onChange={handleInputChange('productName')}
          placeholder="Enter product name"
          onError={errors?.productName}
        />

        <Input
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={handleInputChange('description')}
          placeholder="Enter product description"
          onError={errors?.description}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Category"
            type="select"
            value={formData.category}
            onChange={handleCategoryChange}
            placeholder="Select Category"
            options={addProductListingCategory || []}
          />

          <Input
            label="Subcategory"
            type="Subcategory"
            value={formData.subcategory}
            onChange={handleInputChange('subcategory')}
            placeholder="Select Subcategory"
            options={subcategories || []}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Regular Price"
            type="number"
            value={formData.regularPrice}
            onChange={handleInputChange('regularPrice')}
            placeholder="Enter regular price"
            onError={errors?.regularPrice}
          />

          <Input
            label="Current Price"
            type="number"
            value={formData.currentPrice}
            onChange={handleInputChange('currentPrice')}
            placeholder="Enter current price"
          />
        </div>

        {/* Stock Management Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Stock Management</h3>

          <div className="flex gap-2 items-end mb-4">
            <div className="flex-grow max-w-xs">
              <Input
                label="Add New Size"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Enter size (e.g., XXL)"
              />
            </div>
            <button
              type="button"
              onClick={handleAddSize}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Size
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stockItems.map((item, index) => (
              <div key={item.size} className="relative p-4 border rounded-lg">
                <button
                  type="button"
                  onClick={() => handleRemoveSize(item.size)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Size {item.size}</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleStockChange(index, e.target.value)}
                    min="0"
                    className="w-full p-2 border rounded-md"
                    placeholder="Quantity"
                  />
                </div>
              </div>
            ))}
          </div>
          {errors.stock && (
            <p className="text-red-500 text-sm">{errors.stock}</p>
          )}
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
            {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
          </label>
          <div className="grid grid-cols-3 gap-4">
            {croppingIndex !== null ? (
              <div>
                <Cropper
                  ref={cropperRefs[croppingIndex]}
                  src={imagePreviews[croppingIndex]}
                  style={{ height: 400, width: 300 }}
                  aspectRatio={1}
                  guides={false}
                  scalable={true}
                  cropBoxResizable={true}
                />
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={handleCrop}
                >
                  Crop Image
                </button>
              </div>
            ) : (
              [0, 1, 2].map((index) => (
                <div key={index} className="relative">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-40 flex items-center justify-center">
                    {imagePreviews[index] ? (
                      <img
                        src={imagePreviews[index]}
                        alt={`Preview ${index + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span>Upload Image</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-green-200 text-green-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
