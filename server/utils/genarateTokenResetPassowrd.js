const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const {JWT_SECRET}  = require('../config/ENV_VARS')
const genarateResetPasswordToken = (user) => {

    const payload = {
        userId: user.id,
        email: user.email,
        expairAt: Date.now(),
        // Add a random string to make each token unique even for same user
        nonce: crypto.randomBytes(16).toString('hex')
    }

    const token = jwt.sign(payload,JWT_SECRET,{expiresIn:'3h'});
    return token
}
module.exports = {
    genarateResetPasswordToken
}