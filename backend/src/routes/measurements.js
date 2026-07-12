const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const requireAuth = require('../middleware/auth');
const controller = require('../controllers/measurementController');

const router = express.Router();
router.use(requireAuth);

router.get('/', asyncHandler(controller.list));
router.post('/', asyncHandler(controller.create));
router.delete('/:id', asyncHandler(controller.remove));

module.exports = router;
