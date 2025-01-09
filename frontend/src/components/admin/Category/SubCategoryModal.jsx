import React, { useState } from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';

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

function SubCategoryModal({ isOpen, closeModal, parentCategoryDeatils }) {
    const [subCategoryName, setSubCategoryName] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = () => {
        if (!subCategoryName.trim()) {
            setError('Subcategory name is required');
            return;
        }
        console.log('sub category success fully added')
        setSubCategoryName('');
        setError('');
        closeModal();
    };

    const handleClose = () => {
        setSubCategoryName('');
        setError('');
        closeModal();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            style={customStyles}
            contentLabel="Add Subcategory"
            ariaHideApp={false}
        >
            <div className="flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Add Subcategory</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                        Adding subcategory to <span className="font-medium">{parentCategoryDeatils?.categoryName}</span>
                    </p>

                    <div className="space-y-2">
                        <input
                            type="text"
                            value={subCategoryName}
                            onChange={(e) => setSubCategoryName(e.target.value)}
                            placeholder="Enter subcategory name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Add Subcategory
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default SubCategoryModal;