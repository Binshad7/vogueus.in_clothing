const user = require('../../models/userSchema');



const addewAddress = async (req, res) => {
  const { userId } = req.params;
  const { fullName, mobileNumber, pinCode, country, address, cityDistrictTown, state, landMark } = req.body.address
  if (!fullName.trim()) {
    return res.status(400).message({ success: false, message: 'FullName is Required' })
  }
  if (!mobileNumber.trim()) {
    return res.status(400).message({ success: false, message: 'mobileNumber is Required' })
  }
  if (mobileNumber.length !== 10) {
    return res.status(400).message({ success: false, message: 'mobileNumber is Not Valid' })
  }
  if (pinCode.length !== 6) {
    return res.status(400).message({ success: false, message: 'pinCode is Not Valid' })
  }
  if (!country.trim()) {
    return res.status(400).message({ success: false, message: 'country is Required' })
  }
  if (!address.trim()) {
    return res.status(400).message({ success: false, message: 'address is Required' })
  }
  if (!cityDistrictTown.trim()) {
    return res.status(400).message({ success: false, message: 'cityDistrictTown is Required' })
  }
  if (!state.trim()) {
    return res.status(400).message({ success: false, message: 'state is Required' })
  }
  if (!landMark.trim()) {
    return res.status(400).message({ success: false, message: 'landMark is Required' })
  }
  if (userId !== req.user._id.toString()) {
    return res.status(400).message({ success: false, message: 'User Not Valid' })
  }
  try {

    const ExistUser = await user.findOne({ _id: userId });
    if (ExistUser.address.length > 4) {
      return res.status(400).json({ success: false, message: '4 Address Already Exist' })
    }

    ExistUser.address.push(req.body.address);
    await ExistUser.save()
    const userWithNewAddress = await user.findOne({ _id: userId });
    res.status(200).json({ success: true, message: "New Address Added", user: JSON.stringify(userWithNewAddress) })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'server side error' })
  }
}


const deleteAddress = async (req, res) => {
  const { addressId } = req.params;
  try {
    const ExistUser = await user.findOne({ _id: req.user._id });
    if (!ExistUser) {
      return res.status(400).json({ success: false, message: "User Not find" })
    }
    const deletedAddress = await ExistUser.address.filter((address) => address._id.toString() !== addressId);

    ExistUser.address = deletedAddress;
    await ExistUser.save();
    const updatedAddress = await user.findOne({ _id: ExistUser._id })
    res.status(200).json({ success: true, message: "Address Successfuly Deleted", address: JSON.stringify(deletedAddress) })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'server side error' })
  }
}

const editAddress = async (req, res) => {
  const { addressId } = req.params;
  const { fullName, mobileNumber, pinCode, country, address, cityDistrictTown, state, landMark } = req.body.address;

  try {
    // Early validation for required fields
    if (!addressId) {
      return res.status(400).json({ success: false, message: 'Address ID is required' });
    }

    // Input validations with better error messages
    if (!mobileNumber?.trim()) {
      return res.status(400).json({ success: false, message: 'Mobile Number is required' });
    }
    if (mobileNumber.trim().length !== 10) {
      return res.status(400).json({ success: false, message: 'Mobile Number Should Be 10 Digit' });
    }

    if (!pinCode?.trim()) {
      return res.status(400).json({ success: false, message: 'Pin Code is required' });
    }
    if (pinCode.trim().length !== 6) {
      return res.status(400).json({ success: false, message: 'PinCode Number Should Be 6 Digit' });
    }

    let updatedValues = {};

    if (fullName?.trim()) updatedValues['address.$.fullName'] = fullName.trim();
    if (mobileNumber?.trim()) updatedValues['address.$.mobileNumber'] = mobileNumber.trim();
    if (pinCode?.trim()) updatedValues['address.$.pinCode'] = pinCode.trim();
    if (country?.trim()) updatedValues['address.$.country'] = country.trim();
    if (address?.trim()) updatedValues['address.$.address'] = address.trim();
    if (cityDistrictTown?.trim()) updatedValues['address.$.cityDistrictTown'] = cityDistrictTown.trim();
    if (state?.trim()) updatedValues['address.$.state'] = state.trim();
    if (landMark?.trim()) updatedValues['address.$.landMark'] = landMark.trim();

    if (Object.keys(updatedValues).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const updatedUser = await user.findOneAndUpdate(
      {
        _id: req.user._id,
        "address._id": addressId
      },
      { $set: updatedValues },
      {
        new: true
      }
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "User not found or address doesn't exist"
      });
    }

    const updatedAddress = updatedUser.address.find(
      addr => addr._id.toString() === addressId
    );
    console.log('updateUser : ', updatedUser)
    console.log('updatedAddress :', updatedAddress)
    if (!updatedAddress) {
      return res.status(400).json({
        success: false,
        message: "Address not found after update"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated Successfully",
      updatedAddress:JSON.stringify(updatedAddress)
    });

  } catch (error) {
    console.error('Error in editAddress:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server side error',
      error: error.message
    });
  }
};
module.exports = {
  addewAddress,
  deleteAddress,
  editAddress
}