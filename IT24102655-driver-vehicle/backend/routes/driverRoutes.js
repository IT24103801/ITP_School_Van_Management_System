const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// Get all drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.findAll();
    res.json({ success: true, data: drivers });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get driver by ID
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }
    res.json({ success: true, data: driver });
  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create driver
router.post('/', async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json({ success: true, data: driver });
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update driver
router.put('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }
    
    await driver.update(req.body);
    res.json({ success: true, data: driver });
  } catch (error) {
    console.error('Error updating driver:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete driver
router.delete('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }
    
    await driver.destroy();
    res.json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
