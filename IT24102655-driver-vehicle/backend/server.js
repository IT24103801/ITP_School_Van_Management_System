require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('./models/Driver');
require('./models/Vehicle');
require('./models/DriverBehaviorLog');
require('./models/RouteDeviationAlert');
require('./models/TripLog');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/drivers', require('./routes/driverRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/driver-behavior', require('./routes/driverBehaviorRoutes'));
app.use('/api/route-deviations', require('./routes/routeDeviationRoutes'));
app.use('/api/trips', require('./routes/tripLogRoutes'));

// MySQL connection and sync
sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected successfully');
    // Avoid repeated ALTER operations that can keep adding duplicate keys.
    // Enable only when explicitly needed for one-off schema migrations.
    const enableAlterSync = process.env.DB_ALTER_SYNC === 'true';
    return sequelize.sync(enableAlterSync ? { alter: true } : undefined);
  })
  .then(() => {
    console.log('Database tables synchronized');
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
  });

const PORT = process.env.PORT || 3006;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Driver & Vehicle Backend running on port ${PORT}`);
});
