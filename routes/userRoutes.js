const express = require('express');
const { registerUser, loginUser, getUserDetails,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/details', protect, getUserDetails);

// Protected routes (if needed)
router.put('/some-protected-route', protect, (req, res) => {
    // Example protected route
    res.json({ message: 'This is a protected route' });
});

module.exports = router;
