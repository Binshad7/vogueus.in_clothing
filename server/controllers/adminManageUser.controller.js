const userSchema = require('../models/userSchema');


const fetchAllUsers = async (req, res) => {
    try {
        console.log('hited fetch user');

        const users = await userSchema.find();
        res.status(200).json({ success: false, message: 'All Users Fetched', users })
    } catch (error) {
        res.status(500).json({ success: false, message: 'server side error try again later' })
    }
}

const updateUserStatus = async (req, res) => {
    const { userID } = req.params
    try {
        const Exist_user = await userSchema.findById(userID);
        if (!Exist_user) {
            return res.status(400).json({ success: false, message: 'user not found' })
        }
        const updatedUser = await userSchema.updateOne({ _id: userID }, { $set: { isBlock: !Exist_user.isBlock } });
        if (updatedUser.matchedCount == 0) {
            return res.status(400).json({ success: false, message: 'User Status not updated' })
        }
        const users = await userSchema.find();
        res.status(200).json({ success: false, message: 'user status success fully updated', users })

    } catch (error) {
        res.status(500).json({ success: false, message: 'server side error try again later' })
    }
}

module.exports = {
    fetchAllUsers,
    updateUserStatus
}