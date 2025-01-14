export const validate = (formData, images, setErrors) => {
    const newErrors = {};

    console.log(formData)
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
    if (!formData.category.trim()) {
        newErrors.category = 'Please select a category.';
    }

    // Validate subcategory
    if (!formData.subcategory.trim()) {
        newErrors.subcategory = 'Please select a subcategory.';
    }



    // Validate regularPrice: should be a positive number
    if (parseFloat(formData.currentPrice) > 0 && parseFloat(formData.regularPrice)<parseFloat(formData.currentPrice)) {
        newErrors.currentPrice = 'Current price must be less than regular price.';
    }

    if(formData.currentPrice <0){
        newErrors.currentPrice = 'negative price is not alow';
    }


    if(formData.regularPrice <= 0){
        newErrors.regularPrice = 'RegularPrice must be greater than 0'
    }


    // Validate stock items: At least one size is required

    if (formData?.variant.length > 0) {
        // Check if all stocks are zero
        const allZeroStock = formData.variant.every(variant => variant.stock === 0);
        if (allZeroStock) {
          newErrors.variant = 'At least one size must have a quantity greater than 0';
        }
      
        // Check if any stock is negative
        const hasNegativeStock = formData.variant.some(variant => variant.stock < 0);
        if (hasNegativeStock) {
          newErrors.variant = 'Negative values are not allowed';
        }
      } else {
        newErrors.variant = 'Variants must be provided with stock values';
      }
    if (formData.variant.length ==0 ) {
        newErrors.variant = 'At least one size is required.';
    }
      console.log('new array : ',formData.variant)
      
    //    must be want  3 images 
    if (images.includes(null) || images.length < 3 || images.some(image => image === '')) {
        newErrors.images = "All 3 images are required, and none should be null or empty.";
    }
    console.log(newErrors)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
