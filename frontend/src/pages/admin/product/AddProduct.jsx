import React, { useEffect, useState } from 'react';
import Input from '../../../components/admin/AddProduct/Input/Input';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { toast } from 'react-toastify';
import { validate } from './validation';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addProductListCategory } from '../../../store/middlewares/admin/categoryHandle';
import { addProdcut } from '../../../store/middlewares/admin/addProductHandle';

const AddProduct = () => {
  const [images, setImages] = useState([null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);
  const [croppingIndex, setCroppingIndex] = useState(null);
  const [cropperRefs, setCropperRefs] = useState([React.createRef(), React.createRef(), React.createRef()]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [subcategoryId, setSubCategoryId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addProductListingCategory, loading } = useSelector((state) => state.category);
  // Modified stock state structure

  // Initial stock state
  const [stockItems, setStockItems] = useState([
    { size: 'S', stock: 0, isUnlist: false, status: 'available' },
    { size: 'M', stock: 0, isUnlist: false, status: 'available' },
    { size: 'L', stock: 0, isUnlist: false, status: 'available' },
    { size: 'XL', stock: 0, isUnlist: false, status: 'available' },
    { size: 'XLL', stock: 0, isUnlist: false, status: 'available' },
  ]);

  // Update formData initial state
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: '',
    subcategory: '',
    regularPrice: '',
    currentPrice: '',
    variant: [] // This will store the final stock data
  });

  // State for custom size input
  const [newSize, setNewSize] = useState('');

  const [errors, setErrors] = useState({
    productName: '',
    description: '',
    regularPrice: '',
    category: '',
    subcategory: '',
    variant: '',
    images: '',
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
      setCategoryId(addProductListingCategory[0]?._id);
      setSelectedCategory(initialCategory);
      setSubcategories(initialSubcategories);
      setSubCategoryId(initialSubcategories[0]?._id);

      setFormData(prev => ({
        ...prev,
        category: initialCategory,
        subcategory: initialSubcategories[0]?.subcategoryName || ''
      }));
    }
  }, [addProductListingCategory]);

  // Modified handleAddSize function

  // Modified handleAddSize function
  const handleAddSize = () => {
    if (!newSize.trim()) {
      toast.error('Please enter a size');
      return;
    }

    const sizeKey = newSize.toUpperCase();
    if (stockItems.some(item => item.size === sizeKey)) {
      toast.error('This size already exists');
      return;
    }

    setStockItems(prev => [...prev, {
      size: sizeKey,
      stock: 0,
      isUnlist: false,
      status: 'available'
    }]);
    setNewSize('');
  };

  // Modified handleRemoveSize function
  const handleRemoveSize = (sizeToRemove) => {
    setStockItems(prev => prev.filter(item => item.size !== sizeToRemove));
  };

  // Modified handleStockChange function
  const handleStockChange = (index, value) => {
    const newStockItems = [...stockItems];
    newStockItems[index] = {
      ...newStockItems[index],
      stock: parseInt(value) || 0,
      status: parseInt(value) > 0 ? 'available' : 'out of stock'
    };
    setStockItems(newStockItems);

    // Update formData with new variant array
    setFormData(prev => ({
      ...prev,
      variant: newStockItems
    }));
  };
  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategoryName = e.target.value;
    const selectedCategoryData = addProductListingCategory.find(cat => cat.categoryName === selectedCategoryName);
    setCategoryId(selectedCategoryData?._id);
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
    // setErrors({
    //   productName: '',
    //   description: '',
    //   regularPrice: '',
    //   category: '',
    //   subcategory: '',
    //   stock: '',
    //   image: ''
    // });
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Image handling functions
  const handleImageChange = (e, index) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log(file);

      const validImgType = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validImgType.includes(file.type)) {
        toast.error('Only PNG, JPG, and JPEG images are allowed');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => {
          const newPreviews = [...prev];
          newPreviews[index] = reader.result; // Ensure specific index is updated
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

      setImages((prev) => {
        const newImages = [...prev];
        newImages[croppingIndex] = croppedImage; // Replace only at the croppingIndex
        return newImages.filter((img, index) => img && newImages.indexOf(img) === index); // Remove duplicates
      });

      setImagePreviews((prev) => {
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

    setErrors({
      productName: '',
      description: '',
      regularPrice: '',
      category: '',
      subcategory: '',
      variant: '',
      images: '',
      addSize: ''
    })

    setFormData(prev => ({
      ...prev,
      variant: stockItems
    }));

    let isValidate = validate(formData, imagePreviews, setErrors);
    if (!isValidate) return;


    const newFormData = new FormData();
    newFormData.append('name', formData.productName);
    newFormData.append('category', formData.subcategory);
    newFormData.append('description', formData.description);
    newFormData.append('currentPrice', formData.currentPrice);
    newFormData.append('regularPrice', formData.regularPrice);
    newFormData.append('variants', JSON.stringify(stockItems));

    // Filter out null/undefined values and only append unique images

    // Remove duplicates (if any)
    const validImages = images.filter((img) => img !== null); // Remove null/undefined entries
    const uniqueImages = [...new Set(validImages)]; // Remove exact duplicates

    uniqueImages.forEach((img, i) => {
      const newImgFile = base64ToFile(img, `image${i}`);
      console.log(i)
      newFormData.append("images", newImgFile);
    });

    newFormData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    dispatch(addProdcut(newFormData));
  };

  // Helper function to convert base64 to file
  const base64ToFile = (base64String, filename) => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1]; // Extract MIME type
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    // Get the file extension based on the MIME type
    const extension = mime.split('/')[1]; // For example, 'jpeg' or 'png'
    const updatedFilename = `${filename}.${extension}`;

    return new File([u8arr], updatedFilename, { type: mime });
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
            categoryError={errors.category}
          />
          <Input
            label="Subcategory"
            type="Subcategory"
            value={formData.subcategory}
            onChange={handleInputChange('subcategory')}
            placeholder="Select Subcategory"
            options={subcategories || []}
            subCategoryError={errors.subcategory}
          />

        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              label="Regular Price"
              type="number"
              value={formData.regularPrice}
              onChange={handleInputChange('regularPrice')}
              placeholder="Enter regular price"
            />
            {errors.regularPrice && (
              <p className="text-red-500 text-sm">{errors.regularPrice}</p>
            )}
          </div>

          <div>
            <Input
              label="Current Price"
              type="number"
              value={formData.currentPrice}
              onChange={handleInputChange('currentPrice')}
              placeholder="Enter current price"
            />
            {errors.currentPrice && (
              <p className="text-red-500 text-sm">{errors.currentPrice}</p>
            )}
          </div>
        </div>


        {/* Stock Management Section */}
        <div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value.toUpperCase())}
              placeholder="Enter new size (e.g., XXL)"
              className="flex-1 p-2 border rounded-md"
            />
            <button
              onClick={handleAddSize}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add Size
            </button>
          </div>
          {errors?.variant && <p className='text-red-700'>{errors?.variant}</p>}

          {/* Size Grid */}
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
                    value={item.stock}
                    onChange={(e) => handleStockChange(index, e.target.value)}
                    min="0"
                    className="w-full p-2 border rounded-md"
                    placeholder="Quantity"
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={item.isUnlist}
                      onChange={(e) => {
                        const newStockItems = [...stockItems];
                        newStockItems[index] = {
                          ...newStockItems[index],
                          isUnlist: e.target.checked
                        };
                        setStockItems(newStockItems);
                        setFormData(prev => ({
                          ...prev,
                          variant: newStockItems
                        }));
                      }}
                      className="mr-2"
                    />
                    <label className="text-sm">Unlist</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>




        {/* Image Upload Section */}
        < div >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
            {errors.images && (
              <p className="text-red-500 text-sm">{errors.images}</p>
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
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => setCroppingIndex(null)}
                >
                  Crop Image cancel
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
                      accept="image/png,image/jpg,image/jpeg"
                      onChange={(e) => handleImageChange(e, index)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div >

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-green-200 text-green-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800"
          >
            Save Product
          </button>
        </div>
      </form >
    </div >
  );
};

export default AddProduct;