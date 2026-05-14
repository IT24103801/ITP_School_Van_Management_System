const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  routeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stopPointId: {
    type: DataTypes.STRING(50)
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  session: {
    type: DataTypes.ENUM('morning', 'afternoon'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Picked Up', 'Dropped Safely', 'Absent', 'Late'),
    allowNull: false
  },
  eventType: {
    type: DataTypes.ENUM('Boarding', 'Alighting'),
    allowNull: true,
    comment: 'Boarding = entered van, Alighting = exited van'
  },
  archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  archivedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  markedBy: {
    type: DataTypes.STRING(100)
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'attendance',
  timestamps: false
});

module.exports = Attendance;
