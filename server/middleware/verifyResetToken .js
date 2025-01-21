const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/ENV_VARS')
const verifyResetToken = async (req, res, next) => {
    const { token } = req.body;
    try {

        if (!token) {
            return res.status(200).json({ success: false, message: 'Token is Required' })
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded)
        const { userId, expairAt, exp } = decoded;

        console.log(expairAt, exp)
        const tokenAge = Date.now() - expairAt;
        if(tokenAge>3*60*60*1000){
            return res.status(400).json({success:false,message:"Token  is Expaired 3 hours only valid this Token "})
        }
        req._id = userId ;
        next()

    } catch (error) {

        console.log(error.message, 'error in veryfyReset token ');
        res.status(500).json({ success: false, message: 'server side error' })
    }

}

module.exports = {
    verifyResetToken
}