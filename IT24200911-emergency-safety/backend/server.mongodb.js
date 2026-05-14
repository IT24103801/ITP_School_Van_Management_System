require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/sos', require('./routes/sosRoutes'));
app.use('/api/incidents', require('./routes/incidentRoutes'));
app.use('/api/broadcasts', require('./routes/broadcastRoutes'));
app.use('/api/safety-checks', require('./routes/safetyCheckRoutes'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_van_system')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Emergency & Safety Backend running on port ${PORT}`);
});
