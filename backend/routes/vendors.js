const express = require('express');
const router = express.Router();
const { getTaskVendorSuggestions } = require('../controllers/taskController');

// @route   POST /api/vendors/by-task-and-event
// @desc    Get vendor suggestions for a task based on its title and event context
// @access  Private
router.post('/by-task-and-event', getTaskVendorSuggestions);

module.exports = router;
