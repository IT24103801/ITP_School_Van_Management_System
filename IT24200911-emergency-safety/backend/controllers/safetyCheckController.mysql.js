const SafetyCheck = require('../models/SafetyCheck.mysql');

// Create safety check
exports.createSafetyCheck = async (req, res) => {
  try {
    const checkId = `CHK-${Date.now()}`;
    const safetyCheck = await SafetyCheck.create({
      checkId,
      ...req.body
    });
    res.status(201).json({ success: true, data: safetyCheck });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all safety checks
exports.getAllSafetyChecks = async (req, res) => {
  try {
    const checks = await SafetyCheck.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: checks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get safety check by ID
exports.getSafetyCheckById = async (req, res) => {
  try {
    const check = await SafetyCheck.findByPk(req.params.id);
    if (!check) {
      return res.status(404).json({ success: false, error: 'Safety check not found' });
    }
    res.json({ success: true, data: check });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update safety check
exports.updateSafetyCheck = async (req, res) => {
  try {
    const check = await SafetyCheck.findByPk(req.params.id);
    if (!check) {
      return res.status(404).json({ success: false, error: 'Safety check not found' });
    }
    await check.update(req.body);
    res.json({ success: true, data: check });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete safety check
exports.deleteSafetyCheck = async (req, res) => {
  try {
    const check = await SafetyCheck.findByPk(req.params.id);
    if (!check) {
      return res.status(404).json({ success: false, error: 'Safety check not found' });
    }
    await check.destroy();
    res.json({ success: true, message: 'Safety check deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
