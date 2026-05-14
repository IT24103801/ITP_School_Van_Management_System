const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  driverId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  licenseNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  licenseExpiry: {
    type: DataTypes.DATE
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255)
  },
  assignedVanId: {
    type: DataTypes.STRING(50)
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Suspended'),
    defaultValue: 'Active'
  },
  performanceScore: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  violationCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'drivers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Driver;
