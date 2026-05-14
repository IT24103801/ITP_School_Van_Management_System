require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('./models/Parent');
require('./models/Student');
require('./models/StudentGuardian');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/guardians', require('./routes/guardianRoutes'));
app.use('/api/parents', require('./routes/parentRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));

// MySQL connection and sync
sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected successfully');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database tables synchronized');
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
  });

const PORT = process.env.PORT || 3004;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Parent & Student Backend running on port ${PORT}`);
});
