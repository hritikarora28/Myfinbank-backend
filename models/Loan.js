const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    loanAmount: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        required: true
    },
    loanTermMonths: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'denied'],
        default: 'pending'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    approvedDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);
