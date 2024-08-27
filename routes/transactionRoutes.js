const express = require('express');
const {
    deposit,
    withdraw,
    transfer,
    getUserTransactions,
    getAllTransactions,
    depositToRecurring,
    createFixedDeposit,
    withdrawFixedDeposit,
    repayLoan,
    startRecurringDeposit,
    getUserLoans,
    getUserRecurringDeposits,
    getUserFixedDeposits,
    getAllLoans,
    getAllRecurringDeposits,
    getAllFixedDeposits
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

const router = express.Router();

// User routes
router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);
router.post('/transfer', protect, transfer);
router.get('/my-transactions', protect, getUserTransactions);

// Recurring Deposit
router.post('/deposit-recurring', protect, depositToRecurring);
router.post('/recurring-deposit/start', protect, startRecurringDeposit);

// Fixed Deposit
router.post('/create-fd', protect, createFixedDeposit);
router.post('/withdraw-fd/:id', protect, withdrawFixedDeposit);

// Loan Repayment
router.post('/repay-loan', protect, repayLoan);

// Get User's Loans, Recurring Deposits, and Fixed Deposits
router.get('/my-loans', protect, getUserLoans);
router.get('/my-recurring-deposits', protect, getUserRecurringDeposits);
router.get('/my-fixed-deposits', protect, getUserFixedDeposits);

// Admin routes
router.get('/all-transactions', protect, admin, getAllTransactions);
router.get('/all-loans', protect, admin, getAllLoans);
router.get('/all-recurring-deposits', protect, admin, getAllRecurringDeposits);
router.get('/all-fixed-deposits', protect, admin, getAllFixedDeposits);

module.exports = router;
