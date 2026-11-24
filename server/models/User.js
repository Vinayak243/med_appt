const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true
    },

    // Patient profile details
    bloodGroup: { type: String, default: '' },
    sex: { type: String, default: '' },
    dob: { type: String, default: '' },
    height: { type: String, default: '' },
    weight: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    address: { type: String, default: '' }

}, {
    timestamps: true
});

module.exports = mongoose.model('user', userSchema);