const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

router.get('/summary', async (req, res) => {
  try {
    const [totalDrivers, activeDrivers, totalVehicles, activeVehicles] = await Promise.all([
      Driver.count(),
      Driver.count({ where: { status: 'Active' } }),
      Vehicle.count(),
      Vehicle.count({ where: { status: 'Active' } }),
    ]);
    res.json({
      success: true,
      data: { totalDrivers, activeDrivers, totalVehicles, activeVehicles },
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
