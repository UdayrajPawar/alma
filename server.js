const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const { authenticate } = require('./middleware/auth');
const { User } = require('./models');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const eventRoutes = require('./routes/events');
const jobRoutes = require('./routes/jobs');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const instituteRoutes = require('./routes/institutes');
const adminRoutes = require('./routes/admin');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');
    
    if (!user || user.deleted) {
      return next(new Error('Invalid token'));
    }

    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);
  connectedUsers.set(socket.userId, socket.id);

  socket.on('join-conversation', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
  });

  socket.on('leave-conversation', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
  });

  socket.on('send-message', async (data) => {
    try {
      const { Conversation, Message, Notification } = require('./models');
      const { conversationId, content, attachments } = data;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation || !conversation.participants.includes(socket.userId)) {
        return socket.emit('error', { message: 'Unauthorized' });
      }

      const message = await Message.create({
        conversationId,
        sender: socket.userId,
        content,
        attachments,
        readBy: [socket.userId]
      });

      conversation.lastMessageAt = new Date();
      conversation.lastMessage = content || 'Attachment';
      await conversation.save();

      await message.populate('sender', 'firstName lastName avatarUrl');

      const otherParticipants = conversation.participants.filter(
        p => p.toString() !== socket.userId
      );

      for (const participantId of otherParticipants) {
        await Notification.create({
          userId: participantId,
          type: 'message',
          payload: { conversationId, fromUserId: socket.userId, fromUserName: socket.user.fullName }
        });

        const participantSocketId = connectedUsers.get(participantId.toString());
        if (participantSocketId) {
          io.to(participantSocketId).emit('new-message', message);
          io.to(participantSocketId).emit('new-notification', {
            type: 'message',
            payload: { conversationId, fromUserId: socket.userId }
          });
        }
      }

      io.to(`conversation:${conversationId}`).emit('message-sent', message);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('typing', (data) => {
    socket.to(`conversation:${data.conversationId}`).emit('user-typing', {
      userId: socket.userId,
      userName: socket.user.fullName
    });
  });

  socket.on('stop-typing', (data) => {
    socket.to(`conversation:${data.conversationId}`).emit('user-stop-typing', {
      userId: socket.userId
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
    connectedUsers.delete(socket.userId);
  });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };

