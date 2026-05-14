const { mongoose } = require('../config/database');
const { nextSequence } = require('./Counter');

const gpsBreadcrumbSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    routeDbId: { type: Number, required: true, index: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    recordedAt: { type: Date, required: true },
  },
  {
    collection: 'gps_breadcrumbs',
    versionKey: false,
  }
);

gpsBreadcrumbSchema.pre('save', async function assignNumericId(next) {
  if (!this.id) this.id = await nextSequence('gps_breadcrumbs');
  next();
});

module.exports = mongoose.model('GpsBreadcrumb', gpsBreadcrumbSchema);
