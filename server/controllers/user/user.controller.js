const userSchema = require('../../models/userSchema');
const User = require('../../models/userSchema');
const { hashPassword, comparePassword } = require('../../utils/bcryptPassowrd');
const generateToken = require('../../utils/genarateToken');
const sendEmail = require('../../utils/nodemailer');
const sendResetPassowrdMail = require('../../utils/resetPasswordMail');
// create new user

const register = async (req, res) => {

    var { userName, email, password, user_Otp } = req.body
    const currentTime = Date.now()
    const expiryTime = req.session.otpExpiry
    const otp = req.session.otp
    console.log(req.session)

    try {

        if (currentTime < expiryTime) {
            if (otp == user_Otp) {
                req.session.otp = null;
                const hashedPassword = await hashPassword(password);
                const user = new User({
                    userName,
                    email,
                    password: hashedPassword,
                    isVerified: true
                });
                const newUser = await user.save();
                await generateToken(newUser._id, res);
                var { password, googleId, ...userDetails } = newUser._doc
                res.status(200).json({ success: true, message: 'User created successfully', user: userDetails });
            } else {
                return res.status(401).json({ success: false, message: 'OTP IS NOT VALID' })
            }
        } else {
            return res.status(401).json({ success: false, message: 'OTP EXPAIR' })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'server side error try agian later' });
    }
}


// sign up with google 

