export const validate = (productName, description, category, subCategory, variants) => {
    const newErrors = {};
    const namePattern = /^[A-Za-z0-9 ]+$/;
    console.log(productName)
    if (productName.length < 3 || !productName.trim()) {
        newErrors.productName = 'Product name must be at least 3 characters long and cannot contain special characters.';
    }

    if (description.length < 3 || !namePattern.test(description.trim())) {
        newErrors.description = 'Description must be at least 3 characters long and cannot contain special characters.';
    }

    if (!category || !category.trim()) {
        newErrors.category = 'Please select a category.';
    }

    if (!subCategory || !subCategory.trim()) {
        newErrors.subCategory = 'Please select a SubCategory.';
    }

    // Variants validation
    if (!variants || variants.length === 0) {
        newErrors.variants = 'At least one variant is required';
        return newErrors;
    }

    const variantErrors = variants.map(variant => {
        const errors = {};

        // Color validation
        if (!variant.color || variant.color.trim() === '') {
            errors.color = 'Color is required';
        }

        // Price validation
        if (!variant.regularPrice || variant.regularPrice <= 0) {
            errors.regularPrice = 'Regular price is required and must be greater than 0';
        }

        if (variant.onSale) {
            if (!variant.salePrice || variant.salePrice <= 0) {
                errors.salePrice = 'Sale price is required and must be greater than 0';
            } else if (variant.salePrice >= variant.regularPrice) {
                errors.salePrice = 'Sale price must be less than regular price';
            }
        }

        // Stock validation
        if (Object.keys(variant.stock).length === 0) {
            errors.stock = 'At least one size is required';
        } else {

             // this code is optional

            // const hasStock = Object.values(variant.stock).some(quantity => quantity > 0);

            // if (!hasStock) {
            //     errors.stock = 'At least one size must have stock greater than 0';
            // }
        }

        // Image validation
        const validImages = variant.images.filter(img => img !== null);
        if (validImages.length !== 3) {
            errors.images = 'Exactly 3 images are required';
        }

        return Object.keys(errors).length > 0 ? errors : null;
    });

    if (variantErrors.some(error => error !== null)) {
        newErrors.variantErrors = variantErrors;
    }

    return newErrors;
};