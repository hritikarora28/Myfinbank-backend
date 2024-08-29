const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const emailRoutes = require('./routes/emailRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cron = require('node-cron');
const { checkAndNotifyAdmins } = require('./services/emailService');
const Chat = require('./models/Chat'); // Import the Chat model

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST','PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

// Middleware
app.use(cors());
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

// Socket.IO logic
// Track connected users
const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Listen for the user identification
  socket.on('identify', (email) => {
    if (!email) {
      console.error('User identification failed: email is null or undefined.');
      return;
    }

    connectedUsers[email] = socket.id;
    console.log(`User identified: ${email} with socket ID: ${socket.id}`);
  });

  // Listen for sendMessage event
  socket.on('sendMessage', async (data) => {
    const { senderEmail, receiverEmail, message } = data;

    if (!senderEmail || !receiverEmail) {
      console.error(`Error: senderEmail or receiverEmail is missing. Received data: ${JSON.stringify(data)}`);
      return;
    }

    try {
      // Save message to the database
      const chat = await Chat.create({ senderEmail, receiverEmail, message });

      // Emit the message to the receiver if they are connected
      const receiverSocketId = connectedUsers[receiverEmail];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', chat);
      }

      // Emit the message to the sender's own socket for confirmation
      const senderSocketId = connectedUsers[senderEmail];
      if (senderSocketId) {
        io.to(senderSocketId).emit('receiveMessage', chat);
      }
    } catch (error) {
      console.error('Error saving chat message:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    // Remove user from connectedUsers
    for (const [email, id] of Object.entries(connectedUsers)) {
      if (id === socket.id) {
        delete connectedUsers[email];
        console.log(`User disconnected: ${email}`);
        break;
      }
    }
  });
});



// Scheduled tasks
cron.schedule('0 * * * *', () => {
  checkAndNotifyAdmins();
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));