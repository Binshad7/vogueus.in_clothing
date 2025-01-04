
const Admin = require('../models/userSchema');
const generateToken = require('../utils/genarateToken');
const bcrypt = require('bcrypt');
// create new user
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const ExistingAdmin = await Admin.findOne({ email });

        if (!ExistingAdmin) {
            return res.status(400).json({ success: false, message: "Admin does not exist" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, ExistingAdmin.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        if (ExistingAdmin.role !== 'admin') {
            console.log(7);

            return res.status(400).json({ success: false, message: "You are not an admin" });
        }

        if (ExistingAdmin.isBlock) {
            return res.status(400).json({ success: false, message: "You are blocked by admin" });
        }
        await generateToken(ExistingAdmin._id, res);
        return res.status(200).json({ success: true, message: "Login successfully", admin: ExistingAdmin });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const adminLogout = async (req, res) => {
    try {
        req.clearcookie();
        res.status(200).json({ success: true, message: "Admin Logged out success fully completed " })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    adminLogin,
    adminLogout,
}