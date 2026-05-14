const mongoose = require('mongoose');

const safetyCheckSchema = new mongoose.Schema({
  checkId: { type: String, required: true, unique: true },
  vanId: { type: String, required: true },
  driverId: { type: String, required: true },
  checkItems: {
    brakes: { type: Boolean, default: false },
    tires: { type: Boolean, default: false },
    lights: { type: Boolean, default: false },
    fuel: { type: Boolean, default: false },
    firstAidKit: { type: Boolean, default: false },
    fireExtinguisher: { type: Boolean, default: false }
  },
  overallStatus: {
    type: String,
    enum: ['Pass', 'Fail', 'Needs Attention'],
    required: true
  },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SafetyCheck', safetyCheckSchema);
