const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Billing = sequelize.define('Billing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  billId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  month: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  baseFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  attendancePercentage: {
    type: DataTypes.DECIMAL(5, 2)
  },
  calculatedFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Overdue', 'Cancelled'),
    defaultValue: 'Pending'
  },
  dueDate: {
    type: DataTypes.DATE
  },
  paidDate: {
    type: DataTypes.DATE
  },
  invoiceSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'billing',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Billing;
