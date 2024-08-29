const express = require('express');
const { registerAdmin, loginAdmin, updateAdmin, getAllUsers, getUserById, updateUserByAdmin, toggleUserActiveStatus, updateUserDetails, getUsersWithZeroBalance} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/roleMiddleware');
const router = express.Router();

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes (requires authentication and admin role)
router.get('/users/zero-balance', protect, admin, getUsersWithZeroBalance);
router.put('/update', protect, admin, updateAdmin);
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id', protect, admin, updateUserByAdmin);
router.put('/users/:id/toggle-active', protect, admin, toggleUserActiveStatus);
router.put('/user/:userId', protect, admin, updateUserDetails);




module.exports = router;

