import React, { useState } from "react";
import { X, Home, Building2 } from "lucide-react";
import FormInput from "../../../utils/FormInput";
import { addressValidation } from "../../../utils/addressValidation";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { editAddress } from "../../../store/middlewares/user/address";

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

const EditAddress = ({ editUserAddress, closeModal }) => {
    const [error, setErrors] = useState(ERRORS);
    const [address, setAddress] = useState({
        type: editUserAddress?.type || "Home",
        fullName: editUserAddress?.fullName,
        mobileNumber: editUserAddress?.mobileNumber,
        pinCode: editUserAddress?.pinCode,
        country: editUserAddress?.country,
        address: editUserAddress?.address,
        cityDistrictTown: editUserAddress?.cityDistrictTown,
        state: editUserAddress?.state,
        landMark: editUserAddress?.landMark,
    });
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = addressValidation(address);
        if (Object.keys(errors).length !== 0) {
            setErrors(errors);
            return;
        }
        const result = await dispatch(editAddress({ address, editAddressId: editUserAddress._id }));

        if (editAddress.fulfilled.match(result)) {
            if (closeModal) {
                closeModal();
            } else {
                navigate('/account-details/profile');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-medium">Edit Address</h2>
                <button
                    onClick={closeModal}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                    <X className="h-4 w-4" />
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address Type Selection */}
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Address Type
                        </label>
                        <div className="flex gap-4">
                            <label className="flex-1">
                                <input
                                    type="radio"
                                    name="type"
                                    value="Home"
                                    checked={address.type === "Home"}
                                    onChange={handleOnChange}
                                    className="sr-only"
                                />
                                <div className={`
                                    flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer
                                    hover:bg-blue-50 transition-all
                                    ${address.type === "Home" ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                                `}>
                                    <div className="flex items-center gap-3">
                                        <Home
                                            className={`w-5 h-5 ${address.type === "Home" ? 'text-blue-500' : 'text-gray-400'}`}
                                        />
                                        <div>
                                            <p className={`font-medium ${address.type === "Home" ? 'text-blue-700' : 'text-gray-700'}`}>
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
                                    checked={address.type === "Work"}
                                    onChange={handleOnChange}
                                    className="sr-only"
                                />
                                <div className={`
                                    flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer
                                    hover:bg-green-50 transition-all
                                    ${address.type === "Work" ? 'border-green-500 bg-green-50' : 'border-gray-200'}
                                `}>
                                    <div className="flex items-center gap-3">
                                        <Building2
                                            className={`w-5 h-5 ${address.type === "Work" ? 'text-green-500' : 'text-gray-400'}`}
                                        />
                                        <div>
                                            <p className={`font-medium ${address.type === "Work" ? 'text-green-700' : 'text-gray-700'}`}>
                                                Work
                                            </p>
                                            <p className="text-sm text-gray-500">Office Address</p>
                                        </div>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div>
                        <FormInput
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onChange={handleOnChange}
                            value={address.fullName}
                        />
                        {error.fullName && (
                            <p className="text-red-500 text-sm mt-1">{error.fullName}</p>
                        )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <FormInput
                            type="number"
                            name="mobileNumber"
                            placeholder="Mobile Number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onChange={handleOnChange}
                            value={address.mobileNumber}
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
                            value={address.pinCode}
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
                            value={address.country}
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
                            value={address.address}
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
                            value={address.cityDistrictTown}
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
                            value={address.state}
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
                            value={address.landMark}
                        />
                        {error.landMark && (
                            <p className="text-red-500 text-sm mt-1">{error.landMark}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="col-span-2 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Update Address
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditAddress;