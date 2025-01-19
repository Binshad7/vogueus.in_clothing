const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/ENV_VARS')
const verifyResetToken = async (req, res,next) => {
    const { token } = req.body;
    try {
        if (!token || req.session.resetToken !== token) {
            delete req.session.resetToken;
            delete req.session.linkExpiry;
            await req.session.save();
            return res.status(400).json({ success: false, message: "Invalid Token" });
        }
        if (Date.now() > req.session.linkExpiry) {
            delete req.session.resetToken;
            delete req.session.linkExpiry;
            await req.session.save();
            return res.status(400).json({ success: false, message: "Reset link has expired. Please request a new one." })
        }


        try{
        const decoded = jwt.verify(token,JWT_SECRET);
          req.user = decoded;
          next()
         }catch(error){
            return res.status(400).json({success:false,message:`token is not verify ${error.message}`})
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'server side error' })
    }

}

module.exports = {
    verifyResetToken
}