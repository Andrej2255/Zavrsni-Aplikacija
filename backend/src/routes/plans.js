const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const requireAuth = require('../middleware/auth');
const controller = require('../controllers/planController');

const router = express.Router();
router.use(requireAuth);

router.get('/', asyncHandler(controller.list));
router.post('/', asyncHandler(controller.create));
router.get('/:id', asyncHandler(controller.getOne));
router.put('/:id', asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.remove));
router.post('/:id/exercises', asyncHandler(controller.addExercise));
router.delete('/:id/exercises/:peId', asyncHandler(controller.removeExercise));

module.exports = router;
