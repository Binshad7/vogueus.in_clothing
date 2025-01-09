import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Plus, PenLine, Trash2, Check, X } from 'lucide-react';
import { createCategory, fetchCategory, updateCategory, deleteCategory, unlistParentCategory } from '../../../../store/middlewares/admin/categoryHandle';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../../user/Spinner';
import CategoryModal from '../CategoryModal';
import SubCategoryModal from '../SubCategoryModal';




const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { category, loading } = useSelector((state) => state.category);


  // modal 
  const [modalIsOpen, setModalOpen] = useState(false)
  const [expandedId, setExpandedId] = useState(null);
  const [newCategory, setNewCategoryName] = useState('');
  const [error, setError] = useState({
    addCategory: '',
    editCategory: ''
  });

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // delete category
  const [deletingCategoryId, setDeleteParentCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState(null)

  // unlist category
  const [unlistCategory, setUnlistCategory] = useState(null)
  const [unlist, setUnlist] = useState(false)
  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);


  // sub category  data
  const [subCategory,setSubCategory] = useState(null)


  // toggle catefory
  const toggleCategory = (categoryId) => {
    if (editingId !== categoryId) {
      setExpandedId(expandedId === categoryId ? null : categoryId);
    }
  };
  //  category submistion
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setError({
        ...error,
        addCategory: 'Fill the field'
      });

      return;
    }
    dispatch(createCategory(newCategory));
    setError('');
    setNewCategoryName('');
  };



  // handle update category
  const handleUpdateCategory = () => {
    if (!editCategoryName.trim()) {
      setError({ ...error, editCategory: 'Category name cannot be empty' });
      return;
    }
    let updating_Values = {
      categoryId: editingId,
      categoryName: editCategoryName
    }
    dispatch(updateCategory(updating_Values));
    setEditingId(null);
    setEditCategoryName('');
    setError({
      ...error,
      editCategory: ''
    });
  };
  // update
  const editParentCategory = (catId) => {
    const categoryToEdit = category.find((cat) => cat._id === catId);
    if (categoryToEdit) {
      setEditingId(catId);
      setEditCategoryName(categoryToEdit.categoryName);
    } else {
      console.log('some thing wrong in edit parentCategory')
    }
  };



  // edit cancel
  const cancelEdit = () => {
    setEditingId(null);
    setEditCategoryName('');
    setError('');
  };

  // delete category 
  const deleteParentCategory = (categoryId, category) => {
    setModalOpen(true)
    setDeleteParentCategoryId(categoryId);
    setCategoryName(category)
  };

  const closeModal = () => {
    setModalOpen(false)
    setCategoryName(null)
    setSubCategory(null)
  }
  const handleDeleteConfirm = () => {
    setModalOpen(false)
    setCategoryName(null)
    setUnlistCategory(null)
    setUnlist(false)
    dispatch(deleteCategory(deletingCategoryId))
  }
  // unlist  hadnling

  //  unlist category
  const handleUnlist = (categoryId, categoryName) => {
    setModalOpen(true)
    setUnlist(true)
    setUnlistCategory(categoryId)
    setCategoryName(categoryName)
  }
  // list category
  const handleUnlistConfrim = () => {
    dispatch(unlistParentCategory(unlistCategory))
    setModalOpen(false)
    setUnlist(false)
    setUnlistCategory(false)
    setCategoryName(false)
  }


  // add subCategory
  const createSubCategory = (cat) => {
    setModalOpen(true)
    setSubCategory(cat)
  }

  return (
    <div className="p-6">
      <CategoryModal
        unlist={unlist}
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        handleDeleteConfirm={handleDeleteConfirm}
        categoryName={categoryName}
        handleUnlistConfrim={handleUnlistConfrim}
      />
      <SubCategoryModal
        isOpen={createSubCategory}
        closeModal={closeModal}
        parentCategoryDeatils={subCategory}
      />
      {loading && <Spinner />}

      <div className="max-w-4xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-2">Create Category</h1>
        <p className="text-gray-600 mb-6">Add a new product category</p>

        {error.addCategory && <p className="text-red-600 mb-4">{error.addCategory}</p>}

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New Category Name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleAddCategory}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Category
          </button>
        </div>

        <div className="space-y-4">
          {category.map(cat => (

            <div
              key={cat._id}
              className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between p-4 cursor-pointer">
                <div className="flex items-center gap-2">
                  {editingId === cat._id ? (
                    <>
                      {error.editCategory && <p className="text-red-600 mb-4">{error.editCategory}</p>}
                      <div className="flex items-center gap-2 flex-1">

                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            // onClick={handleUpdateCategory}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <Check
                              onClick={handleUpdateCategory}
                              size={18} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div onClick={() => toggleCategory(cat._id)}>
                        {expandedId === cat._id ? (
                          <ChevronDown size={20} className="text-gray-600" />
                        ) : (
                          <ChevronRight size={20} className="text-gray-600" />
                        )}
                      </div>
                      <span>{cat.categoryName}</span>
                    </>
                  )}
                </div>
                {editingId !== cat._id && (

                  cat.isUnlist ?
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUnlist(cat._id, cat.categoryName)}
                        className="px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200 font-medium">
                        Unlist
                      </button>
                    </div>
                    :
                    <div className="flex items-center gap-3">
                      <PenLine
                        onClick={() => editParentCategory(cat._id)}
                        size={18}
                        className="text-gray-600 hover:text-blue-500 cursor-pointer"
                      />
                      <Trash2
                        onClick={() => deleteParentCategory(cat._id, cat.categoryName)}
                        size={18}
                        className="text-gray-600 hover:text-red-500 cursor-pointer"
                      />
                    </div>

                )}
              </div>

              {expandedId === cat._id && (
                <div className="px-6 pb-4 border-t border-gray-200">
                  {cat.subcategories?.map(sub => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between py-3 pl-6"
                    >
                      <span className="text-gray-600">{sub.name}</span>
                      <div className="flex items-center gap-3">
                        <PenLine size={16} className="text-gray-500 hover:text-blue-500 cursor-pointer" />
                        <Trash2 size={16} className="text-gray-500 hover:text-red-500 cursor-pointer" />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 pl-6 mt-2 text-gray-600 hover:text-blue-500 cursor-pointer"
                    onClick={() => createSubCategory(cat)}
                  >
                    <Plus size={16} />
                    <span>Add Subcategory</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;