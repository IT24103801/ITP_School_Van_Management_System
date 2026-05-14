const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RouteDeviationAlert = sequelize.define(
  'RouteDeviationAlert',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    routeDbId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'route_db_id',
    },
    routeKey: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'route_key',
      comment: 'routes.routeId from Route & Schedule module',
    },
    vanId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'van_id',
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'resolved', 'archived'),
      defaultValue: 'pending',
    },
    adminNotes: {
      type: DataTypes.TEXT,
      field: 'admin_notes',
    },
  },
  {
    tableName: 'route_deviation_alerts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = RouteDeviationAlert;
