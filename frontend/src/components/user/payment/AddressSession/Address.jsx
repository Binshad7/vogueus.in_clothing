import React, { useEffect, useState } from 'react';
import { Check, PlusCircle } from 'lucide-react';
import AddressPopup from './AddressPopup';
function Address({ addresses, selectedAddress, onAddressSelect }) {
    const [isOpen, setOpen] = useState(false);
    
    useEffect(() => {
        // Set default selection to first address if addresses exist and no selection
        if (addresses?.length > 0 && selectedAddress === 0) {
            onAddressSelect(addresses?.length - 1);
        }
    }, [addresses, selectedAddress, onAddressSelect]);
    const handleOpenAddAddress = () => {
        setOpen(true)
    }
    const handleCloseAddress = () => {
        setOpen(false)
    }
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            {
                isOpen && <AddressPopup
                    closeAddress={handleCloseAddress}
                />
            }
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            {(!addresses || addresses.length === 0) ? (
                <p className="text-gray-500 mb-4">No addresses found. Please add an address.</p>
            ) : (
                <div className="space-y-4">
                    {addresses.map((address, index) => (
                        <div
                            key={index}
                            onClick={() => onAddressSelect(index)}
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
                                            <Check className="w-5 h-5 text-blue-500" />
                                        )}
                                    </div>
                                    <p className="text-gray-600 mt-1">{address.mobileNumber}</p>
                                    <p className="text-gray-600 mt-1">
                                        {address.country},
                                        {address.landMark}
                                        <br />
                                        {address.cityDistrictTown}, {address.state} {address.pinCode}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full
                                            ${address.type === 'Home'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-green-100 text-green-700'
                                            }`}
                                    >
                                        {address.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add New Address Button */}
            {
                addresses.length < 4 &&
                < div className="mt-6 flex justify-center">
                    <button
                        onClick={handleOpenAddAddress}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-50 transition"
                    >

                        <PlusCircle className="w-5 h-5" />
                        Add New Address
                    </button>
                </div>
            }
        </div >
    );
}

export default Address;
