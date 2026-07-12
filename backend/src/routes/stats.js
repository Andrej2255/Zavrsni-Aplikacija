const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const requireAuth = require('../middleware/auth');
const controller = require('../controllers/statsController');

const router = express.Router();
router.use(requireAuth);

router.get('/exercise/:id', asyncHandler(controller.exerciseProgress));
router.get('/muscle-groups', asyncHandler(controller.muscleGroupVolume));
router.get('/bodyweight', asyncHandler(controller.bodyweightTrend));

module.exports = router;
