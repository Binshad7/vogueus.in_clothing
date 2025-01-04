import React, { useEffect, useState } from 'react';

import CategoryItem from '../../../components/admin/Category/CategoryManagement/CategoryItem';
import Header from '../../../components/admin/Category/CategoryManagement/Header';
import CategorySearch from '../../../components/admin/Category/CategoryManagement/CategorySearch';
import AddCategoryModal from '../../../components/admin/Category/categoryModal/AddCategoryModal';
import EditCategoryModal from '../../../components/admin/Category/categoryModal/EditCategory';



// Main Category List Component
const CategoryList = () => {
    const [addCategory, setAddCatgory] = useState(false);
    const [categories, setCategories] = useState([]);
    const [addSubCategory, setAddSubCategory] = useState(false)
    const [editCategory, setEditCategory] = useState(false)

    useEffect(()=>{
        
     console.log('fetching data')
    },[addCategory, addSubCategory, editCategory])
    

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        
    };

    return (
        <div className="min-h-screen bg-gray-50">
        <Header onAddCategory={()=> setAddCatgory(true)} />
        
        <div className="max-w-6xl mx-auto p-6 shadow-lg bg-gray-100 mt-3 grid grid-cols-1 lg:grid-cols-[67%,33%] gap-x-10">
                <div className="space-y-2 bg-white p-4">

                    {
                        !categories.length ?
                            "no categories please add"
                            :
                            categories.map((category, index) => (
                                <CategoryItem
                                key={category._id || index} 
                                category={category}
                                onEdit={(cat)=> setEditCategory(cat)}
                                onAddSub={()=> setAddSubCategory(category._id)}
                                />
                            )) 
                    }
                </div>
            <CategorySearch handleSearchChange={(handleSearchChange)} searchTerm={searchTerm}/>
        </div>
        
        {/* add category modal calling  */};
        <AddCategoryModal
            isOpen={addCategory}
            onClose={()=> setAddCatgory(false)}
            child={false}
        />
        {/* add sub category modal  */}
        <AddCategoryModal
            isOpen={addSubCategory }
            onClose={()=> setAddSubCategory(false)}
            child={true}
            parentName={addSubCategory}
        />
        {/* edit category */}
        <EditCategoryModal
            isOpen={editCategory}
            onClose={()=> setEditCategory(false)}
            
        />
        </div>
    );
};

export default CategoryList;