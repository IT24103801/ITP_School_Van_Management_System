const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vanId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  registrationNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  model: {
    type: DataTypes.STRING(100)
  },
  capacity: {
    type: DataTypes.INTEGER
  },
  insuranceExpiry: {
    type: DataTypes.DATE
  },
  lastServiceDate: {
    type: DataTypes.DATE
  },
  nextServiceDate: {
    type: DataTypes.DATE
  },
  assignedDriverId: {
    type: DataTypes.STRING(50)
  },
  status: {
    type: DataTypes.ENUM('Active', 'Maintenance', 'Inactive'),
    defaultValue: 'Active'
  }
}, {
  tableName: 'vehicles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Vehicle;
