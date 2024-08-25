const mongoose = require('mongoose');

const recurringDepositSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        default: 6 // Example interest rate
    },
    term: {
        type: Number // in months
    },
    deposits: [
        {
            date: Date,
            amount: Number
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('RecurringDeposit', recurringDepositSchema);
