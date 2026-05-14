const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SafetyCheck = sequelize.define('SafetyCheck', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  checkId: {
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
  brakes: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tires: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lights: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fuel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  firstAidKit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fireExtinguisher: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  overallStatus: {
    type: DataTypes.ENUM('Pass', 'Fail', 'Needs Attention'),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'safety_checks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = SafetyCheck;