const googleSignup = async (req, res) => {
    try {
        const Email_exist = await User.findOne({ email: req.body.email });
        console.log(req.body.googleId)
        if (Email_exist) {
            // update the user with the google id
            let updateValues = {
                googleId: req.body.googleId,
                isVerified: true,
            }
            const { modifiedCount } = await User.updateOne(
                { email: Email_exist.email },
                { $set: updateValues }
            );
            if (modifiedCount > 0) {
                console.log('updated with googole id')
            }
            return res.status(409).json({ success: false, message: 'Email already exist' });
        }
        const user = new User(req.body);
        const newUser = await user.save();
        await generateToken(newUser._id, res);
        var { password, googleId, ...userDetails } = newUser._doc

        res.status(200).json({ success: true, message: 'User created successfully', user: userDetails });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// user login
const login = async (req, res) => {
    var { email, password } = req.body;

    try {
        const exist_user = await User.findOne({ email });
        if (!exist_user) {
            return res.status(401).json({ success: false, message: 'Invalid email ' });
        }
        const isPasswordMatch = await comparePassword(password, exist_user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }
        if (exist_user.isBlock) {
            return res.status(401).json({ success: false, message: ' this user is blocked from the site ' });
        }

        await generateToken(exist_user._id, res);
        var { password, googleId, ...userDetails } = exist_user._doc

        res.status(200).json({ success: true, message: 'User logged in successfully', user: userDetails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


//  user login with google

const loginWIthGoogle = async (req, res) => {
    try {
        var { email, googleId } = req.body;

        const exist_user = await User.findOne({ email });
        if (!exist_user) {
            return res.status(401).json({ success: false, message: 'Invalid email please register the email ' });
        }
        if (exist_user.googleId !== googleId) {
            return res.status(401).json({ success: false, message: 'Enter your email and passowrd ' });
        }

        if (exist_user.isBlock) {
            return res.status(401).json({ success: false, message: ' This User is Blocked from the Site ' });
        }
        generateToken(exist_user._id, res);
        var { password, googleId, ...userDetails } = exist_user

        res.status(200).json({ success: true, message: 'User logged in successfully', user: userDetails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}





// refresh token
const refreshToken = async (req, res) => {
    try {
        const { user } = req;

        res.status(200).json({ success: true, message: 'Token refreshed successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// user logout



// email verification 

const emailVerification = async (req, res) => {

    const { email, userName } = req.body;
    try {

        const Emial_exist = await User.findOne({ email });
        if (Emial_exist) {
            console.log('email allready exist')
            return res.status(401).json({ success: false, message: 'Email already exist' });
        }


        sendEmail(email, userName, res, req);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// resend otp to email

const emailResendCode = async (req, res) => {

    const { email, userName } = req.body;
    try {
        sendEmail(email, userName, res, req);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const forgotPassowrd = async (req, res) => {
    const { email } = req.body
    try {

        const exist_user = await User.findOne({ email });
        if (!exist_user) {
            return res.status(400).json({ success: true, message: "Enter your user account's verified email address and we will send you a password reset link" })
        }
        const token = generateToken(exist_user._id, null, 'forgot');
        await sendResetPassowrdMail(exist_user.email, exist_user.userName, res, token, req)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'some thing wrong' });
    }
}

const resetPassword = async (req, res) => {
    const { password } = req.body
    try {
        if (!password.trim()) {
            return res.status(400).json({ success: false, message: "New Passowrd is Required" })
        }
        const hashedPassword = await hashPassword(password);
        const updatedPassword = await User.updateOne({ _id: req.user }, { password: hashedPassword });
        if (updatedPassword.modifiedCount <= 0) {
            return res.status(400).json({ success: false, message: 'some thing wrong in update password try again latter ' })
        }
        res.status(200).json({ success: true, message: 'Password Updated Login again' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: `server side error ${error.message}` })
    }
}

const updateUserName = async (req, res) => {
    const { userId } = req.params;
    const { userName, email } = req.body
    if (!userId) {
        return res.status(400).json({ success: false, message: 'userId dont get' })
    }
    if (!userName?.trim()) {
        return res.status(400).json({ success: false, message: 'name is Requierd' })
    }
    if (!email?.trim()) {
        return res.status(400).json({ success: false, message: 'email is Requierd' })
    }
    if (req.user.email !== email) {
        return res.status(400).json({ success: false, message: 'Email is not Valid' })
    }
    if (req.user._id.toString() !== userId) {
        return res.status(400).json({ success: false, message: 'some thing wrong in userID' })
    }
    try {
        const updatedUser = await User.updateOne({ _id: userId }, { $set: { userName } });
        if (updatedUser.modifiedCount == 1) {
            const user = await User.findOne({ _id: userId }).select('userName email role isVerified address createdAt updatedAt');
            return res.status(200).json({ success: true, message: 'Name is Successfuly updated', user })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: `server side error ${error.message}` })
    }
}


const logout = async (req, res) => {
    try {
        res.clearCookie("vogueusToken")
        res.status(200).json({ success: true, message: 'User logged out successfully' });
    } catch (error) {
        console.error("Error logout :", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
}


const checkPassowrd = async (req, res) => {
    const { userId } = req.params
    const { currentPassword } = req.body
    if (!req.user._id.equals(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid User ID' });
    }
    try {
        const existUser = await userSchema.findOne({ _id: userId });
        if (!existUser) {
            return res.status(400).json({ success: false, message: "User Not Find" })
        }
        if (!existUser.password) {
            return res.status(200).json({ success: true, message: 'Create A New Password' })
        }
        const isValidPassowrd = await comparePassword(currentPassword, existUser.password);
        if (!isValidPassowrd) {
            return res.status(400).json({ success: false, message: 'Password Is Not Match' })
        }
        res.status(200).json({ success: true, message: 'password Is Currect' })
    } catch (error) {
        console.error("Error changePassword :", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
}
const changePassword = async (req, res) => {
    const { userId } = req.params
    const { newPassword } = req.body
    if (!req.user._id.equals(userId)) {
        return res.status(400).json({ success: false, message: 'Invalid User ID' });
    }
    if (!newPassword.trim()) {
        return res.status(400).json({ success: false, message: 'New Password Is Required' })
    }
    try {
        const hashedPassword = await hashPassword(newPassword)
        const updatedUser = await userSchema.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
        if (updatedUser.modifiedCount == 0) {
            return res.status(400).json({ success: false, message: 'Password Not Updated' })
        }
        res.status(200).json({ success: true, message: 'Password Successfuly Updated' })
    } catch (error) {
        console.error("Error changePassword :", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
}
module.exports = {
    register,
    login,
    logout,
    googleSignup,
    loginWIthGoogle,
    refreshToken,
    emailVerification,
    emailResendCode,
    forgotPassowrd,
    resetPassword,
    updateUserName,
    checkPassowrd,
    changePassword
}