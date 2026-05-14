const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SOSAlert = sequelize.define('SOSAlert', {
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
  vanId: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  driverId: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  routeId: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Reported', 'In Progress', 'Resolved'),
    defaultValue: 'Reported'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responseNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'sos_alerts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = SOSAlert;
