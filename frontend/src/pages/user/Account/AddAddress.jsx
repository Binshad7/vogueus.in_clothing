import React, { useState } from "react";
import AddAddress from "./AddAddress";

const Profile = () => {
  const [addAddress, setAddAddress] = useState(false);

  const demoUserInfo = {
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "123-456-7890",
    email: "john.doe@example.com",
    addressList: [
      {
        id: 1,
        name: "Home",
        phoneNumber: "123-456-7890",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
      },
      {
        id: 2,
        name: "Office",
        phoneNumber: "987-654-3210",
        street: "456 Business Rd",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
      },
    ],
  };

  return (
    <div>
      <h1 className="text-2xl">My Info</h1>
      {!addAddress ? (
        <div>
          {/* Contact Details Section */}
          <div className="flex gap-2">
            <h2 className="text-xl pt-4">Contact Details</h2>
            <button className="underline text-blue-900 mt-4">Edit</button>
          </div>
          <div className="pt-4">
            <p className="text-gray-700 py-2 font-bold">Full Name</p>
            <p>
              {demoUserInfo.firstName} {demoUserInfo.lastName}
            </p>
            <p className="text-gray-700 py-2 font-bold">Phone Number</p>
            <p>{demoUserInfo.phoneNumber}</p>
            <p className="text-gray-700 py-2 font-bold">Email</p>
            <p>{demoUserInfo.email}</p>
          </div>

          {/* Address Section */}
          <div className="pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Address</h3>
              <button
                className="underline text-blue-900"
                onClick={() => setAddAddress(true)}
              >
                Add New
              </button>
            </div>

            <div className="pt-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-8 pb-10 mb-8">
              {demoUserInfo.addressList.map((address, index) => (
                <div
                  key={index}
                  className="bg-gray-200 border rounded-lg p-4"
                >
                  <p className="py-2 font-bold">{address.name}</p>
                  <p className="pb-2">{address.phoneNumber}</p>
                  <p className="pb-2">
                    {address.street}, {address.city}, {address.state}
                  </p>
                  <p>{address.zipCode}</p>
                  <div className="flex gap-2">
                    <button className="underline text-blue-900">Edit</button>
                    <button className="underline text-blue-900">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <AddAddress onCancel={() => setAddAddress(false)} />
      )}
    </div>
  );
};

export default Profile;
