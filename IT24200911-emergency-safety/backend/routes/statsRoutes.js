const express = require('express');
const { Op, fn, col, where } = require('sequelize');
const router = express.Router();
const SOSAlert = require('../models/SOSAlert.mysql');
const Incident = require('../models/Incident.mysql');
const SafetyCheck = require('../models/SafetyCheck.mysql');

function serverLocalYmd(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

router.get('/dashboard', async (req, res) => {
  try {
    const ymd = serverLocalYmd();
    const todayChecksWhere = where(fn('DATE', col('created_at')), ymd);

    const [activeSos, openIncidents, todayChecks] = await Promise.all([
      SOSAlert.count({ where: { status: { [Op.ne]: 'Resolved' } } }),
      Incident.count({ where: { status: { [Op.ne]: 'Resolved' } } }),
      SafetyCheck.count({ where: todayChecksWhere }),
    ]);

    res.json({
      success: true,
      data: {
        activeSos,
        openIncidents,
        todayChecks,
        dateLabel: ymd,
      },
    });
  } catch (e) {
    console.error('emergency stats dashboard', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
