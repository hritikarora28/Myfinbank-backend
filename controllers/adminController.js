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
        const users = await User.find({ role: 'user' });
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
// Update User Details by Admin
exports.updateUserDetails = async (req, res) => {
    const { userId } = req.params; // Assuming the user ID is passed as a route parameter
    const { name, email, age } = req.body; // The fields that can be updated

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.age = age || user.age;

        await user.save();

        res.status(200).json({ message: 'User details updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch users with zero balance
exports.getUsersWithZeroBalance = async (req, res) => {
    try {
        // Query for users with zero balance and role 'user', selecting only specific fields
        const usersWithZeroBalance = await User.find({ balance: 0, role: 'user' }).select('name email _id');
        res.status(200).json(usersWithZeroBalance);
    } catch (error) {
        console.error('Error fetching users with zero balance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
