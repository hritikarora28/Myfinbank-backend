const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const emailRoutes = require('./routes/emailRoutes');
const chatRoutes = require('./routes/chatRoutes');

require('dotenv').config();
const corsOptions = {
    origin: 'http://localhost:3000', // Corrected the origin URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Fixed the 'methods' key name (plural)
    allowedHeaders: ['Content-Type', 'Authorization'] //
  };
   

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Use Routes
app.use('/api/admins', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/chats', chatRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
