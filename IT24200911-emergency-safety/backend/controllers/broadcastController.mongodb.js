const BroadcastAlert = require('../models/BroadcastAlert');

// Create broadcast alert
exports.createBroadcast = async (req, res) => {
  try {
    const alertId = `BCAST-${Date.now()}`;
    const broadcast = new BroadcastAlert({
      ...req.body,
      alertId,
      sentAt: new Date()
    });
    await broadcast.save();
    
    // Broadcast via Socket.io
    req.app.get('io').emit('broadcast-alert', broadcast);
    
    res.status(201).json({ success: true, data: broadcast });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all broadcasts
exports.getAllBroadcasts = async (req, res) => {
  try {
    const broadcasts = await BroadcastAlert.find().sort({ createdAt: -1 });
    res.json({ success: true, data: broadcasts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get broadcast by ID
exports.getBroadcastById = async (req, res) => {
  try {
    const broadcast = await BroadcastAlert.findById(req.params.id);
    if (!broadcast) {
      return res.status(404).json({ success: false, error: 'Broadcast not found' });
    }
    res.json({ success: true, data: broadcast });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update broadcast
exports.updateBroadcast = async (req, res) => {
  try {
    const broadcast = await BroadcastAlert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!broadcast) {
      return res.status(404).json({ success: false, error: 'Broadcast not found' });
    }
    res.json({ success: true, data: broadcast });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete broadcast
exports.deleteBroadcast = async (req, res) => {
  try {
    const broadcast = await BroadcastAlert.findByIdAndDelete(req.params.id);
    if (!broadcast) {
      return res.status(404).json({ success: false, error: 'Broadcast not found' });
    }
    res.json({ success: true, message: 'Broadcast deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
