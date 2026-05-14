const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true },
  vanId: { type: String, required: true },
  driverId: { type: String, required: true },
  routeId: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['Reported', 'In Progress', 'Resolved'],
    default: 'Reported'
  },
  description: String,
  responseNotes: String,
  createdAt: { type: Date, default: Date.now },
  resolvedAt: Date,
  notifiedParents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parent' }]
});

module.exports = mongoose.model('SOSAlert', sosAlertSchema);
