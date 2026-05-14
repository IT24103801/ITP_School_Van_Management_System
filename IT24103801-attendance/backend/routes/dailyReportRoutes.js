const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const DailyReport = require('../models/DailyReport');
const Attendance = require('../models/Attendance');

// Generate summary for a day from attendance rows (admin-triggered create)
router.post('/generate', async (req, res) => {
  try {
    const reportDate = req.body.reportDate || new Date().toISOString().split('T')[0];
    const existing = await DailyReport.findOne({ where: { reportDate } });
    if (existing && !req.body.force) {
      return res.status(409).json({
        success: false,
        error: 'Report already exists for this date',
        data: existing
      });
    }

    const start = reportDate;
    const end = reportDate;
    const logs = await Attendance.findAll({
      where: {
        archived: false,
        date: { [Op.between]: [start, end] }
      }
    });

    const summaryJson = {
      totalLogs: logs.length,
      byStatus: {},
      byEventType: {}
    };
    for (const row of logs) {
      const s = row.status || 'unknown';
      summaryJson.byStatus[s] = (summaryJson.byStatus[s] || 0) + 1;
      const e = row.eventType || 'unspecified';
      summaryJson.byEventType[e] = (summaryJson.byEventType[e] || 0) + 1;
    }

    const summaryText = `Daily attendance summary for ${reportDate}: ${logs.length} log(s).`;
    const payload = {
      reportDate,
      title: req.body.title || `Attendance summary — ${reportDate}`,
      summaryText,
      summaryJson,
      status: req.body.status || 'draft',
      adminNotes: req.body.adminNotes || null
    };

    let report;
    if (existing && req.body.force) {
      await existing.update(payload);
      report = existing;
    } else {
      report = await DailyReport.create(payload);
    }

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error('Error generating daily report:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const where = {};
    if (status) where.status = status;
    if (startDate || endDate) {
      where.reportDate = {};
      if (startDate) where.reportDate[Op.gte] = startDate;
      if (endDate) where.reportDate[Op.lte] = endDate;
    }
    const rows = await DailyReport.findAll({
      where,
      order: [['reportDate', 'DESC'], ['id', 'DESC']]
    });
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error listing daily reports:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const row = await DailyReport.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    res.json({ success: true, data: row });
  } catch (error) {
    console.error('Error fetching daily report:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const row = await DailyReport.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    const allow = ['title', 'summaryText', 'summaryJson', 'adminNotes', 'status'];
    const payload = {};
    for (const k of allow) {
      if (req.body[k] !== undefined) payload[k] = req.body[k];
    }
    if (req.body.admin_notes !== undefined && payload.adminNotes === undefined) {
      payload.adminNotes = req.body.admin_notes;
    }
    await row.update(payload);
    res.json({ success: true, data: row });
  } catch (error) {
    console.error('Error updating daily report:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const row = await DailyReport.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Report not found' });
    }
    if (row.status === 'published' && !req.query.force) {
      return res.status(400).json({
        success: false,
        error: 'Published reports require ?force=1 to delete'
      });
    }
    await row.destroy();
    res.json({ success: true, message: 'Report deleted' });
  } catch (error) {
    console.error('Error deleting daily report:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
