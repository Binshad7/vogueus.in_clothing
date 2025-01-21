import React, { useEffect, useState, useCallback } from 'react';
import Input from '../../../../components/admin/AddProduct/Input/Input';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react'
import { validate } from '../validation';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addProductListCategory } from '../../../../store/middlewares/admin/categoryHandle';
// import { updateProduct } from '../../../../store/middlewares/admin/ProductRelate';
import Spinner from '../../../../components/user/Spinner';
import { updateProduct } from '../../../../store/middlewares/admin/ProductRelate';
const DEFAULT_STOCK_ITEMS = [
  { size: 'S', stock: 0, isBlocked: false, status: 'available' },
  { size: 'M', stock: 0, isBlocked: false, status: 'available' },
  { size: 'L', stock: 0, isBlocked: false, status: 'available' },
  { size: 'XL', stock: 0, isBlocked: false, status: 'available' },
  { size: 'XXL', stock: 0, isBlocked: false, status: 'available' },
];

const INITIAL_FORM_STATE = {
  productName: '',
  description: '',
  category: '',
  subcategory: '',
  regularPrice: '',
  currentPrice: '',
  variant: []
};

const INITIAL_ERRORS_STATE = {
  productName: '',
  description: '',
  regularPrice: '',
  category: '',
  subcategory: '',
  variant: '',
  images: '',
  addSize: ''
};

