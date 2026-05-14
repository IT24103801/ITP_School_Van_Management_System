const { mongoose } = require('../config/database');
const { nextSequence } = require('./Counter');

const stopPointSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    routeDbId: { type: Number, required: true, index: true },
    sequenceOrder: { type: Number, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    stopType: { type: String, enum: ['pickup', 'dropoff', 'both'], default: 'both' },
    label: String,
    assignedStudentIdsJson: String,
  },
  {
    collection: 'stop_points',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

stopPointSchema.pre('save', async function assignNumericId(next) {
  if (!this.id) this.id = await nextSequence('stop_points');
  next();
});

module.exports = mongoose.model('StopPoint', stopPointSchema);
