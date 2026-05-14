const express = require('express');
const router = express.Router();
const Parent = require('../models/Parent');
const Student = require('../models/Student');

router.get('/summary', async (req, res) => {
  try {
    const [totalParents, totalStudents] = await Promise.all([
      Parent.count(),
      Student.count(),
    ]);
    res.json({ success: true, data: { totalParents, totalStudents } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
