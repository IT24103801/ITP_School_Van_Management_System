const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  incidentId: { type: String, required: true, unique: true },
  vanId: { type: String, required: true },
  driverId: { type: String, required: true },
  type: {
    type: String,
    enum: ['Breakdown', 'Accident', 'Safety Concern', 'Other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  description: { type: String, required: true },
  location: {
    latitude: Number,
    longitude: Number
  },
  status: {
    type: String,
    enum: ['Reported', 'Under Investigation', 'Resolved'],
    default: 'Reported'
  },
  resolutionDetails: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Incident', incidentSchema);
