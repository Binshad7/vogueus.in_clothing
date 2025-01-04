function RegisterValidation(userData) {
    let error = {};

  // user name validation
    if (!userData.userName.trim()) {
        error.userName = 'Name is  reuired'
    }

    // email validation
    if (!userData.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        error.email = 'email is invalid'
    }
    if (!userData.email.trim()) {
        error.email = 'email is required'
    }

    // password validation
    if (userData.password.length < 6) {
        error.password = 'password must be at least 6 characters'
    }
    if (!userData.password.trim()) {
        error.password = 'password is required'
    }
    
    // confirm password validation
    if (!userData.confirmPassword.trim()) {
        error.confirmPassword = 'confirm password is required'
    }
    if (userData.password !== userData.confirmPassword) {
        error.confirmPassword = 'confirmPassword do not match'
    }

    return error
}
export default RegisterValidation