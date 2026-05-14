const Incident = require('../models/Incident');

// Create incident
exports.createIncident = async (req, res) => {
  try {
    const incidentId = `INC-${Date.now()}`;
    const incident = new Incident({
      ...req.body,
      incidentId
    });
    await incident.save();
    res.status(201).json({ success: true, data: incident });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all incidents
exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json({ success: true, data: incidents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get incident by ID
exports.getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ success: false, error: 'Incident not found' });
    }
    res.json({ success: true, data: incident });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update incident
exports.updateIncident = async (req, res) => {
  try {
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!incident) {
      return res.status(404).json({ success: false, error: 'Incident not found' });
    }
    res.json({ success: true, data: incident });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete incident
exports.deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);
    if (!incident) {
      return res.status(404).json({ success: false, error: 'Incident not found' });
    }
    res.json({ success: true, message: 'Incident deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
