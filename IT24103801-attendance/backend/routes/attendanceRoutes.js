const express = require('express');
const { Op, fn, col, where } = require('sequelize');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');

/** Calendar YYYY-MM-DD in the Node process timezone (matches typical dev server local day). */
function serverLocalYmd(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function normalizeAttendanceBody(raw) {
  const body = { ...raw };
  if (body.student_id != null && body.studentId == null) {
    body.studentId = Number(body.student_id);
  }
  if (body.route_id != null && body.routeId == null) {
    body.routeId = Number(body.route_id);
  }
  delete body.student_id;
  delete body.route_id;
  delete body.check_in_time;
  if (!body.session) body.session = 'morning';
  if (body.status === 'present') body.status = 'Picked Up';
  if (body.status === 'absent') body.status = 'Absent';
  if (body.event_type && !body.eventType) body.eventType = body.event_type;
  delete body.event_type;
  delete body.notifyParent;
  delete body.parentRecipientId;
  return body;
}

// --- Must be before /:id ---
router.get('/stats', async (req, res) => {
  try {
    const ymd = serverLocalYmd();
    const dateIsToday = where(fn('DATE', col('date')), ymd);

    const baseArchived = { archived: false };

    const totalRecords = await Attendance.count({ where: baseArchived });
    const presentToday = await Attendance.count({
      where: {
        [Op.and]: [
          baseArchived,
          dateIsToday,
          { status: { [Op.in]: ['Picked Up', 'Dropped Safely', 'Late'] } },
        ],
      },
    });
    const absentToday = await Attendance.count({
      where: {
        [Op.and]: [baseArchived, dateIsToday, { status: 'Absent' }],
      },
    });

    const notifications = await Notification.count({
      where: { deliveryStatus: { [Op.in]: ['queued', 'sending', 'failed'] } },
    });

    res.json({
      success: true,
      data: {
        totalRecords,
        presentToday,
        absentToday,
        notifications,
        dateLabel: ymd,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// List with filters: studentId, startDate, endDate, archived, eventType
router.get('/', async (req, res) => {
  try {
    const { studentId, startDate, endDate, archived, eventType } = req.query;
    const where = {};

    if (studentId) where.studentId = Number(studentId);
    if (archived === 'all') {
      // no archived filter
    } else if (archived !== undefined) {
      where.archived = archived === 'true' || archived === true || archived === '1';
    } else {
      where.archived = false;
    }
    if (eventType) where.eventType = eventType;

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = startDate;
      if (endDate) where.date[Op.lte] = endDate;
    }

    const rows = await Attendance.findAll({
      where,
      order: [['date', 'DESC'], ['timestamp', 'DESC'], ['id', 'DESC']]
    });
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bulk archive (e.g. end of term): body { beforeDate: 'YYYY-MM-DD' }
router.post('/bulk-archive', async (req, res) => {
  try {
    const { beforeDate } = req.body;
    if (!beforeDate) {
      return res.status(400).json({ success: false, error: 'beforeDate is required' });
    }
    const [affected] = await Attendance.update(
      { archived: true, archivedAt: new Date() },
      { where: { archived: false, date: { [Op.lt]: beforeDate } } }
    );
    res.json({ success: true, data: { archivedCount: affected } });
  } catch (error) {
    console.error('Error bulk archiving:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const notifyParent = req.body.notifyParent === true || req.body.notify_parent === true;
    const parentRecipientId = req.body.parentRecipientId != null
      ? Number(req.body.parentRecipientId)
      : req.body.recipient_id != null
        ? Number(req.body.recipient_id)
        : null;

    const raw = normalizeAttendanceBody(req.body);
    if (!raw.date) {
      raw.date = serverLocalYmd();
    }

    const attendance = await Attendance.create(raw);

    const io = req.app.get('io');
    io.emit('attendance_marked', attendance);

    if (notifyParent && parentRecipientId) {
      const notif = await Notification.create({
        recipientId: parentRecipientId,
        type: 'Attendance',
        title: `Attendance: ${raw.eventType || 'Update'}`,
        message: `Student ${raw.studentId} — ${raw.status} (${raw.eventType || 'log'})`,
        priority: 'Medium',
        deliveryStatus: 'queued',
        deliveryAttempts: 0,
        metadata: { attendanceId: attendance.id }
      });
      await notif.update({
        deliveryStatus: 'delivered',
        parentDeliveredAt: new Date(),
        deliveryAttempts: 1
      });
      io.emit('new_notification', notif);
    }

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    console.error('Error creating attendance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const row = await Attendance.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Attendance not found' });
    }
    res.json({ success: true, data: row });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ success: false, error: 'Attendance not found' });
    }

    const payload = normalizeAttendanceBody(req.body);
    delete payload.id;
    await attendance.update(payload);

    const io = req.app.get('io');
    io.emit('attendance_updated', attendance);

    res.json({ success: true, data: attendance });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Soft-archive one log
router.patch('/:id/archive', async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ success: false, error: 'Attendance not found' });
    }
    await attendance.update({ archived: true, archivedAt: new Date() });
    res.json({ success: true, data: attendance });
  } catch (error) {
    console.error('Error archiving attendance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) {
      return res.status(404).json({ success: false, error: 'Attendance not found' });
    }

    await attendance.destroy();
    res.json({ success: true, message: 'Attendance deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
