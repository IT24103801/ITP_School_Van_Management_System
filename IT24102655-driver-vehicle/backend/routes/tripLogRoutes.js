const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const TripLog = require('../models/TripLog');

router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.startedAt) payload.startedAt = new Date();
    const row = await TripLog.create(payload);
    res.status(201).json({ success: true, data: row });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { vanId, driverKey, status, date } = req.query;
    const where = {};
    if (vanId) where.vanId = vanId;
    if (driverKey) where.driverKey = driverKey;
    if (status) where.status = status;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      where.startedAt = { [Op.between]: [start, end] };
    }
    const rows = await TripLog.findAll({
      where,
      order: [['startedAt', 'DESC']],
    });
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const row = await TripLog.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: row });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const row = await TripLog.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Not found' });
    await row.update(req.body);
    res.json({ success: true, data: row });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const row = await TripLog.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Not found' });
    await row.destroy();
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
