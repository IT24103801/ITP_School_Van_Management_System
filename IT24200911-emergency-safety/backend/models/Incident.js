const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Incident = sequelize.define('Incident', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  incidentId: {
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
  type: {
    type: DataTypes.ENUM('Breakdown', 'Accident', 'Safety Concern', 'Other'),
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
    defaultValue: 'Medium'
  },
  description: {
    type: DataTypes.TEXT,
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
    type: DataTypes.ENUM('Reported', 'Under Investigation', 'Resolved'),
    defaultValue: 'Reported'
  },
  resolutionDetails: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'incidents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Incident;
