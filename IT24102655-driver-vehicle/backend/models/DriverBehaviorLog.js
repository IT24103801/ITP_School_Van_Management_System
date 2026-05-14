const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DriverBehaviorLog = sequelize.define(
  'DriverBehaviorLog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    driverKey: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'driver_key',
      comment: 'drivers.driverId business key',
    },
    vanId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'van_id',
    },
    recordedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'recorded_at',
    },
    speedKmh: {
      type: DataTypes.DECIMAL(6, 2),
      field: 'speed_kmh',
    },
    harshBraking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'harsh_braking',
    },
    violationType: {
      type: DataTypes.STRING(100),
      field: 'violation_type',
    },
    reviewStatus: {
      type: DataTypes.ENUM('pending', 'reviewed', 'archived'),
      defaultValue: 'pending',
      field: 'review_status',
    },
    adminNotes: {
      type: DataTypes.TEXT,
      field: 'admin_notes',
    },
  },
  {
    tableName: 'driver_behavior_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = DriverBehaviorLog;
