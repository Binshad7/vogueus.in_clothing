const category = require('../models/category')


// fetch Category
const fetchCategory = async (req, res) => {
    try {
        const categorys = await category.find();
        res.status(200).json({ success: true, message: 'category success fully created', categorys })

    } catch (error) {
        res.status(500).json({ success: false, message: 'server side error' })
    }
}
// addCategory
const addCategory = async (req, res) => {
    console.log('time to leave')
    const { categoryName } = req.body;
    console.log(req.body)
    try {
        console.log('hit in create category')
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

        const categorys = await category.find();
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

        const categorys = await category.find();

        res.status(200).json({ success: true, message: 'success fully update the category', categorys })
    } catch (error) {
        console.log(error);

        res.status(500).json({ success: false, message: 'server side error' })
    }
}
// deleteCategory
const deleteCategory = async (req, res) => {
    try {
        const { deleteId } = req.params;

        const deleteCategory = await category.updateOne({ _id: deleteId }, { $set: { isUnlist: true } })
        if (!deleteCategory) {
            return res.status(401).json({ success: false, message: "category not find" })
        }

        const categorys = await category.find();
        res.status(200).json({ success: true, message: 'category success fully', categorys })
    } catch (error) {
        res.status(500).json({ success: false, message: 'server side error' })
    }
}

// unlist category 
const unlistCategory = async (req, res) => {
    try {
      const {categoryId} = req.params;
      const unlistCategory = await category.updateOne({ _id: categoryId }, { $set: { isUnlist: false } })
      if (!unlistCategory) {
          return res.status(401).json({ success: false, message: "category not find" })
      }

      const categorys = await category.find();
      res.status(200).json({ success: true, message: 'category success fully unlisted', categorys })
    } catch (error) {
        res.status(500).json({ success: false, message: 'server side error' })
    }
}

// sub category
//
const addSubCategory = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ success: false, message: 'server side error' })
    }
}
module.exports = {
    addCategory,
    editCategory,
    deleteCategory,
    fetchCategory,
    unlistCategory
}