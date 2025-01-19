const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/ENV_VARS');
const User = require('../models/userSchema');
const protectRoute = async (req, res, next) => {

    try {
        console.log('protect Route');

        const token = req.cookies['vogueusToken'];

        if (!token) {
            return res.status(401).json({ message: "You are not authenticated, please login" });
        }
        const decoded = jsonwebtoken.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "You are not authenticated, please login" });
        }
        const userDetails = await User.findById(decoded.userID);
        if (!userDetails) {
            return res.status(401).json({ message: "You are not authenticated, please login" });
        }

        if (userDetails.isBlock) {
            res.clearCookie("vogueusToken")
            return res.status(401).json({ success: false, message: "You'r blocked from this site" })
        }

        const { password, googleId, ...user } = userDetails._doc
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}
module.exports = protectRoute;