require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const sequelize = require('./config/database');
require('./models/Attendance');
require('./models/Notification');
require('./models/DailyReport');
require('./models/DelayAlert');

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
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/daily-reports', require('./routes/dailyReportRoutes'));
app.use('/api/delay-alerts', require('./routes/delayAlertRoutes'));

// MySQL connection and sync
sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected successfully');
    // Sync all models with database
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database tables synchronized');
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
  });

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Attendance & Notifications Backend running on port ${PORT}`);
});
