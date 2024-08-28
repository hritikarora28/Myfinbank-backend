const Transaction = require('../models/Transaction');
const User = require('../models/User');
const RecurringDeposit = require('../models/RecurringDeposit');
const FixedDeposit = require('../models/FixedDeposit');
const Loan = require('../models/Loan');



// Deposit Money (User)
exports.deposit = async (req, res) => {
    const { amount } = req.body;
    try {
        const transaction = new Transaction({
            user: req.user._id,
            type: 'deposit',
            amount
        });

        // Update user's balance (assuming a `balance` field in User model)
        const user = await User.findById(req.user._id);
        user.balance += amount;
        await user.save();

        await transaction.save();
        res.status(201).json({ message: 'Deposit successful', transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Withdraw Money (User)
exports.withdraw = async (req, res) => {
    const { amount } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        const transaction = new Transaction({
            user: req.user._id,
            type: 'withdraw',
            amount
        });

        // Update user's balance
        user.balance -= amount;
        await user.save();

        await transaction.save();
        res.status(201).json({ message: 'Withdrawal successful', transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Transfer Money (User)
exports.transfer = async (req, res) => {
    const { amount, recipientId } = req.body;
    try {
        const sender = await User.findById(req.user._id);
        const recipient = await User.findById(recipientId);

        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        const transaction = new Transaction({
            user: req.user._id,
            type: 'transfer',
            amount,
            recipient: recipientId
        });

        // Update sender's and recipient's balances
        sender.balance -= amount;
        recipient.balance += amount;

        await sender.save();
        await recipient.save();
        await transaction.save();

        res.status(201).json({ message: 'Transfer successful', transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get User's Transactions
exports.getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ transactionDate: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Transactions (Admin)
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('user recipient', 'name email').sort({ transactionDate: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Start a Recurring Deposit (User)
exports.startRecurringDeposit = async (req, res) => {
    const { initialAmount, term, interestRate } = req.body;

    try {
        const user = await User.findById(req.user._id);

        // Check if user has enough balance for the initial deposit
        if (user.balance < initialAmount) {
            return res.status(400).json({ message: 'Insufficient balance for initial deposit' });
        }

        // Create a new Recurring Deposit
        const recurringDeposit = new RecurringDeposit({
            user: user._id,
            amount: initialAmount,
            interestRate: interestRate || 6, // Default interest rate is 6% if not provided
            term,
            deposits: [
                {
                    date: new Date(),
                    amount: initialAmount
                }
            ]
        });

        // Deduct the initial deposit from the user's balance
        user.balance -= initialAmount;

        await recurringDeposit.save();
        await user.save();

        res.status(201).json({ message: 'Recurring Deposit started successfully', recurringDeposit });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Recurring Deposit Deposit
exports.depositToRecurring = async (req, res) => {
    const { amount } = req.body;

    try {
        const user = await User.findById(req.user._id);
        const recurringDeposit = await RecurringDeposit.findOne({ user: user._id });

        if (!recurringDeposit) {
            return res.status(404).json({ message: 'Recurring Deposit not found' });
        }

        recurringDeposit.deposits.push({ date: new Date(), amount });
        user.balance -= amount;

        await recurringDeposit.save();
        await user.save();

        res.status(200).json({ message: 'Deposit added successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Fixed Deposit Creation
exports.createFixedDeposit = async (req, res) => {
    const { principalAmount, term } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user.balance < principalAmount) {
            return res.status(400).json({ message: 'Insufficient balance for FD' });
        }

        const maturityAmount = principalAmount * Math.pow(1 + (5 / 100), term); // Example interest rate: 5%
        const maturityDate = new Date();
        maturityDate.setMonth(maturityDate.getMonth() + term);

        const fixedDeposit = new FixedDeposit({
            user: user._id,
            principalAmount,
            interestRate: 5,
            term,
            maturityAmount,
            maturityDate
        });

        user.balance -= principalAmount;

        await fixedDeposit.save();
        await user.save();

        res.status(201).json({message:"Fixed Deposit is started"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Withdraw Fixed Deposit on Maturity
exports.withdrawFixedDeposit = async (req, res) => {
    try {
        const fd = await FixedDeposit.findById(req.params.id);

        if (!fd) {
            return res.status(404).json({ message: 'Fixed Deposit not found' });
        }

        if (new Date() < fd.maturityDate) {
            return res.status(400).json({ message: 'Cannot withdraw before maturity date' });
        }

        const user = await User.findById(fd.user);
        user.balance += fd.maturityAmount;

        await fd.remove();
        await user.save();

        res.status(200).json({ message: 'Fixed Deposit withdrawn successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Cannot withdraw before maturity date' });
    }
};
// Loan Repayment
exports.repayLoan = async (req, res) => {
    const { loanId, amount } = req.body;

    try {
        const loan = await Loan.findById(loanId);
        const user = await User.findById(req.user._id);

        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Initialize repayments array if it doesn't exist
        if (!loan.repayments) {
            loan.repayments = [];
        }

        // Add repayment record
        loan.repayments.push({ amount });
        user.balance -= amount;

        await loan.save();
        await user.save();

        res.status(200).json({ message: 'Loan repayment successful' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Get all loans for the logged-in user
exports.getUserLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ user: req.user._id });
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching loans' });
    }
};

// Get all recurring deposits for the logged-in user
exports.getUserRecurringDeposits = async (req, res) => {
    try {
        const recurringDeposits = await RecurringDeposit.find({ user: req.user._id });
        res.status(200).json(recurringDeposits);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recurring deposits' });
    }
};

// Get all fixed deposits for the logged-in user
exports.getUserFixedDeposits = async (req, res) => {
    try {
        const fixedDeposits = await FixedDeposit.find({ user: req.user._id });
        res.status(200).json(fixedDeposits);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching fixed deposits' });
    }
};

// Get all loans for all users (admin only)
exports.getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find().populate('user', 'name email');
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching loans' });
    }
};

// Get all recurring deposits for all users (admin only)
exports.getAllRecurringDeposits = async (req, res) => {
    try {
        const recurringDeposits = await RecurringDeposit.find().populate('user', 'name email');
        res.status(200).json(recurringDeposits);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recurring deposits' });
    }
};

// Get all fixed deposits for all users (admin only)
exports.getAllFixedDeposits = async (req, res) => {
    try {
        const fixedDeposits = await FixedDeposit.find().populate('user', 'name email');
        res.status(200).json(fixedDeposits);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching fixed deposits' });
    }
};
