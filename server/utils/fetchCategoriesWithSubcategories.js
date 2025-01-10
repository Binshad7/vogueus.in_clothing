const category = require('../models/category')
const fetchCategoriesWithSubcategories = async () => {
    return await category.aggregate([
        {
            $lookup: {
                from: 'subcategories',
                localField: '_id',
                foreignField: 'parentCategory',
                as: 'subcategories'
            }
        }
    ]);
};
module.exports = fetchCategoriesWithSubcategories