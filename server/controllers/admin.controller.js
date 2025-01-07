
const Admin = require('../models/userSchema');
const generateToken = require('../utils/genarateToken');
const bcrypt = require('bcrypt');
// create new user
const adminLogin = async (req, res) => {
    try {
        var { email, password } = req.body;
        const ExistingAdmin = await Admin.findOne({ email });

        if (!ExistingAdmin) {

            return res.status(400).json({ success: false, message: "Admin does not exist" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, ExistingAdmin.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        if (ExistingAdmin.role !== 'admin') {
            return res.status(400).json({ success: false, message: "You are not an admin" });
        }

        if (ExistingAdmin.isBlock) {
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


// const obj = {
//     productName: 'shirt',
//     price: 500,
//     description: 'good shirt',
//     verians:
//         [
//              {color:'red',img:['img-1.png','img-2.png','img-3.png'],stock:{s:2,m:3,l:5,xl:1}},
//              {color:'black',img:['img-1.png','img-2.png','img-3.png'],stock:{s:3,m:4,l:1,xl:6}}

//         ]
// } rbac
