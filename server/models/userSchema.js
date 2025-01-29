const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: 'user',
    },
    isBlock: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    address: [{
        fullName: {
            type: String,
            required: true
        },
        mobileNumber: {
            type: String,
            required: true
        },
        pinCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        cityDistrictTown: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        landMark: {
            type: String,
        }

    }]
},{timestamps:true});

module.exports = mongoose.model('User', userSchema);