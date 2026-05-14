const { mongoose } = require('../config/database');
const { nextSequence } = require('./Counter');

const routeSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    routeId: { type: String, required: true, unique: true, trim: true },
    routeName: { type: String, required: true, trim: true },
    vanId: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    currentGPS_latitude: Number,
    currentGPS_longitude: Number,
    currentGPS_timestamp: Date,
    plannedPathJson: String,
    distanceKm: Number,
  },
  {
    collection: 'routes',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false,
  }
);

routeSchema.pre('save', async function assignNumericId(next) {
  if (!this.id) this.id = await nextSequence('routes');
  next();
});

module.exports = mongoose.model('Route', routeSchema);
