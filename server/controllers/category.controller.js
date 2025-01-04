const category = require('../models/category')

const addCategory = async (req,res) => {
    try {
     const {categoryName} = req.body;
     const Exist_category =await category.findOne(categoryName);
     if(Exist_category){
        res.status(401).json({success:false,message:'Category is already exist'})
     }
     const category = new category({
        categoryName,
        addedBy:req.user._id,
        updatedBy:req.user._id
     })
      await category.save();
     res.status(200).json({success:true,message:"Category created success fully completed"}) 
    } catch (error) {
        res.status(500).json({ success: false, message: 'server side error try again letter' })
    }
}

