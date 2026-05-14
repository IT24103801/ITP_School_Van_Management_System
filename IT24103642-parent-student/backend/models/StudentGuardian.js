const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentGuardian = sequelize.define(
  'StudentGuardian',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentDbId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'student_db_id',
      references: { model: 'students', key: 'id' },
    },
    parentDbId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'parent_db_id',
      references: { model: 'parents', key: 'id' },
    },
    priorityOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'priority_order',
    },
  },
  {
    tableName: 'student_guardians',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [{ unique: true, fields: ['student_db_id', 'parent_db_id'] }],
  }
);

module.exports = StudentGuardian;
