const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: [true, "Nome is required!"]
    },
    photo: {
        type: 'string',
        required: [true, "Photo is required!"]
    },
    password: {
        type: 'string',
        unique: true,
        required: [true, "Password is required!"]
    },
    email: {
        type: 'string',
        unique: true,
        required: [true, "Email is required!"]
    },
    nif: {
        type: 'number',
        unique: true,
        required: [true, "Email is required!"],
        maxlength: 9
    },
    phonenumber: {
        type: 'number',
        unique: true,
        required: [true, "Phone is required!"],
        maxlength: 9
    },
    isActive: {
        type: 'boolean',
        default: false
    },
    role: {
        type: 'string',
        default: 'user',
        enums: ['admin', 'manager', 'user']
    },
    entityConnected: {
        type: 'string',
        ref: "HairDresser"
    },
    recoverCode: {
        type: 'string'
    }
},
    { timestamps: true }
);
module.exports = mongoose.model('User', UserSchema);