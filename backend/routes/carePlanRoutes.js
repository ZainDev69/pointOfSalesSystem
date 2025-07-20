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

// Outcome routes
router.route('/care-plans/:carePlanId/outcomes')
    .get(carePlanController.getCarePlanOutcomes)
    .post(carePlanController.createOutcome);

router.route('/outcomes/:id')
    .patch(carePlanController.updateOutcome)
    .delete(carePlanController.deleteOutcome);

router.route('/outcomes/:id/progress')
    .post(carePlanController.addOutcomeProgress);

module.exports = router; 