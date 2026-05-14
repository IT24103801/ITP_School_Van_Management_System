const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DailyReport = sequelize.define('DailyReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reportDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  summaryText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  summaryJson: {
    type: DataTypes.JSON,
    allowNull: true
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft'
  },
  generatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'daily_reports',
  timestamps: true
});

module.exports = DailyReport;
