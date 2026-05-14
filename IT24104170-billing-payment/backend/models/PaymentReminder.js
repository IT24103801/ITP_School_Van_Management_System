const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentReminder = sequelize.define(
  'PaymentReminder',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    billingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    scheduledFor: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('queued', 'sent', 'cancelled'),
      defaultValue: 'queued',
    },
  },
  {
    tableName: 'payment_reminders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = PaymentReminder;
