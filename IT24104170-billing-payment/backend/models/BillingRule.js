const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BillingRule = sequelize.define(
  'BillingRule',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    minAttendancePercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: 'When attendance % is strictly below this, feeMultiplier applies',
    },
    feeMultiplier: {
      type: DataTypes.DECIMAL(5, 4),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'billing_rules',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = BillingRule;
