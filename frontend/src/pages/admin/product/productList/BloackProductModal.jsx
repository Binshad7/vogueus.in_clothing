import React from 'react';
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
function BloackProductModal({ itemName, typeUpdation, modalIsOpen, closeModal, handleConfirmBlock ,item }) {
      console.log('render in modal block')
    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="block Confirmation"
            ariaHideApp={false}
        >

            <div className="flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">confirm {'  '}  {typeUpdation}</h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="mb-6">
                    Are you sure you want to {typeUpdation} this {item}{'  '}
                    <span className='text-red-500 font-medium'>{itemName}</span>?
                </p>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmBlock}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        {typeUpdation}
                    </button>



                </div>
            </div>
        </Modal>
    );
}

export default React.memo(BloackProductModal);