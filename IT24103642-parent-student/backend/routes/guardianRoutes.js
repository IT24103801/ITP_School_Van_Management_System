const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const StudentGuardian = require('../models/StudentGuardian');
const Parent = require('../models/Parent');

router.post('/link', async (req, res) => {
  try {
    const studentDbId = Number(req.body.studentDbId ?? req.body.student_db_id);
    const parentDbId = Number(req.body.parentDbId ?? req.body.parent_db_id);
    const priorityOrder = req.body.priorityOrder ?? req.body.priority_order ?? 1;
    if (!studentDbId || !parentDbId) {
      return res.status(400).json({ success: false, error: 'studentDbId and parentDbId required' });
    }
    const row = await StudentGuardian.create({ studentDbId, parentDbId, priorityOrder });
    res.status(201).json({ success: true, data: row });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/by-student/:studentDbId', async (req, res) => {
  try {
    const studentDbId = Number(req.params.studentDbId);
    const links = await StudentGuardian.findAll({
      where: { studentDbId },
      order: [['priorityOrder', 'ASC']],
    });
    const parentIds = links.map((l) => l.parentDbId);
    if (parentIds.length === 0) {
      return res.json({ success: true, data: [] });
    }
    const parents = await Parent.findAll({ where: { id: { [Op.in]: parentIds } } });
    const byId = Object.fromEntries(parents.map((p) => [p.id, p]));
    const data = links.map((l) => ({
      linkId: l.id,
      priorityOrder: l.priorityOrder,
      parent: byId[l.parentDbId],
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const row = await StudentGuardian.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Link not found' });
    const patch = {};
    if (req.body.priorityOrder != null) patch.priorityOrder = req.body.priorityOrder;
    if (req.body.priority_order != null) patch.priorityOrder = req.body.priority_order;
    await row.update(patch);
    res.json({ success: true, data: row });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const row = await StudentGuardian.findByPk(req.params.id);
    if (!row) return res.status(404).json({ success: false, error: 'Link not found' });
    await row.destroy();
    res.json({ success: true, message: 'Unlinked' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
