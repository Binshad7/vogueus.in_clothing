const User = require('../models/userSchema');
const { hashPassword, comparePassword } = require('../utils/bcryptPassowrd');
const generateToken = require('../utils/genarateToken');
const sendEmail = require('../utils/nodemailer');
const sendResetPassowrdMail = require('../utils/resetPasswordMail');
const {genarateResetPasswordToken} = require('../utils/genarateTokenResetPassowrd')
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
            return res.status(401).json({ success: false, message: ' this user is blocked from the site ' });
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

const logout = async (req, res) => {
    try {
        res.clearCookie("vogueusToken")
        res.status(200).json({ success: true, message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


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
        const token = genarateResetPasswordToken(exist_user)
        await sendResetPassowrdMail(exist_user.email, exist_user.userName, res, token,req)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'some thing wrong' });
    }
}

const resetPassword = async (req, res) => {
    const {password} = req.body
    try {
     if(!password.trim()){
        return res.status(400).json({success:false,message:"New Passowrd is Required"})
     }
     const hashedPassword = await hashPassword(password);
     const updatedPassword = await User.updateOne({_id:req._id},{password:hashedPassword});
     if(updatedPassword.modifiedCount<=0){
        return res.status(400).json({success:false,message:'some thing wrong in update password try again latter '})
     }
     res.status(200).json({success:true,message:'Password Updated Login again'})
    } catch (error) {
     console.log(error);
     res.status(500).json({success:false,message:`server side error ${error.message}`})
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
    resetPassword    
}