const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    investmentType: {
        type: String,
        enum: ['loan', 'recurring_deposit', 'fixed_deposit'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    maturityDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Investment', investmentSchema);
