const User = require('../models/userSchema');
const { hashPassword, comparePassword } = require('../utils/bcryptPassowrd');
const generateToken = require('../utils/genarateToken');
const sendEmail = require('../utils/nodemailer');



// create new user

const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const Emial_exist = await User.findOne({ email });
        if (Emial_exist) {
            return res.status(409).json({ error: 'Email already exist' });
        }
        const hashedPassword = await hashPassword(password);
        const user = new User({
            userName,
            email,
            password: hashedPassword
        });
        const newUser = await user.save();
        await generateToken(newUser._id, res);
        res.status(200).json({ success: true, message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// sign up with google 

const googleSignup = async (req, res) => {
    try {
        const Emial_exist = await User.findOne({ email: req.body.email });

        if (Emial_exist) {
            // update the user with the google id
            let updateValues = {
                googleId: req.body.googleId,
                isVerified: true,
            }
            const { modifiedCount } = await User.updateOne(
                { email: Emial_exist.email },
                { $set: updateValues }
            );
            if (modifiedCount) {
                console.log('User updated successfully');
            }
            return res.status(409).json({ success: false, message: 'Email already exist' });
        }
        const user = new User(req.body);
        const newUser = await user.save();
        await generateToken(newUser._id, res);
        res.status(200).json({ success: true, message: 'User created successfully', user: newUser });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// user login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const exist_user = await User.findOne(email);
        if (!exist_user) {
            return res.status(401).json({ success: false, message: 'Invalid email ' });
        }
        const isPasswordMatch = await comparePassword(password, exist_user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }
        if (!exist_user.isBlock) {
            return res.status(401).json({ success: false, message: ' this user is blocked from the site ' });
        }
        await generateToken(exist_user._id, res);
        res.status(200).json({ success: true, message: 'User logged in successfully', user: exist_user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


//  user login with google

const loginWIthGoogle = async (req, res) => {
    try {
        const { email, googleId } = req.body;

        const exist_user = await User.findOne({ email });
        if (!exist_user) {
            return res.status(401).json({ success: false, message: 'Invalid email places register the email ' });
        }
        if (exist_user.googleId !== googleId) {
            return res.status(401).json({ success: false, message: 'Invalid google id ' });
        }

        if (exist_user.isBlock) {
            return res.status(401).json({ success: false, message: ' this user is blocked from the site ' });
        }
        await generateToken(exist_user._id, res);
        res.status(200).json({ success: true, message: 'User logged in successfully', user: exist_user });
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
        res.clearCookie('voice_token');
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
            return res.status(401).json({ success: false, message: 'Email already exist' });
        }

        
        sendEmail(email, userName, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// resend otp to email

const emailResendCode = async (req, res) => {

    const { email, userName } = req.body;
    try {
        sendEmail(email, userName, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    emailResendCode
}