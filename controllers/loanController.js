const Loan = require('../models/Loan');
const { calculateEMI } = require('../utils/utils');



// Apply for Loan (User)
exports.applyForLoan = async (req, res) => {
    const { loanAmount, interestRate, loanTermMonths } = req.body;
    try {
        const emi = calculateEMI(loanAmount, interestRate, loanTermMonths);

        const loan = new Loan({
            user: req.user._id,
            loanAmount,
            interestRate,
            loanTermMonths,
            emi,
        });

        await loan.save();
        res.status(201).json({ message: 'Loan application submitted successfully', emi });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Loans (Admin)
exports.getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find().populate('user', 'name email');
        res.json(loans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve/Deny Loan (Admin)
exports.approveOrDenyLoan = async (req, res) => {
    const { status } = req.body; // 'approved' or 'denied'
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        loan.status = status;
        if (status === 'approved') {
            loan.approvedDate = Date.now();
        }
        await loan.save();
        res.json({ message: `Loan ${status} successfully`, loan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Loan by ID (Admin)
exports.getLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id).populate('user', 'name email');
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        res.json(loan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
