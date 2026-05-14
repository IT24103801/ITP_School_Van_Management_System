const express = require('express');
const router = express.Router();
const safetyCheckController = require('../controllers/safetyCheckController');

router.post('/', safetyCheckController.createSafetyCheck);
router.get('/', safetyCheckController.getAllSafetyChecks);
router.get('/:id', safetyCheckController.getSafetyCheckById);
router.put('/:id', safetyCheckController.updateSafetyCheck);
router.delete('/:id', safetyCheckController.deleteSafetyCheck);

module.exports = router;
