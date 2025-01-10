const category = require('../models/category')
const subCategory = require('../models/subcategory');
const fetchCategoriesWithSubcategories = require('../utils/fetchCategoriesWithSubcategories')


// fetch Category
const fetchCategory = async (req, res) => {
    try {
        const catego = await fetchCategoriesWithSubcategories();
        const categorys = JSON.stringify(catego, null, 2);
        res.status(200).json({ success: true, message: 'category success fully created', categorys })

    } catch (error) {
        res.status(500).json({ success: false, message: 'server side error' })
    }
}
// addCategory
const addCategory = async (req, res) => {
    const { categoryName } = req.body;
    try {
        const ExistCategory = await category.findOne({ categoryName });
        if (ExistCategory) {
            return res.status(401).json({ success: false, message: "Category is Already Exist" })
        }
        const newCategory = category({
            categoryName,
            addedBy: req.user._id,
            updatedBy: req.user._id,
        });
        await newCategory.save();
        const catego = await fetchCategoriesWithSubcategories();
        const categorys = JSON.stringify(catego, null, 2);
        res.status(200).json({ success: true, message: 'category success fully created', categorys })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'server side error try again letter' })
    }
}

// editCategory
const editCategory = async (req, res) => {

    try {

        const { categoryId, categoryName } = req.body;

        const updatedCategory = await category.updateOne({ _id: categoryId }, { $set: { categoryName: categoryName, updatedBy: req.user._id } });
        if (!updatedCategory) {
            return res.status(400).json({ success: false, message: 'category not find' })
        }

        const catego = await fetchCategoriesWithSubcategories();
        const categorys = JSON.stringify(catego, null, 2);
        console.log(categorys)
        res.status(200).json({ success: true, message: 'success fully update the category', categorys })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'server side error' })
    }
}
// deleteCategory
const unlistCategory = async (req, res) => {
    try {
        const { deleteId } = req.params;

        const deleteCategory = await category.updateOne({ _id: deleteId }, { $set: { isUnlist: true } })
        if (!deleteCategory) {
            return res.status(401).json({ success: false, message: "category not find" })
        }


        const catego = await fetchCategoriesWithSubcategories();
        const categorys = JSON.stringify(catego, null, 2);

        res.status(200).json({ success: true, message: 'category success fully', categorys })
    } catch (error) {
        console.log('category.controller  unlist  category error', error.message);
        res.status(500).json({ success: false, message: 'server side error' })
    }
}

// unlist category 
const listCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const unlistCategory = await category.updateOne({ _id: categoryId }, { $set: { isUnlist: false } })
        if (!unlistCategory) {
            return res.status(401).json({ success: false, message: "category not find" })
        }


        const catego = await fetchCategoriesWithSubcategories();
        const categorys = JSON.stringify(catego, null, 2);

        res.status(200).json({ success: true, message: 'category success fully unlisted', categorys })
    } catch (error) {
        console.log('category.controller  unlist  category error', error.message);
        res.status(500).json({ success: false, message: 'server side error' })
    }
}

// sub category

//create new sub category
const addSubCategory = async (req, res) => {
    try {
        const { parentCategory, subcategoryName } = req.body;
        const Exist_SubCategory = await subCategory.findOne({ subcategoryName });
        console.log(Exist_SubCategory)
        if (
            Exist_SubCategory &&
            Exist_SubCategory.parentCategory.toString() === parentCategory
        ) {
            return res.status(401).json({
                success: false,
                message: 'This SubCategory Already Exists Under The Parent Category',
            });
        }
        const Exist_Parent_Category = await category.findOne({ _id: parentCategory });

        if (!Exist_Parent_Category) {
            return res.status(401).json({ success: false, message: 'Parent Category canot find' })
        }
        const new_SubCategory = await subCategory({
            parentCategory,
            subcategoryName,
            addedBy: req.user._id,
            updatedBy: req.user._id,
        })

        const save_New_subCategory = await new_SubCategory.save();
        if (!save_New_subCategory) {
            return res.status(401).json({ success: false, message: "some thing wrong we can't create sub category" })
        }

        const update_ParentCategory = await category.updateOne(
            { _id: parentCategory },
            {
                $push: { subcategories: save_New_subCategory._id }
            })
        if (!update_ParentCategory) {
            return res.status(401).json({ success: false, message: "some thing wrong in Add SubCategory" })
        }

        const catego = await fetchCategoriesWithSubcategories();
        const categorys = JSON.stringify(catego, null, 2);
        res.status(200).json({ success: true, message: 'subcategory success fully updated', categorys })
    } catch (error) {
        console.log('category.controller  add sub category error', error.message);
        res.status(500).json({ success: false, message: 'server side error' })
    }
}
const updateSubCategory = async (req, res) => {
    console.log(req.body);
    const { parentCategory, subcategoryName, subCategoryID } = req.body;
    try {
        const Exist_SubCategory = await subCategory.findOne({ subcategoryName });


        if (Exist_SubCategory?.parentCategory?.toString() === parentCategory && Exist_SubCategory?.subcategoryName === subcategoryName) {
            return res.status(401).json({ success: false, message: 'This category Name is already Exist in under Parent Category ' })
        }

        const updateSubCategory = await subCategory.updateOne(
            { _id: subCategoryID },
            {
                $set: { subcategoryName: subcategoryName }
            });

        if (!updateSubCategory) {
            return res.status(401).json({ success: false, message: 'error face in update SubCategory name' });
        }

        const catego = await fetchCategoriesWithSubcategories();
        const categorys = JSON.stringify(catego, null, 2);
        res.status(200).json({ success: true, message: 'subcategory Name success fully updated', categorys })
    } catch (error) {
        console.log('category.controller  update  sub category error', error.message);
        res.status(500).json({ success: false, message: 'server side error' })
    }
}


const unlistSubCategory = async (req, res) => {
    const { subCategoryId } = req.params
    try {
        const unlist_SubCategory = await subCategory.updateOne({ _id: subCategoryId }, { $set: { isUnlist: true } })
        if (!unlist_SubCategory) {
            return res.status(401).json({ success: false, message: 'some thing happend in ' })
        }
        const catego = await fetchCategoriesWithSubcategories();
        const categorys = JSON.stringify(catego, null, 2);
        res.status(200).json({ success: true, message: 'unlist success fully completed', categorys })
    } catch (error) {
        console.log('category.controller  unlist  sub category error', error.message);
        return res.status(500).json({ success: false, message: 'server side error try again later' })
    }
}

// list category 
const listSubCategory = async (req, res) => {
    try {
        const { subCategoryId } = req.params
        const list_SubCategory = await subCategory.updateOne({ _id: subCategoryId }, { $set: { isUnlist: false } })
        if (!list_SubCategory) {
            return res.status(401).json({ success: false, message: 'some thing happend in ' })
        }
        const catego = await fetchCategoriesWithSubcategories();
        const categorys = JSON.stringify(catego, null, 2);
        res.status(200).json({ success: true, message: 'list SubCategory success fully completed', categorys })
    } catch (error) {
        console.log('category.controller  list  sub category error', error.message);
        return res.status(500).json({ success: false, message: 'server side error try again later' })
    }
}


module.exports = {
    addCategory,
    editCategory,
    unlistCategory,
    fetchCategory,
    listCategory,
    addSubCategory,
    updateSubCategory,
    unlistSubCategory,
    listSubCategory
}