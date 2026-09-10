const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profileImage: {
        type: String,
        default: null
    },
    password: {
        type: String,
        required: true,
    },
    phoneno: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    enableaccess:{
        type:Boolean,
        default:false
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
