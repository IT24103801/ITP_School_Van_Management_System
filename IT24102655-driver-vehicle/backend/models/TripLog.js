const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TripLog = sequelize.define(
  'TripLog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vanId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'van_id',
    },
    driverKey: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'driver_key',
    },
    routeKey: {
      type: DataTypes.STRING(50),
      field: 'route_key',
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'started_at',
    },
    endedAt: {
      type: DataTypes.DATE,
      field: 'ended_at',
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'cancelled'),
      defaultValue: 'active',
    },
    fuelLiters: {
      type: DataTypes.DECIMAL(8, 2),
      field: 'fuel_liters',
    },
    distanceKm: {
      type: DataTypes.DECIMAL(10, 3),
      field: 'distance_km',
    },
  },
  {
    tableName: 'trip_logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = TripLog;
