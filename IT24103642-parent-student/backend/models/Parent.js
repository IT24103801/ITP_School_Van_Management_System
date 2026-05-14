const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Parent = sequelize.define('Parent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT
  },
  notificationEmail: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notificationSMS: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notificationPush: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'parents',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Parent;
