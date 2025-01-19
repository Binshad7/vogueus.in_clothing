const jswebtoken = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/ENV_VARS');

const generateToken = (userID, res=null,forgot=null) => {
    const expiresIn = forgot ? "3h" : "15d";
    const token = jswebtoken.sign({ userID }, JWT_SECRET, { expiresIn });
     if(forgot){
        return token
     }
    res.cookie('vogueusToken', token, {

        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevent xss attacks cross-site scripting attacks , make it not be access by js
        sameSite: 'strict', // CSRF attacks cross-site request forgery attacks
        secure: true,

    })
}


module.exports = generateToken;
