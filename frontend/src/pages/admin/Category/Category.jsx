import React, { useEffect, useState } from 'react';

// import EditCategoryModal from '../../../components/admin/Category/categoryModal/EditCategory';
import CategoryManagement from '../../../components/admin/Category/categoryModal/CategoryManagement';



// Main Category List Component
const CategoryList = () => {



    return (
        <div className="min-h-screen bg-gray-50">


            <CategoryManagement />



            {/* add sub category modal   */}

            {/* edit category */}
            {/* <EditCategoryModal
                isOpen={editCategory}
                onClose={() => setEditCategory(false)}
                /> */}

        </div>
    );
};

export default CategoryList;