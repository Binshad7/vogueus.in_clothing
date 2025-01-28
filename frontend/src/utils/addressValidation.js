const addressValidation = (addressData) => {
    let error = {};

    // Full Name Validation
    if (!addressData.fullName.trim()) {
        error.fullName = 'Name is Required';
    } else if (!addressData.fullName.match(/^[a-zA-Z ]+$/)) {
        error.fullName = 'Name is Not Valid (No Numbers or Symbols)';
    }

    // Mobile Number Validation
    const mobileRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!addressData.mobileNumber) {
        error.mobileNumber = 'Mobile Number is Required';
    } else if (!mobileRegex.test(addressData.mobileNumber)) {
        error.mobileNumber = 'Mobile Number is Not Valid';
    }
    if (addressData.mobileNumber.length !== 10) {
        error.mobileNumber = 'Mobile Number Must Be 10 Digits';
    }

    // PIN Code Validation
    const pinCodeRegex = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;
    if (!addressData.pinCode) {
        error.pinCode = 'PIN Code is Required';
    } else if (!pinCodeRegex.test(addressData.pinCode)) {
        error.pinCode = 'PIN Code is Not Valid';
    }

    // Country Validation
    if (!addressData.country.trim()) {
        error.country = 'Country is Required';
    }

    // Address Validation
    if (!addressData.address.trim()) {
        error.address = 'Address is Required';
    }

    // City/District/Town Validation
    if (!addressData.cityDistrictTown.trim()) {
        error.cityDistrictTown = 'City/District/Town is Required';
    }

    // State Validation
    if (!addressData.state.trim()) {
        error.state = 'State is Required';
    }

    // Landmark Validation (Optional)
    if (addressData.landMark && !addressData.landMark.trim()) {
        error.landMark = 'Landmark is Required';
    }

    return error;
};

export { addressValidation };
