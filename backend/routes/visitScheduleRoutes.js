const express = require('express');
const router = express.Router({ mergeParams: true });
const visitScheduleController = require('../controllers/visitScheduleController');

router.get('/', visitScheduleController.getVisitSchedule);
router.post('/', visitScheduleController.addVisit);
router.put('/:visitId', visitScheduleController.updateVisit);
router.delete('/:visitId', visitScheduleController.deleteVisit);
router.get('/status-types', visitScheduleController.getVisitStatusTypes);
router.get('/priority-types', visitScheduleController.getVisitPriorityTypes);

module.exports = router; 