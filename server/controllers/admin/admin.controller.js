
const Admin = require('../../models/userSchema');
const generateToken = require('../../utils/genarateToken');
const {comparePassword} = require('../../utils/bcryptPassowrd')
const adminLogin = async (req, res) => {
    try {
        var { email, password } = req.body;
        // console.log(email,password)
        const ExistingAdmin = await Admin.findOne({ email });
        //  console.log(ExistingAdmin)
        if (!ExistingAdmin) {

            return res.status(400).json({ success: false, message: "Admin does not exist" });
        }
        const isPasswordCorrect = await comparePassword(password, ExistingAdmin.password);
        if (!isPasswordCorrect) {
            console.log(1);
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        
        if (ExistingAdmin.role !== 'admin') {
            console.log(2);
            return res.status(400).json({ success: false, message: "You are not an admin" });
        }
        
        if (ExistingAdmin.isBlock) {
            console.log(3);
            return res.status(400).json({ success: false, message: "You are blocked by admin" });
        }
        await generateToken(ExistingAdmin._id, res);

        var { password, googleId, ...admin } = ExistingAdmin._doc;

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            admin
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const adminRefresh = (req, res) => {
    try {
        const admin = req.user;
        if (admin.isBlock) {
            return res.status(401).json({ success: false, message: 'admin is blocked' })
        }
        if (admin.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not valid Admin' })
        }
        res.status(200).json({ success: true, message: 'Valid Admin', admin })
    } catch (error) {

    }
}


const adminLogout = async (req, res) => {
    try {
        console.log('clearcookie')
        res.clearCookie("vogueusToken")
        res.status(200).json({ success: true, message: "Admin Logged out success fully completed " })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    adminLogin,
    adminLogout,
    adminRefresh,
}

// } rbac
