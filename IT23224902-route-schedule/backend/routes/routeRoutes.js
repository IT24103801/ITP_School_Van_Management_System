const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

router.post('/', routeController.createRoute);
router.get('/', routeController.getAllRoutes);
router.get('/active-gps', routeController.getActiveRoutesWithGPS);
router.get('/:id/gps-trail', routeController.getGpsTrail);
router.delete('/:id/gps-trail', routeController.clearGpsTrail);
router.get('/:id', routeController.getRouteById);
router.put('/:id', routeController.updateRoute);
router.delete('/:id', routeController.deleteRoute);
router.put('/:id/gps', routeController.updateLiveGPS);

module.exports = router;
