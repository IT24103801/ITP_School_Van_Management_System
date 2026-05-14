const SOSAlert = require('../models/SOSAlert');
const axios = require('axios');

// Create SOS Alert
exports.createSOSAlert = async (req, res) => {
  try {
    const alertId = `SOS-${Date.now()}`;
    
    // Get current GPS from Route module
    let location = req.body.location;
    if (!location && req.body.routeId) {
      try {
        const routeResponse = await axios.get(`http://localhost:3001/api/routes/${req.body.routeId}`);
        location = routeResponse.data.data.currentGPS;
      } catch (error) {
        console.error('Error fetching GPS:', error.message);
      }
    }

    const sosAlert = new SOSAlert({
      ...req.body,
      alertId,
      location
    });
    
    await sosAlert.save();
    
    // Broadcast via Socket.io
    req.app.get('io').emit('sos-alert', sosAlert);
    
    // Notify parents (integration point)
    // This would call the notification service
    
    res.status(201).json({ success: true, data: sosAlert });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all SOS alerts
exports.getAllSOSAlerts = async (req, res) => {
  try {
    const alerts = await SOSAlert.find().sort({ createdAt: -1 });
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get SOS alert by ID
exports.getSOSAlertById = async (req, res) => {
  try {
    const alert = await SOSAlert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, error: 'SOS Alert not found' });
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update SOS alert status
exports.updateSOSAlert = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.body.status === 'Resolved') {
      updateData.resolvedAt = new Date();
    }
    
    const alert = await SOSAlert.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!alert) {
      return res.status(404).json({ success: false, error: 'SOS Alert not found' });
    }
    
    // Broadcast update
    req.app.get('io').emit('sos-update', alert);
    
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete SOS alert
exports.deleteSOSAlert = async (req, res) => {
  try {
    const alert = await SOSAlert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, error: 'SOS Alert not found' });
    }
    res.json({ success: true, message: 'SOS Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
