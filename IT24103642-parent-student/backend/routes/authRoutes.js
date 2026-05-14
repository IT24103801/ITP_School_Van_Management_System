const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Parent = require('../models/Parent');

const JWT_SECRET = process.env.JWT_SECRET || 'svms-dev-secret-change-me';

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'email and password required' });
    }

    const parent = await Parent.findOne({ where: { email } });
    if (!parent) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    let valid = await bcrypt.compare(password, parent.password).catch(() => false);
    if (!valid && parent.password === password) {
      valid = true;
      const hash = await bcrypt.hash(password, 10);
      await parent.update({ password: hash });
    }

    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign({ sub: parent.id, role: 'parent' }, JWT_SECRET, {
      expiresIn: '7d',
    });

    const json = parent.toJSON();
    delete json.password;

    res.json({
      success: true,
      data: {
        token,
        parent: json,
      },
    });
  } catch (error) {
    console.error('login:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/password-reset-request', async (req, res) => {
  try {
    const parent = await Parent.findOne({ where: { email: req.body.email } });
    if (!parent) {
      return res.json({ success: true, message: 'If the email exists, instructions were sent.' });
    }
    res.json({
      success: true,
      message: 'Demo mode: contact admin to reset password.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
