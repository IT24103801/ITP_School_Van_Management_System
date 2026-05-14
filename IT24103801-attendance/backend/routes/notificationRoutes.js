const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const Notification = require('../models/Notification');

function normalizePayload(body) {
  const payload = { ...body };
  if (payload.is_read !== undefined) {
    payload.isRead = payload.is_read;
    delete payload.is_read;
  }
  return payload;
}

function applyDeliveryDefaults(payload) {
  const p = { ...payload };
  if (p.scheduledFor && !p.deliveryStatus) {
    p.deliveryStatus = 'queued';
  } else if (!p.deliveryStatus) {
    p.deliveryStatus = 'delivered';
    p.parentDeliveredAt = p.parentDeliveredAt || new Date();
    p.deliveryAttempts = p.deliveryAttempts != null ? p.deliveryAttempts : 1;
  }
  if (p.deliveryStatus === 'failed' && !p.lastDeliveryError) {
    p.lastDeliveryError = 'Delivery failed';
  }
  return p;
}

router.get('/', async (req, res) => {
  try {
    const { deliveryStatus, recipientId, includeCancelled } = req.query;
    const where = {};
    if (deliveryStatus) {
      where.deliveryStatus = deliveryStatus;
    } else if (includeCancelled !== 'true') {
      where.deliveryStatus = { [Op.ne]: 'cancelled' };
    }
    if (recipientId) where.recipientId = Number(recipientId);

    const notifications = await Notification.findAll({
      where,
      order: [['sentAt', 'DESC'], ['id', 'DESC']]
    });
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    let payload = normalizePayload(req.body);
    payload = applyDeliveryDefaults(payload);

    const notification = await Notification.create(payload);

    const io = req.app.get('io');
    io.emit('new_notification', notification);

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    let payload = normalizePayload(req.body);
    await notification.update(payload);
    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Resend after failure: clones as new queued notification then marks delivered (simulated provider)
router.post('/:id/resend', async (req, res) => {
  try {
    const orig = await Notification.findByPk(req.params.id);
    if (!orig) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    if (orig.deliveryStatus === 'cancelled') {
      return res.status(400).json({ success: false, error: 'Cannot resend a cancelled notification' });
    }

    const clone = await Notification.create({
      recipientId: orig.recipientId,
      type: orig.type,
      title: orig.title,
      message: orig.message,
      priority: orig.priority,
      metadata: { ...(orig.metadata || {}), resentFromId: orig.id },
      deliveryStatus: 'queued',
      deliveryAttempts: (orig.deliveryAttempts || 0) + 1,
      sentAt: new Date()
    });

    await clone.update({
      deliveryStatus: 'delivered',
      parentDeliveredAt: new Date(),
      lastDeliveryError: null
    });

    const io = req.app.get('io');
    io.emit('new_notification', clone);

    res.status(201).json({ success: true, data: clone });
  } catch (error) {
    console.error('Error resending notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/:id/cancel', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }
    if (!['queued', 'sending'].includes(notification.deliveryStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Only queued or sending notifications can be cancelled'
      });
    }
    await notification.update({ deliveryStatus: 'cancelled' });
    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error cancelling notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    await notification.destroy();
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
