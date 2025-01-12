import React, { useEffect, useState, useRef } from 'react';
import { ImageIcon, X } from 'lucide-react';
import { addProductListCategory } from '../../../store/middlewares/admin/categoryHandle'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { validate } from '../../../pages/admin/product/validation'

export default function EnhancedAddProduct() {

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const [variants, setVariants] = useState([]);
  const [newSize, setNewSize] = useState("");
  const [availableSubcategories, setAvailableSubcategories] = useState([]);


  const [errors, setErrors] = useState({
    productName: '',
    description: '',
    Price: '',
    category: '',
    subCategory: ''
  });



  // Add new state for image cropping
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 90,
    aspect: 1
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [currentVariantIndex, setCurrentVariantIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [colors, setColors] = useState(null)
  const [imageName, setImageName] = useState(null)
  const imgRef = useRef(null);

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(addProductListCategory())
  }, [])

  const { addProductListingCategory } = useSelector((state) => state.category);


  // Sample categories data



  useEffect(() => {
    if (addProductListingCategory && addProductListingCategory.length > 0) {
      const initialCategory = addProductListingCategory[0]?.categoryName || '';
      setCategory(initialCategory);

      // Set available subcategories for the initial category
      const initialSubcategories = addProductListingCategory[0]?.subcategories || [];
      setAvailableSubcategories(initialSubcategories);

      // Set first subcategory as default if available
      if (initialSubcategories.length > 0) {
        setSubcategory(initialSubcategories[0].subcategoryName);
      }
    }
  }, [addProductListingCategory]);


  const defaultSizes = {
    s: 0,
    m: 0,
    l: 0,
    xl: 0
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        color: "",
        images: [null, null, null],
        stock: { ...defaultSizes },
        regularPrice: 0,
        salePrice: 0,
        onSale: false
      },
    ]);
  };

  const handleUpdateVariant = (index, key, value) => {
    const updatedVariants = [...variants];
    if (key === "images") {
      const imageIndex = value.imageIndex;
      const file = value.file;
      updatedVariants[index].images[imageIndex] = file;
    } else if (key === "stock") {
      updatedVariants[index].stock = { ...updatedVariants[index].stock, ...value };
    } else {
      updatedVariants[index][key] = value;
    }
    setVariants(updatedVariants);
  };

  const handleRemoveImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].images[imageIndex] = null;
    setVariants(updatedVariants);
  };

  const handleAddSize = (variantIndex) => {
    if (!newSize.trim()) {
      alert('Please enter a size');
      return;
    }

    const sizeKey = newSize.toLowerCase();
    const updatedVariants = [...variants];

    if (updatedVariants[variantIndex].stock[sizeKey] !== undefined) {
      toast.error('Size already exists');
      return;
    }

    updatedVariants[variantIndex].stock = {
      ...updatedVariants[variantIndex].stock,
      [sizeKey]: 0
    };

    setVariants(updatedVariants);
    setNewSize("");
  };

  const handleRemoveSize = (variantIndex, size) => {
    const updatedVariants = [...variants];
    const { [size]: _, ...remainingSizes } = updatedVariants[variantIndex].stock;
    updatedVariants[variantIndex].stock = remainingSizes;
    setVariants(updatedVariants);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);

    // Find selected category's subcategories
    const categoryData = addProductListingCategory.find(
      cat => cat.categoryName === selectedCategory
    );

    const newSubcategories = categoryData?.subcategories || [];
    setAvailableSubcategories(newSubcategories);

    // Reset subcategory selection
    setSubcategory(newSubcategories.length > 0 ? newSubcategories[0].subcategoryName : '');
  };

  // Add image cropping functions
  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const crop = {
      unit: '%',
      width: 90,
      x: 5,
      y: 5,
      aspect: 1
    };
    setCrop(crop);
  };

  const getCroppedImg = async (image, crop) => {
    console.log('in get Crop :', image.src, '    ', crop)
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }

        blob.name = colors ? `${colors}-cropped-${imageName}` : `${imageName}`;
        resolve(blob);
      }, 'image/jpeg', 1);
    });
  };

  // Modify handleUpdateVariant to handle cropped images
  const handleImageUpload = (variantIndex, imageIndex, e) => {
    if (e.target.files?.[0]) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(e.target.files?.[0].type)) {
        toast.error("Only PNG, JPG, and JPEG files are allowed.");
        return
      }
      setColors(variants[variantIndex].color)
      setImageName(e.target.files?.[0].name)
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImage(reader.result);
        setCurrentVariantIndex(variantIndex);
        setCurrentImageIndex(imageIndex);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropComplete = async () => {
    if (!imgRef.current || !completedCrop) return;

    try {
      const croppedImageBlob = await getCroppedImg(
        imgRef.current,
        completedCrop
      );

      const updatedVariants = [...variants];
      updatedVariants[currentVariantIndex].images[currentImageIndex] = croppedImageBlob;
      setVariants(updatedVariants);
      setCropModalOpen(false);
      setCurrentImage(null);
      setCompletedCrop(null);
    } catch (e) {
      console.error('Error cropping image:', e);
      toast.error('Failed to crop image');
    }
  };

  const handleSubmitProduct = async () => {
    const isValid = variants.every(variant =>
      variant.images.filter(img => img !== null).length === 3
    );
    const errorSubmit = await validate(productName, description, category, subcategory);
    if (Object.keys(errorSubmit).length > 0) {
      setErrors(errorSubmit)
      return
    }
    if (!isValid) {
      toast.error('Each variant must have exactly 3 images!')
      return;
    }

    const productData = {
      productName,
      description,
      category,
      subcategory,
      variants: variants.map(variant => ({

        ...variant,
        images: variant.images.map(file => file.name)
      }))
    };
    console.log('Product Data:', productData);
    toast.error('Product submission simulated!')
  }
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>

      {/* Base Product Info */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name:
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            className="w-full p-2 border rounded-md"
            rows={4}
          />
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category:
            </label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Category</option>
              {addProductListingCategory?.map((cat) => (
                <option key={cat._id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory:
            </label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={!category}
            >
              <option value="">Select Subcategory</option>
              {availableSubcategories.map((sub) => (
                <option key={sub._id} value={sub.subcategoryName}>
                  {sub.subcategoryName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-6" />

      {/* Variants Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Product Variants</h2>
        <button
          onClick={handleAddVariant}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Variant
        </button>

        <div className="space-y-6">
          {variants.map((variant, variantIndex) => (
            <div key={variantIndex} className="border rounded-lg p-6 space-y-6 bg-gray-50">
              <h3 className="font-medium text-lg">Variant {variantIndex + 1}</h3>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color:
                </label>
                <input
                  type="text"
                  value={variant.color}
                  onChange={(e) => handleUpdateVariant(variantIndex, "color", e.target.value)}
                  placeholder="Enter color"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Enhanced Price Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Regular Price:
                  </label>
                  <input
                    type="number"
                    value={variant.regularPrice}
                    onChange={(e) => handleUpdateVariant(variantIndex, "regularPrice", Number(e.target.value))}
                    placeholder="Enter regular price"
                    className="w-full p-2 border rounded-md"
                    min="0"
                  />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={variant.onSale}
                    onChange={(e) => handleUpdateVariant(variantIndex, "onSale", e.target.checked)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    On Sale
                  </label>
                </div>

                {variant.onSale && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sale Price:
                    </label>
                    <input
                      type="number"
                      value={variant.salePrice}
                      onChange={(e) => handleUpdateVariant(variantIndex, "salePrice", Number(e.target.value))}
                      placeholder="Enter sale price"
                      className="w-full p-2 border rounded-md"
                      min="0"
                      max={variant.regularPrice}
                    />
                    {variant.regularPrice > 0 && variant.salePrice > 0 && (
                      <span className="text-sm text-gray-500 mt-1 block">
                        Discount: {Math.round((1 - variant.salePrice / variant.regularPrice) * 100)}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Images (Exactly 3 required):
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[0, 1, 2].map((imageIndex) => (
                    <div
                      key={imageIndex}
                      className="relative border-2 border-dashed rounded-lg p-4 hover:border-blue-500 transition-colors"
                    >
                      {variant.images[imageIndex] ? (
                        <div className="relative">
                          <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                            <img
                              src={URL.createObjectURL(variant.images[imageIndex])}
                              alt={`Product ${imageIndex + 1}`}
                              className="max-h-full max-w-full object-contain rounded-lg"
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveImage(variantIndex, imageIndex)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <div className="aspect-square rounded-lg bg-gray-100 flex flex-col items-center justify-center gap-2">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                            <span className="text-sm text-gray-500">Click to upload image {imageIndex + 1}</span>
                          </div>
                          <input
                            type="file"
                            accept="image/png, image/jpg, image/jpeg"
                            className="hidden"
                            onChange={(e) => handleImageUpload(variantIndex, imageIndex, e)}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {cropModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-4xl w-full">
                    <h3 className="text-lg font-medium mb-4">Crop Image</h3>
                    <div className="max-h-[60vh] overflow-auto">
                      <ReactCrop
                        crop={crop}
                        onChange={c => setCrop(c)}
                        onComplete={c => setCompletedCrop(c)}
                        aspect={1}
                      >
                        <img
                          ref={imgRef}
                          src={currentImage}
                          onLoad={onImageLoad}
                          alt="Crop me"
                        />
                      </ReactCrop>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        onClick={() => {
                          setCropModalOpen(false);
                          setCurrentImage(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={handleCropComplete}
                      >
                        Apply Crop
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Stock with Dynamic Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock:
                </label>

                {/* Add New Size Input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value.toUpperCase())}
                    placeholder="Enter new size (e.g., XXL)"
                    className="flex-1 p-2 border rounded-md"
                  />
                  <button
                    onClick={() => handleAddSize(variantIndex)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Add Size
                  </button>
                </div>

                {/* Size Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(variant.stock).map(([size, quantity]) => (
                    <div key={size} className="relative">
                      <button
                        onClick={() => handleRemoveSize(variantIndex, size)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                      <label className="block text-sm font-medium text-gray-600">
                        {size.toUpperCase()}:
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          handleUpdateVariant(variantIndex, "stock", {
                            [size]: Number(e.target.value),
                          })
                        }
                        className="w-full p-2 border rounded-md"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {variants.length > 0 && (
        <button
          className="mt-6 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={handleSubmitProduct}
        >
          Submit Product
        </button>
      )}
    </div>
  );
} 