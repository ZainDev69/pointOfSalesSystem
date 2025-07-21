const express = require('express');
const router = express.Router();
const riskAssessmentController = require('../controllers/riskAssessmentController');

// Create a new risk assessment
router.post('/', riskAssessmentController.createRiskAssessment);

// Get all risk assessments for a client
router.get('/client/:clientId', riskAssessmentController.getRiskAssessmentsByClient);

// Update a risk assessment
router.put('/:id', riskAssessmentController.updateRiskAssessment);

// Delete a risk assessment
router.delete('/:id', riskAssessmentController.deleteRiskAssessment);

module.exports = router; 