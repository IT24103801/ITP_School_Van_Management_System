const express = require('express');
const router = express.Router();
const DelayAlert = require('../models/DelayAlert');

router.post('/', async (req, res) => {
  try {
    const row = await DelayAlert.create(req.body);
    const io = req.app.get('io');
    io.emit('delay_alert', row);
    res.status(201).json({ success: true, data: row });
  } catch (error) {
    console.error('Error creating delay alert:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status, routeId } = req.query;
    const where = {};
    if (status) where.status = status;
    if (routeId) where.routeId = Number(routeId);
    const rows = await DelayAlert.findAll({
      where,
      order: [['id', 'DESC']]
    });
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error listing delay alerts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const row = await DelayAlert.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Delay alert not found' });
    }
    res.json({ success: true, data: row });
  } catch (error) {
    console.error('Error fetching delay alert:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const row = await DelayAlert.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Delay alert not found' });
    }
    await row.update(req.body);
    const io = req.app.get('io');
    io.emit('delay_alert_updated', row);
    res.json({ success: true, data: row });
  } catch (error) {
    console.error('Error updating delay alert:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/:id/dismiss', async (req, res) => {
  try {
    const row = await DelayAlert.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Delay alert not found' });
    }
    await row.update({ status: 'dismissed', dismissedAt: new Date() });
    const io = req.app.get('io');
    io.emit('delay_alert_dismissed', row);
    res.json({ success: true, data: row });
  } catch (error) {
    console.error('Error dismissing delay alert:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const row = await DelayAlert.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Delay alert not found' });
    }
    await row.destroy();
    res.json({ success: true, message: 'Delay alert removed' });
  } catch (error) {
    console.error('Error deleting delay alert:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
