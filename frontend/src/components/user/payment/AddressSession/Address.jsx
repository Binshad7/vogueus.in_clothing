import React, { useEffect, useState } from 'react';
import { Check, PlusCircle, ChevronDown } from 'lucide-react';
import AddressPopup from './AddressPopup';

const AddressDropdown = ({ addresses, selectedAddress, onAddressSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAddresses, setShowAddresses] = useState(false);

    useEffect(() => {
        onAddressSelect(0);
    },[]);

    const handleOpenAddAddress = () => {
        setIsOpen(true);
        setShowAddresses(false);
    };

    const handleCloseAddress = () => {
        setIsOpen(false);
    };

    const handleAddressSelect = (index) => {
        onAddressSelect(index);
        setShowAddresses(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            {isOpen && <AddressPopup closeAddress={handleCloseAddress} />}

            {/* Initial Dropdown Button */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Delivery Address</h2>
                <button
                    onClick={() => setShowAddresses(!showAddresses)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <span className="text-sm">Select Address</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAddresses ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Address List */}
            {showAddresses && (
                <div className="space-y-3 mb-4">
                    {(!addresses || addresses.length === 0) ? (
                        <p className="text-gray-500">No addresses found. Please add an address.</p>
                    ) : (
                        addresses.map((address, index) => (
                            <div
                                key={index}
                                onClick={() => handleAddressSelect(index)}
                                className={`border rounded-lg p-4 cursor-pointer transition-all
                  ${selectedAddress === index
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium">{address.fullName}</h3>
                                            {selectedAddress === index && (
                                                <Check className="w-4 h-4 text-blue-500" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{address.mobileNumber}</p>
                                        <p className="text-sm text-gray-600">
                                            {address.country}, {address.landMark}
                                            <br />
                                            {address.cityDistrictTown}, {address.state} {address.pinCode}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full h-fit
                      ${address.type === 'Home'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-green-100 text-green-700'
                                            }`}
                                    >
                                        {address.type}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Selected Address Display (when dropdown is closed) */}
            {!showAddresses && selectedAddress !== null && addresses && addresses.length > 0 && (
                <div className="border rounded-lg p-4 mb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium">{addresses[selectedAddress].fullName}</h3>
                                <span
                                    className={`px-2 py-1 text-xs rounded-full
                    ${addresses[selectedAddress].type === 'Home'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-green-100 text-green-700'
                                        }`}
                                >
                                    {addresses[selectedAddress].type}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{addresses[selectedAddress].mobileNumber}</p>
                            <p className="text-sm text-gray-600">
                                {addresses[selectedAddress].country}, {addresses[selectedAddress].landMark}
                                <br />
                                {addresses[selectedAddress].cityDistrictTown}, {addresses[selectedAddress].state} {addresses[selectedAddress].pinCode}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Add New Address Button */}
            {addresses.length < 4 && (
                <div className="flex justify-center">
                    <button
                        onClick={handleOpenAddAddress}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-500 
                     rounded-lg hover:bg-blue-50 transition"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Add New Address
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddressDropdown;