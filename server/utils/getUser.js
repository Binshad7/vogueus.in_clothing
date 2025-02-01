const userSchema = require('../models/userSchema');


const GetUser = async (userID) => {
    try {
        const user = await userSchema.findOne({ _id: userID });
        return user
    } catch (error) {
        console.log(error.message)
        throw Error('User Not Valid')
    }
}
module.exports = { GetUser }