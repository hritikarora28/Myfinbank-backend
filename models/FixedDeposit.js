const mongoose = require('mongoose');

const fixedDepositSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    principalAmount: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        default: 5 // Example interest rate
    },
    maturityAmount: Number,
    term: {
        type: Number // in months
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    maturityDate: Date
}, { timestamps: true });

module.exports = mongoose.model('FixedDeposit', fixedDepositSchema);
