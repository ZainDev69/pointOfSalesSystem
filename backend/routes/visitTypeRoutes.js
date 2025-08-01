const express = require('express');
const visitTypeController = require('../controllers/visitTypeController');

const router = express.Router();

// Visit Type routes
router.route('/clients/:clientId/visit-types')
    .get(visitTypeController.getClientVisitTypes)
    .post(visitTypeController.createVisitType);

router.route('/visit-types/options')
    .get(visitTypeController.getRequiredTaskOptions);

router.route('/visit-types/task-options')
    .post(visitTypeController.addNewTaskOption);

router.route('/visit-types/task-options/:taskOptionName')
    .delete(visitTypeController.deleteTaskOption);

router.route('/visit-types/:id')
    .get(visitTypeController.getVisitType)
    .patch(visitTypeController.updateVisitType)
    .delete(visitTypeController.deleteVisitType);

router.route('/visit-types/:id/restore')
    .post(visitTypeController.restoreVisitType);

module.exports = router; 