const EditProduct = () => {
  const { productId } = useParams();
  const [images, setImages] = useState(Array(3).fill(null));
  const [imagePreviews, setImagePreviews] = useState(Array(3).fill(null));
  const [existingImages, setExistingImages] = useState([]);
  const [croppingIndex, setCroppingIndex] = useState(null);
  const [cropperRefs] = useState(() => Array(3).fill(null).map(() => React.createRef()));
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [subcategoryId, setSubCategoryId] = useState(null);
  const [stockItems, setStockItems] = useState(DEFAULT_STOCK_ITEMS);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [newSize, setNewSize] = useState('');
  const [errors, setErrors] = useState(INITIAL_ERRORS_STATE);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addProductListingCategory } = useSelector((state) => state.category);
  const { loading, Products } = useSelector((state) => state.AllProducts);

  useEffect(() => {
    if (!productId) {
      navigate(-1);
      return;
    }
    dispatch(addProductListCategory());
  }, [dispatch, productId, navigate]);

  // Initialize form with product data
  useEffect(() => {
    if (Products && addProductListingCategory) {
      const currentProduct = Products.find(item => item._id === productId);
      if (!currentProduct) return;

      const category = addProductListingCategory.find(
        cat => cat._id === currentProduct.category._id
      );

      if (category) {
        setSelectedCategory(category.categoryName);
        setSubcategories(category.subcategories || []);
        setCategoryId(category._id);
        setSubCategoryId(currentProduct.subCategory?._id);
        
        setFormData({
          productName: currentProduct.productName,
          description: currentProduct.description,
          category: currentProduct.category?.categoryName,
          subcategory: currentProduct.subCategory?.subcategoryName,
          regularPrice: currentProduct.regularPrice,
          currentPrice: currentProduct.currentPrice,
          variant: currentProduct.variants
        });

        setStockItems(currentProduct.variants || DEFAULT_STOCK_ITEMS);

        // Handle existing images
        setExistingImages(currentProduct.images || []);

        const previews = currentProduct.images.map(img => img);

        setImagePreviews([...previews, ...Array(3 - previews.length).fill(null)]);

      }
    }
  }, [Products, addProductListingCategory, productId]);

  // category change
  const handleCategoryChange = useCallback((e) => {
    const categoryName = e.target.value;

    const category = addProductListingCategory.find(cat => cat.categoryName === categoryName);
    if (category) {
      setCategoryId(category._id);
      setSelectedCategory(categoryName);
      setSubcategories(category.subcategories || []);
      setSubCategoryId(category.subcategories[0]?._id);

      setFormData(prev => ({
        ...prev,
        category: categoryName,
        subcategory: category.subcategories[0]?.subcategoryName || ''
      }));
    }
  }, [addProductListingCategory]);

  //add new size 
  const handleAddSize = useCallback(() => {
    const trimmedSize = newSize.trim().toUpperCase();
    if (!trimmedSize) {
      toast.error('Please enter a size');
      return;
    }

    if (stockItems.some(item => item.size.toUpperCase() === trimmedSize)) {
      toast.error('This size already exists');
      return;
    }

    setStockItems(prev => [...prev, {
      size: trimmedSize,
      stock: 0,
      isBlocked: false,
      status: 'available'
    }]);
    setNewSize('');
  }, [newSize, stockItems]);
  // handle remove size
  const handleRemoveSize = useCallback((sizeToRemove) => {
    setStockItems(prev => prev.filter(item => item.size !== sizeToRemove));
  }, []);
  // handle on chage in stocks
  const handleStockChange = useCallback((index, value) => {
    const sanitizedValue = value.replace(/^0+(?=\d)/, '');
    const parsedValue = parseInt(sanitizedValue) || 0;

    setStockItems(prev => {
      const newItems = [...prev];
      newItems[index] = {
        ...newItems[index],
        stock: parsedValue,
        status: parsedValue > 0 ? 'available' : 'out of stock'
      };
      return newItems;
    });
  }, []);
  // input change
  const handleInputChange = useCallback((field) => (e) => {
    if (field === 'subcategory') {
      console.log(e.target.value)
      const category = addProductListingCategory.find(cat => cat.categoryName === selectedCategory);
      const subcategory = category?.subcategories?.find(
        subCat => subCat.subcategoryName === e.target.value
      );
      setSubCategoryId(subcategory?._id);
    }

    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  }, [selectedCategory, addProductListingCategory]);

  // image upload 

  const handleImageChange = useCallback((e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only PNG, JPG, and JPEG images are allowed');
      return;
    }

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
  }, []);

  // crop images

  const handleCrop = useCallback(() => {
    const cropper = cropperRefs[croppingIndex]?.current?.cropper;
    if (!cropper) return;

    const croppedImage = cropper.getCroppedCanvas().toDataURL();

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
  }, [croppingIndex, cropperRefs]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData.subcategory)
    console.log(subcategoryId)
    setErrors(INITIAL_ERRORS_STATE);

    if (!validate(formData, imagePreviews, setErrors)) return;

    const formDataToSend = new FormData();
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('regularPrice', formData.regularPrice);
    formDataToSend.append('currentPrice', formData.currentPrice || '0');
    formDataToSend.append('category', categoryId);
    formDataToSend.append('subCategory', subcategoryId);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('variants', JSON.stringify(stockItems));
    formDataToSend.append('oldImages', JSON.stringify(existingImages));
    // Handle new images
    const newImages = images.filter(Boolean);
    const updatedImgesPosstion = []
    imagePreviews.forEach((image, index) => {
      if (image !== existingImages[index]) {
        updatedImgesPosstion.push(index)
      }
    })
    
    formDataToSend.append('updatedImagesPosstion', JSON.stringify(updatedImgesPosstion));
      newImages.forEach((image, index) => {
        const imageFile = base64ToFile(image, `image${index}`);
        formDataToSend.append('images', imageFile);
        console.log(index, '   ', imageFile);

      });
    



    try {
      const result = await dispatch(updateProduct({ id: productId, formData: formDataToSend }));
      if (updateProduct.fulfilled.match(result)) {
        navigate('/admin/product');
      }
    } catch (error) {
      toast.error('Failed to update product. Please try again.');
    }
  };


  // Rest of the component remains similar to AddProduct
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      {loading && <Spinner />}
      <div>
        <ArrowLeft onClick={() => navigate(-1)} />
      </div>
      <h2 className="text-2xl ml-10 font-semibold mb-6">Edit Product</h2>

      <form className="space-y-6">
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
              type="button"
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
                      checked={item.isBlocked}
                      onChange={(e) => {
                        const newStockItems = [...stockItems];
                        newStockItems[index] = {
                          ...newStockItems[index],
                          isBlocked: e.target.checked
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

        {croppingIndex === null && (
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-200 text-blue-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              Update Product
            </button>
          </div>
        )}
      </form >



    </div>
  );
};

export default EditProduct;