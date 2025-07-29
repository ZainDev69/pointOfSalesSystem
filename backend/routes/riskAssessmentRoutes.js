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

// Get assessment status options
router.get('/assessment-status-options', riskAssessmentController.getAssessmentStatusOptions);

// Update a risk assessment
router.put('/:id', riskAssessmentController.updateRiskAssessment);

// Delete a risk assessment
router.delete('/:id', riskAssessmentController.deleteRiskAssessment);

module.exports = router; 