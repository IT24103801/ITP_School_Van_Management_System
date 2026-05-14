const express = require('express');
const router = express.Router();
const StopPoint = require('../models/StopPoint');
const Route = require('../models/Route');

router.post('/', async (req, res) => {
  try {
    const row = await StopPoint.create(req.body);
    res.status(201).json({ success: true, data: row });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { routeDbId, vanId, studentId } = req.query;
    let rows;

    if (vanId && !routeDbId) {
      const routes = await Route.find({ vanId }, { _id: 0, id: 1 });
      const ids = routes.map((r) => r.id);
      rows = await StopPoint.find({ routeDbId: { $in: ids.length ? ids : [-1] } }).sort({ routeDbId: 1, sequenceOrder: 1 });
    } else {
      const where = {};
      if (routeDbId) where.routeDbId = Number(routeDbId);
      rows = await StopPoint.find(where).sort({ routeDbId: 1, sequenceOrder: 1 });
    }

    if (studentId) {
      const studentIdText = String(studentId);
      rows = rows.filter((row) => {
        const raw = row.assignedStudentIdsJson;
        if (!raw) return false;
        try {
          const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
          return Array.isArray(arr) && arr.map(String).includes(studentIdText);
        } catch (_) {
          return false;
        }
      });
    }

    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const row = await StopPoint.findOne({ id: Number(req.params.id) });
    if (!row) return res.status(404).json({ success: false, error: 'Stop not found' });
    res.json({ success: true, data: row });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const row = await StopPoint.findOne({ id: Number(req.params.id) });
    if (!row) return res.status(404).json({ success: false, error: 'Stop not found' });
    Object.assign(row, req.body);
    await row.save();
    res.json({ success: true, data: row });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const row = await StopPoint.findOne({ id: Number(req.params.id) });
    if (!row) return res.status(404).json({ success: false, error: 'Stop not found' });
    await row.deleteOne();
    res.json({ success: true, message: 'Stop deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
