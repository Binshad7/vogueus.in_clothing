import React, { useEffect, useState, useCallback } from 'react';
import { ChevronDown, ChevronRight, Plus, PenLine, Trash2, Check, X } from 'lucide-react';
import {
  createCategory,
  fetchCategory,
  updateCategory,
  deleteCategory,
  unlistParentCategory,
  addSubCategory,
  updateSubCategory,
  subCategoryUnlist,
  listSubCategory
} from '../../../store/middlewares/admin/categoryHandle';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../user/Spinner';
import CategoryModal from './categoryModal/CategoryModal';
import Modal from 'react-modal';
import SubCategoryModal from './categoryModal/SubCategoryModal';
import { toast } from 'react-toastify';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    maxWidth: '500px',
    width: '90%',
    padding: '2rem',
    borderRadius: '0.5rem'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { category, loading } = useSelector((state) => state.category);

  // States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subCategoryModalOpen, setSubCategoryModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [newCategory, setNewCategoryName] = useState('');
  const [error, setError] = useState({
    addCategory: '',
    editCategory: '',
    subCategory: ''
  });
  // category edit
  const [editingId, setEditingId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryDetails, setEditCategoryDetails] = useState(null)
  const [deletingCategoryId, setDeleteParentCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [unlistCategory, setUnlistCategory] = useState(null);
  const [unlist, setUnlist] = useState(false);
  const [subCategoryName, setSubCategoryName] = useState('');
  const [subCategory, setSubCategory] = useState(null);

  //subCategory
  // const subCategory
  const [editSubCategory, setEditSubCategory] = useState(null)
  const [editSubcategoryID, setEditSubcategoryID] = useState(null)
  const [editSubcategoryName, setEditSubcategoryName] = useState(null)
  const [subCategoryModalOpenUnlist, setSubCategoryModalOpenUnlist] = useState(false)


  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);


  // toogel category
  const toggleCategory = useCallback((categoryId) => {
    if (editingId !== categoryId) {
      setExpandedId(prev => prev === categoryId ? null : categoryId);
    }
  }, [editingId]);



  // handle Add Category
  const handleAddCategory = useCallback(() => {
    if (!newCategory.trim()) {
      setError(prev => ({
        ...prev,
        addCategory: 'Fill the field'
      }));
      return;
    }
    dispatch(createCategory(newCategory));
    setError(prev => ({ ...prev, addCategory: '' }));
    setNewCategoryName('');
  }, [dispatch, newCategory]);



  // edit  category 
  const editParentCategory = useCallback((category) => {
    setEditingId(category._id);
    setEditCategoryName(category.categoryName);
    setEditCategoryDetails(category)
  }, [category]);


  // handle Update category
  const handleUpdateCategory = useCallback(() => {
    if (!editCategoryName.trim()) {
      setError(prev => ({ ...prev, editCategory: 'Category name cannot be empty' }));
      return;
    }

    if (editCategoryName.trim() === editCategoryDetails.categoryName) {
      toast.warning('The new category name is the same as the old category name. No changes were made.')

      return
    }

    const updating_Values = {
      categoryId: editingId,
      categoryName: editCategoryName
    };

    dispatch(updateCategory(updating_Values));
    setEditingId(null);
    setEditCategoryName('');
    setError(prev => ({ ...prev, editCategory: '' }));
  }, [dispatch, editingId, editCategoryName]);




  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditCategoryName('');
    setError(prev => ({
      ...prev,
      editCategory: ''
    }));
  }, []);


  // detete category
  const deleteParentCategory = useCallback((categoryId, categoryName) => {
    setDeleteModalOpen(true);
    setDeleteParentCategoryId(categoryId);
    setCategoryName(categoryName);
  }, []);

  // close modal
  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setCategoryName(null);
    setDeleteParentCategoryId(null);
    setUnlist(false);
    setUnlistCategory(null);
  }, []);

  // handle delete Confirm
  const handleDeleteConfirm = useCallback(() => {
    dispatch(deleteCategory(deletingCategoryId));
    closeDeleteModal();
  }, [dispatch, deletingCategoryId, closeDeleteModal]);


  // handle unlist category
  const handleUnlist = useCallback((categoryId, categoryName) => {
    setDeleteModalOpen(true);
    setUnlist(true);
    setUnlistCategory(categoryId);
    setCategoryName(categoryName);
  }, []);
  // handle unlist category confirm

  const handleUnlistConfirm = useCallback(() => {
    dispatch(unlistParentCategory(unlistCategory));
    closeDeleteModal();
  }, [dispatch, unlistCategory, closeDeleteModal]);



  // handle create subCategory

  const createSubCategory = useCallback((cat) => {
    setSubCategoryModalOpen(true);
    setSubCategory(cat);
  }, []);


  // close sub category modal
  const closeSubCategoryModal = useCallback(() => {
    setSubCategoryModalOpen(false);
    setSubCategory(null);
    setSubCategoryName('');
    setError(prev => ({ ...prev, subCategory: '' }));
  }, []);
  // handle sub category submit
  const handleSubmitSubCategory = useCallback(() => {
    if (!subCategoryName.trim()) {
      setError(prev => ({
        ...prev,
        subCategory: 'Subcategory name is required'
      }));
      return;
    }
    dispatch(addSubCategory({
      parentCategory: subCategory?._id,
      subcategoryName: subCategoryName
    }))
    closeSubCategoryModal();
  }, [subCategoryName, subCategory, closeSubCategoryModal]);

  // Memoized input handlers
  const handleNewCategoryChange = useCallback((e) => {
    setNewCategoryName(e.target.value);
  }, []);

  const handleEditCategoryChange = useCallback((e) => {
    setEditCategoryName(e.target.value);
  }, []);

  const handleSubCategoryChange = useCallback((e) => {
    setSubCategoryName(e.target.value);
  }, []);


  // edit sub category
  const hadnleEditSubCategory = (setSubCategoryID, subCategory) => {
    console.log(subCategory)
    setEditSubcategoryID(setSubCategoryID)
    setEditSubcategoryName(subCategory.subcategoryName);
    setEditSubCategory(subCategory)
  }
  // submit eidt subcategory 
  const handleEditSubCategorySubmit = () => {
    if (!editSubcategoryName.trim()) {
      setError(prev => ({
        ...prev,
        subCategory: ' Fields are required'
      }))
      return
    }
    if (editSubCategory.subcategoryName.trim() === editSubcategoryName.trim()) {
      toast.warning('The new subcategory name is the same as the old subcategory name. No changes were made.')
      return
    }

    dispatch(updateSubCategory({
      parentCategory: editSubCategory.parentCategory,
      subcategoryName: editSubcategoryName,
      subCategoryID: editSubcategoryID
    }));
    setEditSubcategoryID(null)
    setEditSubCategory(null)
    setError(prev => ({
      ...prev,
      subCategory: ''
    }))
  }
  // close edit input box
  const handleCloseSubCategoryEdit = () => {
    setEditSubcategoryID(null)
    setError(prev => ({
      ...prev,
      subCategory: ''
    }))
  }


  // unlistSubCategory
  // open unlist modal
  const SubCategoryModla = (subCategory) => {
    setUnlist(false)
    setSubCategoryModalOpenUnlist(true)
    setEditSubcategoryID(subCategory._id)
    setEditSubcategoryName(subCategory.subcategoryName)
  }
  // close modal
  const closeSubCategoryListModal = () => {
    setEditSubcategoryName(null)
    setEditSubcategoryID(null)
    setSubCategoryModalOpenUnlist(false)
  }
  // handle submit subcategory
  const handleSubCategoryUnlist = () => {
    dispatch(subCategoryUnlist(editSubcategoryID))
    setEditSubcategoryName(null)
    setEditSubcategoryID(null)
    setSubCategoryModalOpenUnlist(false)
  }


  //list SubCategory
  // modal open
  const listSubCategoryModal = (category) => {
    console.log(category)
    setSubCategoryModalOpenUnlist(true);
    setEditSubcategoryID(category._id);
    setEditSubcategoryName(category.subcategoryName);
    setUnlist(true)
  }

  // submit  subCategory
  const confirmSubCategorylist = () => {
    dispatch(listSubCategory(editSubcategoryID))
    setSubCategoryModalOpenUnlist(null);
    setEditSubcategoryID(null);
    setEditSubcategoryName(null);
  }

  return (
    <div className="p-6">
      <CategoryModal
        unlist={unlist}
        categoryName={categoryName}
        modalIsOpen={deleteModalOpen}
        closeModal={closeDeleteModal}
        handleDeleteConfirm={handleDeleteConfirm}
        handleUnlistConfirm={handleUnlistConfirm}  // Make sure this matches
      />
      {/* SubVategory Modal */}

      <SubCategoryModal
        unlist={unlist}
        isOpen={subCategoryModalOpenUnlist}
        closeModal={closeSubCategoryListModal}
        handleDeleteConfirm={handleSubCategoryUnlist}
        handleUnlistConfirm={confirmSubCategorylist}
        categoryName={editSubcategoryName}
        style={customStyles}
        contentLabel="SubCategory Unlist and list Confirmation"
        ariaHideApp={false}
      />



      {/* end */}
      <Modal
        isOpen={subCategoryModalOpen}
        onRequestClose={closeSubCategoryModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Add Subcategory Modal"
      >
        <div className="relative">
          <button
            onClick={closeSubCategoryModal}
            className="absolute right-0 top-0 p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-semibold mb-4">Add Subcategory</h2>

          {subCategory && (
            <p className="text-gray-600 mb-6">
              Adding subcategory to <span className="font-medium">{subCategory.categoryName}</span>
            </p>
          )}

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={subCategoryName}
                onChange={handleSubCategoryChange}
                placeholder="Enter subcategory name"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none transition-colors
                  ${error.subCategory ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
              />
              {error.subCategory && (
                <p className="absolute -bottom-6 left-0 text-red-500 text-sm">{error.subCategory}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-10">
            <button
              onClick={closeSubCategoryModal}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitSubCategory}
              className="px-4 py-2 bg-blue-500 text-white rounded-md transition-colors hover:bg-blue-600"
            >
              Add Subcategory
            </button>
          </div>
        </div>
      </Modal>

      {loading && <Spinner />}

      <div className="max-w-4xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-2">Create Category</h1>
        <p className="text-gray-600 mb-6">Add a new product category</p>

        {error.addCategory && <p className="text-red-600 mb-4">{error.addCategory}</p>}

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={newCategory}
            onChange={handleNewCategoryChange}
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
                          onChange={handleEditCategoryChange}
                          className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdateCategory}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <Check size={18} />
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
                  cat.isUnlist ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUnlist(cat._id, cat.categoryName)}
                        className="px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200 font-medium"
                      >
                        Unlist
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <PenLine
                        onClick={() => editParentCategory(cat)}
                        size={18}
                        className="text-gray-600 hover:text-blue-500 cursor-pointer"
                      />
                      <Trash2
                        onClick={() => deleteParentCategory(cat._id, cat.categoryName)}
                        size={18}
                        className="text-gray-600 hover:text-red-500 cursor-pointer"
                      />
                    </div>
                  )
                )}
              </div>

              {expandedId === cat._id && (
                <div className="px-6 pb-4 border-t border-gray-200">
                  {cat.subcategories.map((sub) => (
                    <div
                      key={sub._id}
                      className="flex items-center justify-between pl-8 pr-4 py-2 border-b border-gray-200"
                    >
                      {editSubcategoryID === sub._id ? (
                        <div className="flex-1 space-y-2">
                          {error.subCategory && (
                            <p className="text-red-500 text-sm font-medium">{error.subCategory}</p>
                          )}

                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={editSubcategoryName}
                              onChange={(e) => setEditSubcategoryName(e.target.value)}
                              className={`flex-1 px-3 py-2 border rounded-md text-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${error.subCategory
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300 bg-white hover:border-gray-400'
                                }`}
                              placeholder="Enter subcategory name"
                              autoFocus
                            />

                            <div className="flex items-center gap-2">
                              <button
                                onClick={handleEditSubCategorySubmit}
                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
                                title="Save changes"
                              >
                                <Check size={18} />
                              </button>

                              <button
                                onClick={handleCloseSubCategoryEdit}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                title="Cancel editing"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <span
                              className={`${sub.isUnlist ? 'text-gray-400 line-through' : 'text-gray-800'
                                }`}
                            >
                              {sub.subcategoryName}
                            </span>
                          </div>

                          {sub.isUnlist ? (
                            <button
                              onClick={() => listSubCategoryModal(sub)}
                              className="text-red-500 hover:bg-red-50/50 rounded px-1.5"
                            >
                              Unlist
                            </button>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => hadnleEditSubCategory(sub._id, sub)}
                                className="text-blue-500 hover:text-blue-600"
                              >
                                <PenLine size={18} />
                              </button>
                              <button
                                onClick={() => SubCategoryModla(sub)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  <div
                    className="flex items-center gap-2 pl-6 mt-2 text-gray-600 hover:text-blue-500 cursor-pointer"
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