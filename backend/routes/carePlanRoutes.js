const express = require('express');
const carePlanController = require('../controllers/carePlanController');

const router = express.Router();

// Care Plan routes
router.route('/clients/:clientId/care-plans')
    .get(carePlanController.getClientCarePlans)
    .post(carePlanController.createCarePlan);

router.route('/clients/:clientId/care-plans/active')
    .get(carePlanController.getActiveCarePlan);

router.route('/clients/:clientId/care-plans/history')
    .get(carePlanController.getCarePlanHistory);

router.route('/care-plans/:id')
    .get(carePlanController.getCarePlan)
    .patch(carePlanController.updateCarePlan)
    .delete(carePlanController.deleteCarePlan);

router.route('/care-plans/:id/restore')
    .post(carePlanController.restoreCarePlan);



module.exports = router; 