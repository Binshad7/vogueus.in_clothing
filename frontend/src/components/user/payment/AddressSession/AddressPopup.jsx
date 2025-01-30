import React, { useState } from 'react';
import FormInput from "../../../../utils/FormInput"
import { toast } from 'react-toastify';
import { addressValidation } from '../../../../utils/addressValidation';
import { useDispatch, useSelector } from 'react-redux';
import { addewAddress } from '../../../../store/middlewares/user/address';
import { Building2, Home } from 'lucide-react';
const ERRORS = {
    type: '',
    fullName: "",
    mobileNumber: "",
    pinCode: "",
    country: "",
    address: "",
    cityDistrictTown: "",
    state: "",
    landMark: "",
};

const AddressPopup = ({ closeAddress }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user)
    const [formData, setFormData] = useState({
        type: 'Home',
        fullName: "",
        mobileNumber: "",
        pinCode: "",
        country: "",
        address: "",
        cityDistrictTown: "",
        state: "",
        landMark: "",
    });

    const [error, setErrors] = useState(ERRORS);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = addressValidation(formData);
        if (Object.keys(errors).length != 0) {
            setErrors(errors);
            toast.error('Clear All Errors Before Submiting')
            return
        }

         dispatch(addewAddress({ address: formData, userId: user._id }));
        closeAddress()


    };

    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col m-4">
                {/* Fixed Header */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Add New Address</h2>
                        <button
                            onClick={closeAddress}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-gray-700">Address Type</label>
                            <div className="flex space-x-4">
                                <div className="flex gap-4">
                                    <label className="flex-1">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="Home"
                                            checked={formData.type === "Home"}
                                            onChange={handleOnChange}
                                            className="sr-only" // Hide default radio button
                                        />
                                        <div className={`
                  flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer
                  hover:bg-blue-50 transition-all
                  ${formData.type === "Home"
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200'
                                            }
                `}>
                                            <div className="flex items-center gap-3">
                                                <Home
                                                    className={`w-5 h-5 ${formData.type === "Home" ? 'text-blue-500' : 'text-gray-400'
                                                        }`}
                                                />
                                                <div>
                                                    <p className={`font-medium ${formData.type === "Home" ? 'text-blue-700' : 'text-gray-700'
                                                        }`}>
                                                        Home
                                                    </p>
                                                    <p className="text-sm text-gray-500">Personal Address</p>
                                                </div>
                                            </div>
                                        </div>
                                    </label>

                                    <label className="flex-1">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="Work"
                                            checked={formData.type === "Work"}
                                            onChange={handleOnChange}
                                            className="sr-only" // Hide default radio button
                                        />
                                        <div className={`
                  flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer
                  hover:bg-green-50 transition-all
                  ${formData.type === "Work"
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200'
                                            }
                `}>
                                            <div className="flex items-center gap-3">
                                                <Building2
                                                    className={`w-5 h-5 ${formData.type === "Work" ? 'text-green-500' : 'text-gray-400'
                                                        }`}
                                                />
                                                <div>
                                                    <p className={`font-medium ${formData.type === "Work" ? 'text-green-700' : 'text-gray-700'
                                                        }`}>
                                                        Work
                                                    </p>
                                                    <p className="text-sm text-gray-500">Office Address</p>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Form fields remain the same */}
                        <div>
                            <FormInput
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={handleOnChange}
                                value={formData.fullName}
                            />
                            {error.fullName && (
                                <p className="text-red-500 text-sm mt-1">{error.fullName}</p>
                            )}
                        </div>

                        {/* Rest of your existing form fields... */}
                        {/* Mobile Number */}
                        <div>
                            <FormInput
                                type="number"
                                name="mobileNumber"
                                placeholder="Mobile Number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={handleOnChange}
                                value={formData.mobileNumber}
                            />
                            {error.mobileNumber && (
                                <p className="text-red-500 text-sm mt-1">{error.mobileNumber}</p>
                            )}
                        </div>

                        {/* PIN Code */}
                        <div>
                            <FormInput
                                type="number"
                                name="pinCode"
                                placeholder="PIN Code"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={handleOnChange}
                                value={formData.pinCode}
                            />
                            {error.pinCode && (
                                <p className="text-red-500 text-sm mt-1">{error.pinCode}</p>
                            )}
                        </div>

                        {/* Country */}
                        <div>
                            <FormInput
                                type="text"
                                name="country"
                                placeholder="Country"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={handleOnChange}
                                value={formData.country}
                            />
                            {error.country && (
                                <p className="text-red-500 text-sm mt-1">{error.country}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="col-span-2">
                            <textarea
                                required
                                name="address"
                                placeholder="Address"
                                rows={3}
                                value={formData.address}
                                onChange={handleOnChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                            {error.address && (
                                <p className="text-red-500 text-sm mt-1">{error.address}</p>
                            )}
                        </div>

                        {/* City/District/Town */}
                        <div>
                            <FormInput
                                type="text"
                                name="cityDistrictTown"
                                placeholder="City/District/Town"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={handleOnChange}
                                value={formData.cityDistrictTown}
                            />
                            {error.cityDistrictTown && (
                                <p className="text-red-500 text-sm mt-1">{error.cityDistrictTown}</p>
                            )}
                        </div>

                        {/* State */}
                        <div>
                            <FormInput
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={handleOnChange}
                            />
                            {error.state && (
                                <p className="text-red-500 text-sm mt-1">{error.state}</p>
                            )}
                        </div>

                        {/* Landmark */}
                        <div className="col-span-2">
                            <FormInput
                                type="text"
                                name="landMark"
                                placeholder="Landmark (Optional)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={handleOnChange}
                                value={formData.landMark}
                            />
                            {error.landMark && (
                                <p className="text-red-500 text-sm mt-1">{error.landMark}</p>
                            )}
                        </div>
                    </form>
                </div>

                {/* Fixed Footer */}
                <div className="p-6 border-t bg-white">
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={closeAddress}
                            className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            type="button"
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Save Address
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressPopup;