const express = require('express');
const router = express.Router();
const riskAssessmentController = require('../controllers/riskAssessmentController');


router.get('/risk-options', riskAssessmentController.getRiskAssessmentOptions);
router.post('/', riskAssessmentController.createRiskAssessment);
router.get('/client/:clientId', riskAssessmentController.getRiskAssessmentsByClient);
router.put('/:id', riskAssessmentController.updateRiskAssessment);
router.delete('/:id', riskAssessmentController.deleteRiskAssessment);

module.exports = router; 