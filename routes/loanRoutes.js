const express = require('express');
const { applyForLoan, getAllLoans, approveOrDenyLoan, getLoanById } = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');

const router = express.Router();

// User routes
router.post('/apply', protect, applyForLoan);

// Admin routes
router.get('/', protect, admin, getAllLoans);
router.get('/:id', protect, admin, getLoanById);
router.put('/:id/status', protect, admin, approveOrDenyLoan);

module.exports = router;
