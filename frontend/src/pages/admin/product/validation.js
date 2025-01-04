export const validate = (formData, images, setErrors) => {
  const newErrors = {};

  // Validate productName: should not contain special characters and minimum length 3 (ignoring spaces)
  const namePattern = /^[A-Za-z0-9 ]+$/;
  if (!formData.productName || formData.productName.length < 3 || !namePattern.test(formData.productName.trim())) {
      newErrors.productName = 'Product name must be at least 3 characters long and cannot contain special characters.';
  }

  // Validate description: should not contain special characters and minimum length 3 (ignoring spaces)
  if (!formData.description || formData.description.length < 3 || !namePattern.test(formData.description.trim())) {
      newErrors.description = 'Description must be at least 3 characters long and cannot contain special characters.';
  }

  // Validate category
  if (!formData.category || formData.category.trim() === '') {
      newErrors.category = 'Please select a category.';
  }

  // Validate subcategory

  // Validate stock items
  if (!formData.stock || !Array.isArray(formData.stock) || formData.stock.length === 0) {
      newErrors.stock = 'At least one size with stock is required.';
  } else {
      const hasStock = formData.stock.some(item => item.quantity > 0);
      if (!hasStock) {
          newErrors.stock = 'At least one size must have stock quantity greater than 0.';
      }
  }

  // Validate quantity: should be a positive number
  if (isNaN(formData.quantity) || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be a positive number.';
  }

  // Validate regularPrice: should be a positive number
  if (isNaN(formData.regularPrice) || formData.regularPrice <= 0) {
      newErrors.regularPrice = 'Regular price must be a positive number.';
  }

  // Validate current price if provided
  if (formData.currentPrice) {
      if (isNaN(formData.currentPrice) || formData.currentPrice <= 0) {
          newErrors.currentPrice = 'Current price must be a positive number.';
      }
      if (parseFloat(formData.currentPrice) >= parseFloat(formData.regularPrice)) {
          newErrors.currentPrice = 'Current price must be less than regular price.';
      }
  }

  // Validate images (using separate images parameter)
  if (!images || !Array.isArray(images)) {
      newErrors.images = 'Please provide at least one product image.';
  } else {
      const hasAtLeastOneImage = images.some(img => img !== null);
      if (!hasAtLeastOneImage) {
          newErrors.images = 'Please provide at least one product image.';
      }
  }
  console.log(newErrors)
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0; // If no errors, return true
};