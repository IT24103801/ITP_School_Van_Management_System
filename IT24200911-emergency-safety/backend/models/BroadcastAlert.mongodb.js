const mongoose = require('mongoose');

const broadcastAlertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['Emergency Stop', 'Route Change', 'Delay', 'General'],
    required: true
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  targetAudience: {
    type: String,
    enum: ['All Parents', 'Specific Route', 'Specific Van'],
    default: 'All Parents'
  },
  routeId: String,
  vanId: String,
  sentAt: Date,
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BroadcastAlert', broadcastAlertSchema);
