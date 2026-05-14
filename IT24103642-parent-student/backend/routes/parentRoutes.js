const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Parent = require('../models/Parent');

function sanitizeParent(row) {
  if (!row) return null;
  const j = row.toJSON ? row.toJSON() : { ...row };
  delete j.password;
  return j;
}

router.get('/', async (req, res) => {
  try {
    const parents = await Parent.findAll();
    res.json({ success: true, data: parents.map((p) => sanitizeParent(p)) });
  } catch (error) {
    console.error('Error fetching parents:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const parent = await Parent.findByPk(req.params.id);
    if (!parent) {
      return res.status(404).json({ success: false, error: 'Parent not found' });
    }
    res.json({ success: true, data: sanitizeParent(parent) });
  } catch (error) {
    console.error('Error fetching parent:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }
    const parent = await Parent.create(payload);
    res.status(201).json({ success: true, data: sanitizeParent(parent) });
  } catch (error) {
    console.error('Error creating parent:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const parent = await Parent.findByPk(req.params.id);
    if (!parent) {
      return res.status(404).json({ success: false, error: 'Parent not found' });
    }
    const payload = { ...req.body };
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }
    await parent.update(payload);
    await parent.reload();
    res.json({ success: true, data: sanitizeParent(parent) });
  } catch (error) {
    console.error('Error updating parent:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const parent = await Parent.findByPk(req.params.id);
    if (!parent) {
      return res.status(404).json({ success: false, error: 'Parent not found' });
    }

    await parent.destroy();
    res.json({ success: true, message: 'Parent deleted successfully' });
  } catch (error) {
    console.error('Error deleting parent:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
