const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
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
  grade: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.DATE
  },
  assignedVanId: {
    type: DataTypes.STRING(50)
  },
  assignedRouteId: {
    type: DataTypes.INTEGER
  },
  stopPointId: {
    type: DataTypes.STRING(50)
  },
  pickupAddress: {
    type: DataTypes.TEXT
  },
  pickupLatitude: {
    type: DataTypes.DECIMAL(10, 8)
  },
  pickupLongitude: {
    type: DataTypes.DECIMAL(11, 8)
  },
  dropAddress: {
    type: DataTypes.TEXT
  },
  dropLatitude: {
    type: DataTypes.DECIMAL(10, 8)
  },
  dropLongitude: {
    type: DataTypes.DECIMAL(11, 8)
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'students',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Student;
