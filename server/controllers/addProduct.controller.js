const productSchema = require('../models/productSchema');
const cloudinary = require('cloudinary').v2

const AddProduct = async (req, res) => {
    try {
        console.log('hit the Add Product')
        console.log(req.body.variants[0].stock)
        const { ProductName, description, category, subcategory } = req.body;
        // Parse variants data
        const variants = [];
        const files = req.files;
        console.log('files : ',files)

        // Group the form data for variants
        const variantKeys = Object.keys(req.body).filter(key => key.startsWith('variants['));
        const variantIndices = [...new Set(variantKeys.map(key => {
            const match = key.match(/variants\[(\d+)\]/);
            return match ? parseInt(match[1]) : null;
        }))].filter(index => index !== null);
        // Process each variant
        for (const index of variantIndices) {
            console.log('index ',index)
            const variant = {
                color: req.body[`variants[${index}][color]`],
                regularPrice: parseFloat(req.body[`variants[${index}][regularPrice]`]),
                onSale: req.body[`variants[${index}][onSale]`] === 'true',
                stock: {},
                images: []
            };

            // Add sale price if product is on sale
            if (variant.onSale) {
                variant.salePrice = parseFloat(req.body[`variants[${index}][salePrice]`]);
            }

            // Process stock
            const stockKeys = Object.keys(req.body).filter(key =>
                key.startsWith(`variants[${index}][stock]`)
            );
            for (const stockKey of stockKeys) {
                const size = stockKey.match(/\[stock\]\[(.+?)\]$/)[1];
                variant.stock[size] = parseInt(req.body[stockKey]);
            }

            // Process images
            const variantImages = files.filter(file =>
                file.fieldname.startsWith(`variants[${index}][images]`)
            );
            console.log('variantImages : ',variantImages)
            // Upload images to Cloudinary
            for (const image of variantImages) {
                try {
                    const result = await cloudinary.uploader.upload(
                        `data:${image.mimetype};base64,${image.buffer.toString('base64')}`,
                        {
                            folder: 'products',
                            resource_type: 'auto'
                        }
                    );
                    console.log('new img url : ', result.secure_url)
                    variant.images.push(result.secure_url);
                } catch (uploadError) {
                    console.error('Error uploading to Cloudinary:', uploadError);
                    throw new Error('Failed to upload image');
                }
            }

            variants.push(variant);
        }

        // Create the product
        const product = new productSchema({
            ProductName,
            description,
            category,
            subcategory,
            variantions: variants,
            addedBy: req.user._id,
            updatedBy: req.user._id
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product successfully added',
            product
        });

    } catch (error) {
        console.error('Error in addProduct Controller:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add product'
        });
    }
};
const EditProduct = async (req, res) => {
    try {
        console.log(req.body)
    } catch (error) {
        console.log('error in addProduct Controller erros is : ', error.message)
    }
}
const UnlistProduct = async (req, res) => {
    try {
        console.log(req.body)
    } catch (error) {
        console.log('error in addProduct Controller erros is : ', error.message)
    }
}
const listProduct = async (req, res) => {
    try {
        console.log(req.body)
    } catch (error) {
        console.log('error in addProduct Controller erros is : ', error.message)
    }
}


module.exports = {
    AddProduct,
    EditProduct,
    UnlistProduct,
    listProduct
}