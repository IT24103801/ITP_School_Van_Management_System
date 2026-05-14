const Route = require('../models/Route');
const GpsBreadcrumb = require('../models/GpsBreadcrumb');

async function findRouteByIdentifier(identifier) {
  const text = String(identifier ?? '').trim();
  if (!text) return null;

  const asNumber = Number(text);
  if (!Number.isNaN(asNumber)) {
    const byDbId = await Route.findOne({ id: asNumber });
    if (byDbId) return byDbId;
  }

  return Route.findOne({ routeId: text });
}

function normalizePathJson(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'string') {
    JSON.parse(value);
    return value;
  }
  return JSON.stringify(value);
}

// Create new route
exports.createRoute = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (Object.prototype.hasOwnProperty.call(payload, 'plannedPathJson')) {
      payload.plannedPathJson = normalizePathJson(payload.plannedPathJson);
    }
    const route = await Route.create(payload);
    res.status(201).json({ success: true, data: route });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all routes
exports.getAllRoutes = async (req, res) => {
  try {
    const where = {};
    if (req.query.vanId) where.vanId = req.query.vanId;
    if (req.query.isActive != null) where.isActive = req.query.isActive === 'true';
    const routes = await Route.find(where);
    res.json({ success: true, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get route by ID
exports.getRouteById = async (req, res) => {
  try {
    const route = await findRouteByIdentifier(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }
    res.json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update route
exports.updateRoute = async (req, res) => {
  try {
    const route = await findRouteByIdentifier(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }
    const payload = { ...req.body };
    if (Object.prototype.hasOwnProperty.call(payload, 'plannedPathJson')) {
      payload.plannedPathJson = normalizePathJson(payload.plannedPathJson);
    }
    Object.assign(route, payload);
    await route.save();
    res.json({ success: true, data: route });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete route
exports.deleteRoute = async (req, res) => {
  try {
    const route = await findRouteByIdentifier(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }
    await route.deleteOne();
    res.json({ success: true, message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update live GPS
exports.updateLiveGPS = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const latNum = Number(latitude);
    const lngNum = Number(longitude);
    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      return res.status(400).json({ success: false, error: 'latitude and longitude must be valid numbers' });
    }
    const route = await findRouteByIdentifier(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }
    
    route.currentGPS_latitude = latNum;
    route.currentGPS_longitude = lngNum;
    route.currentGPS_timestamp = new Date();
    await route.save();

    await GpsBreadcrumb.create({
      routeDbId: route.id,
      latitude: latNum,
      longitude: lngNum,
      recordedAt: new Date()
    });
    
    // Broadcast GPS update via Socket.io
    if (req.app.get('io')) {
      req.app.get('io').emit('gps-update', {
        routeId: route.id,
        latitude: latNum,
        longitude: lngNum,
        timestamp: new Date()
      });
    }
    
    res.json({ success: true, data: { latitude: latNum, longitude: lngNum } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Clear GPS breadcrumb history after trip (live position kept on Route row)
exports.clearGpsTrail = async (req, res) => {
  try {
    const route = await findRouteByIdentifier(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }
    const result = await GpsBreadcrumb.deleteMany({ routeDbId: route.id });
    const deleted = result.deletedCount || 0;
    res.json({ success: true, data: { deletedCount: deleted } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getGpsTrail = async (req, res) => {
  try {
    const route = await findRouteByIdentifier(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }
    const points = await GpsBreadcrumb.find({ routeDbId: route.id }).sort({ recordedAt: 1 });
    res.json({ success: true, data: points });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get active routes with live GPS
exports.getActiveRoutesWithGPS = async (req, res) => {
  try {
    const routes = await Route.find(
      { isActive: true },
      { _id: 0, id: 1, routeId: 1, routeName: 1, vanId: 1, currentGPS_latitude: 1, currentGPS_longitude: 1, currentGPS_timestamp: 1 }
    );
    res.json({ success: true, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
