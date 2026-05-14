const express = require('express');
const router = express.Router();
const RouteDeviationAlert = require('../models/RouteDeviationAlert');

router.post('/', async (req, res) => {
  try {
    const row = await RouteDeviationAlert.create(req.body);
    res.status(201).json({ success: true, data: row });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { vanId, status } = req.query;
    const where = {};
    if (vanId) where.vanId = vanId;
    if (status) where.status = status;
    const rows = await RouteDeviationAlert.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const row = await RouteDeviationAlert.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: row });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const row = await RouteDeviationAlert.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Not found' });
    await row.update(req.body);
    res.json({ success: true, data: row });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const row = await RouteDeviationAlert.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Not found' });
    await row.destroy();
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
