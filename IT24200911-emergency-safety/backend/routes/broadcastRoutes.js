const express = require('express');
const router = express.Router();
const broadcastController = require('../controllers/broadcastController');

router.post('/', broadcastController.createBroadcast);
router.get('/', broadcastController.getAllBroadcasts);
router.get('/:id', broadcastController.getBroadcastById);
router.put('/:id', broadcastController.updateBroadcast);
router.delete('/:id', broadcastController.deleteBroadcast);

module.exports = router;
