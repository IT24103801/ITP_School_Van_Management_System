const express = require('express');
const router = express.Router();
const DriverBehaviorLog = require('../models/DriverBehaviorLog');

router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.recordedAt) payload.recordedAt = new Date();
    const row = await DriverBehaviorLog.create(payload);
    res.status(201).json({ success: true, data: row });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { driverKey, reviewStatus } = req.query;
    const where = {};
    if (driverKey) where.driverKey = driverKey;
    if (reviewStatus) where.reviewStatus = reviewStatus;
    const rows = await DriverBehaviorLog.findAll({
      where,
      order: [['recordedAt', 'DESC']],
    });
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const row = await DriverBehaviorLog.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: row });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const row = await DriverBehaviorLog.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Not found' });
    await row.update(req.body);
    res.json({ success: true, data: row });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const row = await DriverBehaviorLog.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Not found' });
    await row.destroy();
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
