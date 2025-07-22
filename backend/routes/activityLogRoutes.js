const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');

// Create a new activity log
router.post('/', activityLogController.createActivityLog);

// Get all activity logs for a client
router.get('/client/:clientId', activityLogController.getActivityLogsByClient);

// Update an activity log
router.put('/:id', activityLogController.updateActivityLog);

// Delete an activity log
router.delete('/:id', activityLogController.deleteActivityLog);

module.exports = router; 