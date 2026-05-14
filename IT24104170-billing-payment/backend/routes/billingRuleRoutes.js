const express = require('express');
const router = express.Router();
const BillingRule = require('../models/BillingRule');

router.post('/', async (req, res) => {
  try {
    const row = await BillingRule.create(req.body);
    res.status(201).json({ success: true, data: row });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const rows = await BillingRule.findAll({ order: [['id', 'ASC']] });
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const row = await BillingRule.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Rule not found' });
    res.json({ success: true, data: row });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const row = await BillingRule.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Rule not found' });
    await row.update(req.body);
    res.json({ success: true, data: row });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const row = await BillingRule.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Rule not found' });
    await row.destroy();
    res.json({ success: true, message: 'Rule deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
