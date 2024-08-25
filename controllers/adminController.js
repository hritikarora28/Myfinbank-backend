const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Admin Registration
exports.registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const admin = new User({ name, email, password, role: 'admin' });
        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await User.findOne({ email, role: 'admin' });
        if (!admin || admin.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Admin Profile
exports.updateAdmin = async (req, res) => {
    const { name, email } = req.body;
    try {
        const updatedAdmin = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true });
        res.json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Users (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'customer' });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get User by ID (Admin)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update User (Admin)
exports.updateUserByAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Deactivate/Activate User (Admin)
exports.toggleUserActiveStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isActive = !user.isActive;

        await user.save();
        res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
