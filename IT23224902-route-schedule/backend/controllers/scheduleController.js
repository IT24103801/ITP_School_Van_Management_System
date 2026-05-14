const Schedule = require('../models/Schedule');

function parseBool(value) {
  if (value == null) return undefined;
  return String(value).toLowerCase() === 'true';
}

// Create schedule
exports.createSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const where = {};
    if (req.query.routeId) where.routeId = Number(req.query.routeId);
    if (req.query.vanId) where.vanId = req.query.vanId;
    if (req.query.session) where.session = req.query.session;
    const activeFilter = parseBool(req.query.isActive);
    if (activeFilter != null) where.isActive = activeFilter;
    const schedules = await Schedule.find(where);
    res.json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get schedule by ID
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ id: Number(req.params.id) });
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule not found' });
    }
    res.json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update schedule
exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ id: Number(req.params.id) });
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule not found' });
    }
    Object.assign(schedule, req.body);
    await schedule.save();
    res.json({ success: true, data: schedule });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ id: Number(req.params.id) });
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule not found' });
    }
    await schedule.deleteOne();
    res.json({ success: true, message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Cancel schedule for a specific day/need
exports.cancelSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ id: Number(req.params.id) });
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule not found' });
    }
    const { cancelDate, reason } = req.body || {};
    const noteParts = [];
    if (cancelDate) noteParts.push(`Cancelled for ${cancelDate}`);
    if (reason) noteParts.push(`Reason: ${reason}`);
    const noteText = noteParts.join(' | ');
    const nextNotes = [schedule.specialNotes, noteText].filter(Boolean).join('\n');
    schedule.isActive = false;
    schedule.specialNotes = nextNotes;
    await schedule.save();
    res.json({ success: true, data: schedule });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
