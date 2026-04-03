const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
        index: true
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: ['Farmer', 'Buyer'],
        default: 'Farmer'
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', ''],
        default: ''
    },
    address: {
        type: String,
        trim: true,
        default: ''
    },
    aadhar: {
        type: String,
        trim: true,
        default: ''
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: ''
    },
    photoURL: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        name: this.name,
        phone: this.phone,
        role: this.role,
        gender: this.gender,
        address: this.address,
        email: this.email,
        photoURL: this.photoURL,
        createdAt: this.createdAt
    };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
