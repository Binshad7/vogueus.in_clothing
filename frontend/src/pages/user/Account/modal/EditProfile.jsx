import React, { useState } from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';
import { toast } from 'react-toastify'
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
import { useDispatch } from 'react-redux'
import { updateUserProfile } from '../../../../store/middlewares/user/user_updates';
function EditProfile({ userName, userEmail, userId, modalIsOpen, closeModal }) {
    const [name, setName] = useState(userName);
    const dispatch = useDispatch()
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('field is Empty')
            return
        }
        if (!/^[A-Za-z]\w*$/.test(name)) {
            toast.error('Invalid name format. Please use only letters and valid characters.');
            return
        }
        if (userName === name) {
            toast.warning("name is not updated")
            return
        }
        dispatch(updateUserProfile({name,userEmail,userId}))
        closeModal()
    };

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Update User Profile Confirmation"
            ariaHideApp={false}
        >
            <div className="relative">
                {/* Close button */}
                <button
                    onClick={closeModal}
                    className="absolute right-0 top-0 p-1 hover:bg-gray-100 rounded-full"
                >
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>

                    {/* Email field (disabled) */}
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={userEmail}
                            disabled
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default React.memo(EditProfile);