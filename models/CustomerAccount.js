const mongoose = require('mongoose');

const customerAccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    },
    accountType: {
        type: String,
        enum: ['savings', 'current'],
        default: 'savings'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('CustomerAccount', customerAccountSchema);
