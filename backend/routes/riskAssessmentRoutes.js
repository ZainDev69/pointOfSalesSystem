const express = require('express');
const router = express.Router();
const riskAssessmentController = require('../controllers/riskAssessmentController');

// Create a new risk assessment
router.post('/', riskAssessmentController.createRiskAssessment);

// Get all risk assessments for a client
router.get('/client/:clientId', riskAssessmentController.getRiskAssessmentsByClient);

// Get risk assessment types
router.get('/types', riskAssessmentController.getRiskAssessmentTypes);

// Get likelihood options
router.get('/likelihood-options', riskAssessmentController.getLikelihoodOptions);

// Get severity options
router.get('/severity-options', riskAssessmentController.getSeverityOptions);

// Get risk level options
router.get('/risk-level-options', riskAssessmentController.getRiskLevelOptions);

// Get overall risk options
router.get('/overall-risk-options', riskAssessmentController.getOverallRiskOptions);

// Get assessment status options
router.get('/assessment-status-options', riskAssessmentController.getAssessmentStatusOptions);

// Get control measure type options
router.get('/control-measure-type-options', riskAssessmentController.getControlMeasureTypeOptions);

// Get control measure status options
router.get('/control-measure-status-options', riskAssessmentController.getControlMeasureStatusOptions);

// Get control measure effectiveness options
router.get('/control-measure-effectiveness-options', riskAssessmentController.getControlMeasureEffectivenessOptions);

// Update a risk assessment
router.put('/:id', riskAssessmentController.updateRiskAssessment);

// Delete a risk assessment
router.delete('/:id', riskAssessmentController.deleteRiskAssessment);

module.exports = router; 