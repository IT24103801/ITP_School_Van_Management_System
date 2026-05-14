const { mongoose } = require('../config/database');
const { nextSequence } = require('./Counter');

const scheduleSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    routeId: { type: Number, required: true },
    vanId: { type: String, required: true, trim: true },
    session: { type: String, enum: ['morning', 'afternoon'], required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    specialNotes: String,
  },
  {
    collection: 'schedules',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

scheduleSchema.pre('save', async function assignNumericId(next) {
  if (!this.id) this.id = await nextSequence('schedules');
  next();
});

module.exports = mongoose.model('Schedule', scheduleSchema);
