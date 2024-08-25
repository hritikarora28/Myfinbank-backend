const express = require('express');
const { deposit, withdraw, transfer, getUserTransactions, getAllTransactions,depositToRecurring, createFixedDeposit, withdrawFixedDeposit, repayLoan,startRecurringDeposit} 
= require('../controllers/transactionController');
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
// Admin route
router.get('/', protect, admin, getAllTransactions);

module.exports = router;
