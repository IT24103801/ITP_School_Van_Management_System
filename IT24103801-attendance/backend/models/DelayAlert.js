const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DelayAlert = sequelize.define('DelayAlert', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  routeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  estimatedDelayMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'dismissed'),
    defaultValue: 'active'
  },
  source: {
    type: DataTypes.ENUM('gps', 'manual'),
    defaultValue: 'gps'
  },
  dismissedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'delay_alerts',
  timestamps: false
});

module.exports = DelayAlert;
