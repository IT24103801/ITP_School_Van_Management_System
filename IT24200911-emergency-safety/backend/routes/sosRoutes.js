const express = require('express');
const router = express.Router();
const sosController = require('../controllers/sosController');

router.post('/', sosController.createSOSAlert);
router.get('/', sosController.getAllSOSAlerts);
router.get('/:id', sosController.getSOSAlertById);
router.put('/:id', sosController.updateSOSAlert);
router.delete('/:id', sosController.deleteSOSAlert);

module.exports = router;
