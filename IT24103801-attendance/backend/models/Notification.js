const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recipientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Attendance', 'Delay', 'Emergency', 'General'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('High', 'Medium', 'Low'),
    defaultValue: 'Medium'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sentAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  deliveryStatus: {
    type: DataTypes.ENUM('queued', 'sending', 'delivered', 'failed', 'cancelled'),
    defaultValue: 'queued'
  },
  parentDeliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveryAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastDeliveryError: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  scheduledFor: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON
  }
}, {
  tableName: 'notifications',
  timestamps: false
});

module.exports = Notification;
