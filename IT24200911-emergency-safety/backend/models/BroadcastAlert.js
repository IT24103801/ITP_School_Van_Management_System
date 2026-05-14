const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BroadcastAlert = sequelize.define('BroadcastAlert', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  alertId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Emergency Stop', 'Route Change', 'Delay', 'General'),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('High', 'Medium', 'Low'),
    defaultValue: 'Medium'
  },
  targetAudience: {
    type: DataTypes.ENUM('All Parents', 'Specific Route', 'Specific Van'),
    defaultValue: 'All Parents'
  },
  routeId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  vanId: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'broadcast_alerts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = BroadcastAlert;
