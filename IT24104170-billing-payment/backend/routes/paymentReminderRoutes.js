const express = require('express');
const router = express.Router();
const PaymentReminder = require('../models/PaymentReminder');

router.post('/', async (req, res) => {
  try {
    const row = await PaymentReminder.create(req.body);
    res.status(201).json({ success: true, data: row });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { parentId, status } = req.query;
    const where = {};
    if (parentId) where.parentId = Number(parentId);
    if (status) where.status = status;
    const rows = await PaymentReminder.findAll({
      where,
      order: [['scheduledFor', 'DESC'], ['id', 'DESC']],
    });
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const row = await PaymentReminder.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Reminder not found' });
    res.json({ success: true, data: row });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const row = await PaymentReminder.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Reminder not found' });
    await row.update(req.body);
    res.json({ success: true, data: row });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const row = await PaymentReminder.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Reminder not found' });
    await row.destroy();
    res.json({ success: true, message: 'Reminder deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
