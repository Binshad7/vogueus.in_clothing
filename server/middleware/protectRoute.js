const jsonwebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/ENV_VARS');
const User = require('../models/userSchema');
const protectRoute = async (req, res, next) => {
    
    try {

        const token =  req.cookies['vogueusToken'];
        console.log(token, 'token');
        
        if (!token) {
            return res.status(401).json({ message: "You are not authenticated, please login" });
        }
        const decoded = jsonwebtoken.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "You are not authenticated, please login" });
        }       
        const user = await User.findById(decoded.userID);
        if (!user) {
            return res.status(401).json({ message: "You are not authenticated, please login" });
        }   
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}
module.exports = protectRoute;